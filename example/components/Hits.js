import React, {PropTypes} from 'react';
import {connect} from 'react-algoliasearch-helper';

const Results = ({results}) => {
  if (!results) return <div/>;
  return <div>{results.hits.map(hit => <div key={hit.objectID}>{hit.Name}</div>)}</div>;
};

Results.propTypes = {
  results: PropTypes.object
};

export default connect(
  state => ({results: state.searchResults})
)(Results);
