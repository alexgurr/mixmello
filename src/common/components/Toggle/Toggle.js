import RToggle from 'react-toggle';
import { useRef } from 'react';
import cx from 'classnames';
import Text from '../Text';
import './_toggle.scss';

export default function Toggle({ className, label = null, defaultChecked, onChange }) {
	const toggleRef = useRef(null);
	
	const onChangeHandler = () => {
		if (!toggleRef) { return; }
		
		onChange?.(toggleRef.current.input?.checked);
	};
	
	return (
		<label className={cx('toggle', className)}>
			<RToggle icons={false} ref={toggleRef} defaultChecked={defaultChecked} onChange={onChangeHandler} />
			{label && <Text className="toggle__label">{label}</Text>}
		</label>
	);
}
