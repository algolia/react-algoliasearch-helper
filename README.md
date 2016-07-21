# react-algoliasearch-helper

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

React `<Provider>` and `connect(WrappedComponent)` for [algoliasearch-helper](https://community.algolia.com/algoliasearch-helper-js/).

Its goal is to make building React applications with Algolia easier by allowing easy
access to the [algoliasearch-helper](https://community.algolia.com/algoliasearch-helper-js/).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Install](#install)
- [Example](#example)
- [API](#api)
- [Tests](#tests)
- [Dev](#dev)
- [Release](#release)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install

```sh
npm install react-algoliasearch-helper --save
```

## Example

SearchBox.js
```js
import React from 'react';
import {connect} from 'react-algoliasearch-helper';

export default connect()(
  ({helper}) =>
    <input
      placeholder="Search here"
      autoFocus
      onChange={e => helper.setQuery(e.target.value).search()}
    />
);
```

Hits.js
```js
import React, {PropTypes} from 'react';
import {connect} from 'react-algoliasearch-helper';

const Results = ({results}) => {
  if (!results) return <div/>;
  return <div>{results.hits.map(hit => <div key={hit.objectID}>{hit.Name}</div>)}</div>;
};

Results.propTypes = {
  results: PropTypes.object
};

export default connect(
  state => ({results: state.searchResults})
)(Results);
```

index.js
```js
import React from 'react';
import ReactDOM from 'react-dom';
import algoliasearch from 'algoliasearch';
import algoliasearchHelper from 'algoliasearch-helper';
import {Provider} from 'react-algoliasearch-helper';
import SearchBox from './components/SearchBox.js';
import Hits from './components/Hits.js';

const client = algoliasearch('latency', 'ffc36feb6e9df06e1c3c4549b5af2b31');
const helper = algoliasearchHelper(client, 'starbucks');

const App = () =>
  <Provider helper={helper}>
    <div>
      <SearchBox/>
      <Hits/>
    </div>
  </Provider>;

ReactDOM.render(<App/>, document.querySelector('#root'));
```

## API

### `<Provider helper>`

Makes the Algolia Search `helper` available to the `connect()` calls in the component hierarchy below. You can’t use connect() without wrapping your root component in <Provider>.

#### Props

* `helper` ([algoliasearch-helper-js](https://github.com/algolia/algoliasearch-helper-js)):
* `children` (ReactElement) The root of your component hierarchy.

#### Example

```js
ReactDOM.render(
  <Provider helper={helper}>
    <MyRootComponent />
  </Provider>,
  rootEl
)
```

### `connect([mapStateToProps])(WrappedComponent)`

Connects a React component to the helper.

#### Arguments

* `[mapStateToProps(state, ownProps): stateProps]` (function): if specified, the component will subscribe to helper events (`change`, `search`, `result`, `error`). Allowing you to compute props for your wrapper component based on the search state.

#### Search state shape

Every function passed to `mapStateToProps` argument of `connect` will be given an search state object with those properties:
* `searching` (boolean): `true` when a search request is pending, false otherwise
* `searchParameters` (object): helper's [SearchParameters](https://community.algolia.com/algoliasearch-helper-js/docs/SearchParameters.html)
* `searchResults` (object): helper's [SearchResults](https://community.algolia.com/algoliasearch-helper-js/docs/SearchResults.html)
* `searchResultsSearchParameters` (object): [SearchParameters](https://community.algolia.com/algoliasearch-helper-js/docs/SearchParameters.html) that yielded the current [SearchResults](https://community.algolia.com/algoliasearch-helper-js/docs/SearchResults.html)
* `searchError` (Error): When the search fails

#### Remarks

* It needs to be invoked two times. The first time with its arguments described above, and a second time, with the component: `connect([mapStateToProps])(WrappedComponent)`.
* It does not modify the passed React component. It returns a new, connected component, that you should use instead.
* Most probably, you will use `connect` as in `export default connect()(WrappedComponent)`.

#### Examples

Forward `helper` to the `RefinementList` component:
```js
export default connect()(RefinementList)
```

Receive `results` in the `Hits` component:
```js
export default connect(
  state =>
    ({
      results: state.searchResults
    })
)(Hits) // Hits component will receive a `results` property everytime new results are available
```

## Tests

Tests are written with [Jest](http://facebook.github.io/jest/).

```sh
npm test
npm run test:watch
npm run lint
```

## Dev

```sh
npm start
```

## Release

```sh
npm run release
```

[version-svg]: https://img.shields.io/npm/v/react-algoliasearch-helper.svg?style=flat-square
[package-url]: https://npmjs.org/package/react-algoliasearch-helper
[travis-svg]: https://img.shields.io/travis/algolia/react-algoliasearch-helper/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/algolia/react-algoliasearch-helper
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/react-algoliasearch-helper.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=react-algoliasearch-helper
