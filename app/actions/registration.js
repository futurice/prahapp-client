import DeviceInfo from 'react-native-device-info';
import { AsyncStorage, Platform } from 'react-native';
import _ from 'lodash';

import api from '../services/api';
import { APP_STORAGE_KEY, AUTH_CLIENTID, AUTH_DOMAIN } from '../../env';
import namegen from '../services/namegen';
import { createRequestActionTypes } from '.';

import { changeTab } from './navigation';
import Tabs from '../constants/Tabs';
import { getTeams } from '../reducers/team';

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
const SET_USER_STORAGE = 'SET_USER_STORAGE';

const openRegistrationView = () => {
  return { type: OPEN_REGISTRATION_VIEW };
};

const closeRegistrationView = () => {
  return { type: CLOSE_REGISTRATION_VIEW };
};

const dismissIntroduction = () => {
  return { type: DISMISS_INTRODUCTION };
};

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


// # Login

const setUserToStorage = payload => ({ type: SET_USER_STORAGE, payload });

const Auth0Lock = require('react-native-lock');
const lock = new Auth0Lock({clientId: AUTH_CLIENTID, domain: AUTH_DOMAIN, useBrowser: true });
const userKey = `${APP_STORAGE_KEY}:user`;

export const openLoginView = () => (dispatch, getState) => {
  const state = getState();
  const teams = getTeams(state);

  lock.show({
    connections: ['google-oauth2']
  }, (err, profile, token) => {

    const userFields = {
      profilePicture: profile.picture,
      name: profile.name,
      selectedTeam: teams.getIn([0, 'id'], 1)
    };

    // Save profile to state
    // (we don't have user id yet, because user is not created)
    Promise.resolve(dispatch(updateProfile(userFields)))
    .then(() => {
      // Save profile to Storage
      AsyncStorage.setItem(userKey, JSON.stringify(profile), () => {
        // Set storage info to state
        dispatch(setUserToStorage(profile));

        // Send profile info to server
        // and then get created user
        Promise.resolve(dispatch(putUser()))
        .then(() => dispatch(getUser()));

      });
    });
  });
}

// # Logout
// Remove user from AsyncStorage and state
export const logoutUser = () => (dispatch) => {
  AsyncStorage.removeItem(userKey, () => {
    dispatch(setUserToStorage(null));
  });
}

export const checkUserLogin = () => (dispatch, getState) => {
  AsyncStorage.getItem(userKey, (err, user) => {
    if (!user) {
      // # No need to show login here
      //    App Intro is shown when user has not logged and
      //    from there user has to login in order to continue

    } else {
      const userObj = JSON.parse(user);
      dispatch(setUserToStorage(userObj));
    }
  });
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
  SET_USER_STORAGE,
  putUser,
  openRegistrationView,
  closeRegistrationView,
  updateName,
  generateName,
  getUser,
  selectTeam,
  reset,
  dismissIntroduction
};
