// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing
} from 'react-native';

import Text from '../common/MyText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TouchableNativeFeedback from './PlatformTouchable';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },
  tabs: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 0,
    borderTopColor: '#f1f1f1'
  },
  textLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign:'center',
    fontFamily: 'Futurice',
    // position:'absolute',
    marginTop: 2,
    left:0,
    right:0,
    bottom: -1
  }
});


var MdIconTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor : React.PropTypes.string,
    activeTextColor : React.PropTypes.string,
    inactiveTextColor : React.PropTypes.string,
  },

  getInitialState() {
    return {
      buttonAnimations: this.props.tabs.map(() => new Animated.Value(1))
    };
  },

  componentWillReceiveProps(nextProps) {
    const { buttonAnimations } = this.state;
    if (nextProps.activeTab !== this.props.activeTab) {
      buttonAnimations.map(b => b.setValue(0));
      Animated.timing(buttonAnimations[nextProps.activeTab], { duration: 330, easing: Easing.ease, toValue: 1}).start();
    }
  },

  renderTabOption(item, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'black';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const buttonAnimation = this.state.buttonAnimations[page];

    return (
    <TouchableNativeFeedback
      key={item.title}
      onPress={() => this.props.goToPage(page)}
      style={{ flex: 1 }}
    >
      <View style={[styles.tab, { paddingLeft: isTabActive ? 0 : 0, paddingRight: isTabActive ? 0 : 0 }]}>
        <Icon
          name={item.icon}
          size={item.iconSize || 22}
          style={{
            top: 0,
            color: isTabActive ? activeTextColor : inactiveTextColor,
          }} />

        {item.title && isTabActive &&
          <Animated.Text style={[
            styles.textLabel,
            {
              color: activeTextColor,
              opacity: isTabActive ? buttonAnimation : 1,
              transform: [{
                scale: isTabActive ? buttonAnimation : 0
              }]
            }
          ]}>
          {item.title}
          </Animated.Text>
        }

      </View>
    </TouchableNativeFeedback>
    );
  },

  render() {
    const { tabs, backgroundColor, style } = this.props;

    return (
      <View>
        <View style={[styles.tabs, { backgroundColor: backgroundColor || null }, style]}>
          {tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
      );
  },
});

module.exports = MdIconTabBar;
