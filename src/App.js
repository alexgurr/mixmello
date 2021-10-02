import axios from 'axios';
import { useEffect, useState } from 'react';
import queryString from 'querystring';
import { useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import searchMusic from './api/searchMusic';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from './pkce';
import './_app.scss';

function Connect({ onConnect }) {
	return (
		<div className="app__connect">
			<button className="button" onClick={onConnect}>Connect Spotify</button>
		</div>
	)
}

function Search({ token }) {
	return (
		<div className="app__search">
			<AsyncSelect
				cacheOptions
				loadOptions={searchMusic({ token })}
				menuPortalTarget={document.body}
				styles={{
					container: () => ({ height: 100 }),
					control: (provided) => ({ ...provided, height: 100, fontSize: 30 }),
				}}
				getOptionLabel={option => (
					<div style={{ display: 'flex', alignItems: 'center' }}>
						{
							option.images?.[0]?.url
								? <img src={option.images?.[0]?.url} width={40} height={40} style={{ borderRadius: '50%', marginRight: 20 }} />
								: <div style={{ width: '40px', height: '40px', background: 'lightgrey', borderRadius: '50%', marginRight: 20 }} />
						}
						<div>
							<p><strong>{option.name}</strong></p>
							<p>{option.type}{option.type === 'Song' ? ` • ${option.artists?.[0]?.name}` : ''}</p>
						</div>
					</div>
				)}
				getOptionValue={option => option.id}
			/>
		</div>
	);
}

function App() {
	const [token, setToken] = useState(null);
	const { '?code': spotifyAuthCode, state: spotifyState } = queryString.parse(window.location.search);
	const history = useHistory();
	
	useEffect(() => {
		const getToken = async () => {
			const refreshToken = localStorage.getItem('spotify-token');
			
			if (!refreshToken) { return; }
			
			const options = {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data: queryString.stringify({
					refresh_token: refreshToken,
					grant_type: 'refresh_token',
					client_id: '581af23d72b04cf19b00ccdf5fcc7bcf'
				}),
				url: 'https://accounts.spotify.com/api/token'
			};
			
			try {
				const { data: { access_token: accessToken, refresh_token: refreshToken } } = await axios(options);
				
				setToken(accessToken);
				
				localStorage.setItem('spotify-token', refreshToken);
				
				history.push('/');
			} catch (e) {
				console.error(e);
			}
		};
		
		getToken();
	}, []);
	
	useEffect(() => {
		if (!spotifyAuthCode) { return; }
		
		const getToken = async () => {
			const options = {
				method: 'POST',
				headers: { 'content-type': 'application/x-www-form-urlencoded' },
				data: queryString.stringify({
					client_id: '581af23d72b04cf19b00ccdf5fcc7bcf',
					grant_type: 'authorization_code',
					code: spotifyAuthCode,
					redirect_uri: 'http://localhost:3000/',
					code_verifier: spotifyState
				}),
				url: 'https://accounts.spotify.com/api/token'
			};
			
			try {
				const { data: { access_token: accessToken, refresh_token: refreshToken} } = await axios(options);
				
				setToken(accessToken);

				localStorage.setItem('spotify-token', refreshToken);

				history.push('/');
			} catch(e) {
				console.error(e);
			}
		};
		
		getToken();
	}, [spotifyAuthCode]);
	
	const onConnect = async () => {
		const codeVerifier = generateCodeVerifier();
		const codeChallenge = await generateCodeChallengeFromVerifier(codeVerifier);
		
		window.location.href = 'https://accounts.spotify.com/authorize?response_type=code'
			+ `&client_id=581af23d72b04cf19b00ccdf5fcc7bcf`
			+ `&redirect_uri=http://localhost:3000/`
			+ '&scope=streaming user-read-email user-read-private'
			+ `&state=${codeVerifier}`
			+ `&code_challenge=${codeChallenge}`
			+ '&code_challenge_method=S256';
	};
	
	if ((spotifyAuthCode || localStorage.getItem('spotify-token')) && !token) { return null; }
	
	return (
    <div className="app">
			{
				!token
					? <Connect onConnect={onConnect} />
					: <Search token={token} />
			}
    </div>
  );
}

export default App;
