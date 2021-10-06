import axios from 'axios';
import withApiErrorHandling from 'common/utils/withApiErrorHandling';

export default withApiErrorHandling(async ({ token, movie }) => {
	if (!token) { return; }

	const { data: { albums: { items } } } = await axios.get(
		`https://api.spotify.com/v1/search?limit=10&type=album&q=${movie.title} soundtrack`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return items.filter(Boolean) || [];
});
