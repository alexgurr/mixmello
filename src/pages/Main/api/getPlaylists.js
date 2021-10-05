import axios from 'axios';
import _memoize from 'lodash.memoize';
import Fuse from 'fuse.js'
import getPaginatedItems from './utils/getPaginatedItems';

function filterPlaylists(playlists, filter) {
	const fuse = new Fuse(playlists, { shouldSort: true, keys: ['name'], threshold: 0.3 })
	const results = fuse.search(filter);
	
	return results.slice(0, 5).map(({ item }) => item);
}

const getAllPlaylists = _memoize((token, api) => getPaginatedItems(token, api));

export default token => (
	async (search) => {
		if (!token) { return; }
		
		const playlists = await getAllPlaylists(token, 'me/playlists');
		
		return filterPlaylists(playlists, search);
	}
);
