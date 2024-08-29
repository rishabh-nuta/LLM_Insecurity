import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserHistory } from 'history';

import App from './App';

const history = createBrowserHistory();

const root = ReactDOM.createRoot(document.querySelector('#container'));
root.render(<App history={history} />);
