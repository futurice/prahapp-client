'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import EventMapView from './EventMapView';
import CalendarView from './CalendarView';

import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import MoodView from './MoodView';

import Tabs from '../constants/Tabs';
import { isUserLoggedIn } from '../reducers/registration';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import ICONS from '../constants/Icons';
import ScrollableTabs  from 'react-native-scrollable-tab-view';
import IconTabBar from '../components/common/MdIconTabBar';

const theme = require('../style/theme');

const IOS_TAB_ORDER = [
  Tabs.FEED,
  Tabs.CALENDAR,
  Tabs.MAP,
  Tabs.SETTINGS
];
const initialTab = 0;

// # Tab navigation
class Navigation extends Component {

  componentDidMount() {
    const { changeTab } = this.props;

    changeTab(IOS_TAB_ORDER[initialTab])
  }


  @autobind
  onChangeTab({ i }) {
    this.props.changeTab(IOS_TAB_ORDER[i]);
  }

  render() {
    const { navigator, currentTab } = this.props;
    return (
      <ScrollableTabs
        onChangeTab={this.onChangeTab}
        initialPage={initialTab}
        tabBarPosition={'bottom'}
        tabBarBackgroundColor={theme.white}
        tabBarActiveTextColor={theme.secondary}
        tabBarInactiveTextColor={theme.blue3}
        locked={true}
        scrollWithoutAnimation={true}
        prerenderingSiblingsNumber={0}
        renderTabBar={() => <IconTabBar />}
      >
        <FeedView navigator={navigator} tabLabel={{ title: 'Vasking', icon:'fiber-smart-record' }} />
        <EventMapView navigator={navigator} tabLabel={{ title: 'Geo', icon:'public' }} />
        <ProfileView navigator={navigator} tabLabel={{ title: 'Me', icon:'face' }} />
      </ScrollableTabs>
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
