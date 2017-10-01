'use strict';

import React, { Component } from 'react';
import {
  View,
  Switch,
  StyleSheet,
  TextInput,
  Platform,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../common/MyText';
import theme from '../../../style/theme';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  postSettings: {
    backgroundColor: '#FFF',

    height: 140,
    padding: 20,
    paddingBottom: 10,
    paddingTop: 20,
    marginBottom: 0,

    // elevation: 5,
    // shadowColor: theme.secondaryDark,
    // shadowOpacity: 0.1,
    // shadowRadius: 5,
    // shadowOffset: {
    //   height: 6,
    //   width: 0
    // },
  },
  settingsRow: {
    minHeight: 50,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  settingsRowTitle: {
    flexDirection: 'row',
  },
  settingsRowTitleTextWrap: {
    flexDirection: 'column',
  },
  settingsRowTitleText: {
    fontWeight: 'normal',
    color: theme.blue1,
    marginTop: 5,
  },
  smaller: {
    fontSize: 11,
    color: '#bbb'
  },
  settingsRowIcon: {
    color: theme.blue1,
    fontSize: 25,
    marginRight: 13,
    marginLeft: -5,
  },
  inputField: {
    padding: 0,
    width: width - 60,
    minHeight: 50,
    fontSize: 14,
  }
});

class PostSettings extends Component {
  render() {
    const {
      onChangeImageText,
      imageText,
      postLocationStatus,
      togglePostLocationStatus,
    } = this.props;

    return (
      <View style={styles.postSettings}>

        <View style={[styles.settingsRow, { marginBottom: 10 }]}>

          <View style={styles.settingsRowTitle}>
            <Icon style={styles.settingsRowIcon} name="text-fields" />
            <TextInput
              multiline={true}
              autoCorrect={false}
              autoCapitalize={'none'}
              clearButtonMode={'while-editing'}
              returnKeyType={'done'}
              style={styles.inputField}
              onChangeText={onChangeImageText}
              value={imageText}
              placeholder={'Write a caption...'}
              placeholderTextColor={'#aaa'}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </View>
        <View style={styles.settingsRow}>
          <View style={styles.settingsRowTitle}>
            <Icon style={styles.settingsRowIcon} name="location-on" />
            <View style={styles.settingsRowTitleTextWrap}>
              <View>
                <Text style={styles.settingsRowTitleText}>
                 Show Post on Map
                </Text>
              </View>
            </View>
          </View>
          <Switch
            onTintColor={theme.secondary}
            value={postLocationStatus}
            onValueChange={togglePostLocationStatus}
          />
        </View>

      </View>
    );
  }
}

export default PostSettings;
