'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  WebView,
} from 'react-native';
import theme from '../../style/theme';
import Toolbar from '../calendar/EventDetailToolbar';
const IOS = Platform.OS === 'ios';


class WebViewer extends Component {


  render() {

    const { hideHeader } = this.props;
    let { url, name } = this.props.route;

    if (IOS && url.indexOf('https') < 0) {
      url = 'https://crossorigin.me/' + url;
    }

    const showHeader = !hideHeader && !IOS;

    return (
      <View style={[styles.container, { paddingTop: showHeader ? 52 : 0 }]}>
        {showHeader && <Toolbar title={name} color={theme.blue2} backgroundColor={theme.secondary} navigator={this.props.navigator} /> }

        {url &&
          <WebView
            source={{uri: url}}
            scalesPageToFit={false}
            style={{flex: 1}}
          />
        }
      </View>
    );
  }

}

WebViewer.propTypes = {
  url: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    flex:1
  }
});


export default WebViewer;
