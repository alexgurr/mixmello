import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useBooleanState } from 'webrix/hooks';
import _throttle from 'lodash.throttle';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as Logo } from '../../../assets/images/logo.svg';
import { ReactComponent as LogoIcon } from '../../../assets/images/logo-icon.svg';
import { Avatar, Icon, Text } from '../../../common/components';
import '../styles/_header.scss';

export default function Header({ stage, title, profile, signOut }) {
	const isMobile = useMediaQuery({ maxWidth: 700 });
	
	const { value: small, setFalse: setLarge, setTrue: setSmall } = useBooleanState(false);
	
	useScrollPosition(_throttle(({ currPos: { y } }) => {
		if (y > -(isMobile ? 10 : 30)) { return void setLarge(); }
		
		setSmall();
	}), 500);
	
	return (
		<div className={cx('header', { 'header--small': small || isMobile, 'header--scrolled': small })}>
			{isMobile ? <LogoIcon /> : <Logo />}
			<div className="header__title">
				<span className="header__title__number"><Text inverse subHeading>{stage}</Text></span>
				<Text heading>{title}</Text>
			</div>
			<div>
				<Menu
					offsetY={20}
					direction="bottom"
					menuButton={<Avatar className="scale-hover" url={profile?.images?.[0].url} />}
					transition
				>
					<MenuItem onClick={signOut}><Icon className="mr-20" name="faSignOutAlt" />Sign Out</MenuItem>
				</Menu>
			</div>
		</div>
	);
}