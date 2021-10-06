import { useState } from 'react';
import Search from './Search';
import Header from './Header';
import { ReactComponent as Waves } from '../../../assets/images/wave.svg';
import Success from './Success';
import getSoundtracks from '../api/getSoundtracks';
import Soundtracks from './Soundtracks';

const STAGES = [
	'Find a movie',
	'Preview the soundtrack',
	'Groove to the beat'
];

export default function Main({ token, profile, signOut }) {
	const [stage, setStage] = useState(1);
	const [currentMovie, setMovie] = useState(null);
	const [soundtracks, setSoundtracks] = useState(null);
	const [playlistUrl, setPlaylistUrl] = useState('');
	
	const onReset = () => {
		setStage(1);
	};
	
	const onSearchContinue = async () => {
		const soundtracks = await getSoundtracks({ token, movie: currentMovie });
		
		setSoundtracks(soundtracks);
		
		setStage(2);
	};
	
	const onSuccess = (newPlaylistUrl) => {
		setPlaylistUrl(newPlaylistUrl);
		setStage(3);
	};
	
	return (
		<div style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
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
							onSelectMovie={setMovie}
							onContinue={onSearchContinue}
							selectedMovie={currentMovie}
						/>
					)
					: null
			}
			{
				stage === 2
					? <Soundtracks onSuccess={onSuccess} token={token} soundtracks={soundtracks} movie={currentMovie} onReset={onReset} profileId={profile.id} />
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
