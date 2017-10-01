
import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';

import theme from '../../../style/theme';

const { width } = Dimensions.get('window');
const FEED_ITEM_MARGIN_DEFAULT = 10;

const styles = StyleSheet.create({
  itemImageWrapper: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    overflow: 'hidden'
  },
  feedItemListItemImg: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    backgroundColor: 'transparent',
  },
});

const FeedItemImage = ({ postId, uri, onImagePress }) => {
  return (
    <View style={styles.itemImageWrapper}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => onImagePress(postId)}
      >
        <Image
          source={{ uri }}
          style={styles.feedItemListItemImg} />
      </TouchableOpacity>
    </View>
  );
};

export default FeedItemImage;
