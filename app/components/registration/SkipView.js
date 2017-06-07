'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import theme from '../../style/theme';
import PlatformTouchable from '../../components/common/PlatformTouchable';

const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

class SkipView extends Component {

  render() {

    return (
       <View style={styles.container}>
          <ScrollView style={{flex:1, width: null, height: null}}>
              <View style={styles.content}>
                <View style={styles.textContainer}>
                  <Image style={{ width: 200, height: 30, tintColor: theme.blue2 }} source={require('../../../assets/prague/futubohemia/logo.png')} />
                  {/*<Text style={styles.subTitle}>IT'S FUN O'CLOCK!</Text>*/}
                  <Text style={styles.text}>Login with your
                    <Text style={{fontWeight: 'bold'}}> @futurice </Text>email address.
                  </Text>
                </View>
                <PlatformTouchable onPress={this.props.onPressProfileLink}>
                  <View style={styles.editButton}>
                    <Text style={{fontSize: 16, fontWeight: 'bold', color: theme.white}}>LOGIN TO FUTUBOHEMIA</Text>
                  </View>
                </PlatformTouchable>
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
  content: {
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topArea: {
    backgroundColor: theme.yellow,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    overflow: 'hidden',
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
    // tintColor: theme.blue2,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 50,
    top: 30,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 200,
    height: 200,
    bottom: 0,
    opacity: 0.3
  },

  textContainer: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'column'
  },
  subTitle: {
    textAlign: 'center',
    color: theme.blue1,
    fontWeight: '600',
    fontSize: 16,
    margin: 15,
    marginTop: 30,
  },
  text: {
    marginTop: 35,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 20,
    color: theme.blue1,
    textAlign: 'center',
  },
  editButton: {
    marginTop: 40,
    marginBottom: 10,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: IOS ? 25 : 2,
    elevation: 3,
    borderWidth: 0,
    borderColor: theme.grey,
    backgroundColor: theme.blue2,
    width: 250,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 3,
      width: 0
    }
  }

});

export default SkipView;
