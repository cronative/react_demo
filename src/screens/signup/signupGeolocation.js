import React, { Fragment, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from 'react-native';
import { Container } from 'native-base';
import { Button } from 'react-native-elements';
import Pulse from 'react-native-pulse';
import commonStyle from '../../assets/css/mainStyle';
import GeolocationBg from '../../assets/images/signup/signup-geolocation-bg.png';
import GetLocation from 'react-native-get-location';
import { useNavigation } from '@react-navigation/native';
import ActivityLoader from '../../components/ActivityLoader';
import { Put } from '../../api/apiAgent';

const SignupGeolocation = ({ route }) => {
  const navigation = useNavigation();
  const { lat, lng, data } = route.params || '';
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    console.log(lat);
    console.log(lng);
    if (lat && lng) {
      AsyncStorage.setItem(
        'device_cordinets',
        JSON.stringify({ latitude: lat, longitude: lng }),
      );
      navigation.navigate('SignupNotifications');
    }
  }, [lat, lng]);

  const getLocation = () => {
    skipBtnHanler()
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getCurrentLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getCurrentLocation();
          } else {
            navigation.navigate('SignupLocationSearch');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
  };


  const skipBtnHanler = () => {
    console.log('***');
    // setLoader(true);
    Put('user/skip-step', { location: '1' })
      .then((result) => {
        setLoader(false);
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

  const getCurrentLocation = () => {
    setLoader(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        console.log('location =', location);
        setLoader(false);
        AsyncStorage.setItem('device_cordinets', JSON.stringify(location));
        navigation.navigate('SignupNotifications');
      })
      .catch((error) => {
        setLoader(false);
        const { code, message } = error;
        console.warn(code, message);
        navigation.navigate('SignupLocationSearch');
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loader ? <ActivityLoader /> : null}
      <ScrollView showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={GeolocationBg}
          style={commonStyle.geolocationbg}>
          <View style={commonStyle.geolocationAvatarsWrap}>
            <Image
              style={commonStyle.geolocationAvatars}
              source={require('../../assets/images/signup/geolocation-avatars.png')}
            />

            <View style={commonStyle.grolocationPointerWrap}>
              <Pulse
                color="#ffffff"
                numPulses={4}
                diameter={100}
                speed={20}
                duration={2000}
              />
              <View style={commonStyle.grolocationPointer} />
            </View>
          </View>
          <View style={[commonStyle.freamContentWrap]}>
            <View style={[commonStyle.geolocationCard, { borderRadius: 20 }]}>
              <Text
                style={[
                  commonStyle.subheading,
                  commonStyle.textCenter,
                  commonStyle.mb15,
                ]}>
                Let’s find professionals nearby using geolocation
              </Text>
              <Text
                style={[
                  commonStyle.onboardingsubtext,
                  commonStyle.textCenter,
                  commonStyle.mb2,
                ]}>
                Security is important to us. Help the app provide the best
                experience by accessing your location
              </Text>
              <Button
                title="Allow"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.changePassModalbutton}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={getLocation}
              />
              <TouchableOpacity
                style={commonStyle.notnowbtn}
                activeOpacity={0.5}
                onPress={
                  () => navigation.navigate('SignupLocationSearch')
                  // navigation.navigate('Signup Location Search')
                }>
                <Text style={commonStyle.grayTextBold}>Not now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </Fragment>
  );
};

export default SignupGeolocation;
