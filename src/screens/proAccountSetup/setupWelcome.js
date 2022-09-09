import React, {Fragment, useEffect, useLayoutEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  BackHandler,
  Platform,
} from 'react-native';
import {Container, List, ListItem, Body, Left} from 'native-base';
import {Button} from 'react-native-elements';
import {
  OnboardingNotification,
  CheckedIconActive,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import PhoneFream from '../../assets/images/setup-welcome-fream.png';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback} from 'react';
import {Post} from '../../api/apiAgent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import global from '../../components/commonservices/toast';
import EventEmitter from 'react-native-eventemitter';

const SetupWelcome = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   EventEmitter.on('PRO_NOT_CREATED', () => {
  //     navigation?.navigate('SetupDOB');
  //   });

  //   return () => {
  //     EventEmitter.off('PRO_NOT_CREATED');
  //   };
  // }, [navigation]);

  const setUserTypeValue = async () => {
    try {
      await AsyncStorage.setItem('userType', '0');
    } catch {}
  };

  const checkSwitchPendingTask = async () => {
    // navigation.navigate('SetupDOB');
    setLoading(true);
    Post('common/switch', '')
      .then(async (result) => {
        console.log('result', result);
        setLoading(false);
        if (result.status === 200) {
          let data = result.data;
          console.log('Switch data : ', data);
          await setUserTypeValue();
          dispatch({type: 'USER_TYPE_STATUS', status: 0});
          if (data.categories === 0 || data.location === 0) {
            dispatch({
              type: 'SET_CLIENT_LANDING_PAGE',
              value: 'SignupCategories',
            });
            dispatch({type: 'SET_NAVIGATION_VALUE', value: 2});
          } else {
            navigation.replace('Profile');
            global.showToast(
              // 'You have successfully switched your profile',
              'Account switch completed',
              'success',
            );
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (route?.params?.showBackButton) {
            checkSwitchPendingTask();
          }
          return true;
        },
      );

      return () => backHandlerdata.remove();
    }, []),
  );

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, {paddingTop: 0}]}>
        <View
          style={[
            commonStyle.skipHeaderWrap,
            {
              backgroundColor: '#ffebce',
              width: '100%',
              justifyContent: 'flex-start',
              minHeight: 30,
              paddingTop: Platform.OS === 'ios' ? 25 : 0,
            },
          ]}>
          {route?.params?.showBackButton && (
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => checkSwitchPendingTask()}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <View style={[commonStyle.signupNotification, {paddingTop: 10}]}>
            <View style={commonStyle.geolocationAvatarsWrap}>
              <Image
                source={PhoneFream}
                style={commonStyle.phoneframImg}
                resizeMode={'contain'}
              />
              <View style={commonStyle.setupWelcomeOverlay1} />
              <View style={commonStyle.setupWelcomeOverlay2} />
            </View>

            <View>
              <View style={commonStyle.geolocationCard}>
                <Text
                  style={[
                    commonStyle.subheading,
                    commonStyle.textCenter,
                    commonStyle.mb1,
                  ]}>
                  Welcome to Pro’s account setup!
                </Text>
                <Text
                  style={[
                    commonStyle.grayText16,
                    commonStyle.textCenter,
                    commonStyle.mb15,
                  ]}>
                  Fill in info about your services and list your business in 10
                  quick steps
                </Text>
                <Button
                  title="Get started!"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.changePassModalbutton}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => navigation.navigate('SetupDOB')}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </Container>
    </Fragment>
  );
};

export default SetupWelcome;
