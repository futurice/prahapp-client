'use strict';

import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import EventMap from './EventMapView';
import CalendarView from './CalendarView';

import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ScanView from './Scan';
import SettingsView from './ProfileView';
import Tabs from '../constants/Tabs';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import ICONS from '../constants/Icons';

const theme = require('../style/theme');

// # Tab navigation
class Navigation extends Component {
  @autobind
  onChangeTab(tab) {
    this.props.changeTab(tab);
  }

  render() {
    const { navigator, currentTab } = this.props;
    return (
      <TabBarIOS
        tintColor={theme.blue2}
        barTintColor={theme.white}
        unselectedTintColor={theme.blue3}
        unselectedItemTintColor={theme.blue3}
        translucent={false}
      >

        <TabBarIOS.Item
          icon={ICONS.CHATS}
          title={'Buzz'}
          selected={currentTab === Tabs.FEED}
          onPress={() => { this.onChangeTab(Tabs.FEED); }}>
          <FeedView navigator={navigator} />
        </TabBarIOS.Item>

        { /*
        <TabBarIOS.Item
          icon={ICONS.HEART}
          title={'How to'}
          selected={currentTab === Tabs.FEELING}
          onPress={() => { this.onChangeTab(Tabs.FEELING); }}>
          <ScanView navigator={navigator} />
        </TabBarIOS.Item>
        */ }
        <MDIcon.TabBarItemIOS
          iconName='access-time'
          title={'Event'}
          selected={currentTab === Tabs.CALENDAR}
          onPress={() => { this.onChangeTab(Tabs.CALENDAR); }}>
          <CalendarView navigator={navigator} />
        </MDIcon.TabBarItemIOS>

        <MDIcon.TabBarItemIOS
          iconName='map'
          title={'Discover'}
          selected={currentTab === Tabs.MAP}
          onPress={() => { this.onChangeTab(Tabs.MAP); }}>
          <EventMap navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        {/*
        <TabBarIOS.Item
          icon={ICONS.CHATS}
          title=''
          selected={currentTab === Tabs.FEED}
          onPress={() => { this.onChangeTab(Tabs.FEED); }}>
          <FeedView navigator={navigator} />
        </TabBarIOS.Item>
        <MDIcon.TabBarItemIOS
          iconName='trending-up'
          title=''
          selected={currentTab === Tabs.FEELING}
          onPress={() => { this.onChangeTab(Tabs.FEELING); }}>
          <MoodView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        <MDIcon.TabBarItemIOS
          iconName='equalizer'
          title=''
          selected={currentTab === Tabs.ACTION}
          onPress={() => { this.onChangeTab(Tabs.ACTION); }}>
          <CompetitionView navigator={navigator} />
        </MDIcon.TabBarItemIOS>*/}
        <MDIcon.TabBarItemIOS
          iconName='account-circle'
          title={'Info'}
          selected={currentTab === Tabs.SETTINGS}
          onPress={() => { this.onChangeTab(Tabs.SETTINGS); }}>
          <SettingsView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
      </TabBarIOS>
    )
  }
}

const mapDispatchToProps = { changeTab };

const select = state => {
  return {
    currentTab: state.navigation.get('currentTab')
  }
};

export default connect(select, mapDispatchToProps)(Navigation);
