import getMovieUrl from '../utils/getMovieUrl';
import { Button, Text } from 'common/components';
import useNumberFlow from '../../../common/hooks/useNumberFlow';
import createSoundtrackPlaylist from '../api/createSoundtrackPlaylist';
import { useBooleanState } from 'webrix/hooks';
import '../styles/_soundtracks.scss';

export default function Soundtracks({ token, movie, soundtracks, onReset, profileId, onSuccess }) {
	const { number, atCeiling, atFloor, previous, next } = useNumberFlow({ max: soundtracks.length - 1 });
	const { value: saving, setTrue: setSaving, setFalse: setNotSaving } = useBooleanState();
	
	const soundtrack = soundtracks[number];
	
	const onSave = async () => {
		setSaving();
		
		try {
			const playlistId = await createSoundtrackPlaylist({ token, album: soundtrack, profileId });
			
			onSuccess(`spotify:playlist:${playlistId}`);
		} catch {
			setNotSaving();
		}
	};
	
	return (
		<div className="soundtracks">
			<div className="soundtracks__movie-container">
				<img className="soundtracks__movie" src={getMovieUrl(movie)} />
			</div>
			<div className="soundtracks__soundtrack">
				<Text subHeading className="mt-0">{movie.title}</Text>
				<div className="soundtracks__soundtrack__info">
					<img src={soundtrack.images?.[0]?.url} height={100} width={100} />
					<div>
						<Text bold className="mt-0">{soundtrack.name}</Text>
						<Text>{soundtrack.total_tracks} tracks</Text>
						<Text className="mb-0">{soundtrack.artists?.[0].name}</Text>
					</div>
				</div>
				{
					soundtracks.length > 1 && (
						<div className="soundtracks__soundtrack__info__controls mt-20">
							<Button iconSize={30} disabled={atFloor} onClick={previous} type="icon-only" icon="faArrowAltCircleLeft" />
							<Button iconSize={30} disabled={atCeiling} onClick={next} type="icon-only" icon="faArrowAltCircleRight" />
						</div>
					)
				}
				<div className="soundtracks__soundtrack__info__actions mt-40">
					<Button type="secondary" onClick={onReset}>Choose A New Movie</Button>
					<Button busy={saving} onClick={onSave}>Save The Soundtrack</Button>
				</div>
			</div>
		</div>
	)
}