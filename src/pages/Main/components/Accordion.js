import { useVisibilityState } from 'webrix/hooks';
import Collapse from '@kunukn/react-collapse';
import cx from 'classnames';
import { Icon, Text } from 'common/components';
import '../styles/_accordion.scss';

export default function Accordion({ title, children, className }) {
	const { visible, toggle } = useVisibilityState(false);
	
	return (
		<div
			className={cx(
				'accordion',
				{ 'accordion--open': visible },
				className
			)}
		>
			<button className="accordion__header" onClick={toggle}>
				<Text subHeading>{title}</Text>
				<div className="accordion__header__icon">
					<Icon size={20} name={visible ? 'fa-chevron-up' : 'fa-chevron-down'} />
				</div>
			</button>
			<Collapse transition={`height 300ms cubic-bezier(.4, 0, .2, 1)`} isOpen={visible}>
				<div className="accordion__child">
					{children}
				</div>
			</Collapse>
		</div>
	);
}