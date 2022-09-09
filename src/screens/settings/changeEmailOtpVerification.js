import React, {Fragment, useState, useEffect, RefObject, useRef} from 'react';
import {
  Platform,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container} from 'native-base';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import commonStyle from '../../assets/css/mainStyle';
import {otpFealdNumber} from '../../utility/commonStaticValues';
import global from '../../components/commonservices/toast';
import {Post, Put} from '../../api/apiAgent';
import {useDispatch} from 'react-redux';
import {profileViewRequest} from '../../store/actions/profileAction';

const ChangeEmailOtpVerification = ({route, navigation}) => {

  const dispatch = useDispatch();
  const CELL_COUNT = otpFealdNumber;
  const [value, setValue] = useState('');
  const [timerTime, setTimerTime] = useState(180);
  let timerCountDownTime = 180;
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const userEmail = route.params.user_email || '';
  const [loading, setLoading] = useState(false);
  let timeCount;

  useEffect(() => {
    if (value.length > otpFealdNumber - 1) {
      const payload = {
        otp: value,
      };
      emailVerification(payload);
    }
  }, [value]);

  useEffect(() => {
    startTimerValue();
  }, []);
 
  const resendOTP = () => {
    setValue('');
    resetEmailOtp();
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
    timerCountDownTime = 180;
    setTimerTime(180);
    clearInterval(timeCount);
  };

  const emailVerification = (payload) => {
    setLoading(true);
    Post('common/complete-change-email', payload)
      .then((result) => {
          console.log('Verification Email : ', result);
        setLoading(false);
        if (result.status === 200) {
          dispatch(profileViewRequest());
          clearTimerValue();
          setValue('');
          global.showToast(result.message, 'success');
          navigation.navigate('AccountSettings');
        } else {
            setValue('');
          global.showToast('Invalid Code', 'error');
        }
      })
      .catch((error) => {
        setValue('');
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

  const resetEmailOtp = () => {
    setLoading(true);
    Put('common/resend-request-change-email', {email: userEmail})
      .then((result) => {
        startTimerValue();
        setLoading(false);
        if (result.status === 200) {
          global.showToast('We have sent you a verification code', 'success');
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
      <Container style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: Platform.OS === 'ios' ? 180 : 0}]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>Verify your Email</Text>
            <View style={[commonStyle.mb3, commonStyle.pb3]}>
              <Text style={[commonStyle.grayText16]}>
                We sent a verification code to
              </Text>
              <Text style={[commonStyle.blackTextR, commonStyle.mb2]}>
                {userEmail}.
              </Text>
              <CodeField
                ref={ref}
                {...props}
                value={value}
                //onChangeText={(event)=>IsVerifyCode(event)}
                //onFulfill={(isValid) => this._onFinishCheckingCode1(isValid)}
                onChangeText={setValue}
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
            {/* {value.length > 0 ? null : (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  I didn’t get a code.
                </Text>
                <TouchableOpacity>
                  <Text style={commonStyle.blackText16} onPress={resendOTP}>
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            )} */}
            {timerTime !== 180 && timerTime !== 0 && (
              <View style={[commonStyle.resendotpwrap, commonStyle.mb3]}>
                <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                  You can request for resend after : {timerTime} sec
                </Text>
              </View>
            )}

            {timerTime === 180 && (
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
    </Fragment>
  );
};

export default ChangeEmailOtpVerification;
