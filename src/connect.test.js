import React, {Component} from 'react';
import connect from './connect.js';
import {shallow, mount} from 'enzyme';
jest.unmock('./connect.js');
jest.unmock('./storeShape.js');

describe('connect', () => {
  it('provides a helper prop', () => {
    const Connected = connect()(() => <div/>);
    const helper = {};
    const algoliaStore = {getHelper() { return helper; }, getState() {}, subscribe() {}};
    const wrapper = shallow(<Connected />, {context: {algoliaStore}});

    expect(wrapper.props()).toEqual({helper});
    expect(wrapper.props().helper).toBe(helper);
  });

  it('merges props', () => {
    const Connected = connect()(() => <div/>);
    const helper = {};
    const algoliaStore = {getHelper() { return helper; }, getState() {}, subscribe() {}};
    const wrapper = shallow(<Connected prop="test" />, {context: {algoliaStore}});

    expect(wrapper.props()).toEqual({prop: 'test', helper});
  });

  it('accepts a store state to props mapping option', () => {
    const mapStateToProps = jest.fn(() => ({state: true}));
    const Connected = connect(mapStateToProps)(() => <div/>);
    const helper = {};
    const state = {};
    const algoliaStore = {
      getHelper() { return helper; },
      getState() { return state; },
      subscribe: () => {}
    };
    const wrapper = shallow(<Connected prop />, {context: {algoliaStore}});

    expect(mapStateToProps).toBeCalledWith(state, {prop: true});
    expect(wrapper.state()).toEqual({state: true});
  });

  it('subscribes to store state changes', () => {
    const mapStateToProps = jest.fn((() => {
      let state = 0;
      return () => {
        state++;
        return {state};
      };
    })());
    const Wrapped = () => <div/>;
    const Connected = connect(mapStateToProps)(Wrapped);
    const helper = {};
    const state = {};
    let subscribeListener;
    const algoliaStore = {
      getHelper() { return helper; },
      getState() { return state; },
      subscribe: fn => { subscribeListener = fn; }
    };
    const wrapper = mount(<Connected prop />, {context: {algoliaStore}});
    subscribeListener();
    expect(wrapper.find(Wrapped).props()).toEqual({helper, state: 2, prop: true});
  });

  it('calls store.unsubscribe when component unmount', () => {
    const unsubscribe = jest.fn();
    const Connected = connect(() => {})(() => <div/>);
    const algoliaStore = {getHelper() {}, getState() {}, subscribe() { return unsubscribe; }};
    const wrapper = mount(<Connected />, {context: {algoliaStore}});
    expect(unsubscribe).not.toBeCalled();
    wrapper.unmount();
    expect(unsubscribe).toBeCalled();
  });

  it('only renders when needed', () => {
    const Wrapped = jest.fn(() => <div/>);
    let subscribeListener;
    const algoliaStore = {
      getHelper() {},
      getState() {
        return {page: 2};
      },
      subscribe(fn) {
        subscribeListener = fn;
      }
    };
    const mapStateToProps = ({page}) => ({page});
    const Connected = connect(mapStateToProps)(Wrapped);
    expect(Wrapped.mock.calls.length).toEqual(0);
    mount(<Connected />, {context: {algoliaStore}});
    expect(Wrapped.mock.calls.length).toEqual(1);
    subscribeListener();
    expect(Wrapped.mock.calls.length).toEqual(1);
  });

  it('sets the right displayName on classes', () => {
    class SuperComponent extends Component {
      render() {
        return <div/>;
      }
    }

    const algoliaStore = {getHelper() {}, getState() {}, subscribe() {}};
    const Connected = connect()(SuperComponent);
    const wrapper = mount(<Connected />, {context: {algoliaStore}});
    expect(wrapper.name()).toEqual('AlgoliaSearchHelperConnect(SuperComponent)');
  });

  // this works because babel turns arrows functions to named function expressions
  it('sets the right displayName on stateless components', () => {
    const SuperComponent = () => <div/>; // => var SuperComponent = function SuperComponent() {}
    const algoliaStore = {getHelper() {}, getState() {}, subscribe() {}};
    const Connected = connect()(SuperComponent);
    const wrapper = mount(<Connected />, {context: {algoliaStore}});
    expect(wrapper.name()).toEqual('AlgoliaSearchHelperConnect(SuperComponent)');
  });

  it('sets the right displayName on React.createClass', () => {
    const SuperComponent = React.createClass({
      render() { return <div/>; },
      displayName: 'SuperComponent'
    });

    const algoliaStore = {getHelper() {}, getState() {}, subscribe() {}};
    const Connected = connect()(SuperComponent);
    const wrapper = mount(<Connected />, {context: {algoliaStore}});
    expect(wrapper.name()).toEqual('AlgoliaSearchHelperConnect(SuperComponent)');
  });

  it('sets a default displayName when not able to find one', () => {
    const SuperComponent = React.createClass({
      render() { return <div/>; },
      displayName: undefined // latest babel
    });

    const algoliaStore = {getHelper() {}, getState() {}, subscribe() {}};
    const Connected = connect()(SuperComponent);
    const wrapper = mount(<Connected />, {context: {algoliaStore}});
    expect(wrapper.name()).toEqual('AlgoliaSearchHelperConnect(UnknownComponent)');
  });
});
