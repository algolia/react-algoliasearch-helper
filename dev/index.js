import React from 'react';
import ReactDOM from 'react-dom';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import Provider from '../src/Provider.js';

import App from './App';

const client = algoliasearch('latency', 'ffc36feb6e9df06e1c3c4549b5af2b31');
const helper = algoliasearchHelper(client, 'starbucks');

ReactDOM.render(
  <Provider helper={helper}>
    <App />
  </Provider>,
  document.getElementById('root')
);
