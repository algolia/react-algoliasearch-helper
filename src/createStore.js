export default function createStore(helper) {
  let state = {
    searching: false,
    searchParameters: helper.getState(),
    searchResults: null,
    searchResultsSearchParameters: null,
    searchError: null
  };
  const listeners = [];
  const dispatch = () => { listeners.forEach(listener => listener()); };

  helper.on('change', searchParameters => {
    state = {
      ...state,
      searchParameters
    };
    dispatch();
  });

  helper.on('search', () => {
    state = {
      ...state,
      searching: true
    };
    dispatch();
  });

  helper.on('result', (searchResults, searchParameters) => {
    state = {
      ...state,
      searching: false,
      searchResults,
      searchResultsSearchParameters: searchParameters
    };
    dispatch();
  });

  helper.on('error', searchError => {
    state = {
      ...state,
      searching: false,
      searchError
    };
    dispatch();
  });

  return {
    getHelper: () => helper,
    getState: () => state,
    subscribe: listener => {
      listeners.push(listener);
      return function unsubscribe() {
        listeners.splice(listeners.indexOf(listener), 1);
      };
    }
  };
}
