import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import queryString from 'querystring';
import { useHistory } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import searchMusic from './api/getPlaylists';
import { generateCodeChallengeFromVerifier, generateCodeVerifier } from './pkce';
import './_app.scss';
import getPlaylistTracks from './api/getPlaylistTracks';
import searchRelatedTracks from './api/searchRelatedTracks';
import getUserProfileId from './api/getUserProfileId';
import createRemixPlaylist from './api/createRemixPlaylist';

function Connect({ onConnect }) {
	return (
		<div className="app__connect">
			<button className="button" onClick={onConnect}>Connect Spotify</button>
		</div>
	)
}

function Search({ token, onSelectPlaylist }) {
	return (
		<div className="app__search">
			<AsyncSelect
				cacheOptions
				onChange={onSelectPlaylist}
				placeholder="Search for a playlist..."
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
							<p>{option.public ? 'Public' : 'Private'}</p>
						</div>
					</div>
				)}
				getOptionValue={option => option.id}
			/>
		</div>
	);
}

function Remix({ token, playlist, profileId, onReset }) {
	const [tracks, setTracks] = useState([]);
	const [newUrl, setNewUrl] = useState('');
	const [remixedTracks, setRemixedTracks] = useState([]);
	
	const handleTracks = async (retrievedTracks) => {
		const currentRemixed = [];
		
		for(let track of retrievedTracks) {
			const remixed = await searchRelatedTracks({ token, trackName: track.name, artistName: track.artists?.[0]?.name || '' });
			
			currentRemixed.push(remixed);
			
			setRemixedTracks([...currentRemixed]);
		}
	};
	
	useEffect(() => {
		const getTracks = async () => {
			const retrievedTracks = await getPlaylistTracks({ token, playlistId: playlist.id });
			
			setTracks(retrievedTracks);
			
			handleTracks(retrievedTracks);
		};
		
		getTracks();
	}, []);
	
	const onSave = async () => {
		const newPlaylistId = await createRemixPlaylist({
			token,
			profileId,
			playlistName: `${playlist.name} Remixes`,
			remixedTracks: remixedTracks.filter(Boolean)
		});
		
		setNewUrl(`spotify:playlist:${newPlaylistId}`)
	};
	
	return (
		<div className="app__remix">
			{tracks.map((track, index) => (
				<div className="app__remix__row">
					<div className="app__remix__row__track">
						<img src={track.album?.images?.[0]?.url} height={50} width={50} />
						<p>{track.name}</p>
						<p>{track.album.name}</p>
					</div>
					{remixedTracks.length < index + 1 ? <p>Finding a remix.</p> : null}
					{
						remixedTracks[index]?.items?.length
							? (
								<div className="app__remix__row__track">
									<img src={remixedTracks[index].items[0].album?.images?.[0]?.url} height={50} width={50} />
									<p>{remixedTracks[index].items[0].name}</p>
									<p>{remixedTracks[index].items[0].album.name}</p>
									{remixedTracks[index].items[0].fallback ? <p>(fallback)</p> : null}
									{remixedTracks[index].items[0].preview_url && (
										<audio controls autoPlay={false}>
											<source src={remixedTracks[index].items[0].preview_url} type="audio/mp3" />
										</audio>
									)}
								</div>
							): !remixedTracks[index]?.items?.length ? <p>Nothing found</p> : null
					}
				</div>
			))}
			{!newUrl ? <button className="button" onClick={onSave}>Save</button> : null}
			{newUrl ? <button className="button" onClick={() => { window.open(newUrl); }}>Open Playlist In Spotify</button> : null}
			<button className="button" onClick={onReset}>New Search</button>
		</div>
	);
}

function App() {
	const [profileId, setProfileId] = useState(localStorage.getItem('spotify-id'));
	const [currentPlaylist, setPlaylist] = useState(null);
	const [token, setToken] = useState(null);
	const { '?code': spotifyAuthCode, state: spotifyState } = queryString.parse(window.location.search);
	const history = useHistory();
	
	const onReset = () => {
		setPlaylist(null);
	};
	
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
				const id = profileId || await getUserProfileId({ token: accessToken });
				
				setToken(accessToken);
				setProfileId(id);
				
				localStorage.setItem('spotify-token', refreshToken);
				localStorage.setItem('spotify-id', id);
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
			+ '&scope=playlist-modify-private playlist-read-private playlist-modify-public playlist-read-collaborative'
			+ `&state=${codeVerifier}`
			+ `&code_challenge=${codeChallenge}`
			+ '&code_challenge_method=S256';
	};
	
	if ((spotifyAuthCode || localStorage.getItem('spotify-token')) && !token) { return null; }
	
	if (!token) {
		return (
			<div className="app">
				<Connect onConnect={onConnect} />
			</div>
		);
	}
	
	if (!currentPlaylist) {
		return (
			<div className="app">
				<Search token={token} onSelectPlaylist={setPlaylist} />
			</div>
		);
	}
	
	return (
    <div className="app">
			<Remix playlist={currentPlaylist} token={token} profileId={profileId} onReset={onReset} />
    </div>
  );
}

export default App;
