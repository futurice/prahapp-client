'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import sceneConfig from '../utils/sceneConfig';

import EventsView from '../components/calendar/TimelineList';
const theme = require('../style/theme');

const styles = StyleSheet.create({
  navigator: {
    paddingTop: 20,
    paddingBottom:30,
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});


class TimelineListWrapper extends Component {
  @autobind
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />;
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{
          component: EventsView,
          name: 'Events'
        }}
        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

export default TimelineListWrapper;
