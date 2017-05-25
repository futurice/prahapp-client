'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';


class Button extends Component {
  // propTypes: Object.assign({},
  //   {
  //     textStyle: Text.propTypes.style,
  //     disabledStyle: Text.propTypes.style,
  //     children: PropTypes.string.isRequired,
  //     isDisabled: PropTypes.bool,
  //     onPress: PropTypes.func,
  //     onPressIn: PropTypes.func,
  //     onPressOut: PropTypes.func
  //   },
  // ),

  _renderInnerText() {
    return (
      <Text style={[styles.textButton, this.props.textStyle]}>
        {this.props.children}
      </Text>
    );
  }

  render() {
    if (this.props.isDisabled === true) {
      return (
        <View style={[styles.button, this.props.style,
            this.props.disabledStyle || styles.opacity]}>
          {this._renderInnerText()}
        </View>
      );
    } else {
      const touchableProps = {
        onPress: this.props.onPress,
        onPressIn: this.props.onPressIn,
        onPressOut: this.props.onPressOut,
      };
      return (
        <TouchableOpacity {...touchableProps}
          style={[styles.button, this.props.style]}>
          {this._renderInnerText()}
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#50E3C2',
    borderRadius: 100,
    paddingLeft: 10,
    paddingRight: 10
  },
  textButton: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff'
  },
  opacity: {
    opacity: 0.6
  }
});

export default Button;
