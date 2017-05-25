import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';
import { isNil } from 'lodash';

import api from '../services/api';
import { createRequestActionTypes } from '../actions/';
import { getCityId } from './city';
import { getUserTeamId, getUserId } from '../reducers/registration';
import { getTeams } from '../reducers/team';
import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../actions/competition';


import * as NotificationMessages from '../utils/notificationMessage';
import ActionTypes from '../constants/ActionTypes';

// const placeHolderMoodData = times(27).map((item, index) => ({
//   date: moment('2017-05-02').subtract(index, 'd').format('YYYY-MM-DD'),
//   value: index > 8 ? (70 - index * 2) + Math.floor(Math.random() * 5) : null
// })).reverse();

// # Selectors
export const getMoodData = state => state.mood.get('data', List()) || List();
export const getLimitLine = state => state.mood.get('limitLine');
export const isMoodSending = state => state.mood.get('moodSending');
export const isMoodLoading = state => state.mood.get('isLoading');

const showAfter = '2017-03-23';
const showAfterISO = moment(showAfter).toISOString();
const getValidMoodData = createSelector(
  getMoodData, (data) => {
    if (!data || data.isEmpty()) {
      return List();
    }
    return data.filter(datum => datum.get('date') >= showAfterISO)
  }
);


// Values come in range of [0, 10]
// Presentation of data is in percentage scale [0, 100]
const formatValue = value => {
  return !isNil(value) ? parseInt(value * 10) : null
}
const processMoodData = (data, type) => (data || [])
.map(datum => ({
  date: moment(datum.get('date')).format('YYYY-MM-DD'),
  value: formatValue(datum.get(type))

}));

export const getMoodDataForChart = (type = 'ratingPersonal') => createSelector(
  getValidMoodData,
  (data) => fromJS(processMoodData(data, type)) || List()
);

export const getOwnMoodData = getMoodDataForChart('ratingPersonal');
export const getTeamMoodData = getMoodDataForChart('ratingTeam');
export const getCityMoodData = getMoodDataForChart('ratingCity');
// export const getCityMoodData = state => fromJS(placeHolderMoodData);

export const getLimitLineData = createSelector(
  getLimitLine, getValidMoodData,
  (limit, data) => data.map(item => ({
    date: moment(item.get('date')).format('YYYY-MM-DD'),
    value: limit
  }))
);


export const getKpiValues = createSelector(
  getMoodData,
  (data) => {
    const today = moment();
    const todayData = data.find(datum => moment(datum.get('date')).isSame(today, 'day')) || Map();

    return fromJS({
      ratingPersonal: formatValue(todayData.get('ratingPersonal')),
      ratingTeam: formatValue(todayData.get('ratingTeam')),
      ratingCity: formatValue(todayData.get('ratingCity')),
    });
  });


export const getCurrentTeamName = createSelector(
  getTeams, getUserTeamId,
  (teams, teamId) => (teams.find(t => t.get('id') === teamId) || List()).get('name')
)

// # Action creators
export const TOGGLE_MOOD_SLIDER = 'mood/TOGGLE_MOOD_SLIDER';
export const SET_MOOD_DATA = 'mood/SET_MOOD_DATA';

export const setMoodData = (moodData) => ({ type: SET_MOOD_DATA, payload: moodData });

const {
  GET_MOOD_DATA_REQUEST,
  GET_MOOD_DATA_SUCCESS,
  GET_MOOD_DATA_FAILURE
} = createRequestActionTypes('GET_MOOD_DATA');
export const fetchMoodData = () => (dispatch, getState) => {

  const state = getState();
  const cityId = getCityId(state);
  const teamId = getUserTeamId(state);
  const userId = getUserId(state);


  const moodParams = Object.assign(
    cityId ? { cityId } : {},
    teamId ? { teamId } : {},
    userId ? { userId } : {});


  dispatch({ type: GET_MOOD_DATA_REQUEST });

  return api.fetchModels('mood', moodParams)
  .then(data => {
    dispatch({
      type: SET_MOOD_DATA,
      payload: data
    });
    dispatch({ type: GET_MOOD_DATA_SUCCESS });
  })
  .catch(error => dispatch({ type: GET_MOOD_DATA_FAILURE, error: true, payload: error }));
};


const {
  PUT_MOOD_REQUEST,
  PUT_MOOD_SUCCESS,
  PUT_MOOD_FAILURE
} = createRequestActionTypes('PUT_MOOD');



export const submitMood = (payload) => (dispatch, getState) => {
  dispatch({ type: PUT_MOOD_REQUEST });

  return api.putMood(payload)
  .then(response => {


    dispatch({ type: PUT_MOOD_SUCCESS, payload: response });
    dispatch(fetchMoodData());

    setTimeout(() => {
      dispatch({ type: SHOW_NOTIFICATION,
        payload: NotificationMessages.getMessage({ type: ActionTypes.MOOD }) });
    }, 1000);

    setTimeout(() => {
      dispatch({ type: HIDE_NOTIFICATION });
    }, 5000);

  })
  .catch(e => {
    dispatch({ type: PUT_MOOD_FAILURE, error: e });
  });
};


// # Reducer
const initialState = fromJS({
  data: [],
  limitLine: 50,
  showMoodSlider: false,
  moodSending: false,
});

export default function mood(state = initialState, action) {
  switch (action.type) {
    case SET_MOOD_DATA: {
      return state.set('data', fromJS(action.payload));
    }

    case GET_MOOD_DATA_REQUEST: {
      return state.set('isLoading', true);
    }
    case GET_MOOD_DATA_SUCCESS:
    case GET_MOOD_DATA_FAILURE: {
      return state.set('isLoading', false);
    }


    case TOGGLE_MOOD_SLIDER: {
      return state.set('showMoodSlider', action.payload);
    }

    case PUT_MOOD_REQUEST: {
      return state.set('moodSending', true);
    }

    case PUT_MOOD_SUCCESS:
    case PUT_MOOD_FAILURE: {
      return state.set('moodSending', false);
    }

    default: {
      return state;
    }
  }
}
