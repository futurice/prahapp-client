'use strict'

import React, { Component } from 'react';
import { View, Animated } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { changeTab } from '../actions/navigation';
import { getFeedSortType, setFeedSortType } from '../concepts/sortType';

import MoodView from './MoodView';
import HoursView from './HoursView';
import CalendarView from './CalendarView';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventMapView from './EventMapView';

import Header from '../components/common/MainHeader';
import ScrollableTabs  from 'react-native-scrollable-tab-view';
import Tabs from '../constants/Tabs';
import IconTabBar from '../components/common/MdIconTabBar';

const theme = require('../style/theme');

const ANDROID_TAB_ORDER = [
  Tabs.FEED,
  Tabs.MAP,
  Tabs.SETTINGS
];
const initialTab = 0;

class AndroidTabNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerVisibility: new Animated.Value(1),
    }
  }

  componentDidMount() {
    const { changeTab } = this.props;

    changeTab(ANDROID_TAB_ORDER[initialTab])
  }

  @autobind
  toggleHeader(show) {
    Animated.timing(this.state.headerVisibility, { toValue: show ? 1 : 0, duration: 300 }).start();
  }

  @autobind
  onChangeTab({ i }) {
    this.props.changeTab(ANDROID_TAB_ORDER[i]);
  }

  render() {
    const {
      navigator,
      currentTab,
      selectedSortType,
    } = this.props;

    const headerHeight = this.state.headerVisibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 56]
    });

    const headerTranslateY = this.state.headerVisibility.interpolate({
      inputRange: [0, 1],
      outputRange: [-56, 0]
    });

    const feedHeaderStyles = {
      height: headerHeight,
      transform: [{ translateY: headerTranslateY }]
    };

    const isFeedView = currentTab === Tabs.FEED;

    return (
      <View style={{ flexGrow: 1, flex: 1 }}>
        <Animated.View style={isFeedView ? feedHeaderStyles : {}}>
          <Header
            title={null}
            backgroundColor={theme.white}
            currentTab={currentTab}
            selectedSortType={selectedSortType}
            setFeedSortType={this.props.setFeedSortType}
            navigator={navigator}
          />
        </Animated.View>
        <ScrollableTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTab}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.darker}
          tabBarInactiveTextColor={theme.blue3}
          locked={true}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView
            onScrollUp={() => this.toggleHeader(true)}
            onScrollDown={() => this.toggleHeader(false)}
            navigator={navigator}
            tabLabel={{ title: 'Feed', icon:'fiber-smart-record' }}
          />
          <EventMapView navigator={navigator} tabLabel={{ title: 'Locate', icon:'public' }} />
          <ProfileView navigator={navigator} tabLabel={{ title: 'Futuricean', icon:'Face' }} />
        </ScrollableTabs>
      </View>
    )
  }
}


const mapDispatchToProps = {
  changeTab,
  setFeedSortType,
};

const select = state => {
  return {
    selectedSortType: getFeedSortType(state),
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(AndroidTabNavigation);
