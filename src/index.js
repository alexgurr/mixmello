import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'what-input';
import App from './App';
import './styles/_index.scss';

ReactDOM.render(
  <React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
