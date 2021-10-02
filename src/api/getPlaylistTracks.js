import axios from 'axios';

export default async ({ token, playlistId }) => {
	if (!token) { return; }
	
	const { data: { items } } = await axios.get(
		`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items.map(item => item.track);
}
