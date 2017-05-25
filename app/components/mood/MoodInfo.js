'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Platform, Image, ScrollView, Text } from 'react-native';
import theme from '../../style/theme';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import Header from '../common/Header';

const isIOS = Platform.OS === 'ios';

class MoodInfo extends Component {
  render() {

    return (
      <View style={styles.container}>
        {!isIOS && <Header backgroundColor={theme.secondary} title="Whappu Vibe" navigator={this.props.navigator} />}
        <ScrollView style={styles.scroll}>
          <View style={styles.iconWrap}>
            <View style={styles.iconCircle}>
              <Image style={styles.bgImage} source={require('../../../assets/patterns/sea.png')} />
              <MDIcon name="trending-up" style={styles.icon} />
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.paragraph}>In practice, subjective fuzzy Wappu means that Wappu is not either binary true or false but each individual has their own Wappu feeling between the closed interval of <Text style={styles.bold}>[0, 100]</Text>. For instance, Whappu vibe of <Text style={styles.bold}>0%</Text> means that one has no Wappu feeling at all, <Text style={styles.bold}>71%</Text> means that one has quite awesome Wappu feeling already and <Text style={styles.bold}>100%</Text> means that one is going full ahead!</Text>

            <Text style={styles.paragraph}>The meaning of this Whappu vibe is to collect the feelings of Wappu-goers. Vibe data can be used to analyse the Wappu behaviour of different Wappu-subgroups. When collective Whappu Vibe crosses <Text style={styles.primary}>magical 50% line</Text>, one can say that it is <Text style={styles.bold}>Thermal Wappu</Text>.</Text>

            <Text style={styles.paragraph}>You can add one vibe per day. You will get information of the progress Whappu Vibe of your own, your team, your city. Start by <Text style={styles.bold}>adding your first vibe!</Text></Text>
          </View>
        </ScrollView>
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.secondary
  },
  scroll: {
    padding: 25,
    paddingTop: 10,
    paddingBottom: 10,
  },
  content: {
    flex: 1,
    paddingBottom: 50
  },
  paragraph: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
    color: theme.white
  },
  bold: {
    fontWeight: 'bold'
  },
  primary: {
    fontWeight: 'bold',
    color: theme.primaryLight
  },
  iconWrap: {
    margin: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    color: theme.accentLight,
    fontSize: 120,
    alignItems: 'center'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 180,
    height: 180,
    borderRadius: 90,
    overflow: 'hidden',
    bottom: 0,
    opacity: 0.3
  },
});


export default MoodInfo;
