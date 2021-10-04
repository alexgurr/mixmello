import cx from 'classnames';
import { forwardRef } from 'react';
import Icon from '../Icon';
import './_avatar.scss';

function Avatar({ className, url, large, onClick, onKeyDown }, ref) {
	return (
		<div
			ref={ref}
			className={cx('avatar', { 'avatar--large': large }, className)}
			onClick={onClick}
			onKeyDown={onKeyDown}
		>
			{
				url
					? <img src={url} />
					: <Icon name="faUser" size={large ? 40: void 0}/>
			}
		</div>
	);
}

export default forwardRef(Avatar);
