import * as SolidIcons from '@fortawesome/free-solid-svg-icons';
import * as BrandIcons from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Icon({ name, colour, size, ...props }) {
	return (
		<FontAwesomeIcon
			icon={SolidIcons[name] || BrandIcons[name]}
			color={colour || '#112035'}
			style={{ fontSize: size || 24 }}
			{...props}
		/>
	);
}