import React, { Fragment, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Container, List, ListItem, Body, Left } from 'native-base';
import { Button } from 'react-native-elements';
import {
  OnboardingNotification,
  CheckedIconActive,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import PhoneFream from '../../assets/images/signup/phone-fream.png';
import { useDispatch } from 'react-redux';
import { setNavigationValue } from '../../store/actions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import { Post, Put } from '../../api/apiAgent';
import postFCMToken from '../../utility/postFCMToken';

const SignupNotifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (value) => {
    skipBtnHanler();
    let userType = await AsyncStorage.getItem('userType');
    console.log('rajjo', JSON.stringify(userType, null, 2));
    dispatch({ type: 'USER_TYPE_STATUS', status: userType });
    let categoriesIds, deviceCordinets, deviceLatitude, deviceLongitude;
    try {
      categoriesIds = await AsyncStorage.getItem('categoryIds');
      deviceCordinets = await AsyncStorage.getItem('device_cordinets');
    } catch (error) { }

    if (deviceCordinets) {
      let deviceCordinetsContent = JSON.parse(deviceCordinets);
      deviceLatitude = deviceCordinetsContent.latitude;
      deviceLongitude = deviceCordinetsContent.longitude;
    }
    if (categoriesIds) {
      categoriesIds = categoriesIds.substring(1, categoriesIds.length - 1);
    }
    const payload = {
      // categories: categoriesIds || '',
      allowNotification: value,
      latitude: deviceLatitude || '25.79065',
      longitude: deviceLongitude || '-80.13005',
    };
    if (categoriesIds) {
      payload.categories = categoriesIds;
    }
    // console.log(payload);
    additionalInfoApi(payload);

    if (value === 1) {
      postFCMToken();
    }
    // if (categoriesIds && deviceLatitude && deviceLongitude) {
    //   additionalInfoApi(payload);
    // } else {
    //   console.log('something went wrong');
    //   // global.showToast(
    //   //   additionalInfo.message || additionalInfo.error,
    //   //   false,
    //   // );
    // }
  };

  const checkApplicationPermission = async () => {
    skipBtnHanler();
    try {
      const authorizationStatus = await messaging().requestPermission();
      if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
        console.log('User has notification permissions enabled.');
        onSubmitHandler(1);
      } else if (
        authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
      ) {
        console.log('User has provisional notification permissions.');
        onSubmitHandler(1);
      } else {
        console.log('User has notification permissions disabled');
        onSubmitHandler(0);
      }
    } catch (error) {
      global.showToast(error, 'err');
    }
  };

  const skipBtnHanler = () => {
    console.log('***');
    // setLoader(true);
    Put('user/skip-step', { notifications: '1' })
      .then((result) => {
        // setLoader(false);
        console.log('result is **', result);
        // navigation.navigate('SignupGeolocation')
        // navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
      })
      .catch((error) => {
        console.log('error', error);
        // setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  // const checkApplicationPermission = () => {
  //   const requestNotificationPermission = async () => {
  //     if (Platform.OS === 'ios') {
  //       onSubmitHandler(1);
  //     } else {
  //       try {
  //         const granted = await PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.RECEIVE_WAP_PUSH,
  //           {
  //             title: 'Readyhubb Would Like to Send You Notifications',
  //             message:
  //               'Notification mau include alerts, sounds and icon badges. These can be configured in Settings',
  //           },
  //         );
  //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //           onSubmitHandler(1);
  //         } else {
  //           onSubmitHandler(0);
  //         }
  //       } catch (err) {
  //         console.warn(err);
  //       }
  //     }
  //   };
  //   requestNotificationPermission();
  //   // return () => {
  //   //   Geolocation.clearWatch(watchID);
  //   // };
  // };

  const additionalInfoApi = async (payload) => {
    setLoading(true);
    Post('user/additional-info', payload)
      .then((result) => {
        setLoading(false);
        if (result.status === 201) {
          // global.showToast(result.message, 'success');
          dispatch(setNavigationValue(4));
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoading(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loading ? <ActivityLoader /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={commonStyle.signupNotification}>
          <View style={commonStyle.geolocationNotifications}>
            <ImageBackground
              source={PhoneFream}
              style={commonStyle.phoneframImg}
              resizeMode={'contain'}>
              <View style={commonStyle.notificationIconUserWrap}>
                <View style={commonStyle.bellIcon}>
                  <OnboardingNotification />
                </View>
                <View style={commonStyle.notificationUserImg}>
                  <Image
                    source={require('../../assets/images/signup/notify-user-img.png')}
                  />
                </View>
              </View>

              <View
                style={[
                  commonStyle.onboardingcardwrap,
                  commonStyle.notificationCard,
                ]}>
                <View style={commonStyle.onboardingcard1}></View>
                <View style={commonStyle.onboardingcard2}></View>
                <View style={commonStyle.onboardingcard3}>
                  <List>
                    <ListItem style={commonStyle.commListitem}>
                      <Left>
                        <Text style={commonStyle.textdategray}>
                          Today, 08 Mar, 2021
                        </Text>
                      </Left>
                      <TouchableOpacity style={commonStyle.paidbtn}>
                        <Text style={commonStyle.paidbtntext}>Paid</Text>
                        <CheckedIconActive />
                      </TouchableOpacity>
                    </ListItem>
                    <View style={[commonStyle.cardTextwrap]}>
                      <Text style={commonStyle.subtextblack}>Daily Makeup</Text>
                      <Text style={commonStyle.carddot}>.</Text>
                      <Text style={commonStyle.subtextblack}>100$</Text>
                    </View>
                    <View style={[commonStyle.cardTextwrap]}>
                      <Text style={commonStyle.texttimeblack}>11am-12pm</Text>
                      <Text
                        style={{
                          width: 3,
                          height: 3,
                          opacity: 0.5,
                          backgroundColor: '#393939',
                          borderRadius: 4,
                          marginHorizontal: 5,
                        }}>
                        .
                      </Text>
                      <Text style={commonStyle.textdategray}>1h</Text>
                    </View>
                  </List>
                </View>
              </View>
            </ImageBackground>
            <View style={commonStyle.phoneOverlay} />
          </View>

          <View style={commonStyle.freamContentWrap}>
            <View style={[commonStyle.geolocationCard, { borderRadius: 20 }]}>
              <Text
                style={[
                  commonStyle.subheading,
                  commonStyle.textCenter,
                  commonStyle.mb15,
                ]}>
                Turn on notifications
              </Text>
              <Text
                style={[
                  commonStyle.onboardingsubtext,
                  commonStyle.textCenter,
                  commonStyle.mb2,
                ]}>
                Don’t miss out on new promos, exclusive offers and your
                appointments.
              </Text>
              <Button
                title="Turn On"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.changePassModalbutton}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => checkApplicationPermission()}
              />
              <TouchableOpacity
                style={commonStyle.notnowbtn}
                activeOpacity={0.5}>
                <Text
                  style={commonStyle.grayTextBold}
                  onPress={() => onSubmitHandler(0)}>
                  Maybe later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default SignupNotifications;
