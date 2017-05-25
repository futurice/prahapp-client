'use strict';

import React, { PropTypes } from 'react';
import { ToolbarAndroid, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';
import MoodInfo from '../mood/MoodInfo';

const cityIcons = {
  'helsinki': require('../../../assets/cities/icon-ota-amfi-accent.png'),
  'tampere': require('../../../assets/cities/icon-tampere-accent-sm.png')
};

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.yellow,
    elevation: 2,
    height: 56,
  }
});

const iconColor = theme.blue2;

const getElevation = (tab) => {
  switch (tab) {
    case Tabs.FEED:
    case Tabs.FEELING:
    case Tabs.CALENDAR: {
      return 0;
    }
    default:{
      return 2;
    }
  }
};

const selectedActionText = '• '; //‣ • ● ♥

var EventDetailToolbar = React.createClass({
  propTypes: {
    title: PropTypes.string,
    navigator: PropTypes.object.isRequired
  },

  getCityIcon(cityName) {
    return (cityName || '').toLowerCase() === 'tampere' ? cityIcons.tampere : cityIcons.helsinki;
  },

  getActions(tab, sortType, cityName) {

    switch (tab) {
      case Tabs.FEED: {
        return [
          // { title: 'City', id:'city', show: 'always', icon: this.getCityIcon(cityName), iconColor },
          { title: `${sortType === SortTypes.SORT_NEW ? selectedActionText : '  '} Newest`, id: SortTypes.SORT_NEW, show: 'never' },
          { title: `${sortType === SortTypes.SORT_HOT ? selectedActionText : '  '} Trending`, id: SortTypes.SORT_HOT, show: 'never' },
        ]
      }
      // case Tabs.FEELING:
      //   return [
      //     // { title: 'City', id:'city', show: 'always', icon: this.getCityIcon(cityName), iconColor },
      //     { title: 'Info', id:'mood', show: 'always', iconName: 'info-outline', iconColor }
      //   ];

      // // case Tabs.CALENDAR:
      // // case Tabs.ACTION:
      // // case Tabs.SETTINGS:
      // //   return [{ title: 'City', id:'city', show: 'always', icon: this.getCityIcon(cityName), iconColor }]
      default:{
        return [];
      }
    }
  },

  onActionSelected(position) {
    const { currentTab, navigator } = this.props;
    switch (position) {
      case 0: {
        this.props.toggleCityPanel();
        break;
      }

      case 1: {
        if (currentTab === Tabs.FEELING) {
          navigator.push({
            component: MoodInfo
          });
        } else {
          this.props.setFeedSortType(SortTypes.SORT_NEW);
        }
        break;
      }
      case 2: {
        this.props.setFeedSortType(SortTypes.SORT_HOT);
        break;
      }

      default: {
        console.log('No action for this selection');
        break;
      }
    }
  },

  render() {
    const toolbarStyles = [styles.toolbar];

    const {
      backgroundColor,
      titleColor,
      currentTab,
      currentCityName,
      selectedSortType,
    } = this.props;

    const elevation = getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation })
    }

    return (
      <Icon.ToolbarAndroid
        actions={this.getActions(currentTab, selectedSortType, currentCityName)}
        logo={require('../../../assets/prague/futubohemia/logo-blue.png')}
        overflowIconName={'sort'}
        title={null}
        onActionSelected={this.onActionSelected}
        onIconClicked={this.chooseCity}
        iconColor={theme.blue2}
        titleColor={titleColor || theme.light}
        style={toolbarStyles}
      />
    );
  }
});

export default EventDetailToolbar;
