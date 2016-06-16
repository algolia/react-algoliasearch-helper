import React, { Component } from 'react';
import connect from '../src/connect.js';

function Results(props) {
  if(!props.results) return <div/>;
  const hits = (props.results.hits || []).map((hit) => {
    return <div key={hit.objectID}>{hit.Name}</div>;
  });
  return <div>{hits}</div>; 
}

export default connect(Results);
