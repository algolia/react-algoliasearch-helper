import React, {Component, PropTypes as T} from 'react';
import connect from '../src/connect.js';

export default connect()(function({helper, search}) {
  return <input onChange={(e) => {
    helper.setQuery(e.target.value);
    search();
  }} />;
});
