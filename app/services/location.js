import { Platform } from 'react-native';
import geolib from 'geolib';
import { round, isNil, noop } from 'lodash';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import permissions from './android-permissions';

const isIOS = Platform.OS === 'ios';

function getPosition(callback = noop) {
  console.log('Get position');
  const locationOpts = {
    enableHighAccuracy: true,
    timeout: 20000, // 20 sec
    maximumAge: 1000 * 60 * 1 // 1 min
  };

  navigator.geolocation.getCurrentPosition(
    position => callback(position),
    error => console.log(error.message),
    locationOpts
  );
}

function getLocation(callback) {
  console.log('Get location');
  if (isIOS) {
    return getPosition(callback);
  }

  permissions.requestLocationPermission(() =>
    RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
    .then(data => {
      console.log('Location on:', data);
      // The user has accepted to enable the location services
      // data can be :
      //  - "already-enabled" if the location services has been already enabled
      //  - "enabled" if user has clicked on OK button in the popup

      return getPosition(callback);
    }).catch(err => {
      console.log('Location off:', err);
      // The user has not accepted to enable the location services or something went wrong during the process
      // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
      // codes : 
      //  - ERR00 : The user has clicked on Cancel button in the popup
      //  - ERR01 : If the Settings change are unavailable
      //  - ERR02 : If the popup has failed to open
    })
  );
}

function getGeoUrl(event) {
  if (isNil(event.location) || isNil(event.location.latitude) || isNil(event.location.longitude)) {
    return '';
  }

  const ZOOM_LEVEL = '18';

  var geoUrl = null;
  let {latitude, longitude} = event.location;

  if (isIOS) {
    // On iOS use Apple Maps
    geoUrl = 'http://maps.apple.com/';
    geoUrl += '?z=' + ZOOM_LEVEL;
    geoUrl += '&q=' + latitude + ',' + longitude;
  } else {
    //<lat>,<long>?q=<lat>,<long>(Label+Name)"
    geoUrl = 'geo:' + latitude + ',' + longitude + '?q=' + latitude + ',' + longitude +
      '(' + encodeURIComponent(event.locationName) + ')';
  }

  return geoUrl;
}

// jscs:disable disallowImplicitTypeConversion
function getDistance(userLocation, eventLocation) {
  if (isNil(userLocation) || isNil(eventLocation) || isNil(eventLocation.latitude) || isNil(eventLocation.longitude)) {
    return '';
  }

  const distanceInMetres = geolib.getDistance(userLocation, eventLocation);
  const distanceInKilometres = distanceInMetres / 1000;

  return '' + round(distanceInKilometres, 1) + ' km';
}

function getDiscanceInMeters(userLocation, eventLocation) {
  if (isNil(userLocation) || isNil(eventLocation) || isNil(eventLocation.latitude) || isNil(eventLocation.longitude)) {
    return '';
  }

  const distanceInMetres = geolib.getDistance(userLocation, eventLocation);

  return distanceInMetres;
}

export default {
  getLocation,
  getGeoUrl,
  getDistance,
  getDiscanceInMeters
};
