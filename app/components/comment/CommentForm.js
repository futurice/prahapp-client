
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import autobind from 'autobind-decorator';
import { isEmpty } from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  @autobind
  onChangeText(text) {
    this.props.editComment(text);
  }


  @autobind
  onSendText() {
    const {
      postComment,
      text
    } = this.props;

    if (!text || isEmpty(text.trim())) {
      return;
    }

    postComment(text);
  }

  render() {
    const { text, loadingCommentPost } = this.props;

    return (
      <View
        behavior={IOS ? 'position' : 'height'}
        keyboardVerticalOffset={IOS ? 0 : 30}
        style={styles.itemWrapper}
      >
        <View style={styles.inputContainer}>
          <TextInput
            autoFocus={false}
            autoCapitalize={'sentences'}
            underlineColorAndroid={'transparent'}
            returnKeyType={'send'}
            style={styles.inputField}
            numberOfLines={1}
            blurOnSubmit={true}
            maxLength={151}
            placeholderTextColor={'rgba(0,0,0, 0.4)'}
            placeholder="Add comment..."
            onSubmitEditing={this.onSendText}
            onChangeText={this.onChangeText}
            value={text}
          />

          {loadingCommentPost
            ? <ActivityIndicator style={styles.sendButton} size={'small'} color={theme.secondary} />
            : <TouchableOpacity style={styles.sendButton}>
              <Icon name="send" onPress={this.onSendText} style={styles.sendButtonIcon} />
            </TouchableOpacity>
          }
        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  itemWrapper: {
    width,
    height: 52,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    elevation: 1,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    backgroundColor: theme.white,
    justifyContent: 'center',
    flexGrow: 1,
    width,
  },
  inputField: {
    backgroundColor: theme.white,
    color: theme.dark,
    height: 52,
    fontSize: 14,
    position: 'relative',
    borderRadius: 5,
    padding: 10,
    left: 15,
    width: width - 75,
  },
  sendButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 52,
    width: 52,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white
  },
  sendButtonIcon: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: 25,
  }
});

export default CommentForm;
