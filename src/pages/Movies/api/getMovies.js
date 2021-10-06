import axios from 'axios';

export default async function getMovies(search) {
	const res = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${search}&api_key=6320a6bcbfddac8a016d2b226f371cd8`);
	
	return res.data.results.slice(0, 5);
}