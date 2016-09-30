import createStore from './createStore.js';
import EventEmitter from 'events';
jest.unmock('./createStore.js');

describe('createStore', () => {
  it('exposes a getHelper method', () => {
    const state = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => state;
    const store = createStore(helper);

    expect(store.getHelper()).toBe(helper);
  });

  it('exposes a getState method', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);

    expect(store.getState()).toEqual({
      searching: false,
      searchParameters,
      searchResults: null,
      searchResultsSearchParameters: null,
      searchError: null
    });

    expect(store.getState().searchParameters).toBe(searchParameters);
  });

  it('computes state on helper `change` event', () => {
    const searchParameters = {some: 'parameter'};
    const searchParametersUpdate = {some: 'update'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    helper.emit('change', searchParametersUpdate);
    expect(store.getState()).toEqual({
      searching: false,
      searchParameters: searchParametersUpdate,
      searchResults: null,
      searchResultsSearchParameters: null,
      searchError: null
    });

    expect(store.getState().searchParameters).toBe(searchParametersUpdate);
  });

  it('computes state on helper `search` event', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    helper.emit('search');
    expect(store.getState()).toEqual({
      searching: true,
      searchParameters,
      searchResults: null,
      searchResultsSearchParameters: null,
      searchError: null
    });
  });

  it('computes state on helper `result` event', () => {
    const searchParameters = {some: 'parameter'};
    const searchResults = {some: 'result'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    helper.emit('result', searchResults, searchParameters);
    expect(store.getState()).toEqual({
      searching: false,
      searchParameters,
      searchResults,
      searchResultsSearchParameters: searchParameters,
      searchError: null
    });

    expect(store.getState().searchResults).toBe(searchResults);
  });

  it('stores the search parameters that yielded the search results', () => {
    const searchResultsSearchParameters = {some: 'parameter'};
    const searchResults = {some: 'result'};
    const helper = new EventEmitter();
    helper.getState = () => searchResultsSearchParameters;
    const store = createStore(helper);
    helper.emit('result', searchResults, searchResultsSearchParameters);
    const searchParameters = {someOther: 'parameter'};
    helper.emit('change', {someOther: 'parameter'});
    expect(store.getState()).toEqual({
      searching: false,
      searchParameters,
      searchResults,
      searchResultsSearchParameters,
      searchError: null
    });

    expect(store.getState().searchResultsSearchParameters).toBe(
      searchResultsSearchParameters
    );
  });

  it('computes state on helper error', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    const searchError = {};
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    helper.emit('error', searchError);
    expect(store.getState()).toEqual({
      searching: false,
      searchParameters,
      searchResults: null,
      searchResultsSearchParameters: null,
      searchError
    });

    expect(store.getState().searchError).toBe(searchError);
  });

  it('notifies listeners on helper change', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    store.subscribe(listener);
    expect(listener).not.toBeCalled();
    helper.emit('change');
    expect(listener).toBeCalled();
  });

  it('notifies listeners on helper search', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    store.subscribe(listener);
    expect(listener).not.toBeCalled();
    helper.emit('search');
    expect(listener).toBeCalled();
  });

  it('notifies listeners on helper result', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    store.subscribe(listener);
    expect(listener).not.toBeCalled();
    helper.emit('result');
    expect(listener).toBeCalled();
  });

  it('notifies listeners on helper error', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    store.subscribe(listener);
    expect(listener).not.toBeCalled();
    helper.emit('error');
    expect(listener).toBeCalled();
  });

  it('allows unsubscribing', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    helper.emit('change');
    expect(listener).not.toBeCalled();
  });

  it('remove only one listener', () => {
    const searchParameters = {some: 'parameter'};
    const helper = new EventEmitter();
    helper.getState = () => searchParameters;
    const store = createStore(helper);
    const listener = jest.fn();
    const anotherListener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    store.subscribe(anotherListener);
    unsubscribe();
    helper.emit('change');
    expect(listener).not.toBeCalled();
    expect(anotherListener).toBeCalled();
  });
});
