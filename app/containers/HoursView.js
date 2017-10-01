'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Platform,
} from 'react-native';

import theme from '../style/theme';
import WebViewer from '../components/webview/WebViewer';

const IOS = Platform.OS === 'ios';

class HoursView extends Component {
  render() {
    return (
      <View style={styles.container}>
        <WebViewer hideHeader route={{ name: 'Futuhours', url: 'https://soundcloud.com/user-684222439' }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow :1
  }
});

export default HoursView;
