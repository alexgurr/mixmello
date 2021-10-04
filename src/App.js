import axios from 'axios';
import { useEffect, useState } from 'react';
import queryString from 'querystring';
import { useHistory } from 'react-router-dom';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from './pkce';
import Home from './pages/Home';
import Main from './pages/Main';
import getUserProfile from './common/api/getUserProfile';
import { useBooleanState } from 'webrix/hooks';
import { Avatar, Button, Modal, Text } from './common/components';
import './styles/_app.scss';

async function getToken({ profile: profileProp, setToken, setProfile, authProps, rethrowError = false }) {
	const options = {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		data: queryString.stringify({
			...authProps,
			client_id: '581af23d72b04cf19b00ccdf5fcc7bcf'
		}),
		url: 'https://accounts.spotify.com/api/token'
	};
	
	try {
		const { data: { access_token: accessToken, refresh_token: refreshToken } } = await axios(options);
		const profile = profileProp || await getUserProfile({ token: accessToken });
		
		setToken(accessToken);
		setProfile(profile);
		
		localStorage.setItem('spotify-token', refreshToken);
		localStorage.setItem('spotify-profile', JSON.stringify(profile));
	} catch (e) {
		if (!rethrowError) { return; }
		
		throw e;
	}
}

function App() {
	const storedProfile = localStorage.getItem('spotify-profile');
	const [profile, setProfile] = useState(storedProfile ? JSON.parse(storedProfile) : null);
	const { value: confirmAuth, toggle: toggleConfirmAuth } = useBooleanState();
	const [token, setToken] = useState(null);
	const { '?code': spotifyAuthCode, state: spotifyState } = queryString.parse(window.location.search);
	const history = useHistory();
	
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
					},
					rethrowError: true
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
		if (!spotifyAuthCode) { return; }
		
		getToken({
			profile,
			setToken,
			setProfile,
			history,
			authProps: {
				grant_type: 'authorization_code',
				code: spotifyAuthCode,
				redirect_uri: 'https://www.beta.mixmello.com',
				code_verifier: spotifyState
			}
		});
		
		history.push('/');
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
			+ `&redirect_uri=https://www.beta.mixmello.com`
			+ '&scope=playlist-modify-private playlist-read-private playlist-modify-public playlist-read-collaborative'
			+ `&state=${codeVerifier}`
			+ `&code_challenge=${codeChallenge}`
			+ '&code_challenge_method=S256';
	};
	
	if (confirmAuth) {
		return (
			<Modal title="We Need To Confirm Your Identity" visible stayOpen width={600}>
				<div className="app__reauth-modal">
					<Avatar url={profile?.images?.[0].url} large />
					<div className="app__reauth-modal__name ml-20">
						<Text subHeading className="mb-5 mt-0">{profile?.display_name}</Text>
						<a onClick={signOut}>Not you?</a>
					</div>
					<Button
						className="ml-auto ml-40"
						onClick={onConnect}
					>
						Re-connect Spotify
					</Button>
				</div>
			</Modal>
		);
	}
	
	if ((spotifyAuthCode || localStorage.getItem('spotify-token')) && !token) { return null; }
	
	if (!token) {
		return (
			<Home onConnect={onConnect} />
		);
	}
	
	return <Main token={token} profile={profile} signOut={signOut} />;
}

export default App;
