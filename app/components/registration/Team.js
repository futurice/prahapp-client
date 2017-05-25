'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import PlatformTouchable from '../common/PlatformTouchable';

import theme from '../../style/theme';

class Team extends Component {
  propTypes: {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    teamid: PropTypes.number.isRequired,
    selected: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired
  }

  render() {
    const selected = this.props.teamid === this.props.selected;
    return (
      <View style={styles.item}>
        <PlatformTouchable
          delayPressIn={1}
          style={{}}
          onPress={this.props.onPress}>
          <View style={styles.button}>
          <Image
            source={this.props.logo === null ? null : { uri: this.props.logo }}
            style={[styles.teamLogo, {borderColor: selected ? theme.primary : '#f2f2f2'}]} />
          <Text style={[styles.text, {color: selected ? theme.primary : '#666'}]}>
            {this.props.name}
          </Text>
          </View>
        </PlatformTouchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor:'#eee',
    borderBottomWidth:1,

  },
  teamLogo:{
    borderRadius:20,
    width:40,
    height:40,
    marginRight:15,
    borderWidth:3,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15
  },
  button: {
    padding:15,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  }
});

export default Team;
