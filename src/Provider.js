import React, { Component, PropTypes as T, Children } from 'react';
import { AlgoliaSearchHelper } from 'algoliasearch-helper';

import createStore from './createStore';
import storeShape from './storeShape';

class Provider extends Component {
  static propTypes = {
    helper: T.instanceOf(AlgoliaSearchHelper),
  };

  static childContextTypes = {
    algoliaStore: storeShape.isRequired,
  };

  constructor(props) {
    super(props);

    this.store = createStore(props.helper);
  }

  getChildContext() {
    return {
      algoliaStore: this.store,
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}

export default Provider;
