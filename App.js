import React, {useState, useEffect, Fragment, useLayoutEffect} from 'react';
import {View, Text, LogBox} from 'react-native';
import {Navigations} from './src/navigation/index';
import {StyleSheet} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import store from './src/store';
import AnimatedSplash from 'react-native-animated-splash-screen';
import httpIntercepter from './src/utility/httpIntercepter';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {setNavigationValue} from './src/store/actions';
import PushNotification, {Importance} from 'react-native-push-notification';
// import configurePushNotifications from './src/utility/configurePushNotifications';
httpIntercepter.setupInterceptors(store);
import messaging from '@react-native-firebase/messaging';
import createNotificationChannel from './src/utility/createNotificationChannel';
import base64 from 'react-native-base64';
import {profileLinkSuccess} from './src/store/actions/authActions';
import AfterLoginProfessionalStack from './src/navigation/StackNavigation/AfterLoginProfessionalStack';

const App = () => {
  LogBox.ignoreAllLogs(); // to ignore all yellow box warnings
  // Declare dispatxh variable
  const dispatch = useDispatch();
  const [isLoaded, setisLoaded] = useState(true);
  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );

  // const [shouldNavigate, setShouldNavigate] = useState(null);
  // const getNavigationRoute = async () => {
  //   const res = await AsyncStorage.getItem('shouldNavigate');
  //   setShouldNavigate(res);
  // };

  // useLayoutEffect(() => {
  //   getNavigationRoute();
  // }, []);

  //For listening to foreground messages
  useEffect(() => {
    //creating the channel for local notifications
    createNotificationChannel();
    // setting up listener for local notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));

      const notification = remoteMessage.notification;
      console.log('notification object', notification);

      PushNotification.localNotification({
        channelId: 'channel-id',
        title: notification.title,
        message: notification.body,
      });
    });

    return unsubscribe;
  }, []);

  // This function is to handle firebase dynamics link
  //Start Change: Snehasish Das Issues #1027, #1028
  const handleDynamicLink = async (link) => {
    console.log('Dynamic Link Received: ', link);
    let linkString = link.url;
    if (linkString.includes('?reflCode=') === true) {
      let index = linkString.indexOf('?reflCode=');
      let refCode = linkString.substr(index + 10, 85);
      if (refCode != null || refCode != '') {
        let type = 'pro';
        clearAuthDetails(refCode, type);
      }
    } else if (linkString.includes('?refCode=') === true) {
      let index = linkString.indexOf('?refCode=');
      let refCode = linkString.substr(index + 10, 85);
      if (refCode != null || refCode != '') {
        let type = 'client';
        clearAuthDetails(refCode, type);
      }
    } else if (linkString.includes('?proProfile=')) {
      try {
        let index = linkString.indexOf('?proProfile=');
        let profileCode = linkString.substr(index + 12);
        console.log(
          'Got profile code: ',
          base64.decode(decodeURIComponent(profileCode)),
        );
        let proId = base64.decode(decodeURIComponent(profileCode));
        if (navigationValue === 1) {
          console.log('Not logged in');
          await AsyncStorage.setItem('isCompleteOnboarding', '1');
          await AsyncStorage.setItem('isClickedExplore', '1');
          dispatch(setNavigationValue(4));
          dispatch(profileLinkSuccess(proId));
        } else {
          dispatch(profileLinkSuccess(proId));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);

    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        handleDynamicLink(link);
      });

    // configurePushNotifications();

    return () => unsubscribe();
  }, []);
  //End Change: Snehasish Das Issues #1027, #1028

  // This function is for clear the auth details
  const clearAuthDetails = (refCode, accountType) => {
    AsyncStorage.removeItem('accessToken', () => {
      AsyncStorage.removeItem('refreshToken', () => {
        AsyncStorage.removeItem('email', () => {
          AsyncStorage.removeItem('fullName', () => {
            AsyncStorage.removeItem('userType', () => {
              AsyncStorage.removeItem('image', () => {
                AsyncStorage.removeItem('isValidForLogin', () => {
                  AsyncStorage.removeItem('callingCode', () => {
                    AsyncStorage.removeItem('phone', () => {
                      AsyncStorage.removeItem('userId', () => {
                        dispatch({type: 'PROFILE_REDUCER_CLEAR'});
                        dispatch({type: 'ADDITIONAL_REDUCER_CLEAR'});
                        dispatch({type: 'AUTH_REDUCER_CLEAR'});
                        dispatch({type: 'BOOKING_REDUCER_CLEAR'});
                        dispatch({type: 'CAT_LIST_REDUCER_CLEAR'});
                        dispatch({type: 'CLIENT_PROFILE_REDUCER_CLEAR'});
                        dispatch({type: 'CLIENT_LIST_REDUCER_CLEAR'});
                        dispatch({type: 'CMS_PAGE_REDUCER_CLEAR'});
                        dispatch({type: 'FAQ_REDUCER_CLEAR'});
                        dispatch({
                          type: 'PROFESSIONAL_LIST_BY_CAT_REDUCER_CLEAR',
                        });
                        dispatch({
                          type: 'PROFESSIONAL_PROFILE_DETAILS_REDUCER_CLEAR',
                        });
                        dispatch({
                          type: 'PROFESSIONAL_PROFILE_SETUP_REDUCER_CLEAR',
                        });
                        dispatch({
                          type: 'PROFESSIONAL_SETTING_STEP_REDUCER_CLEAR',
                        });
                        dispatch({type: 'PROFILE_REDUCER_CLEAR'});
                        dispatch({type: 'REVIEW_REDUCER_CLEAR'});
                        dispatch({type: 'SIMILER_REDUCER_CLEAR'});
                        dispatch({type: 'VERIFICATION_REDUCER_CLEAR'});

                        dispatch({
                          type: 'REFERRAL_CODE_SUCCESS',
                          refflcode: refCode,
                          refflcodeType: accountType,
                        });
                        console.log('App Js Refcode : ', refCode);
                        //Start Change: Snehasish Das Issues #1027, #1028
                        dispatch(setNavigationValue(1));
                        //End Change: Snehasish Das Issues #1027, #1028
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };

  // This function is to handle the page loader
  useEffect(() => {
    setisLoaded(true);
    setTimeout(() => {
      setisLoaded(false);
    }, 2000);
  }, []);
  // const handleNavigation = () => {
  //   if (shouldNavigate) {
  //     return (
  //       <AfterLoginProfessionalStack navigationScreenName={shouldNavigate} />
  //     );
  //   }
  // };

  return (
    <Fragment>
      {isLoaded ? (
        <AnimatedSplash
          disableBackgroundImage={true}
          translucent={true}
          isLoaded={isLoaded}
          logoImage={require('./src/assets/images/splash-logo.png')}
          backgroundColor={'#F36A46'}
          logoHeight={180}
          logoWidth={180}
        />
      ) : (
        <Navigations />
      )}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </Fragment>
  );
};
const styles = StyleSheet.create({});

export default App;
