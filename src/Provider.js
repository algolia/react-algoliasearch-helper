import React, {Component, PropTypes as T, Children} from 'react';
import AlgoliaSearchHelper from 'algoliasearch-helper';
import Algoliasearch from 'algoliasearch';
import bindAll from 'lodash/bindAll';

export const contextType = {
  helper: T.object.isRequired,
  results: T.object
};

export default class Provider extends Component {
  static propTypes = {
    credentials: T.shape({
      applicationID: T.string.isRequired,
      key: T.string.isRequired
    }),
    config: T.shape({
      index: T.string.isRequired,
      facets: T.arrayOf(T.string),
      disjunctiveFacets: T.arrayOf(T.string)
    })
  }

  static childContextTypes = contextType;

  constructor(props) {
    super(props);
    this.state = { lastSearchResults: {} };
  }

  componentDidMount() {
    this.helper.search();
  }

  getChildContext(){
    const client = Algoliasearch(this.props.credentials.applicationID, this.props.credentials.key);
    const helper = this.helper = bindAll(AlgoliaSearchHelper(client, this.props.config.index, {
      facets: this.props.config.facets, disjunctiveFacets: this.props.config.disjunctiveFacets
    }));

    helper.on('result', (res) => {
      this.setState({lastSearchResults: res});
    });

    return {
      helper,
      results: this.state.lastSearchResults
    };
  }

  render() {
    return Children.only(this.props.children);
  }
};
