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
import { checkUserLogin, refreshAuthToken } from '../concepts/auth';
import { updateLocation, startLocationWatcher, stopLocationWatcher } from '../concepts/location';
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


// store.dispatch(refreshAuthToken());

class RootView extends Component {
  componentDidMount() {
    // Location watcher
    store.dispatch(startLocationWatcher());

    // Statusbar style
    if (IOS) {
      StatusBar.setHidden(false)
      StatusBar.setBarStyle('dark-content')
    }

    store.dispatch(checkUserLogin());
  }

  componentWillUnmount() {
    store.dispatch(stopLocationWatcher());
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
