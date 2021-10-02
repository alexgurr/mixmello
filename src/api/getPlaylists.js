import axios from 'axios';

export default ({ token }) => async (search) => {
	if (!token) { return; }

	const { data: { items } } = await axios.get(
		`https://api.spotify.com/v1/me/playlists?limit=10`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items;
}
