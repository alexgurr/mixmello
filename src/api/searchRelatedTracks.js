import axios from 'axios';

export default async ({ token, trackName, artistName, fallback = true }) => {
	if (!token) { return; }
	
	const { data: { tracks: { items } } } = await axios.get(
		`https://api.spotify.com/v1/search?limit=10&type=track&q=${trackName} ${artistName} remix`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	if (items.length || !fallback) {
		return { items, fallback: false };
	}
	
	const { data: { tracks: { items: fallbackitems } } } = await axios.get(
		`https://api.spotify.com/v1/search?limit=10&type=track&q=${trackName} remix`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return { items: fallbackitems, fallback: true };
}
