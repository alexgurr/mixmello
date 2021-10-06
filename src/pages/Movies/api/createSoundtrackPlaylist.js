import axios from 'axios';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';

export default withApiErrorHandling(async ({ token, profileId, album }) => {
	if (!token) { return; }
	
	const { data: { items: tracks } } = await axios.get(
		`https://api.spotify.com/v1/albums/${album.id}/tracks`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	const { data: { id } } = await axios.post(
		`https://api.spotify.com/v1/users/${profileId}/playlists`,
		{ name: album.name, public: false },
		{ headers: { Authorization: `Bearer ${token}`} }
	);

	try {
		await axios.post(
			`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${tracks.map(({ uri }) => uri).join(',')}`,
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
