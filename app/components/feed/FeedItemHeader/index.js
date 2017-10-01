
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import theme from '../../../style/theme';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({

  feedItemListItemInfo: {
    flex: 1,
    flexDirection: 'row',
    padding: 13,
    paddingTop: 13,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedItemListItemAuthor: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemAuthorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 18,
    backgroundColor: theme.grey1,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 18,
  },
  profileIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: theme.grey1,
    borderRadius: 18,
    color: theme.white,
    fontSize: 32,
    lineHeight: 36,
    backgroundColor: theme.transparent
  },
  itemAuthorName: {
    fontSize: 14,
    fontWeight: 'normal',
    color: theme.primary,
    paddingRight: 10,
    paddingTop: IOS ? 2 : 0,
  },
  itemAuthorTeam:{
    fontSize: IOS ? 12 : 11,
    marginTop: IOS ? 1: 0,
    color: '#aaa'
  },
  itemAuthorTeam__my: {
    color: '#aaa',
    fontWeight: 'normal'
  },
  itemTimestamp: {
    color: '#aaa',
    fontSize: 14,
  },
});

const FeedItemHeader = ({ ago, author, avatar, myTeam, onHeaderPress }) => {
  return (
    <TouchableOpacity activeOpacity={IOS ? 0.7 : 1} style={styles.feedItemListItemInfo} onPress={() => onHeaderPress(author)}>
      <View style={styles.itemAuthorAvatar}>
        {avatar
          ? <Image style={styles.profilePic} source={{ uri: avatar }} />
          : <Icon style={styles.profileIcon} name="person" />
        }
      </View>
      <View style={styles.feedItemListItemAuthor}>
        <Text style={styles.itemAuthorName}>{author.name}</Text>
        <Text style={[styles.itemAuthorTeam, myTeam ? styles.itemAuthorTeam__my : {}]}>
          {author.team}
        </Text>
      </View>
      <Text style={styles.itemTimestamp}>{ago}</Text>
    </TouchableOpacity>
  );
};

export default FeedItemHeader;
