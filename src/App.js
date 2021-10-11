import axios from 'axios';
import { useEffect, useState, Suspense, lazy } from 'react';
import queryString from 'querystring';
import { useHistory } from 'react-router-dom';
import { useBooleanState } from 'webrix/hooks';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from './pkce';
import getUserProfile from 'common/api/getUserProfile';
import { Avatar, Button, Error, Modal, Text } from 'common/components';
import postEvent from 'common/utils/postEvent';
import notify from 'common/utils/notify';
import CONFIG from './config';
import './styles/_app.scss';

const Home = lazy(() => import('pages/Home'));
const Main = lazy(() => import('pages/Main'));

async function getToken({ profile: profileProp, setToken, setProfile, authProps }) {
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: queryString.stringify({
			...authProps,
			client_id: CONFIG.SPOTIFY_CLIENT_ID
		}),
		url: 'https://accounts.spotify.com/api/token'
	};
	
	const { data: { access_token: accessToken, refresh_token: refreshToken } } = await axios(options);
	const profile = profileProp || await getUserProfile({ token: accessToken });
	
	setToken(accessToken);
	setProfile(profile);
	
	localStorage.setItem('spotify-token', refreshToken);
	localStorage.setItem('spotify-profile', JSON.stringify(profile));
}

function App() {
	const storedProfile = localStorage.getItem('spotify-profile');
	const [error, setError] = useState(false);
	const [profile, setProfile] = useState(storedProfile ? JSON.parse(storedProfile) : null);
	const { value: confirmAuth, toggle: toggleConfirmAuth } = useBooleanState();
	const [token, setToken] = useState(null);
	const {
		'?code': spotifyAuthCode,
		'?error': spotifyConnectError,
		state: spotifyState,
	} = queryString.parse(window.location.search);
	const history = useHistory();
	
	useEffect(() => {
		if (!spotifyConnectError) { return; }
		
		if (spotifyConnectError === 'access_denied') {
			history.push('/');
			
			return void notify({
				text: 'It looks like you cancelled connecting to Spotify. Why don\'t you give it another try?',
				type: 'warning'
			});
		}
		
		setError(true);
	}, [spotifyConnectError]);
	
	useEffect(() => {
		const refreshToken = localStorage.getItem('spotify-token');
		
		if (!refreshToken || spotifyAuthCode) { return; }
		
		const refresh = async () => {
			try {
				await getToken({
					profile,
					setToken,
					setProfile,
					history,
					authProps: {
						refresh_token: refreshToken,
						grant_type: 'refresh_token',
					}
				});
			} catch {
				toggleConfirmAuth();
			}
		}
		
		refresh();
		
		// Refresh token every 30m
		setInterval(refresh, 1800000);
	}, []);
	
	useEffect(() => {
		const handleConnect = async () => {
			if (!spotifyAuthCode) { return; }
			
			try {
				await getToken({
					profile,
					setToken,
					setProfile,
					history,
					authProps: {
						grant_type: 'authorization_code',
						code: spotifyAuthCode,
						redirect_uri: CONFIG.REDIRECT_URL,
						code_verifier: spotifyState
					}
				});
				
				postEvent('connect-spotify');
			} catch {
				setError(true);
			} finally {
				history.push('/');
			}
		}
		
		handleConnect();
	}, [spotifyAuthCode]);
	
	const signOut = () => {
		setProfile(null);
		setToken(null);
		
		if (confirmAuth) {
			toggleConfirmAuth();
		}
		
		localStorage.removeItem('spotify-token');
		localStorage.removeItem('spotify-profile');
	}
	
	const onConnect = async () => {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
		
		window.location.href = 'https://accounts.spotify.com/authorize?response_type=code'
			+ `&client_id=${CONFIG.SPOTIFY_CLIENT_ID}`
			+ `&redirect_uri=${CONFIG.REDIRECT_URL}`
			+ '&scope=playlist-modify-private playlist-read-private playlist-modify-public playlist-read-collaborative'
			+ `&state=${codeVerifier}`
			+ `&code_challenge=${codeChallenge}`
			+ '&code_challenge_method=S256';
	};
	
	if (error) {
		return (
			<Error
				title="Oh no! Something went wrong connecting to Spotify."
				tryAgainProps={{ onClick: onConnect, icon: 'faSpotify' }}
			/>
		);
	}
	
	if (confirmAuth) {
		return (
			<Modal title="We Need To Confirm Your Identity" visible stayOpen width={600}>
				<div className="app__reauth-modal">
					<div className="app__reauth-modal__content">
						<Avatar url={profile?.images?.[0]?.url} large />
						<div className="app__reauth-modal__name ml-20">
							<Text subHeading className="mb-5 mt-0">{profile?.display_name}</Text>
							<a onClick={signOut}>Not you?</a>
						</div>
						<Button
							className="ml-auto ml-40"
							onClick={onConnect}
							brandIcon
							icon="fa-spotify"
						>
							Re-connect Spotify
						</Button>
					</div>
					<Text className="ml-10">Keep seeing this? <a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">Get In Touch</a>.</Text>
				</div>
			</Modal>
		);
	}
	
	if ((spotifyAuthCode || localStorage.getItem('spotify-token')) && !token) { return null; }
	
	if (!token) {
		return (
			<Suspense fallback={null}>
				<Home onConnect={onConnect} />
			</Suspense>
		);
	}
	
	return (
		<Suspense fallback={null}>
			<Main token={token} profile={profile} signOut={signOut} />
		</Suspense>
	);
}

export default App;
