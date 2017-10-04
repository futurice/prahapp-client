'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { fromJS } from 'immutable';

import Text from '../common/MyText';
import { get, random} from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '../../services/analytics';
import EventDetail from '../calendar/EventDetailView';
import Loader from '../common/Loader';
import Button from '../common/Button';
import PlatformTouchable from '../common/PlatformTouchable';
import time from '../../utils/time';
import theme from '../../style/theme';
import MARKER_IMAGES, { ICONS } from '../../constants/MarkerImages';
// import MAP_STYLE from '../../constants/MapStyle';
import permissions from '../../services/android-permissions';
import location from '../../services/location';


import {
  mapViewData,

  fetchMarkers,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
} from '../../concepts/map';

const disableMap = false;
const CITY_COORDS = {
  tampere: {
    latitude: 61.4931758,
    longitude: 23.7602363,
  },
  otaniemi: {
    latitude: 60.1841396,
    longitude: 24.827895
  },
  prague: {
    latitude: 50.093277,
    longitude: 14.4376183
  }
};
const { width, height } = Dimensions.get('window');

const PLACEHOLDER_FACE_IMAGES = [
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/cbe98cb2845a0c95686eb07400ba5036bea3af4a7f9cb223db1727172113627f/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/211b6a4206550ae9954090b57e8541d914beabab57f3830f64fad9e1e294520b/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/e0ade99c12d8e10c4d46b6b73e6dfee4/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/303c39969a62dc8535de803bd1d89bbbb728c708a4d7d7c314dd74b0ede5139a/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/3f9508f987e1e96f4ce74b3fffa6d3d489cb0e199c73f8ffc78e4e270be26437/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/da04161761cbe3dd9ee2803204be2b83d5d56bcd125f247ab827af9f159976a5/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/da04161761cbe3dd9ee2803204be2b83d5d56bcd125f247ab827af9f159976a5/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/33f7981a2fc934b7a20eda0b76b813cce78a99225224906c8b53677e668b3b9c/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/33f7981a2fc934b7a20eda0b76b813cce78a99225224906c8b53677e668b3b9c/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/33f7981a2fc934b7a20eda0b76b813cce78a99225224906c8b53677e668b3b9c/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/da8c59a354411894526f668dd9becd8aae3e360d08f20581b5913defebd1eb57/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/dce27e1a07914e1ad5d329bd8fa019880b26f5f0b6debe9580f4026bc0dbf866/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/472a1f5631d616323c61a058d778d0cf97eec9779bae1b2d1bfde56ffbcf9c8e/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/4389af968efc6cfec108637eafa4ab84/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/d18f229be70ec871e05b53587567054612ccc68d9b8bb0f636c501460f40330c/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/eed54e63dcfa9a86bb1df0bcedf42fa925b2ba932ed961cc6a8944782d17c5e0/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/cc552e32fa5f2d6838e55c18f86b9523ca2a91feffc8b15ab62b674da0ce9061/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/1f5165d96f74095ff2b216814a81c8b6b1d9a003e97a7dc8f63ef798a07d8bc3/80',
  'https://d2cxspbh1aoie1.cloudfront.net/avatars/local/58ddac442c6d1ee6016d047f81842060666a99619f4305ea87bda2cc4c41bbcc/80'
];

const calloutHeight = 140;

const IOS = Platform.OS === 'ios';
const VIEW_NAME = 'EventMap';

class EventMap extends Component {

  constructor(props) {
    super(props);

    this.state = { calloutAnimation: new Animated.Value(0) };
  }

  componentDidMount() {
    this.props.fetchMarkers();
    analytics.viewOpened(VIEW_NAME);
  }

  componentWillReceiveProps(nextProps) {
    const { currentCity, selectedMarker } = this.props;

    // Animate map when city is changed
    if (currentCity && currentCity !== nextProps.currentCity) {
      const cityCoords = this.getCityCoords(nextProps.currentCity);
      this.map.animateToCoordinate(cityCoords, 1);
    }

    // Custom callout animation
    if (!selectedMarker && nextProps.selectedMarker) {
      this.animateCallout(true);
    } else if (selectedMarker && !nextProps.selectedMarker) {
      this.animateCallout(false);
    }
  }

  @autobind
  onEventMarkerPress(event) {
    this.props.navigator.push({
      component: EventDetail,
      name: event.name,
      model: event,
      disableTopPadding: true
    });
  }

  getCityRegion(city) {
    const deltaSettings = {
      latitudeDelta: 0.025,
      longitudeDelta: 0.025
    };
   const cityCoords = this.getCityCoords(city);
   return Object.assign(deltaSettings, cityCoords);
  }

  @autobind
  getCityCoords(city) {
   return CITY_COORDS.tampere
  }

  @autobind
  onLocatePress() {
    if (IOS) {
      this.props.toggleLocateMe();
    } else {
      permissions.requestLocationPermission(this.props.toggleLocateMe);
    }
  }

  renderDisabledMapAnnouncement(event) {
    return (<View style={styles.emptyWrap}>
      <View style={styles.emptyIconWrap}>
        <MDIcon name="nature-people" style={styles.emptyIcon} />
      </View>
      <View style={styles.emptyContent}>
        <Text style={styles.emptyTitle}>Oh noes!</Text>
        <Text style={styles.emptyText}>Event Map is not currently supported on your device. Be safe out there.</Text>
      </View>
    </View>);
  }

  renderEventMarker(event) {
    return <MapView.Callout onPress={() => this.onEventMarkerPress(event)} style={{ flex: 1, position: 'relative' }}>
      <TouchableHighlight
        underlayColor='transparent'
        style={styles.calloutTouchable}
      >
        <View style={styles.callout}>
          <View>
            <View style={styles.calloutTitleWrap}>
              <Text style={styles.calloutTitle}>{event.name}</Text>
              <Icon style={styles.calloutIcon} name='ios-arrow-forward' />
            </View>
            <Text style={[styles.calloutInfo,{color:'#aaa', marginBottom:10}]}>
              {time.getEventDay(event.startTime)}
            </Text>
            <Text style={styles.calloutInfo}>{event.locationName}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </MapView.Callout>;
  }

  @autobind
  animateCallout(show) {
    Animated.timing(this.state.calloutAnimation, { toValue: show ? 1 : 0, duration: 300 }).start();
  }

  renderCloseLayer(location) {
    if (!location) {
      return null;
    }

    return (
      <View style={styles.customCalloutCloseLayer}>
        <TouchableWithoutFeedback delayPressIn={0} onPress={this.onClosemarker}>
          <View style={{flex: 1 }}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  renderCustomCallout(location) {

    // if (!location) {
    //   return null;
    // }

    let calloutProps = {};
    if (location && location.get('url')) {
      calloutProps = {
        onPress: () => Linking.openURL(location.get('url'))
      }
    }

    const calloutAnimationStyles = {
      opacity: this.state.calloutAnimation,
      top: this.state.calloutAnimation.interpolate({ inputRange: [0, 1], outputRange: [calloutHeight, 0] }),
      height: this.state.calloutAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, calloutHeight] }),
      // transform: [
      //   { translateY: this.state.calloutAnimation.interpolate({ inputRange: [0, 1], outputRange: [300, 0] })
      // }]
    };

    return (
      <Animated.View style={[styles.customCallout, calloutAnimationStyles]}>
        {location && <TouchableHighlight
          underlayColor='transparent'
          style={styles.calloutTouchable}
          {...calloutProps}
        >
          <View style={styles.callout}>
            {
              location && location.get('type') === 'OFFICE'
                ? this.renderMarkerCalloutContent(location)
                : this.renderPostCalloutContent(location)
            }
          </View>
        </TouchableHighlight>
        }
      </Animated.View>
    );
  }

  renderPostCalloutContent(location) {
    return (
      <View style={styles.calloutContent}>
        <View style={styles.calloutImage}>
          <Image
            style={styles.postImage}
            source={{ uri: location.get('url') }}
          />
        </View>
        <View style={styles.postInfo} >
          <Text style={styles.postAuthorName}>{location.getIn(['author','name'])}</Text>
          <Text style={styles.postTextMessage}>{location.get('text')}</Text>
          <Text style={styles.postDate}>{time.getTimeAgo(location.getIn(['createdAt']))} ago</Text>
        </View>
      </View>);
  }

  renderMarkerCalloutContent(location) {
    return  (
      <View style={styles.calloutContent}>
        <View style={styles.calloutImage}>
          <Image
            style={styles.postImage}
            source={{ uri: location.get('imageUrl') }}
          />
        </View>
        <View style={styles.postInfo}>
          <Text style={styles.postAuthorName}>{location.get('title')}</Text>
          <Text style={styles.postTextMessage}>{location.get('subtitle')}</Text>
          <Button style={styles.calloutButton}><MDIcon name="directions" /> Directions</Button>
        </View>
      </View>
    );
  }

  @autobind
  renderCheckIn() {
    const isCheckInAvailable = false;
    return (
      <View style={styles.checkIn}>
        <TouchableOpacity
          onPress={this.onCheckInPress}
          style={styles.checkInButton}
        >
          <MDIcon
            name="add-location"
            style={styles.checkInButtonText}
          />
        </TouchableOpacity>
      </View>
      );
  }

  renderLocateMe() {
    return (
      <View style={styles.locateButton}>
        <TouchableOpacity onPress={this.onLocatePress} style={styles.locateButtonText}>
          <MDIcon size={20} style={{ color: this.props.locateMe ? theme.secondary : '#aaa' }} name='navigation' />
        </TouchableOpacity>
      </View>
    );
  }

  onCheckInPress() {
    location.getLocation((position) => {
      console.log(position);
      alert(`Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`)
    });
  }

  maybeRenderLoading() {
    if (this.props.loading) {
      return <View style={styles.loaderContainer}>
        <Loader color={theme.secondary} />
      </View>;
    }

    return false;
  }

  @autobind
  onSelectMarker(marker) {
    const { selectMarker } = this.props;

    selectMarker(marker);
    this.map.animateToCoordinate(marker.location);
  }

  @autobind
  onClosemarker() {
    this.props.selectMarker(null);
  }

  @autobind
  onCategorySelect(category) {
    const { categories, visiblemarkerCoords } = this.props;
    const index = categories.findIndex(c => c === category);

    const total = categories.size;

    // TODO Find correct scrollTo position
    //  If clicked item is not completely visible, scroll view to make it visible
    //  Last item gives an error regarding to getItemLayout,
    //  using scrollToEnd for last index works correctly
    if (total > index + 1) {
      this.categoryScroll.scrollToIndex({ viewPosition: 0.5, index });
    } else {
      this.categoryScroll.scrollToEnd();
    }

    this.props.selectCategory(category)
      .then(this.fitMarkersToMap);
  }

  @autobind
  fitMarkersToMap() {
    const { visiblemarkerCoords } = this.props;
    if (this.map && visiblemarkerCoords && visiblemarkerCoords.length) {
      const padding = visiblemarkerCoords.length <= 2 ? 60 : 30;
      const edgePadding = { top: padding, bottom: padding, left: padding, right: padding };
      this.map.fitToCoordinates(visiblemarkerCoords, { edgePadding }, false)
    }
  }

  @autobind
  renderMarkerFilterButton({ item }) {
    const { selectedCategory, selectCategory } = this.props;
    return (
      <PlatformTouchable
        key={item}
        onPress={() => this.onCategorySelect(item)}
      >
        <View style={[styles.markerFilterButton, item === selectedCategory ? styles.activeButton : {}]}>
          <Text style={[styles.markerFilterButtonText, item === selectedCategory ? styles.activeButtonText : {}]}>{item}</Text>
        </View>
      </PlatformTouchable>
    )
  }

  renderMarkerFilter() {
    // const { categories } = this.props;
    // const categories = fromJS(['HELSINKI', 'TAMMERFORCE', 'LONDON', 'AVALON', 'MUNICH', 'BERLIN']);
    const { categories } = this.props;
    const keyExtractor = (item, index) => item;
    return (
      <View style={styles.markerNavigation}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.markerNavigationScroll}
          ref={ref => this.categoryScroll = ref}
          renderItem={this.renderMarkerFilterButton}
          keyExtractor={keyExtractor}
          data={categories.toJS()}
        />
      </View>
    )
  }

  getMarker(marker, selectedMarker) {
    if (marker && marker.type === 'HOTEL') {
      return MARKER_IMAGES['HOME']
    }
    if (marker && marker.type === 'OFFICE') {
      return MARKER_IMAGES['FUTU']
    }
    if (marker && marker.type === 'FUTUCAMP') {
      return MARKER_IMAGES['FUTUCAMP']
    }

    return { uri: get(marker, ['author', 'profilePicture']) };
    // return { uri: PLACEHOLDER_FACE_IMAGES[random(PLACEHOLDER_FACE_IMAGES.length - 1)] };
    // return MARKER_IMAGES[selectedMarker && marker.title === selectedMarker.get('title') ? 'SELECTED' : 'DEFAULT']
  }

  render() {
    const { mapMarkers, firstFutureEvent, selectedMarker } = this.props;
    const markersJS = mapMarkers.toJS();

    const markers = markersJS.map((location, index) => {
      const isSelectedMarker = selectedMarker && location.id === selectedMarker.get('id');
      return <MapView.Marker
        centerOffset={{ x: 0, y: 0 }}
        anchor={{ x: 0.5, y: 0.5 }}
        key={index}
        coordinate={location.location}
        onPress={() => this.onSelectMarker(location)}
        style={isSelectedMarker ? { zIndex: markersJS.length + 1, transform: [{ scale: 1.2 }] } : { zIndex: parseInt(location.id) }}
      >
        <View style={styles.avatarMarker}>
          {/*index === 0 &&
          <View style={{ position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.secondary, width: 14, height: 14, borderRadius: 7, top: -3, right: -3, zIndex: 2 }}>
            <MDIcon name="whatshot" style={{ color: theme.white, fontSize: 10, backgroundColor: theme.transparent }} />
          </View>
          */}
          <Image
            style={styles.avatarMarkerImage}
            source={this.getMarker(location, selectedMarker)}
          />
        </View>
      </MapView.Marker>;
    });

    if (disableMap){
      return ( this.renderDisabledMapAnnouncement(firstFutureEvent) );
    }

    const initialRegion = this.getCityRegion();

    return (
      <View style={{ flex:1 }}>
        {this.renderMarkerFilter()}
        <View style={styles.mapWrap}>
          <View style={{ flex:1 }}>
            <MapView
              style={styles.map}
              initialRegion={initialRegion}
              showsUserLocation={this.props.locateMe}
              showsPointsOfInterest={true}
              showsBuildings={true}
              showsIndoors={false}
              rotateEnabled={false}
              ref={(map) => { this.map = map; }}
              // customMapStyle={MAP_STYLE} // TODO IOS Support
              // https://github.com/airbnb/react-native-maps#customizing-the-map-style
              // provider={PROVIDER_GOOGLE}
            >
              {markers}
            </MapView>
          </View>

          {this.maybeRenderLoading()}

          {this.renderCheckIn()}
          {this.renderLocateMe()}

          {this.renderCustomCallout(selectedMarker)}
          {/*this.renderCloseLayer(selectedMarker)*/}
        </View>
      </View>
    );
  }


}

EventMap.propTypes = {
  navigator: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  markers: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
    // alignItems: 'center',
  },
  mapWrap: {
    flexGrow: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  avatarMarker: {
    width: 30,
    height: 30,
    elevation: 3,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,


    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  avatarMarkerImage: {
    width: 26,
    height: 26,
    borderRadius: 13
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  customCalloutCloseLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  customCallout: {
    zIndex: 3,
    width: width,
    position: 'relative',
    left: 0,
    bottom: 0,
    height: calloutHeight,
    backgroundColor: theme.white,
    // borderRadius: 3,
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOpacity: 0.25,
    // shadowRadius: 1,
    // shadowOffset: {
    //   height: 1,
    //   width: 0
    // },
  },
  callout: {
    flexGrow: 1,
    flex: 1,
    flexDirection:'row',
    overflow: 'hidden'
  },
  calloutTouchable: {
    padding: 0,
    // flex: 1,
    flexGrow: 1,
  },
  calloutImageWrap: {
    width: 120,
    height: height / 4,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutImageIcon: {
    fontSize: 50,
    color: theme.blue1
  },
  calloutImage: {
    width: 120,
    height: height / 4,
    backgroundColor: theme.white,
  },
  calloutContent: {
    flex: 1,
    padding: 15,
    paddingBottom: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  calloutTitleWrap: {
    // flex: 1,
    flexDirection:'row',
  },
  calloutImage: {
    width: 110,
  },
  postImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  },
  postInfo: {
    flex: 1,
    marginLeft: 20,
    maxWidth: width - 130 - 0,
  },
  postAuthorName: {
    fontWeight: '500',
    color: theme.primary,
    fontSize: 14,
    paddingBottom: 8
  },
  postTextMessage: {
    marginTop: 10,
    fontSize: 12,
    color: theme.dark,
    backgroundColor: theme.transparent
  },
  postDate: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    backgroundColor: theme.transparent
  },
  calloutButton: {
    marginTop: 15,
    height: 33,
  },
  calloutTitle: {
    fontWeight: '500',
    color: theme.dark,
    fontSize: 14,
    paddingBottom: 8
  },
  calloutInfo: {
    fontSize: 12,
    color: '#888',
    backgroundColor: theme.transparent
  },
  calloutIcon:{
    top: IOS ? 0 : 2,
    fontSize:14,
    color:theme.primary
  },
  checkIn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },

    bottom: 26,
    left: (width / 2) - 28,
    borderRadius: 28,
    height: 56,
    width: 56
  },
  checkInButton: {
    padding: 0,
  },
  checkInButtonText: {
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: theme.transparent,
    color: theme.secondary
  },
  locateButton:{
    backgroundColor: 'rgba(255,255,255,.99)',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 5,
      width: 0
    },
    elevation: 2,
    borderRadius: 20,
    justifyContent: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40
  },
  locateButtonText:{
    backgroundColor: 'transparent',
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    transform: [{ rotate: '0deg' }],
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD'
  },
  emptyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    color: '#bbb',
    fontSize: 100
  },
  emptyContent: {
    paddingTop: 10,
    paddingBottom: 15,
    padding: 50,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 30,
    textAlign: 'center',
    color:'#666'
  },
  emptyText: {
    textAlign: 'center',
    color:'#999'
  },

  markerNavigation: {
    height: 52,
    zIndex: 10,
    justifyContent: 'flex-start',
    backgroundColor: theme.white,
    elevation: 2
  },
  markerNavigationScroll: {
    flex: 1
  },
  markerFilter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'stretch',
    height: 52,
  },
  markerFilterButton: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    borderBottomWidth: 2,
    borderBottomColor: theme.white,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.blue2,
  },
  activeButtonText: {
    color: theme.blue2
  },
  markerFilterButtonText: {
    paddingTop: 2,
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.midgrey,
  },
  markerFilterIcon: {
    color: theme.grey2,
    fontSize: 28,
  }
});

const mapDispatchToProps = {
  fetchMarkers,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
};

export default connect(mapViewData, mapDispatchToProps)(EventMap);
