<img width=60% src="https://www.mixmello.com/logo-cropped.png">

![React](https://img.shields.io/badge/react-v17+-60D9FA.svg)
![Build Status](https://therealsujitk-vercel-badge.vercel.app/?app=mixmello)
![Dependencies](https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg)
[![GitHub Issues](https://img.shields.io/github/issues/alexgurr/mixmello.svg)](https://github.com/alexgurr/mixmello/issues)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)

&nbsp;
## About
Create remixed versions of your favourite Spotify playlists.

### Stack
Frontend: `react@latest`

Design/Logo: [`@alexgurr`](https://twitter.com/alexgurr)

Backend: `none`

APIs: [`Spotify`](https://developer.spotify.com/documentation/web-api/)

Authentication: [`OAuth pkce`](https://oauth.net/2/pkce/)

&nbsp;
### Screenshots
| | |
|:-------------------------:|:-------------------------:|
|<img width="1604" alt="screen shot 1" src="https://user-images.githubusercontent.com/4161867/136679805-f8f32a3c-7b04-4d51-831d-d47d2d7dd729.png"> |  <img width="1604" alt="screen shot 2" src="https://user-images.githubusercontent.com/4161867/136679809-232c3f98-2017-482d-a94c-8ed0121e0a1c.png">|
|<img width="1604" alt="screen shot 3" src="https://user-images.githubusercontent.com/4161867/136679812-9f957b75-842f-47c6-8511-089cd1938e7d.png">  |  <img width="1604" alt="screen shot 4" src="https://user-images.githubusercontent.com/4161867/136679814-3a80a288-8fb3-4deb-a1d6-02dc6d003b6a.png">|


&nbsp;
## Getting Started

### Environment Variables
#### Required
- `REDIRECT_URL`: Redirect URL Spotify will redirect the OAuth flow back to. This should be added to the list of whitelisted domains in the Spotify console. Defaults to `localhost:3000`

- `SPOTIFY_CLIENT_ID`: The Client ID of your Spotify app. Your client should have the scopes: `user-library-read` `playlist-modify-private` `playlist-read-private` `playlist-modify-public` `playlist-read-collaborative`

- `SASS_PATH`: This should be set to **src/styles** or the SCSS import resolution will fail

#### Optional
- `GA_ID`: Google Analytics ID

- `SENTRY_DSN`: Sentry error reporting DSN (url)



&nbsp;
### Install
`yarn` or `npm install`

&nbsp;
### Start
`yarn start` or `npm run start`
