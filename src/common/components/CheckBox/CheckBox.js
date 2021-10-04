import { useBooleanState } from 'webrix/hooks';
import cx from 'classnames';
import Text from '../Text';
import Icon from '../Icon';
import './_checkbox.scss';

export default function CheckBox({ checked: checkedProp, initialValue, onChange, label, className, disabled }) {
	const { value: localChecked, toggle: toggleChecked } = useBooleanState(initialValue);
	const checked = checkedProp !== void 0 ? checkedProp : localChecked;
	
	const handleChange = () => {
		const newChecked = !checked;
		
		onChange?.(newChecked);
		
		toggleChecked();
	}
	
	return (
		<label
			className={cx('checkbox', { 'checkbox--checked': checked, 'checkbox--disabled': disabled }, className)}
		>
			<input type="checkbox" checked={checked} onChange={handleChange} />
			{checked && <Icon size={16} name="faCheck" className="checkbox__tick" colour="white" />}
			{label && <Text>{label}</Text>}
		</label>
	);
}
