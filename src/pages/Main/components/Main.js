import { useState } from 'react';
import Playlist from './Playlist';
import Search from './Search';
import Header from './Header';
import { ReactComponent as Waves } from '../../../assets/images/wave.svg';
import getPlaylistTracks from '../api/getPlaylistTracks';
import Success from './Success';

const STAGES = [
	'Find a playlist',
	'Tailor your remixes',
	'Groove to the beat'
];

export default function Main({ token, profile, signOut }) {
	const [stage, setStage] = useState(1);
	const [currentPlaylist, setPlaylist] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [playlistUrl, setPlaylistUrl] = useState('');
	
	const onReset = () => {
		setPlaylist(null);
		setStage(1);
	};
	
	const onRemix = async () => {
		const retrievedTracks = await getPlaylistTracks({ token, playlistId: currentPlaylist.id });
		
		setTracks(retrievedTracks);
		setStage(2);
	};
	
	const onSuccess = (newPlaylistUrl) => {
		setPlaylistUrl(newPlaylistUrl);
		setStage(3);
	};
	
	return (
		<div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
			<Header
				stage={stage}
				title={STAGES[stage - 1]}
				profile={profile}
				signOut={signOut}
			/>
			{
				stage === 1
					? (
						<Search
							token={token}
							onSelectPlaylist={setPlaylist}
							onRemix={onRemix}
							selectedPlaylist={currentPlaylist}
						/>
					)
					: null
			}
			{
				stage === 2
					? (
						<Playlist
							onSuccess={onSuccess}
							playlist={currentPlaylist}
							token={token}
							profileId={profile.id}
							onReset={onReset}
							tracks={tracks}
						/>
					)
					: null
			}
			{
				stage === 3
					? <Success playlistUrl={playlistUrl} onReset={onReset} />
					: null
			}
			<Waves className="mt-auto" />
		</div>
	);
}