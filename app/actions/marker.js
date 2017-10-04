import api from '../services/api';
import {createRequestActionTypes} from '.';
import staticMarkers from '../data/user-markers';

const SET_MARKER_LIST = 'SET_MARKER_LIST';
const {
  GET_MARKER_LIST_REQUEST,
  GET_MARKER_LIST_SUCCESS,
  GET_MARKER_LIST_FAILURE
} = createRequestActionTypes('GET_MARKER_LIST');

const fetchMarkers = () => {
  return (dispatch) => {
    dispatch({ type: GET_MARKER_LIST_REQUEST });

    api.fetchModels('markers')
      .then(markers => {
        dispatch({
          type: SET_MARKER_LIST,
          payload: markers
        });
        dispatch({ type: GET_MARKER_LIST_SUCCESS });
      })
      .catch(error => dispatch({ type: GET_MARKER_LIST_FAILURE, error: true, payload: error }));
  }
};

export {
  SET_MARKER_LIST,
  GET_MARKER_LIST_REQUEST,
  GET_MARKER_LIST_SUCCESS,
  GET_MARKER_LIST_FAILURE,
  fetchMarkers
};
