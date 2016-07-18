/* eslint-env jest, jasmine */
import React, {Component} from 'react';

jest.unmock('./Provider.js');
jest.unmock('./storeShape.js');
jest.mock('./createStore.js', () =>
  jest.fn(() =>
    ({
      getHelper: () => {},
      getState: () => {},
      subscribe: () => {}
    })
  )
);
import {mount} from 'enzyme';
import storeShape from './storeShape.js';
import createStore from './createStore.js';
import Provider from './Provider.js';

describe('Provider', () => {
  it('provides a store as context for children', () => {
    class Child extends Component {
      render() {
        return <div/>;
      }
    }
    Child.contextTypes = {
      algoliaStore: storeShape.isRequired
    };

    const helper = {};
    const wrapper = mount(<Provider helper={helper}><Child/></Provider>);
    expect(createStore).toBeCalledWith(helper);
    expect(wrapper.find(Child).node.context.algoliaStore).toBeDefined();
  });

  it('fails on multiple children', () => {
    class Child extends Component {
      render() {
        return <div/>;
      }
    }
    Child.contextTypes = {
      algoliaStore: storeShape.isRequired
    };

    const helper = {};
    try {
      mount(<Provider helper={helper}><Child/><Child/></Provider>);
      expect(true).toEqual(false);
    } catch (e) {
      expect(e.message).toEqual('onlyChild must be passed a children with exactly one child.');
    }
  });

  it('fails on no children', () => {
    const helper = {};
    try {
      mount(<Provider helper={helper}></Provider>);
      expect(true).toEqual(false);
    } catch (e) {
      expect(e.message).toEqual('onlyChild must be passed a children with exactly one child.');
    }
  });
});
