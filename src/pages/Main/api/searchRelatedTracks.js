import axios from 'axios';
import _uniqBy from 'lodash.uniqby';
import getRemixSearchTerm from './utils/getRemixSearchTerm';

function normaliseTracks({ tracks, trackId, acousticRemix }) {
	// It seems there are some duplicate tracks with different ids. Let's unique on album + track name
	return _uniqBy(
		tracks.filter(track => (
			track.id !== trackId && track.name.toLowerCase().includes(acousticRemix ? 'acoustic' : 'remix')
		)),
		track => [track.album?.name, track.name].join()
	);
}

async function search({ token, query }) {
	const { data: { tracks: { items } } } = await axios.get(
		`https://api.spotify.com/v1/search?limit=10&type=track&q=${query}`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items;
}

export default async ({ token, track, fallback = false, acousticRemix }) => {
	if (!token) { return; }
	
	const artistName = track.artists?.[0]?.name || '';
	const trackName = track.name;
	const trackId = track.id;
	
	await new Promise(resolve => setTimeout(resolve, 250));
	
	try {
		const items = await search({ token, query: getRemixSearchTerm({ trackName, artistName, acousticRemix }) });
		
		if (items.length || !fallback) {
			return { items: normaliseTracks({ tracks: items, trackId, acousticRemix }), fallback: false };
		}
		
		const fallbackItems = await search({ token, query: getRemixSearchTerm({ trackName, acousticRemix }) });
		
		return { items: normaliseTracks({ tracks: fallbackItems, trackId, acousticRemix} ), fallback: true };
	} catch {
		return { items: [], error: true };
	}
}
