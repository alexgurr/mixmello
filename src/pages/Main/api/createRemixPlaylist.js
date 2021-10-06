import axios from 'axios';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';

export default withApiErrorHandling(async ({ token, remixedTracks, playlistName, profileId, publicPlaylist }) => {
	if (!token) { return; }
	
	const { data: { id } } = await axios.post(
		`https://api.spotify.com/v1/users/${profileId}/playlists`,
		{
			name: playlistName,
			public: publicPlaylist
		},
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	try {
		await axios.post(
			`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${remixedTracks.join(',')}`,
			{},
			{ headers: { Authorization: `Bearer ${token}`} }
		);
		
		return id;
	} catch {
		await axios.delete(
			`https://api.spotify.com/v1/playlists/${id}/followers`,
			{ headers: { Authorization: `Bearer ${token}`} }
		);
		
		throw new Error();
	}
});
