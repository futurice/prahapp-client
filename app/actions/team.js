'use strict';

import api from '../services/api';
import {createRequestActionTypes} from '.';

//
// Action Types
//
const {
  GET_TEAMS_REQUEST,
  GET_TEAMS_SUCCESS,
  GET_TEAMS_FAILURE
} = createRequestActionTypes('GET_TEAMS');
const SHOW_TEAM_SELECTOR = 'SHOW_TEAM_SELECTOR';


//
// Action Creators
//
const fetchTeams = () => (dispatch) => {
  dispatch({ type: GET_TEAMS_REQUEST });
  return api.fetchModels('teams')
    .then(teams => dispatch({ type: GET_TEAMS_SUCCESS, payload: teams }))
    .catch(e => dispatch({ type: GET_TEAMS_FAILURE, error: true, payload: e }));
};

const showChooseTeam = () => {
  return { type: SHOW_TEAM_SELECTOR };
};

export {
  GET_TEAMS_REQUEST,
  GET_TEAMS_SUCCESS,
  GET_TEAMS_FAILURE,

  SHOW_TEAM_SELECTOR,

  fetchTeams,

  showChooseTeam
};
