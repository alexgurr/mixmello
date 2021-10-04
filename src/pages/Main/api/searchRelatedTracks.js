import axios from 'axios';

function removeOriginalTrack(tracks, trackId) {
	return tracks.filter(track => track.id !== trackId);
}

function buildSearchTerm(search) {
	// TODO
	// remove - Remaster X
	// remove - X remaster
	// trim
	// lower case
	// things in brackets
	// feat
	// version
	return search;
}

export default async ({ token, trackId, trackName, artistName, fallback = true }) => {
	if (!token) { return; }
	
	await new Promise(resolve => setTimeout(resolve, 250));
	
	try {
		const { data: { tracks: { items } } } = await axios.get(
			`https://api.spotify.com/v1/search?limit=10&type=track&q=${trackName} ${artistName} remix`,
			{ headers: { Authorization: `Bearer ${token}`} }
		);
		
		if (items.length || !fallback) {
			return { items: removeOriginalTrack(items, trackId), fallback: false };
		}
		
		const { data: { tracks: { items: fallbackItems } } } = await axios.get(
			`https://api.spotify.com/v1/search?limit=10&type=track&q=${trackName} remix`,
			{ headers: { Authorization: `Bearer ${token}`} }
		);
		
		return { items: removeOriginalTrack(fallbackItems, trackId), fallback: true };
	} catch {
		return { items: [], error: true };
	}
}
