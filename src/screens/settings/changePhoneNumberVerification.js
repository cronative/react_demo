import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  Image,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container} from 'native-base';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import Modal from 'react-native-modal';
import commonStyle from '../../assets/css/mainStyle';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';
import {
  sendOtpRequest,
  sendOtpRequestClear,
  changePhonenumberUpdateRequest,
  changePhonenumberUpdateRequestClear,
  profileViewRequest,
} from './../../store/actions/profileAction';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import RNOtpVerify from 'react-native-otp-verify';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePhoneNumberVerification = ({route, navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const CELL_COUNT = 6;
  let timeCount;
  let timerCountDownTime = 45;
  const [timerValue, setTimerValue] = useState(timerCountDownTime);
  const [value, setValue] = useState('');
  const [resendOtp, setResendOtp] = useState(false);
  const updateOtpData = useSelector((state) => state.profileReducer.otpInfo);
  const [phoneNo, setPhoneNo] = useState(
    route.params.phone_number ? route.params.phone_number : '',
  );
  const [countryCode, setCountryCode] = useState(
    route.params.country_code ? route.params.country_code : '',
  );
  const phoneCode = route.params.phoneCode;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [visibleModal, setVisibleModal] = useState(false);
  const updatePhoneData = useSelector(
    (state) => state.profileReducer.updatePhone,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  const [showSkipText, setShowSkipText] = useState(false);
  const [firstSpamOtp, setFirstSpamOtp] = useState(false);
  const [skipModal, setSkipModal] = useState(false);

  useEffect(() => {
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

  // Get the OTP, and verify
  useEffect(() => {
    if (value.trim().length == 6) {
      let formObj = {
        phoneNo: phoneNo,
        countryCode: `+${countryCode}`,
        otp: value,
      };
      dispatch(changePhonenumberUpdateRequest(formObj));
    }
  }, [value]);

  // Use this for hide and show resend otp text
  useEffect(() => {
    if (resendOtp === false) {
      timeCount = setInterval(() => {
        timerCountDownTime = timerCountDownTime - 1;
        if (timerCountDownTime === 0) {
          setResendOtp(true);
          clearInterval(timeCount);
        } else {
          setTimerValue(timerCountDownTime);
          setResendOtp(false);
        }
      }, 1000);
    }
  }, [resendOtp]);

  // Handle change phone number response
  useEffect(() => {
    if (updatePhoneData && updatePhoneData.status == 200) {
      dispatch(changePhonenumberUpdateRequestClear());
      dispatch(profileViewRequest());
      setVisibleModal(true);
      setTimeout(() => {
        setVisibleModal(false);
        navigation.navigate('AccountSettings');
      }, 1000);
    } else if (updatePhoneData && updatePhoneData.status != 200) {
      setValue('');
      if (
        updatePhoneData.response.data.message !== null &&
        updatePhoneData.response.data.message !== ''
      ) {
        global.showToast(updatePhoneData.response.data.message, 'error');
        dispatch(changePhonenumberUpdateRequestClear());
      }
    }
  });

  // Resend OTP process
  const resendverifyCode = async () => {
    const IP_ADDRESS = await AsyncStorage.getItem('ip_address');
    setResendOtp(false);
    setValue('');
    timerCountDownTime = 45;
    setTimerValue(timerCountDownTime);
    let formObj = {
      phoneNo: phoneNo,
      countryCode: `+${countryCode}`,
      ISOCode: phoneCode,
      oid: route?.params?.oid,
      uip: IP_ADDRESS,
    };
    dispatch(sendOtpRequest(formObj));
  };

  // Otp response handle
  useEffect(() => {
    if (updateOtpData && updateOtpData.status == 200) {
      dispatch(sendOtpRequestClear());
      if (updateOtpData?.data?.otp_attempts > 1) {
        setShowSkipText(true);
      }
      if (updateOtpData?.data?.otp_attempts === 2) {
        if (firstSpamOtp) {
          setSkipModal(true);
        } else {
          setFirstSpamOtp(true);
        }
      }
      // global.showToast('We have sent you a verification code', 'success');
    } else if (updateOtpData && updateOtpData.status != 200) {
      if (
        updateOtpData?.data?.message !== null &&
        updateOtpData?.data?.message !== ''
      ) {
        global.showToast(updateOtpData.response.data.message, 'error');
        dispatch(sendOtpRequestClear());
      }
    }
  });

  // Resend OTP confirmation
  const resendOTP = () =>
    Alert.alert(
      '',
      'Are you sure, you want to resend verification code?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
        },
        {text: 'OK', onPress: () => resendverifyCode()},
      ],
      {cancelable: false},
    );

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
                {countryCode ? '+' + countryCode : ''} {phoneNo}
              </Text>
              <CodeField
                ref={ref}
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
            {resendOtp !== true ? (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  You can request for resend after : {timerValue} sec
                </Text>
              </View>
            ) : (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  I didn’t get a code.
                </Text>
                <TouchableOpacity>
                  <Text
                    style={commonStyle.blackText16}
                    onPress={() => resendverifyCode()}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {showSkipText ? (
              <TouchableOpacity
                onPress={() => {
                  navigation?.pop(2);
                }}
                style={{alignSelf: 'flex-start'}}>
                <Text style={[commonStyle?.activeTextStyle]}>
                  Skip & Continue
                </Text>
              </TouchableOpacity>
            ) : null}
            {loderStatus === true ? (
              <View style={commonStyle.otploader}>
                <ActivityIndicator
                  size={Platform.OS === 'ios' ? 'large' : 50}
                  color="#F36A46"
                />
                <Text style={[commonStyle.blackTextR, commonStyle.mt2]}>
                  Just a moment...
                </Text>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
      </Container>
      {/* Phone Number change Message modal start */}
      <Modal
        visible={visibleModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={commonStyle.messageIcon}>
              <Image source={circleMsgImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Your phone number has been changed successfully
            </Text>
          </View>
        </View>
      </Modal>
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
              navigation?.pop(2);
              setSkipModal(false);
            }}
          />
        </View>
      </Modal>
      {/* Phone Number change Message modal end */}
    </Fragment>
  );
};

export default ChangePhoneNumberVerification;
