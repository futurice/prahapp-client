import React from 'react';
import { toArray } from 'lodash';
import {
  StyleSheet,
  View,
  TouchableHighlight
} from 'react-native'

import { connect } from 'react-redux';

import { getFeedSortType, setFeedSortType } from '../../concepts/sortType';

import Text from '../common/MyText';
import theme from '../../style/theme';
import SortTypes from '../../constants/SortTypes';

const sortTypeTitles = {
  [SortTypes.SORT_NEW]: 'fresh',
  [SortTypes.SORT_HOT]: 'hot',
};

const SortSelector = ({
  selectedSortType,
  setFeedSortType: onSortButtonClicked
}) => {

  const sortTypeOptions = toArray(SortTypes);
  const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
  const nextSortTypeItem = selectedSortTypeIndex >= sortTypeOptions.length - 1
    ? sortTypeOptions[0]
    : sortTypeOptions[selectedSortTypeIndex + 1];

  return (
  <TouchableHighlight
    underlayColor={'transparent'}
    onPress={() => onSortButtonClicked(nextSortTypeItem) }>
    <View style={styles.sortSelector}>
      <Text style={styles.filterText}>
        {sortTypeTitles[selectedSortType]}
      </Text>
      <View style={styles.indicators}>
        {sortTypeOptions.map((type, index) =>
          <View
            key={type}
            style={[styles.indicator, index === selectedSortTypeIndex ? styles.activeIndicator : {}]}
          />
        )}
      </View>
    </View>
  </TouchableHighlight>
  );
};

var styles = StyleSheet.create({
  sortSelector: {
    paddingTop: 14,
    paddingRight: 25,
  },
  filterText: {
    color: theme.blue2,
    fontSize: 15
  },
  indicators: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 8,
    alignItems: 'center',
    height: 20,
    backgroundColor: 'transparent',
  },
  indicator: {
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.3,
    backgroundColor: theme.blue1,
  },
  activeIndicator: {
    opacity: 1,
    backgroundColor: theme.blue2,
  }
});


const mapDispatchToProps = { setFeedSortType };

const select = state => {
  return {
    selectedSortType: getFeedSortType(state)
  }
};

export default connect(select, mapDispatchToProps)(SortSelector);
