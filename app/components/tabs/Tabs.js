const React = require('react');
const ReactNative = require('react-native');
const {
  StyleSheet,
  Text,
  View,
  Animated,
  Platform,
} = ReactNative;
const Button = require('./TabButton');
const IOS = Platform.OS === 'ios';
import theme from '../../style/theme';

const DefaultTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor: React.PropTypes.string,
    activeTextColor: React.PropTypes.string,
    inactiveTextColor: React.PropTypes.string,
    textStyle: Text.propTypes.style,
    tabStyle: View.propTypes.style,
    renderTab: React.PropTypes.func,
    underlineStyle: View.propTypes.style,
  },

  getDefaultProps() {
    return {
      activeTextColor: 'navy',
      inactiveTextColor: 'black',
      backgroundColor: null,
    };
  },

  renderTabOption(name, page) {
  },

  renderTab(name, page, isTabActive, onPressHandler) {
    const { activeTextColor, inactiveTextColor, textStyle, } = this.props;
    const textColor = isTabActive ? activeTextColor : inactiveTextColor;

    return <Button
      style={{flex: 1}}
      key={name}
      accessible={true}
      accessibilityLabel={name}
      accessibilityTraits='button'
      onPress={() => onPressHandler(page)}
    >
      <View style={[styles.tab, this.props.tabStyle, ]}>
        <Text style={[{color: textColor, }, textStyle ]}>
          {IOS ? name : (name || '').toUpperCase()}
        </Text>
      </View>
    </Button>;
  },

  render() {
    const {
      containerWidth,
      tabs,
      scrollValue,
      style,
      backgroundColor,
      activeTab,
      goToPage,
      underlineStyle
    } = this.props;

    const numberOfTabs = tabs.length;
    const tabUnderlineStyle = {
      position: 'absolute',
      width: containerWidth / numberOfTabs,
      height: 2,
      backgroundColor: theme.secondary,
      bottom: 0,
    };

    const left = scrollValue.interpolate({
      inputRange: [0, 1], outputRange: [0,  containerWidth / numberOfTabs],
    });

    // Changing line bg color
    // const lineBackgroundColor = scrollValue.interpolate({
    //   inputRange: [0, 1], outputRange: [theme.primary, theme.primary],
    // });

    return (
      <View style={[styles.tabs, { backgroundColor }, style, ]}>
        {tabs.map((name, page) => {
          const isTabActive = activeTab === page;
          const renderTab = this.props.renderTab || this.renderTab;
          return renderTab(name, page, isTabActive, goToPage);
        })}
        <Animated.View style={
          [tabUnderlineStyle,
          { left },
          underlineStyle
          ]}/>
      </View>
    );
  },
});

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  tabs: {
    elevation: 2,
    height: IOS ? 50 : 56,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
});

module.exports = DefaultTabBar;
