import axios from 'axios';
import { useEffect, useState } from 'react';
import queryString from 'querystring';
import { useHistory } from 'react-router-dom';
import { useBooleanState } from 'webrix/hooks';
import { ReactComponent as ErrorLogoIcon } from './assets/images/logo-error-icon.svg';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from './pkce';
import Home from './pages/Home';
import Main from './pages/Main';
import getUserProfile from './common/api/getUserProfile';
import { Avatar, Button, Modal, Text } from './common/components';
import postEvent from './common/utils/postEvent';
import notify from './common/utils/notify';
import CONFIG from './config';
import './styles/_app.scss';

async function getToken({ profile: profileProp, setToken, setProfile, authProps }) {
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: queryString.stringify({
			...authProps,
			client_id: '581af23d72b04cf19b00ccdf5fcc7bcf'
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
			+ `&client_id=581af23d72b04cf19b00ccdf5fcc7bcf`
			+ `&redirect_uri=${CONFIG.REDIRECT_URL}`
			+ '&scope=playlist-modify-private playlist-read-private playlist-modify-public playlist-read-collaborative'
			+ `&state=${codeVerifier}`
			+ `&code_challenge=${codeChallenge}`
			+ '&code_challenge_method=S256';
	};
	
	if (error) {
		return (
			<div className="app__connect-error">
				<ErrorLogoIcon />
				<Text heading className="mb-20 mt-30">Oh no! Something went wrong connecting to Spotify.</Text>
				<Text subHeading className="mt-0 mb-50">It's probably a one time thing.</Text>
				<div className="app__connect-error__actions">
					<Button type="secondary" onClick={() => window.location.reload()}>
						Refresh The Page
					</Button>
					<Button onClick={onConnect} icon="faSpotify">Try Again</Button>
				</div>
				<Text className="mt-50">
					Keep seeing this? <a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">Get In Touch</a>.
				</Text>
			</div>
		)
	}
	
	if (confirmAuth) {
		return (
			<Modal title="We Need To Confirm Your Identity" visible stayOpen width={600}>
				<div className="app__reauth-modal">
					<div className="app__reauth-modal__content">
						<Avatar url={profile?.images?.[0].url} large />
						<div className="app__reauth-modal__name ml-20">
							<Text subHeading className="mb-5 mt-0">{profile?.display_name}</Text>
							<a onClick={signOut}>Not you?</a>
						</div>
						<Button
							className="ml-auto ml-40"
							onClick={onConnect}
							icon="faSpotify"
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
		return <Home onConnect={onConnect} />;
	}
	
	return <Main token={token} profile={profile} signOut={signOut} />;
}

export default App;
