'use strict';

import React, { PropTypes, Component } from 'react';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.yellow,
    elevation: 2,
    height: 56,
  }
});

const iconColor = theme.blue2;

const selectedActionIcon = '• '; //‣ • ● ♥

const getElevation = (tab) => {
  switch (tab) {
    case Tabs.MAP:
    case Tabs.SETTINGS: {
      return 0;
    }
    default:{
      return 1;
    }
  }
};

const getActions = (tab, sortType) => {
  switch (tab) {
    case Tabs.FEED: {
      return [
        { title: `${sortType === SortTypes.SORT_NEW ? selectedActionIcon : '  '} Newest`, id: SortTypes.SORT_NEW, show: 'never' },
        { title: `${sortType === SortTypes.SORT_HOT ? selectedActionIcon : '  '} Trending`, id: SortTypes.SORT_HOT, show: 'never' },
      ];
    }
    default: {
      return [];
    }
  }
  return [];
};

class EventDetailToolbar extends Component {
  @autobind
  onActionSelected(position) {
    const { currentTab, navigator } = this.props;
    switch (position) {
      case 0: {
        this.props.setFeedSortType(SortTypes.SORT_NEW);
        break;
      }
      case 1: {
        this.props.setFeedSortType(SortTypes.SORT_HOT);
        break;
      }

      default: {
        console.log('No action for this selection');
        break;
      }

      return;
    }
  }

  render() {
    const toolbarStyles = [styles.toolbar];

    const {
      backgroundColor,
      titleColor,
      currentTab,
      selectedSortType,
    } = this.props;

    const elevation = getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation })
    }

    return (
      <ToolbarAndroid
        actions={getActions(currentTab, selectedSortType)}
        logo={require('../../../assets/logo/futurice.png')}
        overflowIconName={'sort'}
        overflowIcon={require('../../../assets/icons/sort.png')}
        title={''}
        onActionSelected={this.onActionSelected}
        iconColor={theme.blue2}
        titleColor={titleColor || theme.blue2}
        style={toolbarStyles}
      />
    );
  }
}

export default EventDetailToolbar;
