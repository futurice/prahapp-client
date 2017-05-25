
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { fromJS } from 'immutable';
import moment from 'moment';
import autobind from 'autobind-decorator';

import theme from '../../style/theme';
import time from '../../utils/time';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ICONS from '../../constants/Icons';
import CommentForm from './CommentForm';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const Comment = props => {
  const { item } = props;
  const ago = time.getTimeAgo(item.get('createdAt'));
  const avatarUrl = item.getIn(['author', 'img']);

  return (
    <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <View style={styles.commentAvatar}>
              {avatarUrl
                ? <Image source={{ uri: avatarUrl }} style={styles.commentAvatarImage} />
                : <Icon name="person" style={styles.commentAvatarIcon} />
                /*<Image source={ICONS.PERSON} style={styles.commentAvatarIcon} />*/
              }
            </View>
          </View>

          <View style={styles.commentTextContent}>
            <Text style={styles.commentText}>
              <Text style={styles.commentAuthor}>{item.getIn(['author', 'name'])} </Text>
              {item.get('text')}
            </Text>

            <Text style={styles.itemTimestamp}>{ago}</Text>
          </View>
        </View>
    </View>
  );
};


class CommentList extends Component {
  @autobind
  scrollBottom(animated = false) {
    if (this.commentScrollView){
     this.commentScrollView.scrollToEnd({ animated });
    }
  }

  @autobind
  postComment(comment) {
    this.props.postComment(comment);
    this.scrollBottom(true);
  }

  render() {
    const {
      comments,
      postComment,
      editComment,
      editCommentText,
      loadingCommentPost
    } = this.props;

    return (
      <KeyboardAvoidingView
        behavior={IOS ? 'position' : 'height'}
        keyboardVerticalOffset={IOS ? 0 : 30}
        style={styles.commentList}
      >
        <View style={styles.commentView}>
          <ScrollView
            style={styles.scrollView}
            ref={ref => this.commentScrollView = ref}
            onContentSizeChange={(contentWidth, contentHeight) => {
              this.commentScrollView.scrollToEnd({ animated: false });
            }}
          >
            {comments.map((comment, index) => <Comment key={index} item={comment} />)}
          </ScrollView>
          <CommentForm
            postComment={this.postComment}
            editComment={editComment}
            text={editCommentText}
            postCommentCallback={this.scrollBottom}
            loadingCommentPost={loadingCommentPost}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }
}


const styles = StyleSheet.create({
  commentList: {
    flex: 1,
    paddingBottom: 0,
    backgroundColor: theme.white,
  },
  commentView: {
    paddingBottom: 52,
  },
  itemWrapper: {
    width,
    flex: 1,
    backgroundColor: theme.white,
    paddingBottom: 10,
    paddingTop: 0,
  },

  comment:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 25,
    paddingBottom: 15,
    paddingTop: 15,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  commentAvatarCol: {
    paddingRight: 25,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.earth1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  commentAvatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: theme.earth1,
    borderRadius: 18,
    color: theme.white,
    fontSize: 36,
    lineHeight: 44,
    backgroundColor: theme.transparent
  },
  commentText: {
    textAlign: 'left',
    color: theme.dark
  },
  commentListItemImg: {
    width: width,
    height: width,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  commentTextContent:{
    flex: 1,
  },
  commentAuthor: {
    marginRight: 5,
    color: theme.blue2,
    fontWeight: 'bold',
  },
  itemTimestamp: {
    marginTop: 7,
    color: '#aaa',
    fontSize: 12,
  },
});

export default CommentList;
