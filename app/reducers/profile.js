'use strict';
import Immutable from 'immutable';

import {
  SET_LINK,
} from '../actions/profile';

const initialState = Immutable.fromJS({
  links: [],
  terms: []
});

export default function profile(state = initialState, action) {
  switch (action.type) {
    case SET_LINK:
      return state.merge({
        links: Immutable.fromJS(action.links.links),
        terms: Immutable.fromJS(action.links.terms)
      });

    default:
      return state;
  }
}
