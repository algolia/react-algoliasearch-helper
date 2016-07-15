import React from 'react';
import {connect} from 'react-algoliasearch-helper';

export default connect()(
  ({helper}) =>
    <input
      placeholder="Search here"
      autoFocus
      onChange={e => helper.setQuery(e.target.value).search()}
    />
);
