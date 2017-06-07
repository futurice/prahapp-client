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

const headerImage = require('../../../assets/prague/futubohemia/solid.png');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

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
        backgroundSource={headerImage}
        windowHeight={230}
        style={{ backgroundColor:theme.white }}
        header={(
          <View style={styles.header}>
            {!isIOS &&
            <View style={styles.backLink}>
              <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
              </TouchableHighlight>
            </View>
            }
            <View style={styles.avatar}>
              {profilePicture
                ? <Image style={styles.avatarImage} source={{ uri: profilePicture }} />
                : <Icon style={styles.avatarText} name="person-outline" />
              }
            </View>
            <Text style={styles.headerTitle}>
              {user.name}
            </Text>
          {/*
            <Text style={styles.headerSubTitle}>
              {userTeam || user.team}
            </Text>
          */}
            <View style={styles.headerKpis}>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                <Text style={styles.headerKpiTitle}>photos</Text>
              </View>
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? totalVotes : '-'}</Text>
                <Text style={styles.headerKpiTitle}>likes for photos</Text>
              </View>
            {/*
              <View style={styles.headerKpi}>
                <Text style={styles.headerKpiValue}>{!isLoading ? (totalSimas || '-') : '-'}</Text>
                <Text style={styles.headerKpiTitle}>simas</Text>
              </View>
            */}
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
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: theme.transparent
  },
  backLinkIcon: {
    color: theme.blue2
  },
  headerTitle:{
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.blue2,
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgba(0,0,0,.6)',
    opacity: 0.9,
  },
  avatar: {
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 90,
    height: 90,
    backgroundColor: theme.stable,
    borderRadius: 45,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 0,
  },
  headerKpiTitle: {
    color: theme.blue1,
    fontWeight: '500',
    fontSize: 11,
  },
  headerKpiValue: {
    fontSize: 26,
    color: theme.blue1,
    fontWeight: '400'
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
