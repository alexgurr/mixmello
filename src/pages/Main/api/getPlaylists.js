import _memoize from 'lodash.memoize';
import Fuse from 'fuse.js';
import axios from 'axios';
import getPaginatedItems from './utils/getPaginatedItems';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';
import likedSongsImage from '../../../assets/images/liked-songs-300.png';
import { LIKED_PLAYLIST_ID } from './constants';

function filterPlaylists(playlists, filter) {
	const fuse = new Fuse(playlists, { shouldSort: true, keys: ['name'], threshold: 0.3 })
	const results = fuse.search(filter);
	
	return results.slice(0, 5).map(({ item }) => item);
}

async function getLikedSong(token) {
	const { data: { items } } = await axios.get(
		`https://api.spotify.com/v1/me/tracks?limit=1`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items;
}

const memoGetAllPlaylists = _memoize(getPaginatedItems);
const memoGetLikedSong = _memoize(getLikedSong);

export default token => (
	withApiErrorHandling(async (search) => {
		if (!token) { return; }
		
		const playlists = await memoGetAllPlaylists(token, 'me/playlists');
		const likedSongs = await memoGetLikedSong(token);

		const allPlaylists = likedSongs.length
			? [{ name: 'Liked Songs', id: LIKED_PLAYLIST_ID, images: [{ url: likedSongsImage }] }, ...playlists]
			: playlists;
		
		return filterPlaylists(allPlaylists, search);
	})
);
