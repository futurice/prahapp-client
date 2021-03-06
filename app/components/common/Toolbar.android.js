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

class ToolBar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    leftIcon: PropTypes.string,
    leftIconClick: PropTypes.func
  }

  render() {
    return (
      <Icon.ToolbarAndroid
        onIconClicked={this.props.leftIconClick}
        navIconName={this.props.leftIcon}
        titleColor={theme.blue2}
        iconColor={theme.blue2}
        style={styles.toolbar}
        title={this.props.title}
      />
    );
  }
}

module.exports = ToolBar;
