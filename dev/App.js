import React, { Component } from 'react';

import Results from './Results.js';
import SearchBox from './SearchBox.js';

export default class App extends Component {
  render() {
    return (
      <div>
        <SearchBox/>
        <Results/>
      </div>
    );
  }
}
