import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { isNil } from 'lodash';

import theme from '../../../style/theme';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
// # Skeleton styles
  skeletonWrap: {
    width,
    backgroundColor: theme.white,
    paddingBottom: 15,
    paddingTop: 8,
    flex: 1,
    minHeight: 210,
  },
  itemContent: {
    flexGrow: 1,
    marginHorizontal: 10,
    overflow: 'visible',
    borderWidth: 0,
    // // # Drop shadows
    elevation: 5,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.09,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
    backgroundColor: '#fff',
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
  },
  skeletonHeader: {
    flex: 1,
    flexDirection: 'row',
    padding: 13,
    paddingLeft: 15,
    paddingRight: 15,
    minHeight: 55,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 15,
    backgroundColor: theme.grey1,
  },
  skeletonItemAuthor: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  skeletonName: {
    backgroundColor: theme.grey1,
    width: 100,
    height: 16,
    marginTop: 0,
  },
  skeletonTime: {
    backgroundColor: theme.grey1,
    width: 25,
    height: 16,
    marginTop: 0,
  },
  skeletonItemText: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  skeletonText: {
    backgroundColor: theme.grey1,
    width: width / 2,
    height: 16,
    margin: 10,
  },
  skeletonFooter: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
  skeletonFooterItem: {
    backgroundColor: theme.grey1,
    width: 60,
    height: 16,
    margin: 10,
    marginHorizontal: 15,
  },
});

const FeedItemSkeleton = ({ opacity }) => {
  return (
    <View style={[styles.skeletonWrap, { opacity: isNil(opacity) ? 1 : opacity }]}>
      <View style={styles.itemContent}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonItemAuthor}>
            <View style={styles.skeletonName} />
          </View>
          <View style={styles.skeletonTime} />
        </View>
        <View style={[styles.itemTextWrapper, styles.skeletonItemText]}>
          <View style={styles.skeletonText} />
          <View style={styles.skeletonText} />
        </View>
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonFooterItem} />
          <View style={styles.skeletonFooterItem} />
        </View>
      </View>
    </View>
  );
};

export default FeedItemSkeleton;
