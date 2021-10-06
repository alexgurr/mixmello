import { Button, Text } from 'common/components';
import '../styles/_success.scss';

export default function Success({ playlistUrl, onReset }) {
	const onOpen = () => {
		window.open(playlistUrl);
	};
	
	return (
		<div className="success">
			<div className="success__animation">
				<svg className="success__animation__checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
					<circle className="success__animation__checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
					<path className="success__animation__checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
				</svg>
			</div>
			<div>
				<Text subHeading className="mt-0">We've gone and created your new playlist 🎉</Text>
				<div className="success__actions">
					<Button onClick={onReset} type="secondary">Remix Another Playlist</Button>
					<Button icon="faExternalLinkAlt" iconSize={16} onClick={onOpen} >
						Open In Spotify
					</Button>
				</div>
			</div>
		
		</div>
	);
}