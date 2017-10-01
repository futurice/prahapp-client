'use strict';

import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,
  TouchableHighlight, Image, Platform, Text } from 'react-native';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserPicture,
  getUserTeam,
  getTotalSimas,
  getTotalVotesForUser,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';
import { getUserName, getUserId } from '../../reducers/registration';
import { openLightBox } from '../../actions/feed';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';

const headerImage = require('../../../assets/patterns/sea.png');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const headerHeight = 360;


class UserView extends Component {
  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    } else {
      this.props.fetchUserImages(userId);
    }
  }

  render() {

    const { images, isLoading, totalVotes, totalSimas,
      userTeam, userName, navigator, profilePicture } = this.props;
    let { user } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName }
    }

    const imagesCount = images.size;

    return (
      <View style={{ flex: 1 }}>
      <ParallaxView
        backgroundSource={profilePicture ? { uri: profilePicture } : headerImage}
        windowHeight={headerHeight}
        style={{ backgroundColor:theme.white }}
        scrollableViewStyle={{ shadowColor: theme.transparent }}
        header={(
          <View style={styles.header}>
            {!isIOS &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
              </TouchableHighlight>
            </View>
            }
          {/*
            <View style={styles.avatar}>
              {profilePicture
                ? <Image style={styles.avatarImage} source={{ uri: profilePicture }} />
                : <Icon style={styles.avatarText} name="person-outline" />
              }
            </View>
          */}

            <View style={styles.profileInfo}>
              <Text style={styles.headerTitle}>
                {user.name}
              </Text>
              <Text style={styles.headerSubTitle}>
                {userTeam || user.team}
              </Text>
              <View style={styles.headerKpis}>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>photos</Text>
                </View>
                <View style={styles.headerKpi}>
                  <Text style={styles.headerKpiValue}>{!isLoading ? totalVotes : '-'}</Text>
                  <Text style={styles.headerKpiTitle}>likes for photos</Text>
                </View>
              </View>

            </View>
          </View>
        )}
      >

      <View style={styles.container}>
        {isLoading && <View style={styles.loader}><Loader size="large" /></View>}
        {images.size > 0 &&
          <View style={styles.imageContainer}>
            {images.map(image =>
              <View key={image.get('id')}>
                <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.props.openLightBox(image.get('id'))}
                >
                  <Image
                    key={image.get('id')}
                    style={{height: width / 3 - 5, width: width / 3 - 5, margin: 2, backgroundColor: theme.stable}}
                    source={{uri: image.get('url')}}/>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        {!isLoading && !images.size &&
          <View style={styles.imageTitleWrap}>
            <Text style={styles.imageTitle}>No photos</Text>
          </View>
        }
      </View>
      </ParallaxView>
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    minHeight: height / 2
  },
  header: {
    flex:1,
    elevation: 3,
    paddingTop: 30,
    minHeight: headerHeight,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.white
  },
  backLinkIcon: {
    color: theme.blue2
  },
  profileInfo: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    padding: 12,
    alignItems: 'flex-start',
  },
  headerTitle:{
    fontSize: 16,
    fontWeight: 'normal',
    textAlign: 'center',
    color: theme.primary,
    marginBottom: 2,
    paddingHorizontal: 0,
    backgroundColor: theme.transparent,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'rgba(0,0,0,.5)',
    opacity: 0.9,
  },
  avatar: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: 100,
    height: 100,
    backgroundColor: theme.stable,
    borderRadius: 50,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: 60,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row'
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 0,
    marginTop: 10,
  },
  headerKpiTitle: {
    color: theme.primary,
    fontWeight: '500',
    fontSize: 10,
    backgroundColor: theme.transparent,
  },
  headerKpiValue: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '400',
    minWidth: 30,
    textAlign: 'left',
    backgroundColor: theme.transparent
  },
  loader: {
    marginTop: 50
  },
  imageContainer:{
    margin: 1,
    marginTop: 2,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.grey,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
    fontWeight: '600'
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0
  },
});


const mapDispatchToProps = { openLightBox, fetchUserImages };

const mapStateToProps = state => ({
  images: getUserImages(state),
  profilePicture: getUserPicture(state),
  isLoading: isLoadingUserImages(state),
  totalSimas: getTotalSimas(state),
  totalVotes: getTotalVotesForUser(state),
  userId: getUserId(state),
  userName: getUserName(state),
  userTeam: getUserTeam(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
