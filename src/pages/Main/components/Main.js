import { useState } from 'react';
import Playlist from './Playlist';
import Search from './Search';
import Header from './Header';
import { ReactComponent as Waves } from '../../../assets/images/wave.svg';
import getPlaylistTracks from '../api/getPlaylistTracks';
import Success from './Success';
import '../styles/_main.scss';
import { Helmet } from 'react-helmet';

const STAGES = [
	'Find a playlist',
	'Tailor your remixes',
	'Groove to the beat'
];

export default function Main({ token, profile, signOut }) {
	const [stage, setStage] = useState(1);
	const [currentPlaylist, setPlaylist] = useState(null);
	const [tracks, setTracks] = useState([]);
	const [playlistId, setPlaylistId] = useState('');
	const [acousticRemix, setAcousticRemix] = useState(false);
	
	const onReset = () => {
		setPlaylist(null);
		setStage(1);
	};
	
	const onRemix = async () => {
		const retrievedTracks = await getPlaylistTracks({ token, playlistId: currentPlaylist.id });
		
		setTracks(retrievedTracks);
		setStage(2);
	};
	
	const onSuccess = (newPlaylistId) => {
		setPlaylistId(newPlaylistId);
		setStage(3);
	};
	
	return (
		<div className="main">
			<Helmet><meta name="theme-color" content="#fff" /></Helmet>
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
							acousticRemix={acousticRemix}
							setAcousticRemix={setAcousticRemix}
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
							acousticRemix={acousticRemix}
						/>
					)
					: null
			}
			{
				stage === 3
					? <Success playlistId={playlistId} onReset={onReset} />
					: null
			}
			<Waves className="mt-auto" />
		</div>
	);
}
