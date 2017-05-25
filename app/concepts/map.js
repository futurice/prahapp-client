// # concepts/map
// This is so called 'view concept'
// that combines core concepts like 'marker' and 'event'

import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { has, chain } from 'lodash';
import moment from 'moment';

import { getCurrentCityName } from './city';
import {
  updateShowFilter as _updateShowFilter,
  toggleLocateMe as _toggleLocateMe
} from '../actions/event';
import { fetchMarkers as _fetchMarkers } from '../actions/marker';

import { isLocating, getShowFilter, getEvents, getEventListState } from '../reducers/event';
import { getMarkers, getMarkerListState } from '../reducers/marker';
import LoadingStates from '../constants/LoadingStates';
import MarkerImages from '../constants/MarkerImages';
import time from '../utils/time';


// # Selectors
const getSelectedCategory = state => state['map'].get('selectedCategory');
const getSelectedMarker = state => state['map'].get('selectedMarker');

const isMapLoading = createSelector(
  getMarkerListState, getEventListState, (a, b) =>
  a === LoadingStates.LOADING || b === LoadingStates.LOADING
);

const isEventBetweenSelectedTime = (event, firstFutureEvent, showFilter) => {
  switch (showFilter) {
    case '24H':
    return firstFutureEvent &&
      firstFutureEvent.get('endTime') &&
      time.eventsBetweenHours(event.get('endTime'), firstFutureEvent.get('endTime'), 24);
    default:
      return true;
  }
}

const getFirstFutureEvent = createSelector(
  getEvents, (events) => {
    const event = chain(events.toJS())
      .filter(item => time.isEventInFuture(item.endTime))
      .sortBy(item => time.getTimeStamp(item.endTime))
      .head()
      .value();

    return fromJS(event);
  }
)

const getMapMarkers = createSelector(
  getEvents, getMarkers, getShowFilter, getSelectedCategory, getFirstFutureEvent,
  (events, markers, showFilter, categoryFilter, firstFutureEvent) => {

    const validEvents = events
      .filter(event => {
        const hasLocation = !!event.getIn(['location', 'latitude']) && !!event.getIn(['location', 'longitude']);
        return hasLocation && isEventBetweenSelectedTime(event, firstFutureEvent, showFilter);
      })
      .map(event => event.set('type', 'EVENT'));

    const validMarkers = markers
      .filter(marker => categoryFilter === 'ALL' || marker.get('type') === categoryFilter)
      .filter(marker => marker.has('location'));

    let mapMarkers = validEvents.concat(validMarkers);

    // Filter markers which do not have correct type
    return mapMarkers.filter(marker => has(MarkerImages, marker.get('type')));
});

const getMapMarkersCoords = createSelector(getMapMarkers, markers => {
  return markers.map(marker => marker.get('location')).toJS();
});

// const getMarkerCategories = (state) => fromJS(['ALL','FOOD', 'PUB', 'BAR', 'CAFES', 'BEER MUSEUMS', 'SHOPS', 'STREET MARKETS']);
const getMarkerCategories = createSelector(
  getMarkers, (markers) => {
    const validCategories = markers
      .map(marker => marker.get('type', 'CATEGORY').toUpperCase())
      .toSet().toList(); // Immutable uniq

    return validCategories.unshift('ALL');
  }
);

// View concept selector
export const mapViewData = createStructuredSelector({
  currentCity: getCurrentCityName,
  locateMe: isLocating,
  showFilter: getShowFilter,
  events: getEvents,
  markers: getMarkers,
  loading: isMapLoading,
  mapMarkers: getMapMarkers,
  firstFutureEvent: getFirstFutureEvent,
  selectedMarker: getSelectedMarker,
  selectedCategory: getSelectedCategory,
  categories: getMarkerCategories,
  visiblemarkerCoords: getMapMarkersCoords
})

// # Action types & creators
const SELECT_MARKER = 'map/SELECT_MARKER';
const SELECT_CATEGORY = 'map/SELECT_CATEGORY';

export const fetchMarkers = _fetchMarkers;
export const updateShowFilter = _updateShowFilter;
export const toggleLocateMe = _toggleLocateMe;

export const selectMarker = payload => ({ type: SELECT_MARKER, payload });
export const selectCategory = payload => (dispatch) => Promise.resolve(
  dispatch({ type: SELECT_CATEGORY, payload })
);

// # Reducer
const initialState = fromJS({
  selectedMarker: null,
  selectedCategory: 'ALL',
});

export default function map(state = initialState, action) {
  switch (action.type) {
    case SELECT_MARKER: {
      return state.set('selectedMarker', fromJS(action.payload));
    }

    case SELECT_CATEGORY: {
      return state.set('selectedCategory', action.payload);
    }

    default: {
      return state;
    }
  }
}

