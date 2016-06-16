import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import Provider from '../src/Provider.js';

const algoliaCredentials = {
  applicationID: 'latency',
  key: 'ffc36feb6e9df06e1c3c4549b5af2b31'
};

const helperConfig = {
  index: 'starbucks'
};

ReactDOM.render(
  <Provider credentials={algoliaCredentials} config={helperConfig}>
    <App />
  </Provider>,
  document.getElementById('root'));
