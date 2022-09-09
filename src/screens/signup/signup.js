import React, { Fragment, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Container, Body } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button } from 'react-native-elements';
import commonStyle from '../../assets/css/mainStyle';
import {
  EyeOpen,
  EyeClose,
  LeftArrowIos,
  LeftArrowAndroid,
} from '../../components/icons';


import { useForm, Controller } from 'react-hook-form';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../../utility/commonRegex';
import AsyncStorage from '@react-native-async-storage/async-storage';
import global from '../../components/commonservices/toast';
import ActivityLoader from '../../components/ActivityLoader';
import { Get, Post, Put } from '../../api/apiAgent';
import GoogleLoginBtn from '../../components/socialLogin/GoogleLoginBtn';
import FacebookLoginBtn from '../../components/socialLogin/FacebookLoginBtn';
import AppleLoginBtn from '../../components/socialLogin/AppleLoginBtn';
import { useSelector, useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import logo from '../../assets/images/logo.png';
import { setNavigationValue } from '../../store/actions';
import { strEmailVerified, strMobileVerified } from '../../utility/config';

const Signup = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [press, setPress] = useState(false);
  const [password, setPassword] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [loader, setLoader] = useState(false);
  const referCodeByUrl = useSelector((state) => state.auth.referralCode);
  const ref_inputpassword = useRef();
  // const ref_inputEmail = useRef();

  const { handleSubmit, control, errors, setValue } = useForm();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setValue('email', null);
      setValue('password', null);
      setIsEmailFocus(false);
      setIsPassFocus(false);
    });
    return unsubscribe;
  }, [navigation]);

  /**
   * This Method will use to show and hide the password .
   */
  const showPass = () => {
    if (!press) {
      setShowPassword(false);
      setPress(true);
    } else {
      setShowPassword(true);
      setPress(false);
    }
  };

  //! should come from a utility file

  // resolver: yupResolver(schema),

  const onSubmitHandler = (value) => {
    value.isProfessional =
      route.params.user_type === 'professional account' ? '1' : '0';

    if (referCodeByUrl) {
      value.referralCode = referCodeByUrl ? referCodeByUrl : '';
    }
    crashlytics().log('data submited');
    signupApi('user/register', value);
  };

  //storing data
  const _storeUserData = async (accessToken, refreshToken, authDetails) => {
    console.log("STORING DATA>>>>>>>>>>>>>>>>>");
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('email', authDetails.email);
      await AsyncStorage.setItem(
        'userId',
        (authDetails.id && authDetails.id.toString()) || '',
      );
      await AsyncStorage.setItem(
        'userType',
        authDetails.isProfessional.toString(),

      );
      await AsyncStorage.setItem('referralId', authDetails.referralId);
      await AsyncStorage.setItem(
        'image',
        authDetails.image ? authDetails.image : '',
      );
      await AsyncStorage.setItem(strEmailVerified, "0");
      await AsyncStorage.setItem(strMobileVerified, "0");
      await AsyncStorage.setItem('fullName', authDetails.fullName);
      await AsyncStorage.setItem('fullName', authDetails.fullName);
      await AsyncStorage.setItem('phone', authDetails.phoneNo || '');
      await AsyncStorage.setItem('callingCode', authDetails.countryCode || '');
    } catch (error) {
      // Error saving data
    }
  };


  const signupApi = (url, data, isSocial = false, userName = '') => {
    console.log('DATA PASSED: ', data);
    console.log('UserTypessss : ', route.params.user_type);
    setLoader(true);
    Post(url, data)
      .then((result) => {
        console.log('RESULTTT: ', result);
        setLoader(false);
        if (result.status === 200 || result.status === 201) {
          dispatch({ type: 'REFERRAL_CODE_CLEAR' });
          dispatch({
            type: 'USER_TYPE_STATUS',
            status:
              route.params.user_type === 'professional account' ? '1' : '0',
          });
          AsyncStorage.setItem('isClickedExplore', '0');
          let userData =
            result.status === 201 ? result.data.userDetails : result.data;
          userData.fullName = userData.fullName
            ? userData.fullName
            : result.status === 201
              ? result.data.userDetails.userName
              : result.data.fullName;
          console.log("userData >>>>>>>>>>>>>>>>>>>>>>>>>");
          console.log(userData);
          _storeUserData(
            result.data.accessToken,
            result.data.refreshToken,
            userData,
          );
          if (isSocial) {
            if (userData.emailVerified) {
              if (!userData.fullName) {
                Put('user/profile', { userName: userName }).finally(() => {
                  if (route.params.user_type === 'professional account') {
                    Get('user/welcome-mail?isProfessional=1')
                      .then((response) => {
                        console.log(response);
                      })
                      .catch((err) => {
                        console.log({ err });
                      });
                  } else {
                    Get('user/welcome-mail?isProfessional=0')
                      .then((response) => {
                        console.log(response);
                      })
                      .catch((err) => {
                        console.log({ err });
                      });
                  }
                  if (
                    route.params.user_type === 'professional account' &&
                    !userData.mobileVerified
                  ) {
                    navigation.navigate('SignupPhone', { isSocial: isSocial });
                  } else {
                    AsyncStorage.setItem('isValidForLogin', 'yes');
                    dispatch(setNavigationValue(4));
                  }
                });
              } else if (
                route.params.user_type === 'professional account' &&
                !userData.mobileVerified
              ) {
                navigation.navigate('SignupPhone', { isSocial: isSocial });
              } else {
                AsyncStorage.setItem('isValidForLogin', 'yes');
                dispatch(setNavigationValue(4));
              }
              AsyncStorage.setItem('isValidForLogin', 'yes');
            } else if (!userData.emailVerified) {
              navigation.navigate('EmailVerification', {
                user_email: userData.email,
                user_type: route.params.user_type
              });
            }
          } else {
            if (userData.emailVerified && userData.mobileVerified) {
              AsyncStorage.setItem('isValidForLogin', 'yes');
              dispatch(setNavigationValue(4));
            } else if (userData.emailVerified && !userData.fullName) {
              navigation.navigate('SignupName', { user_type: route.params.user_type });
            } else if (userData.fullName && !userData.mobileVerified) {
              navigation.navigate('SignupPhone');
            } else if (!userData.emailVerified) {
              navigation.navigate('EmailVerification', {
                user_email: userData.email,
                user_type: route.params.user_type
              });
            }
            AsyncStorage.setItem('isValidForLogin', 'yes');
          }
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log('SIGNUP ERROR: ', error);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const googleLoginSuccessHandler = (data) => {
    console.log('google data: ', data);
    let socialData = data.additionalUserInfo.profile;
    const payload = {
      email: socialData.email,
      googleId: data.user.uid,
      isProfessional:
        route.params.user_type === 'professional account' ? '1' : '0',
      fullName: socialData.name,
      profileImage: socialData.picture,
    };
    console.log('Gmail Payload Data : ', payload);
    if (referCodeByUrl) {
      payload.referralCode = referCodeByUrl ? referCodeByUrl : '';
    }
    signupApi('user/social-media-authenticate', payload);
  };

  const facebookLoginSuccessHandler = (data) => {
    console.log('facebookLoginSuccess', data);
    let socialData = data.additionalUserInfo.profile;
    let profilePicture = socialData.picture.data.url;
    if (socialData.email == null) {
      global.showToast(
        'Something went wrong, please try after some times.',
        'error',
      );
      return;
    } else {
      const payload = {
        email: socialData.email,
        facebookId: data.user.uid,
        isProfessional:
          route.params.user_type === 'professional account' ? '1' : '0',
        fullName: socialData.name,
        profileImage: profilePicture,
      };
      if (referCodeByUrl) {
        payload.referralCode = referCodeByUrl ? referCodeByUrl : '';
      }
      signupApi('user/social-media-authenticate', payload);
    }
  };

  const appleLoginSuccessHandler = async (data) => {
    console.log('apple login', data);
    let socialData = data.additionalUserInfo.profile;
    console.log('socialData', socialData);
    const payload = {
      email: socialData.email,
      appleId: data.user.uid,
      isProfessional:
        route.params.user_type === 'professional account' ? '1' : '0',
      profileImage: data?.user?.photoURL ? data?.user?.photoURL : '',
    };
    if (referCodeByUrl) {
      payload.referralCode = referCodeByUrl ? referCodeByUrl : '';
    }
    await AsyncStorage.setItem('fullName', data?.user?.displayName ?? '');
    signupApi(
      'user/social-media-authenticate',
      payload,
      true,
      data?.user?.displayName,
    );
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loader ? <ActivityLoader /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              Sign Up
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter your email
              </Text>
              {
                // ! we need to wrap our components in Controller imported from react-hook-form
              }
              <Controller
                name="email"
                control={control}
                defaultValue={emailValue}
                // ! rules will apply in up to down order

                rules={{
                  required: { value: true, message: 'Email is required' },
                  pattern: {
                    value: EMAIL_PATTERN,
                    message: 'Not a valid email',
                  },
                }}
                render={({ onChange, value }) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isEmailFocus && commonStyle.focusinput,
                    ]}
                    // ref={ref_inputEmail}
                    onFocus={() => setIsEmailFocus(true)}
                    returnKeyType="next"
                    keyboardType="email-address"
                    onSubmitEditing={() => ref_inputpassword.current.focus()}
                    autoCapitalize={'none'}
                    // ! this value is coming from Controllar's render function
                    value={value}
                    onChangeText={(text) => {
                      // ! this on change is coming from Controllar's render function
                      onChange(text);
                    }}
                  />
                )}
              />
              {
                // ! this is the error text out put deginar need to fix the styling
              }
              {errors.email && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.email?.message}
                </Text>
              )}
            </View>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Create password
              </Text>
              <Controller
                name="password"
                control={control}
                defaultValue={password}
                rules={{
                  required: { value: true, message: 'Password is required' },
                  pattern: {
                    value: PASSWORD_PATTERN,
                    message:
                      'Your password should contain at least 8 characters, A mixture of both uppercase and lowercase letters, A mixture of letters and numbers Inclusion of at least one special character, e.g., ! @ # ? ',
                  },
                }}
                render={({ onChange, value }) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      commonStyle.icontextinput,
                      isPassFocus && commonStyle.focusinput,
                    ]}
                    error={errors.password}
                    errorText={errors?.password?.message}
                    onFocus={() => setIsPassFocus(true)}
                    ref={ref_inputpassword}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    secureTextEntry={showPassword}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      setPassword(text);
                    }}
                  />
                )}
              />
              <TouchableOpacity style={commonStyle.btnEye} onPress={showPass}>
                {!press ? <EyeOpen /> : <EyeClose />}
              </TouchableOpacity>
              {errors.password && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.password?.message}
                </Text>
              )}
            </View>

            <View style={[commonStyle.mb3]}>
              <Button
                title="Sign Up"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={handleSubmit(onSubmitHandler)}
              />
              {/*   <Button
                title="Test crash"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => crashlytics().crash()}
              /> */}
            </View>

            {/* No longer in app scope - Confirmed by Tanmoy */}

            <View style={[commonStyle.termswrap, commonStyle.mb4]}>
              <Text style={[commonStyle.dividerline]}></Text>
              <Text style={[commonStyle.blackText16, commonStyle.ordivider]}>
                or
              </Text>
              <Text style={[commonStyle.dividerline]}></Text>
            </View>
            <AppleLoginBtn
              appleLoginSuccessHandler={appleLoginSuccessHandler}
              text="Sign Up"
            />

            {/* <FacebookLoginBtn
              facebookLoginSuccessHandler={facebookLoginSuccessHandler}
              text="Sign Up"
            />
            <GoogleLoginBtn
              googleLoginSuccessHandler={googleLoginSuccessHandler}
              text="Sign Up"
            /> */}

            <View style={[commonStyle.termswrap, commonStyle.mb3]}>
              <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={commonStyle.blackText16}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    </Fragment>
  );
};

export default Signup;
