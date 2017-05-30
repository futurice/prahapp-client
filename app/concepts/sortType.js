import { fromJS } from 'immutable';
import SortTypes from '../constants/SortTypes';
import { fetchFeed, refreshFeed } from '../actions/feed';


// # Action creators
export const SET_FEED_SORT_TYPE = 'sortType/SET_FEED_SORT_TYPE';
export const setFeedSortType = (payload) => dispatch =>
  Promise.resolve(
    dispatch({ type: SET_FEED_SORT_TYPE, payload })
  )
  .then(() => dispatch(refreshFeed()));

export const sortFeedChronological = () => setFeedSortType(SortTypes.SORT_NEW);

// # Selectors
export const getFeedSortType = state => state.sortType.get('type');


// # Reducer
const initialState = fromJS({
  type: SortTypes.SORT_NEW
});

export default function sortType(state = initialState, action) {
  switch (action.type) {
    case SET_FEED_SORT_TYPE: {
      return state.set('type', action.payload);
    }

    default: {
      return state;
    }
  }
}
