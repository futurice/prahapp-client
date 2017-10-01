import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import PlatformTouchable from '../common/PlatformTouchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

class CommentsLinks extends Component {
  render() {
    const { commentCount, openComments } = this.props;

    const hasComments = commentCount > 0;

    return (
      <PlatformTouchable style={styles.commentLink} onPress={openComments}>
        <View style={styles.comment}>
          <Text style={styles.commentText}>
            {hasComments ? commentCount : ''}
          </Text>
          <Text style={[styles.commentText, styles.commentTextRight]}>
            <Icon
              style={[styles.commentIcon, hasComments ? styles.activeCommentIcon : {}]}
              name={hasComments ? 'chat-bubble' : 'chat-bubble-outline'}
            />
          </Text>
        </View>
      </PlatformTouchable>
    );
  }
};


const styles = StyleSheet.create({
  comment: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: theme.grey,
    fontSize: 15,
  },
  commentTextRight: {
    marginLeft: 7,
  },
  commentIcon: {
    fontSize: 18,
  },
  activeCommentIcon: {
    color: theme.secondaryLight,
  }
});


export default CommentsLinks;
