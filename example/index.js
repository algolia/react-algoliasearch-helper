import React from 'react';
import ReactDOM from 'react-dom';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import {Provider} from 'react-algoliasearch-helper';
import SearchBox from './components/SearchBox.js';
import Hits from './components/Hits.js';

const client = algoliasearch('latency', 'ffc36feb6e9df06e1c3c4549b5af2b31');
const helper = algoliasearchHelper(client, 'starbucks');

const App = () =>
  <Provider helper={helper}>
    <div>
      <SearchBox/>
      <Hits/>
    </div>
  </Provider>;

ReactDOM.render(<App/>, document.querySelector('#root'));
