import React, {Component, PropTypes as T} from 'react';

function connect(Component) {
  function SearchEnabledComponent(props, context) {
    return <Component {...props} results={context.results} helper={context.helper}/>
  }

  SearchEnabledComponent.contextTypes = {
    helper: T.object.isRequired,
    results: T.object
  };

  return SearchEnabledComponent;
}

export default connect;
