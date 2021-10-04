import axios from 'axios';

export default async ({ token, remixedTracks, playlistName, profileId, publicPlaylist }) => {
	if (!token) { return; }
	
	const { data: { id } } = await axios.post(
		`https://api.spotify.com/v1/users/${profileId}/playlists`,
		{
			name: playlistName,
			public: publicPlaylist
		},
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	
	await axios.post(
		`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${remixedTracks.join(',')}`,
		{},
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return id;
};
