import { Icon, Text } from 'common/components';
import { ReactComponent as LogoIcon } from 'assets/images/logo-icon-inverse.svg';
import './_footer.scss';

export default function Footer() {
	return (
		<div className="footer">
			<LogoIcon />
			<div className="footer__content">
				<div className="footer__content__links">
					<div className="footer__content__list" >
						<a href="https://www.privacypolicies.com/generic/" target="_blank" rel="noreferrer">Privacy</a>
						<a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">Contact Us</a>
					</div>
					<div className="footer__content__list" >
						<a href="https://www.twitter.com/alexgurr" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-twitter" brand />
							<span className="footer__content__list__accessible">twitter</span>
						</a>
						<a href="https://github.com/alexgurr/mixmello" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-github" brand />
							<span className="footer__content__list__accessible">github</span>
						</a>
						<a href="https://www.alexgurr.com" target="_blank" rel="noreferrer">
							<Icon colour="white" name="fa-globe-americas" />
							<span className="footer__content__list__accessible">website</span>
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
