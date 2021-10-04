import { useEffect, useState } from 'react';
import cx from 'classnames';
import { useBooleanState } from 'webrix/hooks';
import { createPortal } from 'react-dom';
import AutosizeInput from 'react-input-autosize';
import { Button, Icon, Text, Toggle } from 'common/components';
import searchRelatedTracks from '../api/searchRelatedTracks';
import createRemixPlaylist from '../api/createRemixPlaylist';
import Accordion from './Accordion';
import CheckBox from '../../../common/components/CheckBox';
import useNumberFlow from '../../../common/hooks/useNumberFlow';
import '../styles/_playlist.scss';
import Pagination from './Pagination';
import { useMediaQuery } from 'react-responsive';

const MAX_RESULTS = 20;

function AlbumArt({ url, loading, previewUrl, error }) {
	const { value: playing, toggle: togglePlaying, setFalse: stopPlaying } = useBooleanState();
	
	useEffect(() => {
		if (!playing) { return; }
		
		stopPlaying();
	}, [previewUrl]);
	
	return (
		<div className="playlist__row__track__art">
			{loading ? <Icon name="faCircleNotch" spin /> : null}
			{error ? <Icon name="faTimes" colour="#FF453A" /> : null}
			{url && !loading ? <img src={url} alt="album-art" /> : null}
			{previewUrl && (
				<div className="playlist__row__track__art__audio">
					<Icon size={17} colour="white" name={playing ? 'faPause' : 'faPlay'} onClick={togglePlaying} />
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

function Track({ name, albumName, albumUrl, fallback, error, loading, noMatch, previewUrl }) {
	return (
		<div className="playlist__row__track">
			<AlbumArt url={albumUrl} loading={loading} previewUrl={previewUrl} error={error} />
			{
				loading || noMatch || error
					? (
						<div className="playlist__row__track__content">
							{!error ? <p className="mt-0">{loading ? 'Finding you a remix' : 'No remixes found'}</p> : null}
							{error ? <p className="mt-0">Something went wrong finding this remix</p> : null}
						</div>
					)
					: (
						<div className="playlist__row__track__content">
							<div className="playlist__row__track__content__name">
								<p>{name}</p>
								{fallback ? <Icon name="faBinoculars" /> : null}
							</div>
							{albumName && <p>{albumName}</p>}
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
							<Button iconSize={30} disabled={atFloor} onClick={previous} type="icon-only" icon="faArrowAltCircleLeft" />
							<Button iconSize={30} disabled={atCeiling} onClick={next} type="icon-only" icon="faArrowAltCircleRight" />
						</div>
					) : null
			}
		</>
	);
}

function TrackRow({ track, remixedTracks, rowIndex, trackListMap, isMobile, isSmall }) {
	const loadingRemixTrack = remixedTracks.length - 1 < rowIndex;
	const noMatch = !remixedTracks[rowIndex]?.items.length && !loadingRemixTrack;
	const trackInList = trackListMap.get(track.id);
	const { value, setFalse, setTrue, toggle } = useBooleanState(trackInList ? trackInList.enabled : false);
	
	useEffect(() => {
		if (noMatch) { return void setFalse(); }
		
		setTrue();
	}, [noMatch]);
	
	const onChangeEnabled = () => {
		toggle();
		
		trackListMap.set(track.id, {
			...(trackListMap.get(track.id) || { track: remixedTracks[rowIndex]?.items[0]?.uri }),
			enabled: !value
		});
	};
	
	return (
		<div
			className={cx(
				'playlist__row',
				{ 'playlist__row--empty': noMatch, 'playlist__row--disabled': (!value && !noMatch) || loadingRemixTrack }
			)}
			key={track.id || rowIndex}
		>
			<CheckBox
				onChange={onChangeEnabled}
				className='playlist__row__checkbox mr-40'
				checked={loadingRemixTrack || noMatch ? false : value}
				disabled={noMatch || loadingRemixTrack}
			/>
			<Track name={track.name} albumName={track.album?.name} albumUrl={track.album?.images?.[0]?.url} />
			<Icon
				className="playlist__row__arrow"
				name={isSmall ? 'faChevronDown' : 'faLongArrowAltRight'}
			/>
			<RemixedTrack
				selection={remixedTracks[rowIndex]?.items}
				fallback={remixedTracks[rowIndex]?.fallback}
				error={remixedTracks[rowIndex]?.error}
				loading={loadingRemixTrack}
				noMatch={noMatch}
				trackListMap={trackListMap}
				trackId={track.id}
			/>
		</div>
	);
}

export default function Playlist({ token, playlist, profileId, onReset, tracks, onSuccess }) {
	const { value: publicPlaylist, toggle: togglePublic } = useBooleanState();
	const [name, setName] = useState(`${playlist.name} vol. 2`);
	const [hideProgress, setProgressHidden] = useState(false);
	const [remixedTracks, setRemixedTracks] = useState([]);
	const isMobile = useMediaQuery({ maxWidth: 700 });
	const isSmall = useMediaQuery({ maxWidth: 950 });
	const totalPages = Math.ceil(tracks.length / MAX_RESULTS);
	const {
		number: page,
		next: nextPage,
		previous: previousPage,
		atCeiling,
		atFloor,
		setNumber: setPage
	} = useNumberFlow({ initialNumber: 1, min: 1, max: totalPages });
	const { value: saving, toggle: toggleSaving } = useBooleanState();
	const [trackListMap] = useState(new Map());
	
	const handleTracks = async (retrievedTracks) => {
		const currentRemixed = [];
		
		for(let track of retrievedTracks) {
			const remixed = await searchRelatedTracks({
				token,
				trackId: track.id,
				trackName: track.name,
				artistName: track.artists?.[0]?.name || ''
			});
			
			currentRemixed.push(remixed);
		
			setRemixedTracks([...currentRemixed]);
		}
	};
	
	useEffect(() => {
		handleTracks(tracks);
	}, []);
	
	const onSave = async () => {
		const tracks = Array.from(trackListMap).reduce((trackList, [, { enabled, track }]) => {
			if (!enabled) { return trackList; }
			
			return [...trackList, track];
		}, []);
		
		if (!tracks.length) { return; }

		toggleSaving();
		
		try {
			const newPlaylistId = await createRemixPlaylist({
				token,
				profileId,
				playlistName: name,
				remixedTracks: tracks,
				publicPlaylist
			});
			
			onSuccess(`spotify:playlist:${newPlaylistId}`);
		} catch {
			toggleSaving();
		}
	};
	
	const progressPercent = (remixedTracks.length / tracks.length) * 100;
	
	useEffect(() => {
		if (progressPercent !== 100) { return; }
		
		setTimeout(() => {
			setProgressHidden(true);
		}, 2000);
	}, [remixedTracks])
	
	const header = document.querySelector('.header');
	
	const paginatedTracks = tracks.slice((page - 1) * MAX_RESULTS, page * MAX_RESULTS);

	return (
		<>
		{header && !hideProgress && createPortal(
			<div className="playlist__progress">
				<span className="playlist__progress__bar" style={{ width: `${progressPercent.toFixed(0)}%` }} />
				<span className="playlist__progress__text">
					<span className="playlist__progress__text__remixing">Remixing </span>{remixedTracks.length} / {tracks.length}
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
					<Toggle label="Wider searching when no remixes are found (results will vary)" />
					<Toggle label="Make the new playlist public" onChange={togglePublic} />
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
				{paginatedTracks.map((track, index) => (
					<TrackRow
						trackListMap={trackListMap}
						track={track}
						remixedTracks={remixedTracks}
						rowIndex={index + ((page - 1) * MAX_RESULTS)}
						isMobile={isMobile}
						isSmall={isSmall}
					/>
				))}
				<Pagination
					className="ml-auto mt-10"
					page={page}
					nextPage={nextPage}
					previousPage={previousPage}
					atCeiling={atCeiling}
					atFloor={atFloor}
					totalPages={totalPages}
					setPage={setPage}
				/>
				<div className="playlist__footer mt-60">
					<Button onClick={onReset} type="secondary">Remix Another Playlist</Button>
					<Button busy={saving} onClick={onSave} disabled={!name || remixedTracks.length !== tracks.length}>
						Save
					</Button>
				</div>
			</div>
		</div>
		</>
	);
}