import { Menu, MenuItem } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useBooleanState } from 'webrix/hooks';
import cx from 'classnames';
import { useMediaQuery } from 'react-responsive';
import { ReactComponent as Logo } from '../../../assets/images/logo.svg';
import { ReactComponent as LogoIcon } from '../../../assets/images/logo-icon.svg';
import { Avatar, Icon, Text } from '../../../common/components';
import '../styles/_header.scss';

export default function Header({ stage, title, profile, signOut }) {
	const isMobile = useMediaQuery({ maxWidth: 700 });
	const smallLogo = useMediaQuery({ maxWidth: 950 });
	
	const { value: small, setFalse: setLarge, setTrue: setSmall } = useBooleanState(false);
	
	useScrollPosition(({ currPos: { y } }) => {
		const isLarge = y > -(isMobile ? 10 : 30);
		
		if (isLarge && !small) { return; }
		
		if (isLarge) { return void setLarge(); }
		
		setSmall();
	});
	
	return (
		<div className={cx('header', { 'header--small': small || isMobile, 'header--scrolled': small })}>
			{smallLogo ? <LogoIcon /> : <Logo />}
			<div className="header__title">
				<span className="header__title__number"><Text inverse subHeading>{stage}</Text></span>
				<Text heading>{title}</Text>
			</div>
			<div className="header__avatar-container">
				<Menu
					offsetY={20}
					direction="bottom"
					menuButton={<Avatar className="scale-hover" url={profile?.images?.[0]?.url} />}
					transition
				>
					<MenuItem onClick={signOut}><Icon className="mr-10" name="fa-sign-out-alt" />Sign Out</MenuItem>
				</Menu>
			</div>
		</div>
	);
}