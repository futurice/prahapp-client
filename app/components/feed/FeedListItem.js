'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  Platform,
  PropTypes,
  TouchableOpacity,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { connect } from 'react-redux';
import abuse from '../../services/abuse';
import time from '../../utils/time';
import theme from '../../style/theme';

import VotePanel from './VotePanel';
import CommentsLink from './CommentsLink';

const { width } = Dimensions.get('window');
const FEED_ITEM_MARGIN_DISTANCE = 0;
const FEED_ITEM_MARGIN_DEFAULT = 0;
const FEED_ADMIN_ITEM_MARGIN_DEFAULT = 15;
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  itemWrapper: {
    width,
    flex: 1,
    backgroundColor: theme.lightgreen,
    paddingBottom: 10,
    paddingTop: 0,
  },
  itemTouchable: {
    elevation: 1,
    flexGrow: 1,
  },
  itemContent:{
    flexGrow: 1,
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DISTANCE,
    borderRadius: 0,
    // overflow: 'hidden',
    borderBottomWidth: IOS ? 0 : 1,
    borderBottomColor: 'rgba(0, 0, 0, .075)',
    // // # Drop shadows
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.075,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    backgroundColor: '#fff'
  },
  itemContent_selected: {
    backgroundColor: theme.stable
  },
  itemContent_byMyTeam: {
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    marginLeft: FEED_ITEM_MARGIN_DISTANCE,
    // backgroundColor: '#edfcfb',
  },

  itemContent_image: {
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    borderRadius: 0,
  },
  itemImageWrapper: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    overflow: 'hidden'
  },
  itemTextWrapper: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 18,
    paddingBottom: 4,
    top: -10,
  },
  feedItemListText: {
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 25,
    color: theme.dark
  },
  feedItemListItemImg: {
    width: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    height: width - (2 * FEED_ITEM_MARGIN_DEFAULT),
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,

  },
  feedItemListItemImg__admin: {
    width: width - (2 * FEED_ADMIN_ITEM_MARGIN_DEFAULT),
    borderRadius: 5,
  },
  feedItemListItemInfo: {
    flex: 1,
    flexDirection: 'row',
    padding: 13,
    paddingTop: 13,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'center',
    justifyContent: 'center'
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
    fontWeight: 'bold',
    color: theme.blue2,
    paddingRight: 10
  },
  itemAuthorTeam:{
    fontSize: 11,
    color: '#aaa'
  },
  itemAuthorTeam__my: {
    color: theme.primary,
    fontWeight: 'bold'
  },
  feedItemListItemAuthorIcon:{
    color: '#bbb',
    fontSize: 15,
    marginTop: 1,
    paddingRight: 10
  },
  listItemRemoveButton:{
    backgroundColor: 'transparent',
    color: 'rgba(150,150,150,.65)',
    fontSize: IOS ? 22 : 20,
  },
  listItemRemoveContainer: {
    position: 'absolute',
    right: 8,
    bottom: 10,
    borderRadius: 15,
    width: 30,
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTimestamp: {
    color: '#aaa',
    fontSize: 14,
  },
  itemContent__admin:{
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 2,
    backgroundColor: '#faf5ee'
  },
  itemTextWrapper__admin: {
    paddingTop: 0,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15
  },
  feedItemListItemInfo__admin: {
    paddingLeft: 0,
    paddingBottom: 14,
  },
  feedItemListItemAuthor__admin:  {
    paddingLeft: 15,
  },
  itemTimestamp__admin:{
    color: '#b5afa6'
  },
  feedItemListText__admin: {
    textAlign: 'left',
    color: '#7d776e',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between'
  },

  // # Skeleton styles
  skeletonWrap: {
    flex: 1,
    minHeight: 193
  },
  skeletonHeader: {
    minHeight: 50,
    paddingTop: 15,
    justifyContent: 'center',
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 15,
    backgroundColor: theme.grey1,
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
  skeletonFooterItem: {
    backgroundColor: theme.grey1,
    width: 60,
    height: 16,
    margin: 10,
    marginHorizontal: 15,
  }
});

class FeedListItem extends Component {
  propTypes: {
    item: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { selected: false };
  }

  itemIsCreatedByMe(item) {
    return item.author.type === 'ME';
  }


  itemIsCreatedByMyTeam(item) {
    const { userTeam } = this.props;
    if (userTeam) {
      return item.author.team === userTeam.get('name');
    }
    return false;
  }

  selectItem() {
    this.setState({ selected: true });
    this.showRemoveDialog(this.props.item);
  }

  deSelectItem() {
    this.setState({ selected: false });
  }

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert(
        'Remove Content',
        'Do you want to remove this item?',
        [
          { text: 'Cancel',
            onPress: () => this.deSelectItem(), style: 'cancel' },
          { text: 'Yes, remove item',
            onPress: () => { this.deSelectItem(); this.removeThisItem() }, style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Flag Content',
        'Do you want to report this item?',
        [
          { text: 'Cancel',
            onPress: () => this.deSelectItem() , style: 'cancel' },
          { text: 'Yes, report item',
            onPress: () => { this.deSelectItem(); abuse.reportFeedItem(item) }, style: 'destructive' }
        ]
      );
    }
  }

  removeThisItem() {
    this.props.removeFeedItem(this.props.item);
  }

  // Render "remove" button, which is remove OR flag button,
  // depending is the user the creator of this feed item or not
  renderRemoveButton(item) {
    if (item.author.type === 'SYSTEM') {

      return <View></View>; // currently it is not possible to return null in RN as a view
    }

    const iconName = this.itemIsCreatedByMe(item) ? 'delete' : 'flag';
    return (
      <TouchableOpacity
       style={[styles.listItemRemoveContainer,
         {backgroundColor:item.type !== 'IMAGE' ? 'transparent' : 'rgba(255,255,255,.1)'}]}
       onPress={() => this.showRemoveDialog(item)}>

        <Icon name={iconName} style={[styles.listItemRemoveButton,
          {opacity:item.type !== 'IMAGE' ? 0.7 : 1}]
        }/>

      </TouchableOpacity>
    );
  }

  renderAdminItem(item, ago) {

    return (
      <View style={styles.itemWrapper}>
        <View style={[styles.itemContent, styles.itemContent__admin]}>

          <View style={[styles.feedItemListItemInfo, styles.feedItemListItemInfo__admin]}>
            <View style={[styles.feedItemListItemAuthor, styles.feedItemListItemAuthor__admin]}>
              <Text style={styles.itemAuthorName}>Futuspirit</Text>
            </View>
            <Text style={[styles.itemTimestamp, styles.itemTimestamp__admin]}>{ago}</Text>
          </View>

          {item.type === 'IMAGE' ?
            <View style={styles.itemImageWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(item.id)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={[styles.feedItemListItemImg, styles.feedItemListItemImg__admin]} />
              </TouchableOpacity>
            </View>
          :
            <View style={[styles.itemTextWrapper, styles.itemTextWrapper__admin]}>
              <Text style={[styles.feedItemListText, styles.feedItemListText__admin]}>
                {item.text}
              </Text>
            </View>
          }
        </View>
      </View>
    );
  }

  renderSkeletonItem() {
    return (
    <View style={[styles.itemWrapper, styles.skeletonWrap]}>
      <View style={styles.itemTouchable}>
        <View style={styles.itemContent}>

          <View style={[styles.feedItemListItemInfo, styles.skeletonHeader]}>
            <View style={styles.skeletonAvatar} />
            <View style={styles.feedItemListItemAuthor}>
              <View style={styles.skeletonName} />
            </View>
            <View style={styles.skeletonTime} />
          </View>


          <View style={[styles.itemTextWrapper, styles.skeletonItemText]}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonText} />
          </View>

          <View style={styles.footer}>
            <View style={styles.skeletonFooterItem} />

            <View style={styles.skeletonFooterItem} />
          </View>
        </View>
      </View>
    </View>);
  }

  render() {
    const { item, openUserPhotos, openComments } = this.props;

    if (item.type === 'SKELETON') {
      return this.renderSkeletonItem();
    }

    const { selected } = this.state;
    const ago = time.getTimeAgo(item.createdAt);

    if (item.author.type === 'SYSTEM') {
      return this.renderAdminItem(item, ago);
    }

    const itemByMyTeam = this.itemIsCreatedByMyTeam(item);
    const isItemImage = item.type === 'IMAGE';
    const avatar = item.author.profilePicture;

    return (
      <View style={styles.itemWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemTouchable}
          onLongPress={() => this.selectItem() }
        >
        <View style={[styles.itemContent,
          itemByMyTeam ? styles.itemContent_byMyTeam : {},
          isItemImage ? styles.itemContent_image : {},
          selected ? styles.itemContent_selected : {}
        ]}>

          <TouchableOpacity activeOpacity={IOS ? 0.7 : 1} style={styles.feedItemListItemInfo} onPress={() => openUserPhotos(item.author)}>
            <View style={styles.itemAuthorAvatar}>
              {avatar
                ? <Image style={styles.profilePic} source={{ uri: avatar }} />
                : <Icon style={styles.profileIcon} name="person" />
              }
            </View>
            <View style={styles.feedItemListItemAuthor}>
              <Text style={styles.itemAuthorName}>{item.author.name}</Text>
              {/*
                <Text style={[styles.itemAuthorTeam, itemByMyTeam ? styles.itemAuthorTeam__my : {}]}>{item.author.team}</Text>
              */}
            </View>
            <Text style={styles.itemTimestamp}>{ago}</Text>
          </TouchableOpacity>

          {isItemImage ?
            <View style={styles.itemImageWrapper}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(item.id)}
              >
                <Image
                  source={{ uri: item.url }}
                  style={styles.feedItemListItemImg} />
              </TouchableOpacity>
            </View>
          :
            <View style={styles.itemTextWrapper}>
              <Text style={styles.feedItemListText}>{item.text}</Text>
            </View>
          }

          <View style={styles.footer}>
            <VotePanel
              item={item}
              voteFeedItem={this.props.voteFeedItem}
              openRegistrationView={this.props.openRegistrationView}
            />

            <CommentsLink
              parentId={item.id}
              commentCount={item.commentCount}
              openComments={() => openComments(item.id)}
            />

          </View>
        </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default FeedListItem;
