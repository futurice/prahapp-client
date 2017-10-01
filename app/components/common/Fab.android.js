'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableNativeFeedback,
  Platform,
  PropTypes,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 67 : 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6
  }
});


class Fab extends Component {
  propTypes: {
    styles: View.propTypes.style,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    underlayColor: PropTypes.string
  }

  render() {
    const touchableProps = this.props.disabled ? {} : {
      onPress: this.props.onPress,
      onPressIn: this.props.onPressIn,
      onPressOut: this.props.onPressOut,
      underlayColor: this.props.underlayColor,
      background: TouchableNativeFeedback.SelectableBackgroundBorderless(),
      delayPressIn: 1
    };

    const buttonStyles = this.props.disabled ?
      [styles.button, this.props.styles, styles.disabledButton] :
      [styles.button, this.props.styles];

    return (
    	<View style={buttonStyles}>
	      <TouchableNativeFeedback {...touchableProps}>
	        <View style={styles.content}>
	           {this.props.children}
	        </View>
	      </TouchableNativeFeedback>
     </View>
    );
  }
}

export default Fab;

