'use strict';

import React, { Component } from 'react';
import { View, Image, StyleSheet, ScrollView, Platform, Text } from 'react-native';
import theme from '../../style/theme';
import Header from '../../components/common/Header';
import Button from '../../components/common/Button';
import TabBarItems from '../../components/tabs/Tabs';
import CameraView from './CameraView';

const ScrollTabs = require('react-native-scrollable-tab-view');
const IOS = Platform.OS === 'ios';
const CODE_WIDTH = 300;

class Scan extends Component {

  renderMatrixCode(code) {
    if (!code) {
      return (<View />);
    }
    const url = `https://api-bwipjs.rhcloud.com/?bcid=code128&scale=8&text=${code}`;
    return (
        <View style={styles.listItemButton}>
          <View style={{ alignItems: 'center', padding: 15, paddingLeft: 20, paddingRight: 20 }}>
            <View style={[ styles.listItem, styles.bubble ]}>
              <View style={{ paddingBottom: 15 }}>
                <Text style={{backgroundColor: 'transparent', textAlign: 'center', color: theme.darkgrey}}>Your Personal code</Text>
              </View>
              <View>
                <Image style={{ top: CODE_WIDTH / 4, width: CODE_WIDTH, height: CODE_WIDTH / 2, tintColor: theme.secondary, opacity: 0.6, zIndex: 2 }} source={{uri: url}} />
                <Image style={{ width: CODE_WIDTH, height: CODE_WIDTH, position: 'absolute', opacity: 1 }} source={{uri: 'https://flockler.com/thumbs/sites/377/abnormal_pasi_lampinen_s1600x900_q65_noupscale.jpg'}} />
              </View>
            </View>
            <View style={[styles.bubbleTip]} />
          </View>
        </View>
    );
  }

  render() {

    return (
      <View style={{ flexGrow: 1, paddingTop: 20 }}>
        <ScrollTabs
          initialPage={0}
          tabBarActiveTextColor={theme.secondary}
          tabBarUnderlineColor={theme.secondary}
          tabBarBackgroundColor={theme.white}
          tabBarInactiveTextColor={'rgba(0,0,0,0.6)'}
          locked={IOS}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <TabBarItems />}
        >
          <View
            style={theme.container}
            barColor={theme.accent}
            tabLabel="Your profile"
          >
            {this.renderMatrixCode('321')}
          </View>
          <View
            style={theme.container}
            barColor={theme.accent}
            tabLabel="Scan futuricean"
          >
            <CameraView />
          </View>
      </ScrollTabs>


      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white
  },
  content: {
    padding: IOS ? 10 : 20,
    paddingTop: IOS ? 40 : 20,
    paddingBottom: 50,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 15,
    color: theme.dark
  },
  bold: {
    fontWeight: 'bold'
  }
});


export default Scan;
