// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
'use strict';

import React, { PropTypes, Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
  Animated
} from 'react-native';

import _ from 'lodash';
import Icon from 'react-native-vector-icons/MaterialIcons';

var styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom:0,
    elevation:2,
  },
  tabs: {
    elevation:2,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
  },
  textLabel: {
    fontSize: 11,
    textAlign:'center',
    position:'absolute',
    left:0,
    right:0,
    bottom: 7,
  }
});

class AndroidTabBar extends Component {
  propTypes: {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    backgroundColor : PropTypes.string,
    activeTextColor : PropTypes.string,
    inactiveTextColor : PropTypes.string,
  }

  renderTabOption(name, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'navy';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';

    const AnimatedIcon = Animated.createAnimatedComponent(Icon);

    const numberOfTabs = this.props.tabs.length;
    const outPutArray = _.times(numberOfTabs, () => 0);
    outPutArray[page] = 1; // -> eg. [0,1,0,0,0]

    const textScale = this.props.scrollValue.interpolate({  inputRange: _.range(numberOfTabs), outputRange: outPutArray});
    const iconTop = textScale.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

    return (
    <TouchableNativeFeedback
      key={name.title}
      onPress={() => this.props.goToPage(page)}
      background={TouchableNativeFeedback.SelectableBackground()}
      delayPressIn={1}
    >
      <View style={styles.tab} >
        <AnimatedIcon
        name={name.icon}
        size={20}
        style={{
          top: isTabActive ? iconTop : 0,
          color: isTabActive ? activeTextColor : inactiveTextColor
        }}/>

        {isTabActive &&
          <Animated.Text style={[
            styles.textLabel,
            {
              color: activeTextColor,
              opacity: isTabActive ? textScale : 0,
              transform: [{
                scale: isTabActive ? textScale : 0
              }]
            }
          ]}>
          {name.title}
          </Animated.Text>
        }
      </View>
    </TouchableNativeFeedback>
    );
  }

  render() {

    const { tabs, containerWidth } = this.props;
    const numberOfTabs = tabs.length;

    var tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 2,
      backgroundColor: this.props.underlineColor || "navy",
      bottom: 0,
    };

    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0,  containerWidth / numberOfTabs]
    });

    // Elastic width underline
    // Between tabs underline width is wider
    const BORDER_ELASTICITY = 1.35;
    const widthValues = _.range((numberOfTabs * 2 - 1));
    const width = this.props.scrollValue.interpolate({
      inputRange:  _.map(widthValues, i => i * 0.5), // [0, 0.5, 1, 1.5, 2...]
      outputRange: _.map(widthValues, (item, i) => i % 2 === 0 ?
        containerWidth / numberOfTabs :
        containerWidth / numberOfTabs * BORDER_ELASTICITY
      )
    });

    return (
      <View>
        <View style={[styles.tabs, {backgroundColor : this.props.backgroundColor || null}, this.props.style]}>
          {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
          <Animated.View style={[tabUnderlineStyle, {left: left, width: width} ]} />
        </View>
      </View>
      );
  }
}

module.exports = AndroidTabBar;
