import { AsyncStorage } from 'react-native';
import Auth0Lock from 'react-native-lock';
import { fromJS } from 'immutable';

import api from '../services/api';
import { updateProfile, putUser } from '../actions/registration';
import { fetchAppContent } from './app';
import { getTeams } from '../reducers/team';
import { createRequestActionTypes } from '../actions';

import { AUTH0_CLIENTID, AUTH0_DOMAIN } from '../../env';
import STORAGE_KEYS from '../constants/StorageKeys';

// # Action types
export const SET_TOKEN = 'SET_TOKEN';
export const {
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE
} = createRequestActionTypes('REFRESH_TOKEN');

const lock = new Auth0Lock({ clientId: AUTH0_CLIENTID, domain: AUTH0_DOMAIN, useBrowser: true });

// # Selectors
export const isRefreshingToken = state => state.auth.get('isRefreshingToken', false);

// # Actions

// Clear login: AsyncStorage.clear();

const setTokenToStore = payload => ({ type: SET_TOKEN, payload });

export const openLoginView = () => (dispatch, getState) => {
  const state = getState();
  const teams = getTeams(state);

  lock.show({
    connections: ['google-oauth2'],
    scope: 'openid profile email',
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
      AsyncStorage.setItem(STORAGE_KEYS.token, JSON.stringify(token), () => {
        // Set storage info to state
        dispatch(setTokenToStore(token));


        // Send profile info to server
        // and then get created user
        Promise.resolve(dispatch(putUser()))
        .then(() => dispatch(fetchAppContent()));

      });
    });
  });
}

const updateAuthToken = (idToken) => dispatch => {
  dispatch({ type: REFRESH_TOKEN_REQUEST });

  // Get current token
  AsyncStorage.getItem(STORAGE_KEYS.token, (err, token) => {
    if (!token) {
      return;
    }

    // Merge new token with current token information
    const currentToken = JSON.parse(token);
    const newToken = Object.assign(currentToken, { idToken });

    // Update token to storage
    AsyncStorage.setItem(STORAGE_KEYS.token, JSON.stringify(newToken), () => {
      dispatch({ type: REFRESH_TOKEN_SUCCESS, newToken });
      dispatch(fetchAppContent());
    });
  });
}


export const refreshAuthToken = () => (dispatch, getState) => {
  console.log('refreshAuthToken');
  return;
  //
  const state = getState();
  const refreshingToken = isRefreshingToken(state);

  // Prevent multiple refreshing actions
  if (refreshingToken) {
    return;
  }

  return AsyncStorage.getItem(STORAGE_KEYS.token).then((token) => {
    const tokenObj = token ? JSON.parse(token) : {};
    const { refreshToken } = tokenObj;

    dispatch({ type: REFRESH_TOKEN_REQUEST });

    return api.refreshAuthToken(refreshToken)
      .then(response => {
        const { id_token } = response;

        dispatch(updateAuthToken(id_token));
        dispatch({ type: REFRESH_TOKEN_SUCCESS });
      })
      .catch(() => dispatch({ type: REFRESH_TOKEN_FAILURE }));
  });
}

// # Logout
// Remove user from AsyncStorage and state
export const logoutUser = () => (dispatch) => {
  AsyncStorage.removeItem(STORAGE_KEYS.token, () => {
    dispatch(setTokenToStore(null));
  });
}

export const checkUserLogin = () => (dispatch, getState) => {
  AsyncStorage.getItem(STORAGE_KEYS.token, (err, token) => {
    if (!token) {
      // TODO Add login redirect

      // # No need to show login here
      //    App Intro is shown when user has not logged and
      //    from there user has to login in order to continue

    } else {
      const tokenObj = JSON.parse(token);
      dispatch(setTokenToStore(tokenObj));

      // Get all app content
      dispatch(fetchAppContent());
    }
  });
};



const initialState = fromJS({
  isRefreshingToken: false,
});

export default function auth(state = initialState, action) {
  switch (action.type) {
    case REFRESH_TOKEN_REQUEST:
      return state.set('isRefreshingToken', true);

    case REFRESH_TOKEN_SUCCESS:
    case REFRESH_TOKEN_FAILURE:
      return state.set('isRefreshingToken', false);

    default:
      return state;
  }
}
