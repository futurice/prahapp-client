'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';

import PlatformTouchable from '../common/PlatformTouchable';
import theme from '../../style/theme';

class RadioWebsiteLink extends Component {
  render() {
    const { currentStation } = this.props;

    return (
      <View style={styles.radioWebsite}>
        <PlatformTouchable
          onPress={() => Linking.openURL(currentStation.get('website'))}
        >
          <Text style={styles.websiteUrl}>
            See full program in <Text style={styles.websiteUrlAccent}>
            {currentStation.get('website', '').replace('https://', '').replace('/', '')}
            </Text>
          </Text>
        </PlatformTouchable>
      </View>
    );
  }
};



const styles = StyleSheet.create({
radioWebsite: {
    backgroundColor: 'transparent',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0,
    borderBottomWidth: 2,
    borderBottomColor: theme.secondary,
  },
  websiteUrl: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .5)',
  },
  websiteUrlAccent: {
    color: theme.black
  },
});


export default RadioWebsiteLink;
