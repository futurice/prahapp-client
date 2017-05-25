import { AsyncStorage } from 'react-native';
import { createSelector } from 'reselect';
import { fromJS, List } from 'immutable';
import { isNil, parseInt } from 'lodash';
import api from '../services/api';
import {createRequestActionTypes} from '../actions';
import { fetchFeed } from '../actions/feed';
import { fetchTeams } from '../actions/team';
import { fetchEvents } from '../actions/event';
import { fetchMoodData } from './mood';
import { getTeams } from '../reducers/team';
import { getUserTeamId } from '../reducers/registration';


import { APP_STORAGE_KEY } from '../../env';
const cityKey = `${APP_STORAGE_KEY}:city`;


// # Selectors
export const getCityList = state => state.city.get('list', List()) || List();
export const getCityId = state => state.city.get('id');
export const getCityPanelShowState = state => state.city.get('showCityPanel');
export const getCurrentCityName = createSelector(
   getCityId, getCityList,
   (cityId, cityList) => {
      if (isNil(cityId) || cityId === 1) {
        return '';
      }

      const currentCity = cityList.find(c => c.get('id') === cityId) || List()

      return currentCity.get('name');
    }
);

export const getCityIdByTeam = createSelector(
  getUserTeamId, getTeams,
  (teamId, teams) => {
    const usersTeamInfo = teams.find(team => team.get('id') === teamId);

    if (!usersTeamInfo) {
      return null;
    }

    return usersTeamInfo.get('city');
  });

export const getUsersCityName = createSelector(
  getCityIdByTeam, getCityList,
  (cityId, cities) => {

    if (!cities || cities.isEmpty()) {
      return null;
    }

    const usersCity = cities.find(c => c.get('id') === cityId) || List();

    return usersCity.get('name', '');

  });

// # Action creators

// TODO: Setting city should re-fetch feed, events and teams
export const SET_CITY = 'city/SET_CITY';
export const setCity = (cityId) => dispatch => {
  // set to state
  dispatch({ type: SET_CITY, payload: cityId })

  dispatch(toggleCityPanel(true));

  // set to local storage
  AsyncStorage.setItem(cityKey, JSON.stringify(cityId))
    .then(() => dispatch(fetchCitySpecificContent()));
}

const SET_CITY_LIST = 'city/SET_CITY_LIST';
const {
  GET_CITY_LIST_REQUEST,
  GET_CITY_LIST_SUCCESS,
  GET_CITY_LIST_FAILURE
} = createRequestActionTypes('GET_CITY_LIST');

export const fetchCities = () => dispatch => {
  dispatch({ type: GET_CITY_LIST_REQUEST });

  return api.fetchModels('cities')
  .then(cities => {
    dispatch({ type: GET_CITY_LIST_SUCCESS });
    return dispatch({
      type: SET_CITY_LIST,
      payload: cities
    });
  })
  .catch(error => dispatch({ type: GET_CITY_LIST_FAILURE, error: true, payload: error }));
};


export const NO_SELECTED_CITY_FOUND = 'city/NO_SELECTED_CITY_FOUND';
export const initializeUsersCity = () => (dispatch, getState) => {
  const defaultCityId = '1';

  return AsyncStorage.getItem(cityKey)
    .then(c => {

      const activeCity = c ? JSON.parse(c) : defaultCityId;
      const isDefault = parseInt(activeCity, 10) === 1;
      dispatch({ type: NO_SELECTED_CITY_FOUND, payload: isDefault});
      return dispatch(setCity(activeCity));
    })
    .catch(error => { console.log('error when setting city') });
};

const FETCH_CITY_CONTENT_SUCCESS = 'city/FETCH_CITY_CONTENT_SUCCESS';
export const fetchCitySpecificContent = () => dispatch =>
  Promise.all([
    dispatch(fetchFeed()),
    dispatch(fetchEvents()),
    dispatch(fetchTeams()),
    dispatch(fetchMoodData()),
  ])
  .then(() => dispatch({ type: FETCH_CITY_CONTENT_SUCCESS }))


const TOGGLE_CITY_PANEL = 'city/TOGGLE_CITY_PANEL';
export const toggleCityPanel = (close) => (dispatch, getState) => {
  const open = close || getCityPanelShowState(getState());
  return dispatch({ type: TOGGLE_CITY_PANEL, payload: !open });
}

// # Reducer
const initialState = fromJS({
  id: null,
  list: [],
  showCityPanel: false,
});

export default function city(state = initialState, action) {
  switch (action.type) {
    case SET_CITY_LIST: {
      return state.set('list', fromJS(action.payload));
    }

    case SET_CITY: {
      return state.set('id', parseInt(action.payload, 10));
    }

    case TOGGLE_CITY_PANEL: {
      return state.set('showCityPanel', action.payload);
    }

    default: {
      return state;
    }
  }
}
