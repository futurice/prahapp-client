'use strict';

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { get } from 'lodash';
import { connect } from 'react-redux';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';
import errorAlert from '../utils/error-alert';


import IOSTabNavigation from './Navigation';
import RegistrationView from '../components/registration/RegistrationView';
import CheckInActionView from '../components/actions/CheckInActionView';
import TextActionView from '../components/actions/TextActionView';
import LightBox from '../components/lightbox/Lightbox';
import CitySelector from '../components/header/CitySelector';

const theme = require('../style/theme');

class MainView extends Component {
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const { showCitySelection, errors, dispatch } = this.props;
    const immutableError = errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(dispatch, get(error, 'header'), get(error, 'message'));
    }

    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={styles.navigator}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navbar}
              routeMapper={NavRouteMapper(this.props)} />
          }
          initialRoute={{
            component: IOSTabNavigation,
            name: 'Prague'
          }}
          renderScene={this.renderScene}
          configureScene={() => sceneConfig}
        />
        <LightBox />
        <RegistrationView />
        <CheckInActionView />
        <TextActionView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    paddingTop: 42,
    paddingBottom:0,
  },
  navbar: {
    backgroundColor: theme.yellow,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // shadowColor: theme.dark,
    // shadowOpacity: 0.05,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 1,
    //   width: 0
    // },
  }
});

const select = state => {
  return {
    errors: state.errors,
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select)(MainView);
