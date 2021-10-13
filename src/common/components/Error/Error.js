import { Helmet } from 'react-helmet';
import { ReactComponent as ErrorLogoIcon } from 'assets/images/logo-error-icon.svg';
import { Button, Text } from '../';
import './_error.scss';

export default function Error({ title, tryAgainProps }) {
	return (
		<div className="error">
			<Helmet><meta name="theme-color" content="#ffffff" /></Helmet>
			<ErrorLogoIcon />
			<Text heading className="mb-20 mt-30">{title || 'Oh no! Something went wrong.'}</Text>
			<Text subHeading className="mt-0 mb-50">It's probably a one time thing.</Text>
			<div className="error__actions">
				<Button type="secondary" onClick={() => window.location.reload()}>
					Refresh The Page
				</Button>
				{tryAgainProps && <Button {...tryAgainProps}>Try Again</Button>}
			</div>
			<Text className="mt-50 mb-0">
				Keep seeing this? <a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">Get In Touch</a>.
			</Text>
		</div>
	);
}