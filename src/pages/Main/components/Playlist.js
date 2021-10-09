import { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { useBooleanState } from 'webrix/hooks';
import { createPortal } from 'react-dom';
import AutosizeInput from 'react-input-autosize';
import { Button, Icon, OpenOnSpotifyButton, Text, Toggle } from 'common/components';
import searchRelatedTracks from '../api/searchRelatedTracks';
import createRemixPlaylist from '../api/createRemixPlaylist';
import Accordion from './Accordion';
import CheckBox from '../../../common/components/CheckBox';
import useNumberFlow from '../../../common/hooks/useNumberFlow';
import Pagination from './Pagination';
import postEvent from '../../../common/utils/postEvent';
import Footer from './Footer';
import '../styles/_playlist.scss';

const MAX_RESULTS = 20;

function AlbumArt({ url, loading, previewUrl, error }) {
	const { value: playing, toggle: togglePlaying, setFalse: stopPlaying } = useBooleanState();
	
	useEffect(() => {
		if (!playing) { return; }
		
		stopPlaying();
	}, [previewUrl]);
	
	return (
		<div className="playlist__row__track__art">
			{!loading && !error && !url ? <Icon size={20} name="fa-music" /> : null}
			{loading ? <Icon name="fa-circle-notch" spin /> : null}
			{error ? <Icon name="fa-times" size={30} colour="#FF453A" /> : null}
			{url && !loading ? <img src={url} alt="album-art" /> : null}
			{previewUrl && (
				<div className="playlist__row__track__art__audio">
					<Icon size={20} colour="white" name={playing ? 'fa-pause' : 'fa-play'} onClick={togglePlaying} />
				</div>
			)}
			{
				playing
					? (
						<audio autoPlay controls={false} onEnded={stopPlaying}>
							<source src={previewUrl} type="audio/mp3" />
						</audio>
					)
					: null
			}
		</div>
	);
}

function Track({ id, name, albumName, albumUrl, fallback, error, loading, noMatch, previewUrl, fade }) {
	return (
		<div className={cx('playlist__row__track', { 'playlist__row__track--fade': error || noMatch || fade })}>
			<AlbumArt url={albumUrl} loading={loading} previewUrl={previewUrl} error={error} />
			{
				loading || noMatch || error
					? (
						<div className="playlist__row__track__content">
							{!error ? <p className="mt-0">{loading ? 'Finding you a remix' : 'No remixes found'}</p> : null}
							{error ? <p className="mt-0">Something went wrong</p> : null}
						</div>
					)
					: (
						<div className="playlist__row__track__content">
							<div className="playlist__row__track__content__name">
								<Text bold>{name}</Text>
								{fallback ? <Icon name="fa-binoculars" /> : null}
							</div>
							{albumName && <Text>{albumName}</Text>}
							<div className="no-fade mt-15">
								<OpenOnSpotifyButton id={id} type="track" buttonType="secondary" small action="Play" />
							</div>
						</div>
					)
			}
		</div>
	);
}

function RemixedTrack({ selection = [], trackId, loading, noMatch, fallback, error, trackListMap }) {
	const initialTrackIndex = trackListMap.get(trackId)
		? selection.findIndex(track => track.uri === trackListMap.get(trackId).track)
		: 0;
	
	const {
		next,
		previous,
		number,
		atCeiling,
		atFloor
	} = useNumberFlow({
		initialNumber: initialTrackIndex >= 0 ? initialTrackIndex : 0,
		max: selection?.length && selection?.length - 1
	});
	const track = selection[number];
	
	useEffect(() => {
		if (!track) { return; }
		
		trackListMap.set(trackId, {
			...(trackListMap.get(trackId) || { enabled: true }),
			track: track.uri
		});
	}, [track]);
	
	return (
		<>
			<Track
				id={track?.id}
				name={track?.name}
				albumName={track?.album.name}
				albumUrl={track?.album?.images?.[0]?.url}
				fallback={fallback}
				loading={loading}
				noMatch={noMatch}
				previewUrl={track?.preview_url}
				error={error}
			/>
			{
				selection.length > 1
					? (
						<div className="playlist__row__nav ml-30">
							<Button iconSize={30} disabled={atFloor} onClick={previous} type="icon-only" icon="fa-arrow-alt-circle-left" />
							<Button iconSize={30} disabled={atCeiling} onClick={next} type="icon-only" icon="fa-arrow-alt-circle-right" />
						</div>
					) : null
			}
		</>
	);
}

function TrackRow({ track, remixListMap, trackListMap, isSmall, onRetryTrack }) {
	const remixedTrack = remixListMap.get(track.id);
	const loadingRemixTrack = !remixedTrack;
	const noMatch = !remixedTrack?.items.length && !loadingRemixTrack;
	const trackInList = trackListMap.get(track.id);
	const { value, setFalse, setTrue, toggle } = useBooleanState(trackInList ? trackInList.enabled : false);
	
	useEffect(() => {
		if (noMatch) { return void setFalse(); }
		
		setTrue();
	}, [noMatch]);
	
	const onChangeEnabled = () => {
		toggle();
		
		trackListMap.set(track.id, {
			...(trackListMap.get(track.id) || { track: remixedTrack?.items[0]?.uri }),
			enabled: !value
		});
	};
	
	const error = remixedTrack?.error;
	
	return (
		<div
			className={cx(
				'playlist__row',
				{
					'playlist__row--empty': noMatch,
					'playlist__row--loading': loadingRemixTrack,
					'playlist__row--error': error,
					'playlist__row--disabled': !value && !noMatch && !loadingRemixTrack
				}
			)}
			key={track.id}
		>
			<CheckBox
				onChange={onChangeEnabled}
				className='playlist__row__checkbox mr-40'
				checked={loadingRemixTrack || noMatch ? false : value}
				disabled={noMatch || loadingRemixTrack}
			/>
			<Track
				fade={error || noMatch}
				id={track?.id}
				name={track.name}
				albumName={track.album?.name}
				albumUrl={track.album?.images?.[0]?.url}
			/>
			<div className="playlist__row__arrow">
				<Icon name={isSmall ? 'fa-chevron-down' : 'fa-long-arrow-alt-right'} />
			</div>
			<RemixedTrack
				selection={remixedTrack?.items}
				fallback={remixedTrack?.fallback}
				error={error}
				loading={loadingRemixTrack}
				noMatch={noMatch}
				trackListMap={trackListMap}
				trackId={track.id}
			/>
			{error && (
				<Button type="secondary" icon="fa-sync" iconSize={15} onClick={onRetryTrack(track)}>
					Try Again
				</Button>
			)}
		</div>
	);
}

export default function Playlist({ token, playlist, profileId, onReset, tracks, onSuccess }) {
	const { value: publicPlaylist, toggle: togglePublic } = useBooleanState();
	const [name, setName] = useState(`${playlist.name} vol. 2`);
	const [finishedRemixing, setFinisheRemixing] = useState(false);
	const isMobile = useMediaQuery({ maxWidth: 700 });
	const isSmall = useMediaQuery({ maxWidth: 1030 });
	const totalPages = Math.ceil(tracks.length / MAX_RESULTS);
	const {
		number: page,
		next: nextPage,
		previous: previousPage,
		atCeiling,
		atFloor,
		setNumber: setPage
	} = useNumberFlow({ initialNumber: 1, min: 1, max: totalPages });
	const { value: saving, setTrue: setSaving, setFalse: setNotSaving } = useBooleanState();
	const [trackListMap] = useState(new Map());
	const [remixListMap] = useState(new Map());
	const [remixLastUpdated, onRemixUpdated] = useState(null);
	const bottomRef = useRef();
	
	const handleTracks = async (retrievedTracks) => {
		for (let track of retrievedTracks) {
			const remixed = await searchRelatedTracks({ token, track });
			
			remixListMap.set(track.id, remixed);
			
			onRemixUpdated(Date.now());
		}
	};
	
	useEffect(() => {
		handleTracks(tracks);	},
	[]);
	
	const onRetryTrack = track => async () => {
		remixListMap.delete(track.id);
		
		onRemixUpdated(Date.now());
		
		const remixed = await searchRelatedTracks({ token, track });
		
		remixListMap.set(track.id, remixed);
		
		onRemixUpdated(Date.now());
	}
	
	const onSave = async () => {
		const tracks = Array.from(trackListMap).reduce((trackList, [, { enabled, track }]) => {
			if (!enabled) { return trackList; }
			
			return [...trackList, track];
		}, []);
		
		if (!tracks.length) { return; }

		setSaving();
		
		try {
			const newPlaylistId = await createRemixPlaylist({
				token,
				profileId,
				playlistName: name,
				remixedTracks: tracks,
				publicPlaylist
			});
			
			postEvent('playlist-saved');
			
			onSuccess(newPlaylistId);
		} catch {
			setNotSaving();
		}
	};
	
	const progressPercent = (remixListMap.size / tracks.length) * 100;
	
	useEffect(() => {
		if (progressPercent !== 100) { return; }
		
		setTimeout(() => { setFinisheRemixing(true); }, 2000);
	}, [remixLastUpdated])
	
	const header = document.querySelector('.header');
	const paginatedTracks = tracks.slice((page - 1) * MAX_RESULTS, page * MAX_RESULTS);
	
	return (
		<>
		{header && createPortal(
			<div className="playlist__progress">
				<span className="playlist__progress__bar" style={{ width: `${finishedRemixing ? '100' : progressPercent.toFixed(0)}%` }} />
				<span className="playlist__progress__text">
					<span className="playlist__progress__text__remixing">{finishedRemixing ? 'Found remixes for' : 'Remixing'} </span>
					{`${finishedRemixing ? Array.from(remixListMap).filter(([_, { items }]) => items.length).length : remixListMap.size} / ${tracks.length} tracks`}
				</span>
			</div>,
			header
		)}
		<div className="playlist">
			<div className="playlist__inner">
				<AutosizeInput
					className="playlist__name"
					name="playlist-name"
					value={name}
					placeholder="Playlist name"
					inputStyle={{ fontSize: isMobile ? 20 : 30 }}
					onChange={({ target: { value } }) => {
						setName(value);
					}}
				/>
				<Accordion title="Settings" className="playlist__settings">
					{/*<Toggle label="Wider searching when no remixes are found (results will vary)" />*/}
					<Toggle label="Make your remixed playlist public" onChange={togglePublic} />
				</Accordion>
				<div className="playlist__songs-header mb-30">
					<Text subHeading className="mb-0 mt-0">Songs ({tracks.length})</Text>
					<Pagination
						page={page}
					  nextPage={nextPage}
						previousPage={previousPage}
						atCeiling={atCeiling}
						atFloor={atFloor}
						totalPages={totalPages}
						setPage={setPage}
					/>
				</div>
				{paginatedTracks.map(track => (
					<TrackRow
						key={track.id}
						trackListMap={trackListMap}
						track={track}
						remixListMap={remixListMap}
						isMobile={isMobile}
						isSmall={isSmall}
						onRetryTrack={onRetryTrack}
					/>
				))}
				<div id="bottom-anchor" ref={bottomRef} />
				<Pagination
					className="mt-10"
					page={page}
					nextPage={nextPage}
					previousPage={previousPage}
					atCeiling={atCeiling}
					atFloor={atFloor}
					totalPages={totalPages}
					setPage={setPage}
				/>
				<Footer
					tracks={tracks}
					onReset={onReset}
					onSave={onSave}
					remixListMap={remixListMap}
					saving={saving}
					name={name}
					bottomRef={bottomRef}
				/>
			</div>
		</div>
		</>
	);
}