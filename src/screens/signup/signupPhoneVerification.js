import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';

import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container} from 'native-base';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import commonStyle, {Colors} from '../../assets/css/mainStyle';
import {useSelector, useDispatch} from 'react-redux';
import {otpFealdNumber} from '../../utility/commonStaticValues';
import {setNavigationValue} from '../../store/actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../../components/commonservices/toast';
import {Post} from '../../api/apiAgent';
import logo from '../../assets/images/logo.png';
import {
  EyeOpen,
  EyeClose,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';
import RNOtpVerify from 'react-native-otp-verify';
import {Button} from 'react-native-elements';

const SignupPhoneVerification = ({navigation, route}) => {
  const dispatch = useDispatch();

  const CELL_COUNT = otpFealdNumber;
  const [value, setValue] = useState('');
  const [timerTime, setTimerTime] = useState(45);
  let timerCountDownTime = 45;
  let timeCount;
  const codeFiledRef = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [loading, setLoading] = useState(false);
  const [showSkipText, setShowSkipText] = useState(false);
  const [firstSpamOtp, setFirstSpamOtp] = useState(false);
  const [skipModal, setSkipModal] = useState(false);

  // * number comming from route paramiters
  const userPhoneNumber = route.params.phoneNumber;
  const userCountryCode = route.params.countryCode;
  const phoneCode = route.params.phoneCode;

  // * Auto submit otp process start

  useEffect(() => {
    console.log(
      'route?.params?.navigatedFrom',
      JSON.stringify(route?.params?.navigatedFrom, null, 2),
    );
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash().then(console.log).catch(console.log);
      RNOtpVerify.getOtp()
        .then((p) => {
          RNOtpVerify.addListener((message) => {
            try {
              if (!!message) {
                console.log('message is', message.match(/\d+/g));
                var otp = message.match(/\d+/g)[0];
                if (!!otp) {
                  setValue(otp);
                }
              }
            } catch (error) {
              global.showToast(error.message, 'error');
            }
          });
        })
        .catch((e) => {
          global.showToast('Failed to auto read otp', 'error');
          console.log('error with auto read otp', e);
        });

      return () => {
        RNOtpVerify.removeListener();
      };
    }
  }, []);

  // * Auto submit otp process end

  useEffect(() => {
    if (value.length > otpFealdNumber - 1) {
      let valueForSubmit = {
        phoneNo: userPhoneNumber,
        otp: `${value}`,
        countryCode: `+${userCountryCode}`,
      };
      console.log('Data Payload', valueForSubmit);
      if (codeFiledRef.current && !codeFiledRef.current.isFocused()) {
        setTimeout(() => {
          mobileOtpVerification(valueForSubmit);
        }, 1000);
      }
      // mobileOtpVerification(valueForSubmit);
    }
  }, [value]);

  useEffect(() => {
    // startTimerValue();
  }, []);

  const redirectNavigation = async () => {
    try {
      if (route?.params?.navigatedFrom === 'profile') {
        navigation?.replace('Profile');
        return;
      }
      let userType = await AsyncStorage.getItem('userType');
      console.log('userType= ', userType);
      // await AsyncStorage.setItem('isValidForLogin', 'yes');
      if (route?.params?.isSocial) {
        dispatch(setNavigationValue(4));
      } else {
        userType == 1
          ? dispatch(setNavigationValue(3))
          : dispatch(setNavigationValue(2));
      }
    } catch (err) {}
  };

  const resendOTP = () => {
    resetMobileOtp();
  };

  const timerCountDown = () => {
    timerCountDownTime = timerCountDownTime - 1;
    if (timerCountDownTime === 0) {
      clearTimerValue();
    } else {
      setTimerTime(timerCountDownTime);
    }
  };
  const startTimerValue = () => {
    timeCount = setInterval(() => {
      timerCountDown();
    }, 1000);
  };

  const clearTimerValue = () => {
    timerCountDownTime = 45;
    setTimerTime(45);
    clearInterval(timeCount);
  };

  const mobileOtpVerification = (payload) => {
    setLoading(true);
    Post('common/verify-otp', payload)
      .then((result) => {
        setLoading(false);
        setValue('');
        if (result.status === 200) {
          // global.showToast(result.message, 'success');
          redirectNavigation();
        } else {
          // global.showToast(result.message, 'error');
          redirectNavigation();
        }
      })
      .catch((error) => {
        setLoading(false);
        setValue('');
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            'Something went wrong',
          'error',
        );
      });
  };

  const resetMobileOtp = async () => {
    setLoading(true);
    const IP_ADDRESS = await AsyncStorage.getItem('ip_address');
    setValue('');
    Post('common/send-otp', {
      countryCode: '+' + userCountryCode,
      phoneNo: userPhoneNumber,
      ISOCode: phoneCode,
      oid: route?.params?.oid,
      uip: IP_ADDRESS,
    })
      .then((result) => {
        console.log('resend otp', result);
        if (result?.data?.otp_attempts > 1) {
          setShowSkipText(true);
        }
        if (result?.data?.otp_attempts === 2) {
          if (firstSpamOtp) {
            setSkipModal(true);
          } else {
            setFirstSpamOtp(true);
          }
        }
        startTimerValue();
        setLoading(false);

        if (result.status === 200) {
          // global.showToast(result.message, 'success');
        } else {
          // global.showToast(result.message, 'error');
          // clearTimerValue();
        }
      })
      .catch((error) => {
        setLoading(false);
        // clearTimerValue();
        setValue('');
        resetMobileOtp('');
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
      <Container
        style={[
          commonStyle.mainContainer,
          commonStyle.pb1,
          {paddingTop: Platform.OS === 'ios' ? 10 : 0},
        ]}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading]}>Verify your</Text>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              phone number
            </Text>
            <View style={[commonStyle.mb3, commonStyle.pb3]}>
              <Text style={[commonStyle.grayText16]}>
                We sent a verification code to
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb2]}>
                +{userCountryCode} {userPhoneNumber}
              </Text>
              <CodeField
                ref={codeFiledRef}
                {...props}
                value={value}
                onChangeText={setValue}
                caretHidden={false}
                cellCount={CELL_COUNT}
                rootStyle={commonStyle.otpcodeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <Text
                    key={index}
                    style={[
                      commonStyle.otpcell,
                      isFocused && commonStyle.otpfocusCell,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}>
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            {timerTime !== 45 && timerTime !== 0 && (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  You can request for resend after : {timerTime} sec
                </Text>
              </View>
            )}
            {timerTime === 45 && (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  I didn’t get a code.
                </Text>
                <TouchableOpacity>
                  {loading ? (
                    <Text style={commonStyle.blackText16}>Resend</Text>
                  ) : (
                    <Text
                      style={commonStyle.blackText16}
                      onPress={() => resendOTP()}>
                      Resend
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            {showSkipText ? (
              <TouchableOpacity
                onPress={() => {
                  redirectNavigation();
                }}
                style={{alignSelf: 'flex-start'}}>
                <Text style={[commonStyle?.activeTextStyle]}>
                  Skip & Continue
                </Text>
              </TouchableOpacity>
            ) : null}
            {loading ? (
              <View style={commonStyle.otploader}>
                <ActivityIndicator
                  size={Platform.OS === 'ios' ? 'large' : 50}
                  color="#F36A46"
                />
                <Text style={[commonStyle.blackTextR, commonStyle.mt2]}>
                  Just a moment... Checking
                </Text>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </Container>
      <Modal visible={skipModal} style={{margin: 20}}>
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1,
            paddingVertical: 50,
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <View style={{flex: 1}}>
            <View style={{alignSelf: 'flex-start', marginVertical: 20}}>
              <Text style={[commonStyle.subheading]}>Verify your</Text>
              <Text style={[commonStyle.subheading, commonStyle.mb2]}>
                phone number
              </Text>
            </View>

            <Text style={[commonStyle.grayText14]}>
              Sorry we cannot process your OTP further as you ran out of
              attempts, please try again later after 24 hrs. Or you skip it now
              and can do that OT verification later.
            </Text>
          </View>
          <Button
            title={'Skip and Continue'}
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={() => {
              redirectNavigation();
              setSkipModal(false);
            }}
          />
        </View>
      </Modal>
    </Fragment>
  );
};

export default SignupPhoneVerification;
