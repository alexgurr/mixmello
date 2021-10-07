import axios from 'axios';

export default async ({ token }) => {
	if (!token) { return; }
	
	const { data } = await axios.get(
		`https://api.spotify.com/v1/me`,
		{ headers: { Authorization: `Bearer ${token}`} }
	);
	
	return data;
}
