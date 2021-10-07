const CONFIG = {
	REDIRECT_URL: process.env.REACT_APP_REDIRECT_URL || 'http://localhost:3000',
	SPOTIFY_CLIENT_ID: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
	GA_ID: process.env.REACT_APP_GA_ID,
	SENTRY_DSN: process.env.REACT_APP_SENTRY_DSN
};

export default CONFIG;
