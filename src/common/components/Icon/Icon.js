import cx from 'classnames';

export default function Icon({ name, colour, size = 24, brand, spin }) {
	return (
		<i
			className={cx('icon', `fa${brand ? 'b' : 's'}`, name, { spin })}
			style={{ color: colour, fontSize: size }}
		/>
		// <FontAwesomeIcon
		// 	icon={SolidIcons[name] || BrandIcons[name]}
		// 	color={colour || '#112035'}
		// 	style={{ fontSize: size || 24 }}
		// 	{...props}
		// />
	);
}