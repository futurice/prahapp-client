'use strict'

import React, { Component } from 'react';
import { View } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { changeTab } from '../actions/navigation';
import {
  toggleCityPanel,
  getCityPanelShowState,
} from '../concepts/city';
import { getFeedSortType, setFeedSortType } from '../concepts/sortType';
import CalendarView from './CalendarView';
// import MoodView from './MoodView';
// import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventMapView from './EventMapView';

import Header from '../components/common/MainHeader';
import AndroidTabs  from 'react-native-scrollable-tab-view';
import Tabs from '../constants/Tabs';

const theme = require('../style/theme');
const IconTabBar = require('../components/common/MdIconTabBar');
const ANDROID_TAB_ORDER = [
  Tabs.FEED,
  Tabs.CALENDAR,
  Tabs.MAP,
  Tabs.SETTINGS
];
const initialTab = 0;

class AndroidTabNavigation extends Component {

  componentDidMount() {
    const { changeTab } = this.props;

    changeTab(ANDROID_TAB_ORDER[initialTab])
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

    return (
      <View style={{ flexGrow: 1, flex: 1 }}>
        <Header
          title={null}
          backgroundColor={theme.secondary}
          currentTab={currentTab}
          selectedSortType={selectedSortType}
          setFeedSortType={this.props.setFeedSortType}
          navigator={navigator}
        />
        <AndroidTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTab}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.blue2}
          tabBarInactiveTextColor={theme.blue3}
          locked={true}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView navigator={navigator} tabLabel={{ title: 'Buzz', icon:'whatshot' }} />
          <CalendarView navigator={navigator} tabLabel={{ title: 'Event', icon:'access-time' }} />
          <EventMapView navigator={navigator} tabLabel={{ title: 'Discover', icon:'map' }} />
          <ProfileView navigator={navigator} tabLabel={{ title: 'Info', icon:'account-circle' }} />
        </AndroidTabs>
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
