import getPaginatedItems from './getPaginatedItems';

export default async ({ token, playlistId }) => {
	if (!token) { return; }
	
	const items = await getPaginatedItems(token, `playlists/${playlistId}/tracks`);
	
	return items.map(item => item.track).filter(Boolean);
}
