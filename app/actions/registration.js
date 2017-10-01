import DeviceInfo from 'react-native-device-info';
import { AsyncStorage, Platform } from 'react-native';
import _ from 'lodash';

import api from '../services/api';
import { AUTH0_CLIENTID, AUTH0_DOMAIN } from '../../env';
import STORAGE_KEYS from '../constants/StorageKeys';
import namegen from '../services/namegen';
import { createRequestActionTypes } from '.';

import { changeTab } from './navigation';
import Tabs from '../constants/Tabs';
import { getTeams } from '../reducers/team';

import { fetchActionTypes } from './competition';
import { fetchFeed } from './feed';
import { fetchEvents } from './event';
import { fetchTeams } from './team';

const IOS = Platform.OS === 'ios';

const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE
} = createRequestActionTypes('CREATE_USER');
const {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE
} = createRequestActionTypes('GET_USER');

const OPEN_REGISTRATION_VIEW = 'OPEN_REGISTRATION_VIEW';
const CLOSE_REGISTRATION_VIEW = 'CLOSE_REGISTRATION_VIEW';
const UPDATE_NAME = 'UPDATE_NAME';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const RESET = 'RESET';
const SELECT_TEAM = 'SELECT_TEAM';
const CLOSE_TEAM_SELECTOR = 'CLOSE_TEAM_SELECTOR';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';

const openRegistrationView = () => ({ type: OPEN_REGISTRATION_VIEW });

const closeRegistrationView = () => ({ type: CLOSE_REGISTRATION_VIEW });

const dismissIntroduction = () => ({ type: DISMISS_INTRODUCTION });

const putUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const state = getState();

    const name = state.registration.get('name');
    const team = state.registration.get('selectedTeam');
    const profilePicture = state.registration.get('profilePicture');

    return api.putUser({ uuid, name, team, profilePicture })
      .then(response => {
        dispatch({ type: CREATE_USER_SUCCESS });
        dispatch({ type: CLOSE_REGISTRATION_VIEW });
        // Works only in IOS
        if (IOS) {
          dispatch(changeTab(Tabs.SETTINGS));
        }
      })
      .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }));
  };
};
const selectTeam = team => {
  return (dispatch, getState) => {
    const state = getState();

    const teams = state.team.get('teams').toJS();
    const currentName = state.registration.get('name');
    const currentTeam = _.find(teams, ['id', team]);

    dispatch({ type: CLOSE_TEAM_SELECTOR });
    dispatch({ type: SELECT_TEAM, payload: team });
    // Generate new name if not given name
    if (!currentName) {
      dispatch({ type: UPDATE_NAME, payload: namegen.generateName(currentTeam.name) });
    }
  };
};

const updateName = name => ({ type: UPDATE_NAME, payload: name });

const updateProfile = payload => ({ type: UPDATE_PROFILE, payload })

const reset = () => {
  return { type: RESET };
};

const generateName = () => {
  return (dispatch, getStore) => {
    const currentTeamId = getStore().registration.get('selectedTeam');

    if (currentTeamId) {
      const teams = getStore().team.get('teams').toJS();
      const selectedTeam = _.find(teams, ['id', currentTeamId]);
      if (selectedTeam) {
        dispatch({ type: UPDATE_NAME, payload: namegen.generateName(selectedTeam.name) });
      }
    }
  };
};

const getUser = () => {
  return dispatch => {
    dispatch({ type: GET_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getUser(uuid)
      .then(user => {
        dispatch({ type: GET_USER_SUCCESS, payload: user });
      })
      .catch(error => {
        dispatch({ type: GET_USER_FAILURE, error: error });
      });
  };
};



export {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE,
  OPEN_REGISTRATION_VIEW,
  CLOSE_REGISTRATION_VIEW,
  UPDATE_NAME,
  UPDATE_PROFILE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  SELECT_TEAM,
  RESET,
  DISMISS_INTRODUCTION,
  putUser,
  openRegistrationView,
  closeRegistrationView,
  updateName,
  updateProfile,
  generateName,
  getUser,
  selectTeam,
  reset,
  dismissIntroduction
};
