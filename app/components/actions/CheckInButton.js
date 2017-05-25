'use strict';

import React, { Component } from 'react';

import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  TouchableWithoutFeedback,
  StyleSheet
} from 'react-native';

import {
  UNAVAILABLE,
  AVAILABLE,
  CHECKED
} from '../../constants/CheckInStates';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
const IOS = Platform.OS === 'ios';

class CheckInButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      springAnim: new Animated.Value(0),
      status: props.validLocation ? AVAILABLE : UNAVAILABLE
    };
  }

  handlePress() {
    this.setState({status: CHECKED});
    this.state.springAnim.setValue(0);
     Animated.timing(
       this.state.springAnim,
       {
         toValue: 1,
         duration: 500,
         easing: Easing.elastic(1)}
     ).start(() => {
       this.props.checkIn();
     });
  }

  renderText(status) {
    switch (status) {
      case AVAILABLE:
        return <Text style={styles.text}>CHECK IN </Text>;
      case CHECKED:
        return <Icon size={26} name={'check'} style={styles.icon}/>;
      case UNAVAILABLE:
        return <Text style={styles.text}>TOO FAR </Text>;
    }
  }

  render() {
    const { status } = this.state;

    const active = this.state.springAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });

    return (
      <TouchableWithoutFeedback disabled={status !== AVAILABLE} onPress={() => this.handlePress()}>
        <Animated.View style={[styles.button, status === UNAVAILABLE ? styles.buttonDisabled : {}, { transform: [{scale: active}]}]}>
          {this.renderText(status)}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    color: 'white',
  },
  text: {
    color: theme.light
  },
  button: {
    flexDirection: 'row',
    alignItems:'center',
    borderWidth: 0,
    borderRadius: IOS ? 20 : 2,
    borderColor: theme.white,
    height: 40,
    width: 120,
    position: 'absolute',
    bottom: 15,
    right: 15,
    overflow: 'hidden',
    padding: 2,
    justifyContent: 'center',
    backgroundColor: theme.primary,
  },
  buttonDisabled: {
    opacity: 0.9,
    backgroundColor: theme.grey,
  }
});

export default CheckInButton;
