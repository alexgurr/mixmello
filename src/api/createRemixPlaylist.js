import axios from 'axios';

export default async ({ token, remixedTracks, playlistName, profileId }) => {
	if (!token) { return; }
	
	const { data: { id } } = await axios.post(
		`https://api.spotify.com/v1/users/${profileId}/playlists`,
		{
			"name": playlistName,
			"public": false
		},
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	
	await axios.post(
		`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${remixedTracks.map(track => track.uri).join(',')}`,
		{},
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return id;
};
