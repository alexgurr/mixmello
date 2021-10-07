import cx from 'classnames';
import { useEffect, useState } from 'react';
import Icon from '../Icon';
import Tooltip from '../Tooltip';
import './_button.scss';

const DEFAULT_TYPE = 'primary';
const SUPPORTED_TYPES = [DEFAULT_TYPE, 'secondary', 'danger', 'icon-only'];
const BUSY_ICON = 'fa-circle-notch';

const ICON_COLOUR_OVERRIDES = {
	[DEFAULT_TYPE]: 'white',
	danger: 'white'
};

export default function Button({
	type = DEFAULT_TYPE,
	fullWidth,
	children,
	disabled,
	onClick,
	icon,
	busy,
	tooltip,
	tooltipId,
	tooltipPlace = 'right',
	className,
	onStateEnd,
	state,
	id,
	dynamicWidth,
	iconSize,
	iconColour,
	brandIcon
}) {
	const supportedType = SUPPORTED_TYPES.includes(type);
	
	if (!supportedType) {
		console.warn('Button type not supported. Falling back to primary.');
	}
	
	const [showStateIcon, setButtonState] = useState(Boolean(state));
	const busyIcon = showStateIcon ? (state === 'success' ? 'checkmark-circle' : 'close') : BUSY_ICON;
	const prefixIcon = busy || showStateIcon ? busyIcon : icon;
	
	useEffect(() => {
		if (state) {
			setButtonState(true);
			
			const timeout = setTimeout(() => {
				setButtonState(false);
				
				if (!onStateEnd) {
					return;
				}
				
				onStateEnd();
			}, 2000);
			
			return () => {
				if (!timeout) {
					return;
				}
				
				clearTimeout(timeout);
			};
		}
	}, [state]);
	
	return (
		<Tooltip
			hide={!tooltip || busy || disabled || state}
			id={tooltipId}
			place={tooltipPlace}
			delayShow={500}
			text={tooltip}
		>
			<button
				disabled={busy || disabled || state}
				className={cx(
					'button',
					`button--${supportedType ? type : DEFAULT_TYPE}`,
					{
						'button--full-width': fullWidth,
						'button--icon': icon && !children && type !== 'icon-only',
						'button--busy': busy || state,
						'button--dynamic-width': dynamicWidth
					},
					className
				)}
				onClick={onClick}
				data-tip={tooltipId}
				data-for={tooltipId}
				id={id}
			>
				<div className="button__content">
					{prefixIcon ? <Icon brand={brandIcon} name={prefixIcon} colour={iconColour || ICON_COLOUR_OVERRIDES[type]} spin={prefixIcon === BUSY_ICON} size={iconSize} /> : null}
					{children && <span style={{ opacity: busy || state ? 0 : 1 }}>{children}</span>}
				</div>
			</button>
		</Tooltip>
	);
}