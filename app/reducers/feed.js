'use strict';
import Immutable from 'immutable';
import { createSelector } from 'reselect';
import { isNil } from 'lodash';

import {
  SET_FEED,
  APPEND_FEED,
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  GET_FEED_FAILURE,
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  DELETE_FEED_ITEM,
  OPEN_LIGHTBOX,
  VOTE_FEED_ITEM_REQUEST,
  CLOSE_LIGHTBOX
} from '../actions/feed';
import { getUserImages } from '../concepts/user';
import { getEventImages } from './event';
import LoadingStates from '../constants/LoadingStates';

// # Selectors
export const getFeed = state => state.feed.get('list') || Immutable.List([]);
export const getLightBoxItemId = state => state.feed.get('lightBoxItemId', null);

export const getAllPostsInStore = createSelector(
  getFeed, getUserImages, getEventImages,
  (feedList, userImages, eventImages) => feedList.concat(userImages, eventImages)
);

export const getLightboxItem = createSelector(
  getLightBoxItemId, getAllPostsInStore,
  (id, posts) => {

    if (isNil(id)) {
      return Immutable.Map();
    }

    return posts.find((item) => item.get('id') === id);
  }
);


// # Reducer
const initialState = Immutable.fromJS({
  list: [],
  listState: LoadingStates.NONE,
  isRefreshing: false,
  lightBoxItem: {},
  lightBoxItemId: {},
  isLightBoxOpen: false
});

export default function feed(state = initialState, action) {
  switch (action.type) {
    case SET_FEED:
      return state.set('list', Immutable.fromJS(action.feed));
    case APPEND_FEED:
      return (action.feed && action.feed.length) ?
        state.set('list', Immutable.fromJS(state.get('list')
          .concat(Immutable.fromJS(action.feed)))) :
        state;
    case GET_FEED_REQUEST:
      return state.set('listState', LoadingStates.LOADING);
    case GET_FEED_SUCCESS:
      return state.set('listState', LoadingStates.READY);
    case GET_FEED_FAILURE:
      return state.set('listState', LoadingStates.FAILED);
    case REFRESH_FEED_REQUEST:
      return state.set('isRefreshing', true);
    case REFRESH_FEED_SUCCESS:
      return state.set('isRefreshing', false);
    case DELETE_FEED_ITEM:
      const originalList = state.get('list');
      const itemIndex = originalList.findIndex((item) => item.get('id') === action.item.id);

      if (itemIndex < 0) {
        console.log('Tried to delete item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.set('list', originalList.delete(itemIndex));
      }

    case VOTE_FEED_ITEM_REQUEST: {
      const list = state.get('list');
      const voteItemIndex = list.findIndex((item) => item.get('id') === action.feedItemId);
      if (voteItemIndex < 0) {
        console.log('Tried to vote item, but it was not found from state:', voteItemIndex);
        return state;
      } else {
        return state.mergeIn(['list', voteItemIndex], {
          'userVote': action.value,
          'votes': action.votes
        });
      }
    }

    case OPEN_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: true,
        lightBoxItemId: action.payload
      });

    case CLOSE_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: false,
        lightBoxItemId: null,
      })

    default:
      return state;
  }
}
