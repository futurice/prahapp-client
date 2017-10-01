'use strict';

import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import Fab from '../common/Fab';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 37 : 20,
    right: 20,
    backgroundColor: theme.white,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  }
});

class ActionButton extends Component {
  render() {
    const combinedStyle = [styles.button];
    const { extraStyle, onPress, disabled, children, underLayColor } = this.props;

    if (extraStyle) {
      combinedStyle.push(extraStyle);
    }

    return (
      <Fab onPress={onPress} styles={combinedStyle}
        disabled={disabled} underlayColor={underLayColor || theme.yellow}>
        {children}
      </Fab>
    );
  }
}

export default ActionButton;
