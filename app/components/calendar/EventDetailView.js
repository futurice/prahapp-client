'use strict';

import React, { PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  Platform,
  TouchableOpacity,
  Linking,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  TouchableHighlight,
  Image,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ParallaxView from 'react-native-parallax-view';
import theme from '../../style/theme';
import Toolbar from './EventDetailToolbar';
import Notification from '../common/Notification';

import moment from 'moment';
import { connect } from 'react-redux';
import analytics from '../../services/analytics';
import { checkIn } from '../../actions/competition';
import time from '../../utils/time';
import locationService from '../../services/location';
import Button from '../common/Button';

import { openLightBox } from '../../actions/feed';
import { openRegistrationView } from '../../actions/registration';

import {
  INACTIVE,
  UNAVAILABLE,
  AVAILABLE,
  CHECKED
} from '../../constants/CheckInStates';

import PlatformTouchable from '../common/PlatformTouchable';
const IOS = Platform.OS === 'ios';
const { width } = Dimensions.get('window');
const placholderImage = require('../../../assets/patterns/sea.png');

const VIEW_NAME = 'EventDetail';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#eee'
  },
  detailEventImg: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  content: {
    padding: 20,
    backgroundColor: theme.light,
    flex: 1,
  },
  detailEventInfoContainer: {
    flexDirection:'row',
    alignItems:'flex-start',
    justifyContent:'center',
    padding: 20,
    paddingTop: 15,
    paddingBottom: 0,
    backgroundColor:'#fff'
  },
  detailEventInfoWrapper: {
    flex:1,
    flexDirection:'row',
    alignItems:'flex-end',
  },
  detailEventInfoIcon: {
    fontSize:25,
    color:theme.blue1,
    marginTop:1,
    paddingRight:23,
    marginLeft:7,
    alignSelf:'center'
  },
  detailEventInfoAttending: {
    top: -2,
    fontSize: 15,
    color:theme.darkgrey,
    alignSelf: 'center'
  },
  detailEventInfoTime: {
    color: '#000',
    fontSize: 15,
    alignSelf: 'center'
  },
  detailEventName: {
    backgroundColor: theme.light,
    textAlign: 'left',
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 25,
  },
  detailEventDescription: {
    color: '#666',
    fontWeight: 'normal',
    fontSize: 16,
    lineHeight:24,
    marginTop: 0,
  },

  navigationButtonWrapper: {
    margin: 0,
    marginTop: 30,
    borderRadius: 0,
    backgroundColor: theme.light
  },
  navigationButton: {
    height: 50,
    backgroundColor: '#E9E9E9',
    borderColor: '#C7C7C7',
    borderWidth: 10,
    borderRadius: 2,
  },
  navigationButtonText: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 35,
    fontWeight: 'bold',
    color: '#8A8A8A',
    margin: 0,
    padding: 0,
  },
  navigationButtonIcon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 15,
    top: 10,
  },
  eventContent: {
    marginTop: 10,
  },
  gridListItemMetaWrap:{
    paddingBottom: 10,
    borderBottomWidth:1,
    borderBottomColor:'#eee',
  },
  gridListItemMeta: {
    backgroundColor:'#fff',
    borderBottomWidth:0,
    borderBottomColor:'#eee',
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center',
    padding:15,
    paddingLeft:20,
    paddingRight:20,
  },
  gridListItemIcon:{
    color: theme.blue1,
    fontSize: 24,
    top:2
  },
  gridListItemIconImage:{
    tintColor: theme.blue1,
    width: 26,
    height: 26,
    top:2
  },
  gridListItemMeta__block: {
    flexDirection:'column',
    alignItems:'center',
  },
  gridListItemMetaInfo__title:{
    color:'#000',
    fontSize:15,
  },
  gridListItemMetaInfo: {
    color: theme.dark,
  },
  gridListItemPlace:{
    color:theme.midgrey
  },
  gridListItemDistance: {
    color: '#000',
    textAlign:'right',
    fontSize:15
  },
  gridListItemLeftIcon: {
    width:40,
    paddingRight:15,
    color: theme.secondary,
    fontSize: 15,
  },
  gridListItemLeftImage: {
    width: 40,
    paddingRight:15
  },
  header:{
    position:'absolute',
    bottom:20,
    left:20,
    right:20,
    fontSize: 25,
    lineHeight:29,
    fontWeight: 'bold',
    textAlign: 'left',
    color: theme.light,
    elevation:2,
    paddingBottom:10
  },
  buttonText: {
    fontSize: 12,
    textAlign: 'center',
    color: theme.accent,
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  },
  icon: {
    textAlign: 'center',
    color: theme.accent,
  },
  gridListItemImgColorLayer: {
    //position: 'absolute',
    //left: 0, top: 0, bottom: 0, right: 0,
    flex: 1
  },
  imageContainer:{
    margin: 2,
    marginTop: 10,
    marginBottom: 30,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  imageTitle: {
    textAlign: 'left',
    color: theme.midgrey,
    margin: 20,
    marginTop: 15,
    marginBottom: 7,
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '600'
  },
  imageTitleWrap: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flex: 1,
    marginTop: 5
  },
  checkInButton: {
    position:'absolute',
    right: 20,
    justifyContent: 'center',
    top: IOS ? -51 : 70,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    zIndex:99,
    borderRadius: 40,
    padding: 10,
    width: 80,
    height: 80,
    backgroundColor: theme.secondary
  }
});

const EventDetail = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
  },

  getInitialState () {
      return {
        springAnim: new Animated.Value(0),
        checked: false,
      };
    },

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  },

  onPressBack() {
    this.props.navigator.pop();
  },

  onCheckIn() {

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      this.setState({checked: true});

      this.state.springAnim.setValue(0);
       Animated.timing(
         this.state.springAnim,
         {
           toValue: 1,
           duration: 500,
           easing: Easing.elastic(1)}
       ).start();
      this.props.checkIn(this.props.route.model.id);
    }
  },

  getEventStatus() {
    const model = this.props.route.model;

    const isActive = this.isEventActive(model);
    const isLocationValid = this.isLocationValid(model);

    if (!isActive) {
      return INACTIVE;
    } else if (!isLocationValid) {
      return UNAVAILABLE;
    } else if (this.state.checked) {
      return CHECKED;
    } else {
      return AVAILABLE;
    }
  },

  isEventActive(event) {
    const currentTime = moment();
    return (moment(event.startTime).isBefore(currentTime) && moment(event.endTime).isAfter(currentTime));
  },

  isLocationValid(event) {
    const { userLocation } = this.props;

    if ( userLocation && event.location ) {
      const distance = locationService.getDiscanceInMeters(userLocation, event.location);
      const isLocationValid = event.radius > distance;
      return isLocationValid
    }
    return false;
  },


  getText(status) {
    switch (status) {
      case AVAILABLE:
        return <Text style={styles.buttonText}>CHECK IN</Text>;
      case INACTIVE:
        return <Text style={styles.buttonText}>NOT ONGOING</Text>;
      case CHECKED:
        return <Icon size={50} name={IOS ? 'ios-checkmark' : 'md-checkmark'} style={styles.icon}/>;
      case UNAVAILABLE:
        return <Text style={styles.buttonText}>GET CLOSER</Text>;
    }
  },

  renderCheckinButton() {
    const eventStatus = this.getEventStatus();
    const active = this.state.springAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 1.2, 1]
    });
    return (
      <TouchableWithoutFeedback disabled={eventStatus !== AVAILABLE} onPress={() => this.onCheckIn()}>
        <Animated.View style={[styles.checkInButton, {
          opacity: eventStatus === AVAILABLE ? 1 : 0.9,
          transform: [{scale: active}],
        }]}>
          {this.getText(eventStatus)}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  },

  render: function() {
    const { model, currentDistance } = this.props.route;
    const timepoint = time.formatEventTime(model.startTime, model.endTime, { formatLong: true });
    const wrapperStyleAdd = {
      paddingTop: 0
    };

    const coverImage =  model.coverImage;
    const eventGeoUrl = locationService.getGeoUrl(model);

    return <View style={[styles.wrapper, wrapperStyleAdd]}>
      {!IOS ?
      <Toolbar title={moment(model.startTime).format('ddd D.M.')} navigator={this.props.navigator} /> : null}


      <ParallaxView
          backgroundSource={coverImage ? {uri: coverImage} : placholderImage}
          windowHeight={300}
          style={{backgroundColor: theme.white}}
          header={(
            <View style={{ flex:1, elevation: 3 }}>
              <LinearGradient
                locations={[0,0.6,0.9]}
                colors={['transparent', 'rgba(0,0,0,.1)', 'rgba(0,58,111,.4)']}
                style={styles.gridListItemImgColorLayer}>
                <Text style={styles.header}>
                    {model.name}
                </Text>
                {/*!IOS && this.renderCheckinButton()*/}
              </LinearGradient>
            </View>
          )}
      >
        <View style={styles.eventContent}>
          {/* IOS && this.renderCheckinButton() */}
          <View style={styles.gridListItemMetaWrap}>

            <View style={styles.gridListItemMeta}>
              <View style={styles.gridListItemMeta__block}>
                <Text style={styles.gridListItemLeftIcon}><MaterialIcon style={styles.gridListItemIcon} name='access-time'/> </Text>
              </View>

              <View style={[styles.gridListItemMeta__block, {alignItems: 'flex-start'}]}>
                <Text style={styles.gridListItemMetaInfo__title}>Time</Text>
                <Text style={styles.gridListItemPlace}>{timepoint.time} - {timepoint.endTime}</Text>
              </View>
            </View>

            <TouchableHighlight underlayColor={'#eee'}
              onPress={() => eventGeoUrl ? Linking.openURL(eventGeoUrl) : console.log('Event has no Map URL')}>
              <View style={styles.gridListItemMeta}>
                <View style={styles.gridListItemMeta__block}>
                  <Text style={styles.gridListItemLeftIcon}><MaterialIcon style={styles.gridListItemIcon} name='location-on'/> </Text>
                </View>

                <View style={[styles.gridListItemMeta__block, {alignItems: 'flex-start'}]}>
                <Text style={styles.gridListItemMetaInfo__title}>Location</Text>
                  <Text style={styles.gridListItemPlace}>{model.locationName}</Text>
                </View>
              </View>
            </TouchableHighlight>


            {currentDistance !== '' && currentDistance &&
            <View style={styles.gridListItemMeta}>
              <View style={styles.gridListItemMeta__block}>
                <Text style={styles.gridListItemLeftIcon}><MaterialIcon style={styles.gridListItemIcon} name='redo'/> </Text>
              </View>

              <View style={[styles.gridListItemMeta__block, {alignItems: 'flex-start'}]}>
                <Text style={styles.gridListItemMetaInfo__title}>Distance from you</Text>
                <Text style={styles.gridListItemMetaInfo}>{currentDistance}</Text>
              </View>
            </View>
            }

            {!!model.fbEventId && <PlatformTouchable
                activeOpacity={0.6} delayPressIn={1}
                underlayColor={'#eee'}
                onPress={() =>
                  Linking.openURL(`https://www.facebook.com/${ model.fbEventId }`)}
                >
                  <View style={styles.gridListItemMeta}>
                    <View style={styles.gridListItemMeta__block}>
                      <Text style={[styles.gridListItemLeftIcon, {paddingLeft: 3}]}>
                        <Icon style={styles.detailEventInfoIcon} name='logo-facebook' />
                      </Text>
                    </View>

                    <View style={[styles.gridListItemMeta__block, {alignItems: 'flex-start'}]}>
                      <Text style={styles.detailEventInfoAttending}>
                        {model.attendingCount
                          ? `${model.attendingCount} ${model.attendingCount ? 'attending' : null}`
                          : 'Facebook page'
                        }
                      </Text>
                    </View>
                  </View>
                </PlatformTouchable>
              }
          </View>

          <View style={styles.content}>
            <Text style={styles.detailEventDescription}>{model.description}</Text>
          </View>
          {!!eventGeoUrl &&
          <View style={styles.navigationButtonWrapper}>
            <Button style={{ borderRadius: 0, backgroundColor: theme.blue2 }} onPress={() => Linking.openURL(eventGeoUrl)}>Show Directions</Button>
          </View>
          }

          {this.props.images.size > 0 &&
            <View>
              <View style={styles.imageTitleWrap}>
                <Text style={styles.imageTitle}>Event images</Text>
              </View>
              <View style={styles.imageContainer}>
                {this.props.images.map(image => {
                  if (image.get('type') === 'IMAGE') {
                  return <View key={image.get('id')}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.props.openLightBox(image.get('id'))}
                    >
                    <Image
                      key={image.get('id')}
                      style={{height: width / 3 - 8, width: width / 3 - 8, margin: 3}}
                      source={{uri: image.get('url')}}/>
                    </TouchableOpacity>
                    </View>;
                  }}
                )}
              </View>
            </View>
          }
        </View>
      </ParallaxView>
      <Notification visible={this.props.isNotificationVisible}>
        {this.props.notificationText}
      </Notification>
    </View>
  }

});

const mapDispatchToProps = { checkIn, openLightBox, openRegistrationView };


const select = store => {

  const isRegistrationInfoValid = store.registration.get('name') !== '' &&
    store.registration.get('selectedTeam') > 0;

  return {
    userLocation: store.location.get('currentLocation'),
    images: store.event.get('images'),
    isRegistrationInfoValid,
    isNotificationVisible: store.competition.get('isNotificationVisible'),
    notificationText: store.competition.get('notificationText')
  }
};


export default connect(select, mapDispatchToProps)(EventDetail);
