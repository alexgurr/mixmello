import axios from 'axios';
import _sortBy from 'lodash.sortby';

function addTypeToItems(array, type) {
	return array.map(item => ({ ...item, type }));
}

export default ({ token }) => async (search) => {
	if (!token) { return; }

	const { data: { artists, tracks } } = await axios.get(
		`https://api.spotify.com/v1/search?q=${search}&type=track,artist&limit=5`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);

	return _sortBy([
		...addTypeToItems(artists.items, 'Artist'),
		...addTypeToItems(tracks.items, 'Song')
	], 'popularity').reverse();
}
