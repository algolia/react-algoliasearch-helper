import { PropTypes as T } from 'react';

export default T.shape({
  getHelper: T.func.isRequired,
  getState: T.func.isRequired,
  subscribe: T.func.isRequired,
});
