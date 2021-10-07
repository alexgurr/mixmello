import cx from 'classnames';
import './_text.scss';

const styles = ({ centered, bold, ellipsis }) => ({
	textAlign: centered ? 'center' : void 0,
	fontWeight: bold ? '800' : void 0,
	textOverflow: ellipsis ? 'ellipsis' : void 0,
	overflow: ellipsis ? 'hidden' : void 0,
	whiteSpace: ellipsis ? 'nowrap' : void 0
});

export default function Text({
	heading,
	subHeading,
	children,
	bold,
	className,
	centered,
	ellipsis,
	danger,
	small,
	inverse
}) {
	const computedClassName = cx(
		'text',
		{
			'text--danger': danger,
			'text--small': small,
			'text--inverse': inverse
		},
		className
	);
	
	if (heading) {
		return <h1 style={styles({ centered, ellipsis, danger })} className={computedClassName}>{children}</h1>;
	}
	
	if (subHeading) {
		return <h2 style={styles({ centered, ellipsis, danger })} className={computedClassName}>{children}</h2>;
	}
	
	return <p style={styles({ centered, bold, ellipsis, danger, small })} className={computedClassName}>{children}</p>;
}
