import React, { PropTypes, Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

import storeShape from './storeShape';

export default function connect(
  mapStateToProps,
  { helperProp = 'helper', searchProp = 'search' } = {}
) {
  return Composed => {
    return class Connected extends Component {
      static contextTypes = {
        algoliaStore: storeShape.isRequired,
      };

      constructor(props, context) {
        super();

        if (mapStateToProps) {
          this.state = mapStateToProps(context.algoliaStore.getState(), props);

          this.unsubscribe = context.algoliaStore.subscribe(() => {
            this.setState(
              mapStateToProps(context.algoliaStore.getState(), this.props)
            );
          });
        }
      }

      componentWillReceiveProps(nextProps) {
        if (mapStateToProps) {
          this.setState(
            mapStateToProps(this.context.algoliaStore.getState(), nextProps)
          );
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          this.unsubscribe();
        }
      }

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      render() {
        return (
          <Composed
            {...this.props}
            {...this.state}
            {...{
              [helperProp]: this.context.algoliaStore.getHelper(),
              [searchProp]: this.context.algoliaStore.debouncedSearch,
            }}
          />
        );
      }
    }
  };
}
