'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  PropTypes
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../common/MyText';
import theme from '../../style/theme';


const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.white,
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
    color: theme.primary
  },
  title:{
    paddingRight:15,
    lineHeight: 25,
    color: theme.primary,
    fontWeight: 'normal'
  },
  buttonPush: {
    width: 25,
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
        <View style={styles.buttonPush} />
      </View>

    );
  }
}

module.exports = EventDetailToolbar;
