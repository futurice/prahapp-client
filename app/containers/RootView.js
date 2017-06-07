'use strict';

import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger';
import loggerConfig from '../utils/loggerConfig';
import * as reducers from '../reducers';
import MainView from './MainView';
import { fetchActionTypes } from '../actions/competition';
import { updateLocation } from '../actions/location';
import { getUser, checkUserLogin } from '../actions/registration';
import { initializeUsersCity, fetchCities } from '../concepts/city';
import permissions from '../services/android-permissions';

const IOS = Platform.OS === 'ios';

const middlewares = [thunk];
if (__DEV__) {
  // Disabling logging might help performance as XCode prints the whole objects
  // without respecing the collapsed parameter
  const logger = createLoggerMiddleware(loggerConfig)
  middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware.apply(this, middlewares)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

// Fetch actions, check user existance
store.dispatch(fetchActionTypes());
store.dispatch(getUser());

// Fetch all cities
// store.dispatch(fetchCities())
// // load selected city from local storage
// .then(() => store.dispatch(initializeUsersCity()))


class RootView extends Component {
  constructor(props) {
    super(props);

    this.startLocationWatcher = this.startLocationWatcher.bind(this);
  }

  componentDidMount() {
    // Location watcher
    if (IOS) {
      this.startLocationWatcher();
    } else {
      // No need for location watcher
      // permissions.requestLocationPermission(this.startLocationWatcher);
    }

    // Statusbar style
    if (IOS) {
      StatusBar.setHidden(false)
      StatusBar.setBarStyle('dark-content')
    }

    store.dispatch(checkUserLogin());
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  startLocationWatcher() {
    const locationOpts = {
      enableHighAccuracy: false,
      timeout: 20000, // 20 sec
      maximumAge: 1000 * 60 * 5 // 5 min
    };

    navigator.geolocation.getCurrentPosition(
      position => this.updateLocation,
      error => console.log(error.message),
      locationOpts
    );
    this.watchID = navigator.geolocation.watchPosition(
      this.updateLocation,
      error => console.log(error.message),
      locationOpts
    );
  }

  updateLocation(position) {
    store.dispatch(updateLocation({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }));
  }

  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

export default RootView;
