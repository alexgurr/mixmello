import axios from 'axios';
import getRemixSearchTerm from './utils/getRemixSearchTerm';

function removeOriginalTrack(tracks, trackId) {
	return tracks.filter(track => track.id !== trackId);
}

async function search({ token, query }) {
	const { data: { tracks: { items } } } = await axios.get(
		`https://api.spotify.com/v1/search?limit=10&type=track&q=${query}`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items;
}

export default async ({ token, trackId, trackName, artistName, fallback = false }) => {
	if (!token) { return; }
	
	await new Promise(resolve => setTimeout(resolve, 250));
	
	try {
		console.log(trackName);
		const items = await search({ token, query: getRemixSearchTerm({ trackName, artistName }) });
		
		if (items.length || !fallback) {
			return { items: removeOriginalTrack(items, trackId), fallback: false };
		}
		
		const fallbackItems = await search({ token, query: getRemixSearchTerm({ trackName }) });
		
		return { items: removeOriginalTrack(fallbackItems, trackId), fallback: true };
	} catch {
		return { items: [], error: true };
	}
}
