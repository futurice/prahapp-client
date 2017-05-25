'use strict';

import React, { Component } from 'react';
import { PropTypes } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';
import EventsView from '../components/calendar/TimelineList';

let _navigator; // eslint-disable-line
class TimelineListWrapper extends Component {
  propTypes: {
    navigator: PropTypes.object.isRequired
  }

  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={this.props.navigator} route={route} {...this.props} />
    }
  }

  render() {
    return (
      <Navigator
        initialRoute={{
          component: EventsView,
          name: 'Events'
        }}
        renderScene={this.renderScene}
        configureScene={() => ({
          ...Navigator.SceneConfigs.FloatFromBottomAndroid
        })}
      />
    );
  }
}

export default TimelineListWrapper;
