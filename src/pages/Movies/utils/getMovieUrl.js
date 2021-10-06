export default function getMovieUrl({ poster_path }) {
	if (!poster_path) { return null; }
	
	return `https://image.tmdb.org/t/p/original/${poster_path}`;
}