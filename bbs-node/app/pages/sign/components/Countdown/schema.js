import { PropTypes as types } from 'prop-types';

export default {

  types: {
    stop: types.number,
    onStart: types.func,
    onStop: types.func
  },

  defaults: {
    stop: 0
  }
};
