import Select from 'react-select';
import Async from 'react-select/async';

const getSelectStyles = ({ hasError, styles: { control, ...styles } = {} }) => ({
	control: (base, state) => ({
		...base,
		borderColor: hasError ? '#FF453A' : (state.isFocused ? '#00BD85 !important' : '#CBCCCC'),
		boxShadow: hasError ? '0 0 0 1px #FF453A' : (state.isFocused ? '0 0 0 1px #00BD85' : void 0),
		height: '50px',
		color: 'red',
		...(control?.(base, state) || {})
	}),
	option: (base, { isSelected }) => ({
		...base,
		color: isSelected ? 'white' : '#264653',
		backgroundColor: isSelected ? '#00BD85' : void 0,
		':active': {
			...base[':active'],
			backgroundColor: 'red'
		},
		':hover': {
			...base[':hover'],
			backgroundColor: isSelected ? '#00BD85' : '#E7E9EB',
			color: isSelected ? 'white' : '#264653'
		},
	}),
	...styles
});

export default function Dropdown({ async, hasError, styles, ...props }) {
	const DropdownElement = async ? Async : Select;
	
	return (
		<DropdownElement
			{...props}
			styles={getSelectStyles({ hasError, styles })}
			menuPortalTarget={document.body}
		/>
	)
}