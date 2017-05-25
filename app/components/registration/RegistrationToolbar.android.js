'use strict';

import React, { Component } from 'react';
import {
  ToolbarAndroid,
  StyleSheet,
  PropTypes
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.secondary,
    height: 56,
    elevation:2,
  }
});

class EventDetailToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconClick: PropTypes.func
  }

  render() {
    return (
      <Icon.ToolbarAndroid
      onIconClicked={this.props.iconClick}
      navIconName={this.props.icon}
      titleColor={theme.light}
      iconColor={theme.light}
      style={styles.toolbar}
      title={this.props.title}
      />
    );
  }
}

module.exports = EventDetailToolbar;
