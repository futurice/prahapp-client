'use strict';

import React, { Component } from 'react';
import { TabBarIOS } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import EventMap from './EventMapView';
import CalendarView from './CalendarView';

import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import SettingsView from './ProfileView';
import MoodView from './MoodView';
import HoursView from './HoursView';
import Tabs from '../constants/Tabs';
import { isUserLoggedIn } from '../reducers/registration';
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
        <MDIcon.TabBarItemIOS
          iconName="tag-faces"
          title={'Work Vibe'}
          selected={currentTab === Tabs.FEELING}
          onPress={() => { this.onChangeTab(Tabs.FEELING); }}>
          <MoodView navigator={navigator} />
        </MDIcon.TabBarItemIOS>




        <MDIcon.TabBarItemIOS
          iconName="history"
          title={'Hours'}
          selected={currentTab === Tabs.MAP}
          onPress={() => { this.onChangeTab(Tabs.MAP); }}>
          <HoursView navigator={navigator} />
        </MDIcon.TabBarItemIOS>

        {/*
        <MDIcon.TabBarItemIOS
          iconName="access-time"
          title={'Events'}
          selected={currentTab === Tabs.CALENDAR}
          onPress={() => { this.onChangeTab(Tabs.CALENDAR); }}>
          <CalendarView navigator={navigator} />
        </MDIcon.TabBarItemIOS>
        <MDIcon.TabBarItemIOS
          iconName="map"
          title={'Futumap'}
          selected={currentTab === Tabs.MAP}
          onPress={() => { this.onChangeTab(Tabs.MAP); }}>
          <EventMap navigator={navigator} />
        </MDIcon.TabBarItemIOS>
      */}
        <MDIcon.TabBarItemIOS
          iconName="account-circle"
          title={'Tools'}
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
