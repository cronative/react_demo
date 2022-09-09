import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const checkAndGetLocation = () => {
    check(Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    }))
    .then((result) => {
    switch (result) {
        case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
        case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
        case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        case RESULTS.GRANTED:
            console.log('The permission is granted');
            getLocationWhenGranted();
            break;
        case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            askPermissionAndGetLocation();
            break;
    }
    })
    .catch((error) => {
    console.log(error)
    });
}



  const getLocationWhenGranted = () => {
    Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    }).then(location => {
        console.log('COORDINATES=============================: ', location);
        // setCoordinates(location);
        setLatitude(location.latitude);
        setLongitude(location.longitude);
    })
    .catch(error => {
        const {code, message} = error;
        console.log("LOCATION ERROR:", code, message);
    })
  }

  const askPermissionAndGetLocation = () => {
    try {
        request(
            Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            })
        ).then(res => {
            if (res == "granted") {
                Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                }).then(location => {
                    console.log('COORDINATES=============================: ', location);
                    // setCoordinates(location);
                    setLatitude(location.latitude);
                    setLongitude(location.longitude);
                })
                .catch(err => {
                    const {code, message} = error;
                    console.log("LOCATION ERROR:", code, message);
                })
            } else {
            console.log("Location is not enabled");
            }
        });
        } catch (error) {
        console.log("location set error:", error);
        }
  }