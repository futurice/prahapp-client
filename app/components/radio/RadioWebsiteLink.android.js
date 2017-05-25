'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking, TouchableNativeFeedback } from 'react-native';

import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';

class RadioWebsiteLink extends Component {
  render() {
    const { currentStation } = this.props;

    return (
      <PlatformTouchable
        background={TouchableNativeFeedback.SelectableBackground()}
        delayPressIn={0}
        onPress={() => Linking.openURL(currentStation.get('website'))}
      >
        <View style={styles.radioWebsite}>
          <Text style={styles.websiteUrl}>
            {/*<Icon name="link" style={styles.websiteIcon}/>*/}
            See full program in <Text style={styles.websiteUrlAccent}>
            {currentStation.get('website', '').replace('https://', '').replace('/', '')}
            </Text>
          </Text>
        </View>
      </PlatformTouchable>
    );
  }
};



const styles = StyleSheet.create({
  radioWebsite: {
    backgroundColor: '#f5f5f5',
    height: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingBottom: 0,
    paddingLeft: 25,
    borderBottomWidth: 2,
    borderBottomColor: theme.secondary,
  },
  websiteUrl: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .5)',
  },
  websiteUrlAccent: {
    color: theme.dark
  },
});


export default RadioWebsiteLink;
