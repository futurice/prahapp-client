'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import UserMap from '../components/map/UserMap';
import sceneConfig from '../utils/sceneConfig';
import theme from '../style/theme';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

var _navigator; // eslint-disable-line

class EventMapView extends Component {
  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{
          component: UserMap,
          name: 'Map'
        }}

        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

export default EventMapView;
