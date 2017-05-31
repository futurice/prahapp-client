import { PermissionsAndroid } from 'react-native';

async function requestLocationPermission(cb) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Futubohemia Location Permission',
        'message': 'Futubohemia needs access to location ' +
                   'to serve best possible experience.'
      }
    )
    if (granted) {
      console.log("You can use the Location")
      cb();
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

async function requestCameraPermission(cb) {
  try {
    const grantCamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Futubohemia Camera Permission',
        'message': 'Futubohemia needs access to camera ' +
                   'to post images to feed.'
      }
    );

    const grantWrite = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Futubohemia Storage Permission',
        'message': 'Futubohemia needs access to storage ' +
        'to post images to feed.'
      }
    );

    if (grantCamera && grantWrite) {
      console.log("You can use the Camera and storage")
      cb();
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default {
  requestLocationPermission,
  requestCameraPermission
}
