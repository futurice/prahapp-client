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

    let { url, name } = this.props.route;

    if (IOS && url.indexOf('https') < 0) {
      url = 'https://crossorigin.me/' + url;
    }

    return (
      <View style={styles.container}>
        {!IOS && <Toolbar title={name} backgroundColor={theme.secondary} navigator={this.props.navigator} /> }

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
    flex:1,
    paddingTop: IOS ? 10 : 52
  }
});


export default WebViewer;
