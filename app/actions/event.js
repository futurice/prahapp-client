import api from '../services/api';
import {createRequestActionTypes} from '.';
import { getCityId } from '../concepts/city';

const SET_EVENT_LIST = 'SET_EVENT_LIST';
const SET_EVENT_IMAGES = 'SET_EVENT_IMAGES';
const {
  GET_EVENT_LIST_REQUEST,
  GET_EVENT_LIST_SUCCESS,
  GET_EVENT_LIST_FAILURE
} = createRequestActionTypes('GET_EVENT_LIST');

const {
  GET_EVENT_IMAGES_REQUEST,
  GET_EVENT_IMAGES_SUCCESS,
  GET_EVENT_IMAGES_FAILURE
} = createRequestActionTypes('GET_EVENT_IMAGES');

const UPDATE_EVENT_SHOWFILTER = 'UPDATE_EVENT_SHOWFILTER';
const TOGGLE_EVENT_MAP_LOCATE = 'TOGGLE_EVENT_MAP_LOCATE';

const fetchEvents = () => (dispatch, getState) => {
  const cityId = getCityId(getState());

  if (!cityId) {
    return;
  }

  dispatch({ type: GET_EVENT_LIST_REQUEST });
  return api.fetchModels('events', { cityId, showPast: true })
  .then(events => {
    dispatch({
      type: SET_EVENT_LIST,
      payload: events
    });
    dispatch({ type: GET_EVENT_LIST_SUCCESS });
  })
  .catch(error => dispatch({ type: GET_EVENT_LIST_FAILURE, error: true, payload: error }));

};

const updateShowFilter = filterName => {
  return { type: UPDATE_EVENT_SHOWFILTER, payload: filterName };
};

const toggleLocateMe = () => {
  return { type: TOGGLE_EVENT_MAP_LOCATE };
}

const fetchImages = (eventId) => (dispatch, getState) => {
  dispatch({ type: GET_EVENT_IMAGES_REQUEST });
  return api.getImages(eventId)
    .then(event => {
      dispatch({
        type: SET_EVENT_IMAGES,
        payload: event.images
      });
      dispatch({ type: GET_EVENT_IMAGES_SUCCESS });
    })
    .catch(error => dispatch({ type: GET_EVENT_IMAGES_FAILURE, error: true, payload: error }));
}

export {
  SET_EVENT_LIST,
  GET_EVENT_LIST_REQUEST,
  GET_EVENT_LIST_SUCCESS,
  GET_EVENT_LIST_FAILURE,
  UPDATE_EVENT_SHOWFILTER,
  TOGGLE_EVENT_MAP_LOCATE,
  SET_EVENT_IMAGES,
  GET_EVENT_IMAGES_REQUEST,
  GET_EVENT_IMAGES_SUCCESS,
  GET_EVENT_IMAGES_FAILURE,
  fetchEvents,
  fetchImages,
  updateShowFilter,
  toggleLocateMe
};
