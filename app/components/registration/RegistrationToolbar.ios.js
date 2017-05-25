'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PropTypes
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.secondary,
    height: 60,
    flexDirection: 'row',
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    color: theme.light
  },
  title:{
    paddingRight:15,
    color: theme.light,
    fontWeight: 'bold'
  }
});

class EventDetailToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconClick: PropTypes.func
  }

  render() {
    const touchableProps = {};
    if (this.props.iconClick) {
      touchableProps.onPress = this.props.iconClick;
    }

    return (
      <View style={styles.toolbar}>
        <TouchableOpacity {...touchableProps}>
          {
            this.props.icon
            ? <Icon style={styles.icon} name={this.props.icon} />
            : <View/>
          }

        </TouchableOpacity>
        <Text style={styles.title}>{this.props.title}</Text>
        <View />
      </View>

    );
  }
}

module.exports = EventDetailToolbar;
