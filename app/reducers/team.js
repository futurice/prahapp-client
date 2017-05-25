'use strict';
import { fromJS, List } from 'immutable';
import { createSelector } from 'reselect';

import {
  GET_TEAMS_REQUEST,
  GET_TEAMS_SUCCESS,
  GET_TEAMS_FAILURE,
  SHOW_TEAM_SELECTOR,
  CLOSE_TEAM_SELECTOR
} from '../actions/team';

const initialState = fromJS({
  teams: [],
  isLoading: false,
  isError: false,
  selectedTeam: null,
  isChooseTeamViewOpen: false,
  isRefreshing: false
});

export default function team(state = initialState, action) {
  switch (action.type) {
    case GET_TEAMS_REQUEST:
      return state.merge({
        isLoading: true,
        isError: false,
        isRefreshing: true
      });
    case GET_TEAMS_SUCCESS:
      return state.merge({
        isLoading: false,
        isError: false,
        teams: action.payload,
        isRefreshing: false
      });
    case GET_TEAMS_FAILURE:
      return state.merge({
        isLoading: false,
        isError: true,
        isRefreshing: false
      });
    case SHOW_TEAM_SELECTOR:
      return state.set('isChooseTeamViewOpen', true);
    case CLOSE_TEAM_SELECTOR:
      return state.set('isChooseTeamViewOpen', false);
    default:
      return state;
  }
};

//
// Selectors
//
export const getTeams = state => state.team.get('teams', List());
export const getCurrentCity = state => state.city.get('id', null);


export const getCityTeams = createSelector(
  getTeams, getCurrentCity,
  (teams, cityId) => teams.filter(t => t.get('city') === cityId)
);

