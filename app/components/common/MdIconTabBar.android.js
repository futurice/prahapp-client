// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
'use strict';

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Animated,
  Easing
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0
  },
  tabs: {
    elevation: 4,
    height: 54,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1'
  },
  textLabel: {
    fontSize: 10,
    textAlign:'center',
    // position:'absolute',
    left:0,
    right:0,
    bottom: 0
  }
});


var AndroidTabBar = React.createClass({
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

    // const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    // const numberOfTabs = this.props.tabs.length;
    // const outPutArray = times(numberOfTabs, () => 0);
    // outPutArray[page] = 1; // -> eg. [0,1,0,0,0]

    // const textScale = this.props.scrollValue.interpolate({  inputRange: range(numberOfTabs), outputRange: outPutArray});
    // const iconTop = textScale.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

    const buttonAnimation = this.state.buttonAnimations[page];

    return (
    <TouchableNativeFeedback
      key={item.title}
      onPress={() => this.props.goToPage(page)}
      background={TouchableNativeFeedback.SelectableBackground()}
      delayPressIn={1}
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
                // scale: isTabActive ? 1.1 : 0
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

module.exports = AndroidTabBar;
