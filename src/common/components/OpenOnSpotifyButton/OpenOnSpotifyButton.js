import { Menu, MenuItem } from '@szhsin/react-menu';
import { Button, Icon } from '../index';

export default function OpenOnSpotifyButton({ buttonType, type = 'playlist', id, small, action = 'Open' }) {
	const onOpenUrl = () => {
		window.open(`https://open.spotify.com/${type}/${id}`);
	};
	
	const onOpenApp = () => {
		window.open(`spotify:${type}:${id}`);
	};
	
	return (
		<Menu
			offsetY={10}
			direction="bottom"
			menuButton={(
				<Button icon="fa-spotify" brandIcon iconSize={16} small={small} type={buttonType}>
					{action} On Spotify
				</Button>
			)}
			transition
		>
			<MenuItem onClick={onOpenApp}>
				<Icon className="mr-10" name="fa-spotify" brand />
				In The App
			</MenuItem>
			<MenuItem onClick={onOpenUrl}>
				<Icon className="mr-10" name="fa-globe-americas" />
				On The Web
			</MenuItem>
		</Menu>
	);
}