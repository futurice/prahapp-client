'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  Text,
  Image,
  StyleSheet,
  Easing,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';

import theme from '../../style/theme';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');
const cityIcons = {
  'helsinki': require('../../../assets/cities/icon-ota-amfi-accent.png'),
  'tampere': require('../../../assets/cities/icon-tampere-accent.png')
};

class InstructionView extends Component {
  constructor(props) {
     super(props);
     this.state = {
       springAnim: new Animated.Value(0),
     };
   }

   handlePress(id) {
     this.props.onSelect(id);

     this.state.springAnim.setValue(0);
      Animated.timing(
        this.state.springAnim,
        {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1)}
      ).start();
   }

  render() {
    const containerStyles = [styles.container, styles.modalBackgroundStyle];
    const { springAnim } = this.state;

    const active = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
       <View style={containerStyles}>

          <View style={styles.topArea}>
            <View style={styles.iconWrap}>
              <Image style={styles.subImage} source={require('../../../assets/prague/futubohemia/chilicorn.png')} />
            </View>
          </View>

          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={styles.container}>
              <View style={styles.bottomArea}>

                  <View style={styles.content}>
                    <View style={styles.textContainer}>
                      <Image style={{ width: 200, height: 30, tintColor: theme.blue2 }} source={require('../../../assets/prague/futubohemia/logo.png')} />
                      <Text style={styles.subTitle}>WELCOME TO PRAGUE!</Text>
                      {/*<Text style={styles.text}>It's time for Fututrip again!</Text>*/}
                    </View>
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
    backgroundColor: theme.yellow,
    alignSelf: 'stretch'
  },
  area: {
    alignItems: 'stretch'
  },
  topArea: {
    backgroundColor: theme.yellow,
    minHeight: height / 2.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0)',
    left: width / 2 - 95,
    top: width / 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible'
  },
  icon: {
    // width: 200,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 190,
    width: 190,
    height: 190,
    // tintColor: theme.white,
    color: theme.white,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 40,
    top: 10,
    position: 'absolute'
  },
  subImage: {
    width: width - 120,
    height: width - 120,
    left: 0,
    bottom: 0,
    position: 'relative',
    zIndex: 2,
  },
  accentImage: {
    width: 40,
    height: 25,
    left: 5,
    top: 55,
    position: 'absolute',
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 190,
    height: 190,
    borderRadius: 95,
    bottom: 0,
    opacity: 0.01
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
  subTitle: {
    color: theme.blue1,
    fontWeight: '600',
    fontSize: 16,
    margin: 15,
    marginTop: 35,
  },
  text: {
    fontSize: 16,
    lineHeight: 18,
    marginTop: 40,
    color: theme.blue1,
    textAlign: 'center',
  },
  cities: {
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 50,
  },
  touchable: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  circle: {
    flex: 1,
    backgroundColor: theme.secondary,
    padding: 12,
    paddingTop: 16,
    borderWidth: 2,
    borderColor: theme.white,
    alignItems: 'center',
    borderRadius: 50,
  },
  cityIcon: {
    width: 40,
    height: 40,
    zIndex: 4,
  },
  cityText: {
    fontSize: 12,
    color: theme.white,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  activeCityText: {
    color: theme.accentLight
  },
  cityTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checked: {
    zIndex: 2,
    position: 'absolute',
    bottom: 5,
    right: 35,
    fontSize: 25,
    color: theme.accentLight,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height: 50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  }
});

export default InstructionView;
