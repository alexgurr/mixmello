import { Icon, Text } from 'common/components';
import { ReactComponent as LogoIcon } from 'assets/images/logo-icon-inverse.svg';
import './_footer.scss';

export default function Footer() {
	return (
		<div className="footer">
			<LogoIcon />
			<div className="footer__content">
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div className="footer__content__list" >
						<a href="https://www.privacypolicies.com/generic/" target="_blank" rel="noreferrer">Privacy</a>
						<a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">Contact Us</a>
					</div>
					<div className="footer__content__list" >
						<a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-twitter" brand />
							<span style={{ display: 'none' }}>twitter</span>
						</a>
						<a href="https://www.github.com/alexgurr" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-github" brand />
							<span style={{ display: 'none' }}>github</span>
						</a>
						<a href="https://www.alexgurr.com" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-cloud" />
							<span style={{ display: 'none' }}>website</span>
						</a>
					</div>
				</div>
				<Text inverse className="footer__copyright mt-40">
					©2021 Alex Gurr. All rights reserved. Various trademarks held by their respective owners.
				</Text>
			</div>
		</div>
	);
}
