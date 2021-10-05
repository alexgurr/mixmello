import axios from 'axios';

const MAX_LIMIT = 50;

async function getItems({ token, limit, offset = 0, api }) {
	const { data: { items, total } } = await axios.get(
		`https://api.spotify.com/v1/${api}?limit=${limit}&offset=${offset}`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return { items, total };
}

export default async (token, api) => {
	const { total } = await getItems({ limit: 1, token, api });
	
	if (total <= MAX_LIMIT) {
		const result = await getItems({ limit: MAX_LIMIT, token, api });
		
		return result.items;
	}
	
	const requests = [
		...new Array(Math.ceil(total / MAX_LIMIT))
	].map((_, index) => getItems({ limit: MAX_LIMIT, offset: MAX_LIMIT * index, token, api }))
	
	const allItems = await Promise.all(requests);
	const merged = allItems.reduce((all, { items }) => [...all, ...items], []);
	
	return merged;
};