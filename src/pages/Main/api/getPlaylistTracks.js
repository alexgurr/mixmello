import getPaginatedItems from './utils/getPaginatedItems';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';
import { LIKED_PLAYLIST_ID } from './constants';

export default withApiErrorHandling(async ({ token, playlistId }) => {
	if (!token) { return; }
	
	const items = await getPaginatedItems(
		token,
		playlistId === LIKED_PLAYLIST_ID ? 'me/tracks' : `playlists/${playlistId}/tracks`
	);

	return items.map(item => item.track).filter(Boolean);
});
