export default function getRemixSearchTerm({ trackName, artistName, acousticRemix }) {
	const normalisedTrack = trackName
		.toLowerCase()
		.replace(/\(.*\)|-.*|from (.)+ soundtrack|radio edit|feat.+|ft.+|remix|remixed|’|'/g, '')
		.trim()
		.replace(/ {2}/g, ' ');
	
	return `${normalisedTrack}${artistName ? ` ${artistName.toLowerCase()}` : ''} ${acousticRemix ? 'acoustic' : 'remix'}`;
}