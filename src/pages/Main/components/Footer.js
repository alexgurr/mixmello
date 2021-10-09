import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import cx from 'classnames';
import { Button, Icon } from 'common/components';

function useOnScreen(ref, rootMargin = "0px") {
	// State and setter for storing whether element is visible
	const [isIntersecting, setIntersecting] = useState(false);
	
	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				// Update our state when observer callback fires
				setIntersecting(entry.isIntersecting);
			},
			{
				rootMargin,
			}
		);
		if (ref.current) {
			observer.observe(ref.current);
		}
		return () => {
			observer.unobserve(ref.current);
		};
	}, []); // Empty array ensures that effect is only run on mount and unmount
	return isIntersecting;
}

export default function Footer({ onReset, tracks, saving, onSave, remixListMap, name, bottomRef }) {
	const isMobile = useMediaQuery({ maxWidth: 700 });
	const onScreen = useOnScreen(bottomRef, isMobile ? '-100px' : void 0);
	
	const onScroll = to => () => {
		if (to === 'top') {
			return void window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		
		window.scrollTo({
			top: document.querySelector('.playlist__inner').getBoundingClientRect().height,
			behavior: 'smooth'
		})
	};
	
	return (
		<div className={cx('playlist__footer', 'mt-40', { 'playlist__footer--scrolled': !onScreen })}>
			<a
				className="playlist__footer__link"
				onClick={onScroll(onScreen ? 'top' : 'bottom')}
			>
				Scroll To {onScreen ? 'Top' : 'Bottom'}
				<Icon size={20} name={`fa-chevron-${onScreen ? 'up' : 'down'}`} />
			</a>
			<div>
				<Button onClick={onReset} type="secondary">
					{isMobile ? 'Cancel' : 'Remix Another Playlist'}
				</Button>
				<Button
					busy={saving}
					onClick={onSave}
					disabled={!name || remixListMap.size !== tracks.length}
				>
					Save Playlist
				</Button>
			</div>
		</div>
	);
}