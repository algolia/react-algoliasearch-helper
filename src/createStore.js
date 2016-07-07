export default function createStore(helper) {
  let state = {
    searching: false,
    searchParameters: helper.getState(),
    searchResults: null,
    searchError: null,
  };
  const listeners = [];
  const dispatch = () => {
    listeners.forEach(listener => listener());
  };

  let dispatchQueued = false;
  const debouncedDispatch = () => {
    if (!dispatchQueued) {
      dispatchQueued = true;
      process.nextTick(() => {
        dispatchQueued = false;
        dispatch();
      });
    }
  };

  let searchQueued = false;
  const debouncedSearch = () => {
    if (!searchQueued) {
      searchQueued = true;
      process.nextTick(() => {
        searchQueued = false;
        helper.search();
      });
    }
  };

  helper.on('change', searchParameters => {
    state = {
      ...state,
      searchParameters,
    };
    debouncedDispatch();
  });

  helper.on('search', () => {
    state = {
      ...state,
      searching: true,
    };
    dispatch();
  });

  helper.on('result', searchResults => {
    state = {
      ...state,
      searching: false,
      searchResults,
    };
    dispatch();
  });

  helper.on('error', searchError => {
    state = {
      ...state,
      searching: false,
      searchError,
    };
    dispatch();
  });

  return {
    debouncedSearch,
    getHelper: () => helper,
    getState: () => {
      return state;
    },
    subscribe: listener => {
      listeners.push(listener);
      return function unsubscribe() {
        listeners.splice(listeners.indexOf(listener));
      };
    },
  };
}
