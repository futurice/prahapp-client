'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import theme from '../../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class InstructionView extends Component {
  render() {

    return (
      <View style={styles.container}>
          <ScrollView style={{flex:1, width: null, height: null}} >
            <View style={[styles.container, styles.contentContainer]}>

              <View style={styles.content} >
                <View style={styles.textContainer}>
                  <Text style={styles.title}>#PRAHAN TAKII</Text>

                  <Text style={styles.subTitle}>Enjoy Prague & Share it</Text>
                  <Text style={styles.text}>Keep in touch with your colleagues!</Text>
                </View>
              </View>
            </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.yellow,
  },
  simplified: {
    alignSelf: 'stretch'
  },
  innerContainer: {
    flex: 1,
    paddingTop: IOS ? 15 : 15,
  },
  topArea: {
    backgroundColor: theme.yellow,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
 iconWrap: {
    // overflow: 'hidden',
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,.1)',
    left: width / 2 - 100,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    // width: 200,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 150,
    width: 150,
    height: 150,
    // tintColor: theme.white,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: 90,
    left: 140,
    top: -5,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    bottom: 0,
    opacity: 0.3
  },
  content: {
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'column'
  },
  title: {
    color: theme.blue1,
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 15,
  },
  subTitle: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: 'bold',
    color: theme.blue2,
    textAlign: 'center',
  },
  text: {
    marginBottom: 20,
    fontSize: 13,
    lineHeight: 18,
    color: theme.blue2,
    textAlign: 'center',
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    backgroundColor: theme.primary,
    marginLeft:0,
  }
});

export default InstructionView;
