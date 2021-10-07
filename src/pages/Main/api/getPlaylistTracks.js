import getPaginatedItems from './utils/getPaginatedItems';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';

export default withApiErrorHandling(async ({ token, playlistId }) => {
	if (!token) { return; }
	
	const items = await getPaginatedItems(token, `playlists/${playlistId}/tracks`);

	return items.map(item => item.track).filter(Boolean);
});
