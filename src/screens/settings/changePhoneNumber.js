import { Container } from 'native-base';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import { useDispatch, useSelector } from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import { getCurrentCountryCode } from '../../utility/commonService';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {
  sendOtpRequest,
  sendOtpRequestClear,
} from './../../store/actions/profileAction';
import RNOtpVerify from 'react-native-otp-verify';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Put } from '../../api/apiAgent';

const ChangePhoneNumber = ({ navigation }) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [countryCode, setCountryCode] = useState('44');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef('');
  const updateOtpData = useSelector((state) => state.profileReducer.otpInfo);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const [hashString, setHashString] = useState('');
  const [phoneCode, setPhoneCode] = useState(getCurrentCountryCode());
  const [OID, setOID] = useState(0);
  const loginUserType = useSelector((state) => state.auth.userType);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getHash()
        .then((p) => setHashString(p[0]))
        .catch(console.log);
      console.log('hash string is', hashString);
    }
  }, []);

  const updateClientProfile = async (payload) => {
    setLoading(true);
    console.log('client profile payload is', payload);
    Put('user/profile', payload)
      .then(async (result) => {
        setLoading(false);
        if (result.status === 200) {
          navigation?.pop();
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoading(false);
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

  // This function will call after click to continue
  const changePhoneNumberVerification = async () => {
    try {
      const IP_ADDRESS = await AsyncStorage.getItem('ip_address');
      if (value.length > 10) {
        global.showToast('Phone number should be 10 digits', 'error');
        return false;
      }
      let countycode = phoneInput.current?.getCallingCode()
        ? phoneInput.current?.getCallingCode()
        : countryCode;
      setCountryCode(countycode);
      if (countycode && value.length > 0) {
        let userType = await AsyncStorage.getItem('userType');
        await AsyncStorage.setItem('phone', value || '');
        if (userType == 1) {
          setTimeout(() => {
            let formObj = {
              phoneNo: value,
              countryCode: '+' + countycode,
              ISOCode: phoneCode,
              oid: 0,
              uip: IP_ADDRESS,
              anyValue: hashString,
              isMob: 1 //https://app.asana.com/0/1202100062086760/1202168946402431
            };
            dispatch(sendOtpRequest(formObj));
          }, 1000);
        } else {
          updateClientProfile({
            phone: value,
            countryCode: '+' + countycode,
            isProfessional: 0,
          });
        }
      } else {
        global.showToast('Phone number is required', 'error');
      }
    } catch (err) {
      console.log('change phone number err', err);
    }
  };

  useEffect(() => {
    console.log('upppp', updateOtpData);
    if (updateOtpData && updateOtpData.status == 200) {
      setOID(updateOtpData?.data?.oid ?? 0);
      dispatch(sendOtpRequestClear());
      navigation.navigate('AccountSettings');
      // global.showToast('We have sent you a verification code', 'success');
      // setTimeout(() => {
      // if (loginUserType == 1)
      //   navigation.navigate('ChangePhoneNumberVerification', {
      //     phone_number: value,
      //     country_code: countryCode,
      //     phoneCode,
      //     oid: OID,
      //   });
      // }, 1000);
    } else if (updateOtpData && updateOtpData.status != 200) {
      if (updateOtpData?.response?.status == 500) {
        global.showToast('Invalid phone number', 'error');
        dispatch(sendOtpRequestClear());
      } else {
        global.showToast(updateOtpData?.message, 'error');
        dispatch(sendOtpRequestClear());
      }
    }
  });

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 80 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: 'white' }}>
        {loderStatus || loading ? <ActivityLoaderSolid /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.grayText16, commonStyle.mb2]}>
                Enter your phone number and we will send you a code to verify
                your account.
              </Text>
              <PhoneInput
                ref={phoneInput}
                defaultValue={value}
                defaultCode={'US'}
                layout="first"
                placeholder="XXXX XXX XXX"
                onChangeText={(text) => {
                  setValue(text);
                }}
                onChangeCountry={(text) => {
                  setPhoneCode(text.cca2);
                }}
                onChangeFormattedText={(text) => {
                  setFormattedValue(text);
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
        {/* {formattedValue.length > 0 ? ( */}
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Continue"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={changePhoneNumberVerification}
            />
          </View>
        </View>
        {/* ) : null} */}
      </KeyboardAvoidingView>
    </Fragment>
  );
};

export default ChangePhoneNumber;
