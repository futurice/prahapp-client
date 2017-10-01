'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  PropTypes,
  TouchableOpacity,
  Linking,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ParsedText from 'react-native-parsed-text';

import { isNil, isEmpty } from 'lodash';
import abuse from '../../services/abuse';
import time from '../../utils/time';
import theme from '../../style/theme';

import Text from '../common/MyText';
import VotePanel from './VotePanel';
import FeedItemHeader from './FeedItemHeader';
import FeedItemText from './FeedItemText';
import FeedItemImage from './FeedItemImage';
import CommentsLink from './CommentsLink';

const { width } = Dimensions.get('window');
const FEED_ITEM_MARGIN_DISTANCE = 10;
const FEED_ITEM_MARGIN_DEFAULT = 10;
const FEED_ADMIN_ITEM_MARGIN_DEFAULT = 15;
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  itemWrapper: {
    width: width,
    flex: 1,
    backgroundColor: theme.white,
    paddingBottom: 15,
    paddingTop: 8,
  },
  itemTouchable: {
    flexGrow: 1,
    flex: 1
  },
  itemContent: {
    flexGrow: 1,
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DISTANCE,
    overflow: 'visible',
    borderWidth: IOS ? 0 : 0,
    borderColor: 'rgba(0, 0, 0, .033)',
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
  itemContent_selected: {
    backgroundColor: theme.stable
  },
  itemContent_byMyTeam: {
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    marginLeft: FEED_ITEM_MARGIN_DISTANCE,
  },
  itemContent_image: {
    marginLeft: FEED_ITEM_MARGIN_DEFAULT,
    marginRight: FEED_ITEM_MARGIN_DEFAULT,
    borderRadius: 0,
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
    backgroundColor: '#EEF3F5'
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
    fontSize: 14,
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
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  // # Skeleton styles
  skeletonWrap: {
    flex: 1,
    minHeight: 210,
  },
  skeletonHeader: {
    minHeight: 55,
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

  handleUrlPress(url) {
    Linking.openURL(url);
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
              <Text style={styles.itemAuthorName}>Vaskbot</Text>
            </View>
            <Text style={styles.itemTimestamp__admin}>{ago}</Text>
          </View>

          {item.type === 'IMAGE' ?
            <FeedItemImage
              onImagePress={this.props.openLightBox}
              postId={item.id}
              uri={item.url} />
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
    const { opacity } = this.props;
    return (
    <View style={[styles.itemWrapper, styles.skeletonWrap, { opacity: isNil(opacity) ? 1 : opacity }]}>
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
    const hasItemText = !isEmpty(item.text);
    const avatar = item.author.profilePicture;

    return (
      <View style={styles.itemWrapper}>
        <View
          style={[styles.itemContent,
            itemByMyTeam ? styles.itemContent_byMyTeam : {},
            isItemImage ? styles.itemContent_image : {},
            selected ? styles.itemContent_selected : {}
          ]}
        >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemTouchable}
          onLongPress={() => this.selectItem() }
        >
          <FeedItemHeader
            ago={ago}
            avatar={avatar}
            author={item.author}
            myTeam={itemByMyTeam}
            onHeaderPress={openUserPhotos} />
          {hasItemText && isItemImage &&
            <FeedItemText
              text={item.text}
              isItemImage={isItemImage}
              handleUrlPress={this.handleUrlPress} />
          }

          {isItemImage &&
            <FeedItemImage
              onImagePress={this.props.openLightBox}
              postId={item.id}
              uri={item.url} />
          }
          {!isItemImage &&
            <FeedItemText
              text={item.text}
              isItemImage={isItemImage}
              handleUrlPress={this.handleUrlPress} />
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
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default FeedListItem;
