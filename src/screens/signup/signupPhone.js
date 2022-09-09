import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container } from 'native-base';
import React, {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import {
  BackHandler,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import { Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
import logo from '../../assets/images/logo.png';
import { useDispatch, useSelector } from 'react-redux';
import ActivityLoader from '../../components/ActivityLoader';
import global from '../../components/commonservices/toast';
import {
  getCurrentCountryCode,
  verifyMobileNumber,
} from '../../utility/commonService';
import { setNavigationValue, setupProgressionUpdate } from '../../store/actions';
import RNOtpVerify from 'react-native-otp-verify';
import CountryQuery from 'country-query';
import { LeftArrowAndroid, LeftArrowIos } from '../../components/icons';
const SignupPhone = ({ route, navigation }) => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneCode, setPhoneCode] = useState(getCurrentCountryCode());
  const phoneInput = useRef('');
  const [loading, setLoading] = useState(false);
  const [hashString, setHashString] = useState('');

  const dispatch = useDispatch();

  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );
  useLayoutEffect(() => {
    if (route?.params?.navigatedFrom === 'profile') {
      navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false,
      });
    }
  }, []);
  useEffect(() => {
    // console.log('amma', JSON.stringify(route?.params, null, 2));

    if (route?.params?.countryCode) {
      // console.log(
      //   'adada',
      //   CountryQuery.findByIdd(route?.params?.countryCode + '' ?? '+91'),
      // );
      // let cc = CountryQuery?.findByIdd(route?.params?.countryCode ?? '+91');
      // console.log('amma', JSON.stringify(route?.params, null, 2));
      setPhoneCode(
        CountryQuery?.findByIdd(route?.params?.countryCode + '' ?? '+1')?.cca2,
      );
      setCountryCode(route?.params?.countryCode?.replace('+', ''));
      // setCountryCode(route?.params?.countryCode);
    }
    if (route?.params?.phone) {
      setValue(route?.params?.phone);
    }
  }, [route?.params]);
  console.log('value', JSON.stringify(value, null, 2));

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash()
        .then((p) => setHashString(p[0]))
        .catch(console.log);
      console.log('hash string is', hashString);
    }
  }, []);

  const backAction = () => {
    console.log('phone back');
    navigation.goBack();
    return true;
  };
  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    //Resetting redux state (Resetting the setup progress for previous setup process)
    if (!!progressionData) {
      const resetData = progressionData.map((step) => {
        return {
          ...step,
          isCompleted: 0,
        };
      });
      console.log('RESET DATA: ', resetData);
      dispatch(setupProgressionUpdate(resetData));
    }
  }, []);

  const updateClientProfile = async (payload) => {
    setLoading(true);
    console.log('client profile payload is', payload);
    Put('user/profile', payload)
      .then(async (result) => {
        setLoading(false);
        if (result.status === 200) {
          await AsyncStorage.setItem('isValidForLogin', 'yes');
          AsyncStorage.setItem('mobileVerified', "1");
          dispatch(setNavigationValue(2));
          // global.showToast(result.message, 'success');
          // navigation.navigate('SignupPhone');
          // Get('user/welcome-mail')
          //   .then((response) => {
          //     console.log(response);
          //   })
          //   .catch((err) => {
          //     console.log({err});
          //   });
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log('response error is', error);
        console.log('response error is', error.response);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const verifyPhoneNumber = async () => {
    const IP_ADDRESS = await AsyncStorage.getItem('ip_address');
    console.log('hhhhh', IP_ADDRESS);
    if (value) {
      // const checkValid = phoneInput.current?.isValidNumber(value);
      console.log('value ***', value, countryCode);
      let coutrycodeformat = '+' + countryCode;
      const checkValid = true;
      if (checkValid) {
        let userType = await AsyncStorage.getItem('userType');
        console.log("userType >>>>>> ", userType)
        await AsyncStorage.setItem('phone', value || '');
        // if (userType == 1) {
        // updateClientProfile({
        //   phone: value,
        //   countryCode: coutrycodeformat,
        //   isProfessional: 0,
        // });
        // redirectNavigation();
        sendOtpToMobileApi({
          countryCode: coutrycodeformat,
          phoneNo: value,
          ISOCode: phoneCode,
          oid: 0,
          uip: IP_ADDRESS,
          anyValue: hashString,
          isMob: 1 // https://app.asana.com/0/1202100062086760/1202365658161235
        });
        // } else {
        //   updateClientProfile({
        //     phone: value,
        //     countryCode: coutrycodeformat,
        //     isProfessional: 0,
        //   });
        // }
      } else {
        global.showToast('Invalid phone number', 'error');
      }
    } else {
      global.showToast('Phone number required', 'error');
    }
  };

  const redirectNavigation = async () => {
    console.log("CLIENT LOGINNNNNNNNNN")
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
    } catch (err) { }
  };


  const sendOtpToMobileApi = (payload) => {
    console.log('payload is', payload);
    // if (payload) {
    //   console.log('##', payload);
    //   return false;
    // }
    let flag = true;
    // if (value.length < 10) {
    //   flag = true;
    //   global.showToast('Invalid phone number', 'error');
    //   return false;
    // } else if (value.length > 11) {
    //   flag = true;
    //   global.showToast('Invalid phone number', 'error');
    //   return false;
    // } else {
    //   flag = true;
    // }

    // const { isValid } = verifyMobileNumber('+' + countryCode + ' ' + value);
    // if (isValid) flag = true;
    // else {
    //   global.showToast('Invalid phone number', 'error');
    //   return false;
    // }

    if ((flag = true)) {
      setLoading(true);
      Post('common/send-otp', payload)
        .then(async (result) => {
          setLoading(false);
          if (result.status === 200) {
            console.log('send otp fist', JSON.stringify(result, null, 2));
            AsyncStorage.setItem('mobileVerified', "1");
            let userType = await AsyncStorage.getItem('userType');
            console.log('userType= ', userType);
            if (userType == 0) {
              setClientSkipStep();
              await AsyncStorage.setItem('isValidForLogin', 'yes');
              dispatch(setNavigationValue(2));
            } else {
              setProSkipStep();
              redirectNavigation();
              // navigation.navigate('SignupPhoneVerification', {
              //   phoneNumber: value,
              //   countryCode,
              //   phoneCode,
              //   isSocial: route?.params?.isSocial,
              //   oid: result?.data?.oid,
              //   navigatedFrom: route?.params?.navigatedFrom,
              // });
            }
          } else {
            // global.showToast(result.message, 'error');
            Alert.alert(result?.message);
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
    }
  };

  const setClientSkipStep = () => {
    Put('user/skip-step', {})
      .then((result) => {
        // setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep);
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
  }

  const setProSkipStep = () => {
    Put('pro/skip-step', {})
      .then((result) => {
        // setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep);
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
  }

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {loading ? <ActivityLoader /> : null}
      <Container style={[commonStyle.mainContainer]}>
        <View
          style={[
            commonStyle.headerlogo,
            {
              flexDirection: 'row',
              alignItems: 'center',
            },
          ]}>
          <View
            style={{
              flex: 1,
            }}>
            {route?.params?.navigatedFrom ? (
              <TouchableOpacity
                style={{
                  // flexShrink: 1,
                  marginTop: -5,
                  // alignSelf: 'center',
                  // position: 'absolute',
                  // left: 20,
                  // top: 0,
                  // bottom: 0,
                }}
                onPress={() => {
                  // redirectToExplore();
                  navigation?.goBack();
                  // navigation.navigate('signup_account_type');
                }}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
          <View
            style={{
              flex: 1,
              alignSelf: 'center',
            }}>
            <Image source={logo} style={commonStyle.logo} />
          </View>
          <View
            style={{
              flex: 1,
            }}
          />
        </View>
        {route?.params?.isSocial ? (
          <View style={{ position: 'absolute', end: 0, top: 30 }}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => {
                AsyncStorage.setItem('isValidForLogin', 'yes');
                dispatch(setNavigationValue(4));
              }}>
              <Text style={commonStyle.grayText16}>Skip</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS == 'ios' ? 0 : 0}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: 'white' }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.fromwrap, {}]}>
              <Text style={[commonStyle.subheading, commonStyle.mb2]}>
                Please enter your phone number
              </Text>

              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.grayText16, commonStyle.mb2]}>
                  Enter your phone number and we will send you a code to verify
                  your account.
                </Text>
                <PhoneInput
                  ref={phoneInput}
                  defaultValue={route?.params?.phone ?? value}
                  // value={value}

                  defaultCode={route?.params?.countryCode ? phoneCode : 'US'}
                  onChangeCountry={(text) => {
                    setPhoneCode(text.cca2);
                  }}
                  layout="first"
                  placeholder="XXXX XXX XXX"
                  onChangeText={(text) => {
                    let text1 = text?.replace(/[^0-9]/gi, '').substring(0, 12);
                    // let text2= text.slice(0, 12)
                    //console.log(text1,text2)
                    // console.log('text', JSON.stringify(text, null, 2));
                    // console.log('value',value)
                    setValue(text1);
                  }}
                  onChangeFormattedText={(text) => {
                    setFormattedValue(text);
                    setCountryCode(phoneInput.current?.getCallingCode() || '');
                  }}
                  withDarkTheme={false}
                  withShadow={false}
                  autoFocus={true}
                  containerStyle={commonStyle.phonecontainerStyle}
                  textContainerStyle={commonStyle.phonetextContainerStyle}
                  textInputStyle={commonStyle.phonetextInputStyle}
                  codeTextStyle={commonStyle.phonecodeTextStyle}
                  flagButtonStyle={commonStyle.phoneflagButtonStyle}
                  countryPickerButtonStyle={
                    commonStyle.phonecountryPickerButtonStyle
                  }
                />
              </View>
            </View>
          </ScrollView>
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                // title="Send Verification Code"
                title="Continue"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => verifyPhoneNumber()}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
        {/* <KeyboardAwareScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"> */}

        {/* </KeyboardAwareScrollView> */}
        {console.log(value)}
        {/*  {value.length > 9 && formattedValue.length < 12 ? ( */}
        {/*   ) : null} */}
      </Container>
    </Fragment>
  );
};

export default SignupPhone;
