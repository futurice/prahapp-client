'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Animated,
  Text,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableHighlight
} from 'react-native';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../../style/theme';

class MoodSubmit extends Component {
  render() {

    const { confirmScale, onChangeText, submit, description, isMoodSending } = this.props;

    return (
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={-40} style={styles.confirmForm}>

        <Animated.View style={[styles.confirmFormBg, { opacity: confirmScale, transform:[ { scale: confirmScale }] }]}>
          <TextInput
          autoFocus={false}
          autoCapitalize={'sentences'}
          underlineColorAndroid={'transparent'}
          clearButtonMode={'while-editing'}
          returnKeyType={'send'}
          onSubmitEditing={submit}
          onChangeText={onChangeText}
          style={styles.inputField}
          maxLength={131}
          placeholderTextColor={'rgba(0,0,0, 0.3)'}
          placeholder="Describe Your Wappuvibe..."
          value={description}
          />

          <View style={styles.buttonWrap}>
          {isMoodSending
            ?
            <ActivityIndicator style={styles.loader} size={'large'} color={theme.primary} />
            :
            <TouchableHighlight underlayColor={theme.primary} onPress={submit} style={[styles.button, styles.submitButton]}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>
                <MdIcon size={30} name={'done'} />
              </Text>
            </TouchableHighlight>
          }
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
      );
  }
};



const styles = StyleSheet.create({
  confirmForm: {
    backgroundColor: theme.white,
    position: 'absolute',
    // width: 60,
    height: 100,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8,
    justifyContent: 'center'
  },
  confirmFormBg: {
    height: 100,
    backgroundColor: theme.white,
    justifyContent: 'center',
    paddingRight: 120,
  },
  inputField: {
    backgroundColor: theme.lightgrey,
    height: 40,
    fontSize: 14,
    position: 'relative',
    borderRadius: 5,
    padding: 10,
    left: 15,
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    height: 54,
    width: 54,
    borderRadius: 27,
    zIndex: 9,
  },
  button: {
    backgroundColor: theme.stable,
    height: 66,
    width: 66,
    borderRadius: 33,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.075,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.primary
  },
  submitButtonWrap: {
    bottom: 15,
    right: 20,
  },
  submitButton: {
    elevation: 3,
    backgroundColor: theme.primaryLight,
  },
  submitButtonText: {
    color: theme.white,
  },
  loader: {
    top: 17,
    left: 10,
  },
  inputField: {
    backgroundColor: theme.lightgrey,
    height: 40,
    fontSize: 14,
    position: 'relative',
    borderRadius: 5,
    padding: 10,
    left: 15,
  }
});


export default MoodSubmit;
