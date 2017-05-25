import { AsyncStorage, Platform } from 'react-native';
import { createSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { isNil, random } from 'lodash';
import { ReactNativeAudioStreaming } from 'react-native-audio-streaming';

import api from '../services/api';
import { getCityId } from './city';
import {
  PLAYING,
  STREAMING,
  PAUSED,
  STOPPED,
  ERROR,
  BUFFERING,
} from '../constants/RadioStates';


import { APP_STORAGE_KEY } from '../../env';
const radioKey = `${APP_STORAGE_KEY}:radio`;
const IOS = Platform.OS === 'ios';

import { createRequestActionTypes } from '../actions/';


// # Selectors
export const getRadioStatus = state => state.radio.get('status');
export const getRadioMode = state => state.radio.get('expanded');
export const getRadioName = state => state.radio.get('name');
export const getActiveStationId = state => state.radio.get('activeStationId');
export const getRadioStations = state => state.radio.get('stations') || List([]);

export const isRadioPlaying = createSelector(
  getRadioStatus,
  (status) => status === PLAYING || status === STREAMING
);

export const getActiveStation = createSelector(
  getActiveStationId, getRadioStations,
  (activeId, stations) => stations.find(item => item.get('id') === activeId) || Map()
);

export const getNowPlaying = createSelector(
  getActiveStation,
  (station) => station.get('nowPlaying') || Map()
);

export const getNowPlayingLeft = createSelector(
  getActiveStation,
  (station) => station.getIn(['nowPlaying', 'left'], null)
);

// # Action creators

const pause = () => ReactNativeAudioStreaming.pause();
const stop = () => ReactNativeAudioStreaming.stop();
const play = () => (dispatch, getState) => {
  const state = getState();
  const url = getActiveStation(state).get('stream');
  if (url) {
    ReactNativeAudioStreaming.play(url, { showIniOSMediaCenter: true, showInAndroidNotifications: true });
  } else {
    stop();
  }
}

export const onRadioPress = () => (dispatch, getState) => {
  const state = getState();
  const status = getRadioStatus(state);

  switch (status) {
    case PLAYING:
    case STREAMING:
      pause();
      break;
    case PAUSED:
      dispatch(play());
      break;
    case STOPPED:
    case ERROR:
      dispatch(play());
      break;
    case BUFFERING:
      stop();
      break;
  }
}

const SET_RADIO_SONG = 'radio/SET_RADIO_SONG';
export const setRadioSong = (song) => ({ type: SET_RADIO_SONG, payload: song });

const SET_RADIO_STATUS = 'radio/SET_RADIO_STATUS';
export const setRadioStatus = (status) => ({ type: SET_RADIO_STATUS, payload: status });

const SET_RADIO_STATIONS = 'radio/SET_RADIO_STATIONS';
export const setRadioStations = (stations) => ({ type: SET_RADIO_STATIONS, payload: stations });

const SET_RADIO_STATION_ACTIVE = 'radio/SET_RADIO_STATION_ACTIVE';
export const setRadioStationActive = (stationId) => (dispatch, getState) => {
  dispatch({ type: SET_RADIO_STATION_ACTIVE, payload: stationId })

  // Radio needs to be stopped in Android
  //  when station is changed or app crashes
  const isPlaying = isRadioPlaying(getState());
  if (!IOS && isPlaying) {
    stop();
  }

  // set to local storage
  AsyncStorage.setItem(radioKey, JSON.stringify(stationId));
  dispatch(setSongUpdater());

  // continue playing if radio is/was playing
  if (IOS && isPlaying) {
    setTimeout(() => {
      dispatch(play());
    }, 100);
  }

}

const TOGGLE_RADIO_BAR = 'radio/TOGGLE_RADIO_BAR';
export const toggleRadioBar = expanded => dispatch => {
  dispatch(fetchRadioStations());
  dispatch(({ type: TOGGLE_RADIO_BAR, payload: expanded }));
}
export const closeRadio = () => (dispatch) => {
  dispatch(setRadioStatus(STOPPED))
  dispatch(setRadioSong(''))
}

const {
  GET_RADIO_STATIONS_REQUEST,
  GET_RADIO_STATIONS_SUCCESS,
  GET_RADIO_STATIONS_FAILURE
} = createRequestActionTypes('GET_RADIO_STATIONS');


export const fetchRadioStations = () => dispatch => {
  dispatch({ type: GET_RADIO_STATIONS_REQUEST });
  return api.fetchModels('radio')
  .then(stations => {
    dispatch({
      type: SET_RADIO_STATIONS,
      payload: stations
    });
    dispatch({ type: GET_RADIO_STATIONS_SUCCESS });
  })
  .then(() => dispatch(setDefaultRadioByCity()))
  .then(() => dispatch(setSongUpdater()))
  .catch(error => dispatch({ type: GET_RADIO_STATIONS_FAILURE, error: true, payload: error }));
};

export const setDefaultRadioByCity = (city) => (dispatch, getState) => {
  const state = getState();
  const activeStation = getActiveStationId(state);

  // If user has already active station and city is not defined
  // as function parameter, just break
  if (activeStation && !city) {
    return;
  }

  const cityId = city || getCityId(state);

  // Find station by city Id
  const stations = getRadioStations(state);
  const nextStation = stations.find(s => s.get('cityId') === cityId) || stations.first();
  const stationId = nextStation.get('id');

  return dispatch(setRadioStationActive(stationId));
}

// Song/Program updater
let songUpdater = null;
const MINIMUM_UPDATE_INTERVAL = 60; // seconds
const RANDOM_SECONDS_ADDED = 10; // seconds
const setSongUpdater = () => (dispatch, getState) => {
  if (!isNil(songUpdater)) {
    clearTimeout(songUpdater);
  }

  const playingLeft = getNowPlayingLeft(getState());
  const refreshTime = Math.max(playingLeft, MINIMUM_UPDATE_INTERVAL * 1000);
  const randomOffset = random(0, RANDOM_SECONDS_ADDED) * 1000;

  console.log('Next update in (s)', (refreshTime + randomOffset) / 1000);
  songUpdater = setTimeout(() =>
    dispatch(fetchRadioStations()), refreshTime + randomOffset);
}

export const initializeUsersRadio = () => (dispatch, getState) =>
  AsyncStorage.getItem(radioKey)
  .then(station => {
    const activeStation = station ? JSON.parse(station) : null;

    if (!isNil(activeStation)) {
      return dispatch(setRadioStationActive(activeStation));
    } else {
      return dispatch(setDefaultRadioByCity());
    }
  })
  .catch(error => { console.log('error setting radio') });



// # Reducer
const initialState = fromJS({
  // url: 'http://stream.basso.fi:8000/stream',
  // url: 'http://stream.wappuradio.fi:80/wappuradio.mp3',
  status: STOPPED,
  expanded: false,
  stations: null,
  activeStationId: null,
});

export default function radio(state = initialState, action) {
  switch (action.type) {
    case SET_RADIO_SONG: {
      return state.set('song', action.payload);
    }

    case SET_RADIO_STATUS: {
      return state.set('status', action.payload);
    }

    case SET_RADIO_STATIONS: {
      return state.set('stations', fromJS(action.payload));
    }

    case SET_RADIO_STATION_ACTIVE: {
      return state.set('activeStationId', action.payload);
    }

    case TOGGLE_RADIO_BAR: {
      return state.set('expanded', action.payload);
    }

    default: {
      return state;
    }
  }
}
