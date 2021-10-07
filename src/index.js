import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { init as initSentry, ErrorBoundary } from "@sentry/react";
import { Integrations as TracingIntegrations } from "@sentry/tracing";
import 'what-input';
import { Error } from 'common/components';
import App from './App';
import CONFIG from './config';
import './styles/_index.scss';

if (process.env.NODE_ENV !== 'development') {
	initSentry({
		dsn: CONFIG.SENTRY_DSN,
		integrations: [new TracingIntegrations.BrowserTracing()],
		tracesSampleRate: 0.25
	});
}

ReactDOM.render(
  <React.StrictMode>
		<ErrorBoundary fallback={Error}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);
