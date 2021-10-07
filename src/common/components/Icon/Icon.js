import cx from 'classnames';

export default function Icon({ name, colour, size = 24, brand, spin, onClick }) {
	return (
		<i
			className={cx('icon', `fa${brand ? 'b' : 's'}`, name, { spin })}
			style={{ color: colour, fontSize: size }}
			onClick={onClick}
		/>
	);
}