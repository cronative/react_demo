import AsyncStorage from '@react-native-async-storage/async-storage';
import { Container, Left } from 'native-base';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  BackHandler,
  Platform,
} from 'react-native';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { Get, Post, Put } from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import logo from '../assets/images/logo.png';
import ActivityLoader from '../components/ActivityLoader';
import global from '../components/commonservices/toast';
import { EyeClose, EyeOpen } from '../components/icons';
import AppleLoginBtn from '../components/socialLogin/AppleLoginBtn';
import FacebookLoginBtn from '../components/socialLogin/FacebookLoginBtn';
import GoogleLoginBtn from '../components/socialLogin/GoogleLoginBtn';
import { setNavigationValue, setOnboardingValue } from '../store/actions';
import { clearInitialNavigationRoute } from '../store/actions/nagationAction';
import { useFocusEffect } from '@react-navigation/native';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../utility/commonRegex';
import postFCMToken from '../utility/postFCMToken';
import { LeftArrowAndroid } from '../components/icons';
import { LeftArrowIos } from '../components/icons';
import messaging from '@react-native-firebase/messaging';
import EventEmitter from 'react-native-eventemitter';
import { IS_LAST_STEP } from '../store/actionTypes';
import { setInitialStepValue } from '../store/actions/nagationAction';
import { strEmailVerified, strMobileVerified } from '../utility/config';
const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isEmailFocus, setIsEmailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [press, setPress] = useState(false);
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);
  const ref_inputpassword = useRef();

  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );
  const initialNav = useSelector(
    (state) => state.navigationValueDetails.initialNav,
  );

  const authDetails = useSelector((state) => state.auth);
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
  //storing data
  const _storeUserData = async (accessToken, refreshToken, authDetails, emailVerified, mobileVerified, currentUserType) => {
    console.log('tokens', accessToken, refreshToken);
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
      await AsyncStorage.setItem('userId', authDetails.id.toString());
      await AsyncStorage.setItem('email', authDetails.email);
      await AsyncStorage.setItem('fullName', authDetails.fullName);
      await AsyncStorage.setItem(strEmailVerified, emailVerified.toString());
      await AsyncStorage.setItem(strMobileVerified, mobileVerified.toString());
      await AsyncStorage.setItem('currentUserType', currentUserType.toString());
      await AsyncStorage.setItem(
        'userType',
        authDetails.currentUserType.toString(),
      );
      await AsyncStorage.setItem('phone', authDetails.phoneNo || '');
      await AsyncStorage.setItem('callingCode', authDetails.countryCode || '');
      await AsyncStorage.setItem(
        'image',
        authDetails.image ? authDetails.image : '',
      );

      console.log("STORAGE DONE<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    } catch (error) {
      // Error saving data
    }
  };

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

  const [setupProgress, setSetupProgress] = useState([
    { name: 'dateOfBirth', stepNo: 1, isCompleted: 0, routeName: 'SetupDOB' },
    {
      name: 'primaryCategory',
      stepNo: 2,
      isCompleted: 0,
      routeName: 'SetupMainCategories',
    },
    {
      name: 'additionalCategories',
      stepNo: 3,
      isCompleted: 0,
      routeName: 'SetupAdditionalCategories',
    },
    {
      name: 'businessDetails',
      stepNo: 4,
      isCompleted: 0,
      routeName: 'SetupBusiness',
    },
    { name: 'services', stepNo: 5, isCompleted: 0, routeName: 'SetupService' },
    {
      name: 'availability',
      stepNo: 6,
      isCompleted: 0,
      routeName: 'SetupAvailability',
    },
    { name: 'contact', stepNo: 7, isCompleted: 0, routeName: 'SetupContacts' },
    {
      name: 'paymentTerms',
      stepNo: 8,
      isCompleted: 0,
      routeName: 'SetupTermsOfPayment',
    },
    {
      name: 'additionalInfo',
      stepNo: 9,
      isCompleted: 0,
      routeName: 'SetupAdditionalInfo',
    },
    { name: 'proFaqs', stepNo: 10, isCompleted: 0, routeName: 'SetupFaq' },
  ]);


  const [setupProgressClient, setSetupProgressClient] = useState([
    { name: 'primaryCategories', stepNo: 1, isCompleted: 0, routeName: 'SignupCategories' },
    {
      name: 'location',
      stepNo: 2,
      isCompleted: 0,
      routeName: 'SignupGeolocation',
    },
    {
      name: 'notifications',
      stepNo: 4,
      isCompleted: 0,
      routeName: 'SignupNotifications',
    },
  ]);

  const getBusinessCompleteInfo = () => {
    console.log("getBusinessCompleteInfo");
    // setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        // setLoader(false);
        console.log(result.data);
        console.log(result.status);
        if (result.status === 200) {

          let updatedProgress = [];
          let businessInfoDetails = result.data;
          console.log(businessInfoDetails);

          if (businessInfoDetails.completionDetails["dateOfBirth"] != 1 || businessInfoDetails.completionDetails["primaryCategory"] != 1) {
            for (let stepIndex in setupProgress) {
              let step = setupProgress[stepIndex];
              // console.log(step)
              console.log(businessInfoDetails.completionDetails[step.name])
              if (businessInfoDetails.completionDetails[step.name] == 1) {
                updatedProgress.push({ ...step, isCompleted: 1 });
              } else if (businessInfoDetails.completionDetails[step.name] == 0) {
                updatedProgress.push({ ...step, isCompleted: 0 });
              }
            }
          } else if (businessInfoDetails.skipStepDetails != null) {
            {
              for (let stepIndex in setupProgress) {
                let step = setupProgress[stepIndex];
                // console.log(step)
                console.log(businessInfoDetails.skipStepDetails[step.name])
                if (businessInfoDetails.skipStepDetails[step.name] == 1) {
                  updatedProgress.push({ ...step, isCompleted: 1 });
                } else if (businessInfoDetails.skipStepDetails[step.name] == 0) {
                  updatedProgress.push({ ...step, isCompleted: 0 });
                }
              }
            }
          }
          if (updatedProgress.length > 0) {


            let firstUnfinishedStep1 = updatedProgress.filter(
              (step) => step.isCompleted === 0,
            );

            if (firstUnfinishedStep1.length > 0) {
              let firstUnfinishedStep = updatedProgress.find(
                (step) => step.isCompleted === 0,
              );
              console.log('firstUnfinishedStep ', firstUnfinishedStep)
              console.log('firstUnfinishedStep ', firstUnfinishedStep)
              let nextStep;
              if (firstUnfinishedStep?.routeName) {
                nextStep = firstUnfinishedStep.routeName;
              }
              //  else {
              //   nextStep = 'SetupSubscription';
              // }
              console.log('Next step is: ', nextStep);
              console.log('Next step is>>: ', navigationValue);
              if (navigationValue == 1) {
                navigation.navigate(nextStep)
              } else {
                dispatch(setInitialStepValue(nextStep));
                dispatch(setNavigationValue(1));
              }
            } else {
              dispatch(setOnboardingValue(1));
              dispatch(setNavigationValue(4));
            }


            // setNextNavigationStep(nextStep);
            // dispatch(setInitialStepValue(nextStep));
            // dispatch(setNavigationValue(1));
          } else {
            dispatch(setOnboardingValue(1));
            dispatch(setNavigationValue(4));
          }


          // console.log(updatedProgress);

          // setBusinessInfoDetails(result.data);
          // if (result.data.percentage === 100) {
          //   // Start Change: Snehasish Das, Issue #1698
          //   setProfileFinished(true);
          //   // End Change: Snehasish Das, Issue #1698
          //   formatDate();
          // }
        }
      })
      .catch((error) => {
        console.log("ERRrrrrrrr>>>>>>>>> ", error)
        // setLoader(false);
        // formatDate();
      });
  };

  const getClientCompleteInfo = () => {
    console.log("getClientCompleteInfo");
    // setLoader(true);
    Get('user/completion-status', '')
      .then((result) => {
        // setLoader(false);
        console.log("CLIENT RESPONSE ==========================");
        console.log(result);
        console.log(result.data);
        console.log(result.status);
        if (result.status === 200) {

          let updatedProgress = [];
          let businessInfoDetails = result.data;
          console.log(businessInfoDetails);
          // if (businessInfoDetails.skipStepDetails["dateOfBirth"] != 1 || businessInfoDetails.completionDetails["primaryCategory"] != 1) {
          //   for (let stepIndex in setupProgress) {
          //     let step = setupProgress[stepIndex];
          //     // console.log(step)
          //     console.log(businessInfoDetails.completionDetails[step.name])
          //     if (businessInfoDetails.completionDetails[step.name] == 1) {
          //       updatedProgress.push({ ...step, isCompleted: 1 });
          //     } else if (businessInfoDetails.completionDetails[step.name] == 0) {
          //       updatedProgress.push({ ...step, isCompleted: 0 });
          //     }
          //   }
          // } else {
          for (let stepIndex in setupProgressClient) {
            let step = setupProgressClient[stepIndex];
            // console.log(step)
            console.log(businessInfoDetails.skipStepDetails[step.name])
            if (businessInfoDetails.skipStepDetails[step.name] == 1) {
              updatedProgress.push({ ...step, isCompleted: 1 });
            } else if (businessInfoDetails.skipStepDetails[step.name] == 0) {
              updatedProgress.push({ ...step, isCompleted: 0 });
            }
          }
          // }

          console.log(updatedProgress)

          if (updatedProgress.length > 0) {

            let firstUnfinishedStep1 = updatedProgress.filter(
              (step) => step.isCompleted === 0,
            );

            if (firstUnfinishedStep1.length > 0) {
              let firstUnfinishedStep = updatedProgress.find(
                (step) => step.isCompleted === 0,
              );
              console.log('firstUnfinishedStep ', firstUnfinishedStep)
              console.log('firstUnfinishedStep ', firstUnfinishedStep)
              let nextStep;
              if (firstUnfinishedStep?.routeName) {
                nextStep = firstUnfinishedStep.routeName;
              }
              dispatch(setInitialStepValue(nextStep));
              dispatch(setNavigationValue(1));
            } else {
              dispatch(setOnboardingValue(1));
              dispatch(setNavigationValue(4));
            }

            console.log('firstUnfinishedStep1 ', firstUnfinishedStep1)

          } else {
            dispatch(setOnboardingValue(1));
            dispatch(setNavigationValue(4));
          }


          console.log(updatedProgress);

          // setBusinessInfoDetails(result.data);
          // if (result.data.percentage === 100) {
          //   // Start Change: Snehasish Das, Issue #1698
          //   setProfileFinished(true);
          //   // End Change: Snehasish Das, Issue #1698
          //   formatDate();
          // }
        }
      })
      .catch((error) => {
        console.log("ERRRRRRR000000>>>>>>>>>>>>>>>> ", error)
        // setLoader(false);
        // formatDate();
      });
  };


  // login handler
  const onSubmitHandler = (value) => {
    loginApi('user/login', value);
  };

  const googleLoginSuccessHandler = (data) => {
    let socialData = data.additionalUserInfo.profile;
    const payload = {
      email: socialData.email,
      googleId: data.user.uid,
      currentUserType: 0,
      fullName: socialData.displayName,
    };
    console.log('goole data', payload);
    loginApi('user/social-media-authenticate', payload);
  };

  const facebookLoginSuccessHandler = (data) => {
    let socialData = data.additionalUserInfo.profile;
    const payload = {
      email: socialData.email,
      facebookId: data.user.uid,
      currentUserType: 0,
      fullName: socialData.name,
    };
    loginApi('user/social-media-authenticate', payload);
  };

  const appleLoginSuccessHandler = (data) => {
    console.log('apple login', data);
    let socialData = data.additionalUserInfo.profile;
    const payload = {
      email: socialData.email,
      appleId: data.user.uid,
      currentUserType: 0,
    };
    loginApi(
      'user/social-media-authenticate',
      payload,
      true,
      data?.user?.displayName,
    );
  };

  const loginApi = (url, data, isSocial = false, userName = '') => {
    setLoader(true);

    Post(url, data)
      .then((result) => {
        console.log('login result', JSON.stringify(result, null, 2));
        setLoader(false);
        // if (result?.data?.currentUserType == 1 && result?.data?.lastStep == 1) {
        // if (result?.data?.currentUserType == 1 && result?.data?.lastStep == 1) {
        //   EventEmitter.emit('PRO_NOT_CREATED');

        //   // dispatch({type: 'USER_TYPE_STATUS', status: 1});
        //   let userData =
        //     result.status === 201 ? result.data.userDetails : result.data;

        //   console.log(userData)
        //   userData.fullName = userData.fullName
        //     ? userData.fullName
        //     : result.status === 201
        //       ? result.data.userDetails.userName
        //       : result.data.fullName;
        //   _storeUserData(
        //     result.data.accessToken,
        //     result.data.refreshToken,
        //     userData,

        //   );
        //   dispatch({ type: IS_LAST_STEP, value: true });
        //   dispatch(setNavigationValue(3));
        //   return;
        // }
        if (result.status === 200 || result.status === 201) {

          AsyncStorage.setItem('isClickedExplore', '0');
          let userData =
            result.status === 201 ? result.data.userDetails : result.data;
          console.log("userData>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
          console.log(userData)

          userData.fullName = userData.fullName
            ? userData.fullName
            : result.status === 201
              ? result.data.userDetails.userName
              : result.data.fullName;
          // _storeUserData(
          //   result.data.accessToken,
          //   result.data.refreshToken,
          //   userData,
          // );

          _storeUserData(
            result.data.accessToken,
            result.data.refreshToken,
            userData,
            userData.emailVerified,
            userData.mobileVerified,
            result.data.currentUserType
          );





          // if (userData.emailVerified && userData.mobileVerified) {
          //   AsyncStorage.setItem('isValidForLogin', 'yes');
          //   dispatch(setNavigationValue(4));
          // } else if (userData.emailVerified && !userData.fullName) {
          //   navigation.navigate('SignupName');
          // } else if (userData.fullName && !userData.mobileVerified) {
          //   navigation.navigate('SignupPhone');
          // } else if (!userData.emailVerified) {
          //   navigation.navigate('EmailVerification', {
          //     user_email: userData.email,
          //   });
          // }



          console.log("emailVerified");
          console.log(userData.emailVerified);
          console.log(userData.mobileVerified);

          if (isSocial) {
            if (userData.emailVerified) {
              if (!userData.fullName) {
                Put('user/profile', { userName: userName }).finally(() => {
                  Get('user/welcome-mail')
                    .then((response) => {
                      console.log(response);
                    })
                    .catch((err) => {
                      console.log({ err });
                    });
                  if (
                    result.data.currentUserType == 1 &&
                    !userData.mobileVerified
                  ) {
                    navigation.navigate('SignupPhone', { isSocial: isSocial });
                  } else {
                    AsyncStorage.setItem('isValidForLogin', 'yes');
                    dispatch(setNavigationValue(4));
                  }
                });
              } else if (
                result.data.currentUserType == 1 &&
                !userData.mobileVerified
              ) {
                navigation.navigate('SignupPhone', { isSocial: isSocial });
              } else {
                AsyncStorage.setItem('isValidForLogin', 'yes');
                dispatch(setNavigationValue(4));
              }
            } else if (!userData.emailVerified) {
              navigation.navigate('EmailVerification', {
                user_email: userData.email,
              });
            }

          } else {
            if (userData.emailVerified && userData.mobileVerified) {
              console.log("253 React native")
              // AsyncStorage.setItem('isValidForLogin', 'yes');
              // dispatch(setNavigationValue(4));
              if (result.data.currentUserType == 0) {
                dispatch({ type: 'USER_TYPE_STATUS', status: 0 });
                getClientCompleteInfo();
                // dispatch({ type: IS_LAST_STEP, value: true });
                // dispatch(setNavigationValue(2))
                // dispatch(setOnboardingValue(1));
                // dispatch(setNavigationValue(4));
                // console.log('hello code', result.data.currentUserType);
                // dispatch({ type: 'USER_TYPE_STATUS', status: 1 });
                // // dispatch({ type: IS_LAST_STEP, value: true });
                // dispatch(setNavigationValue(2))
              } else {
                dispatch({ type: 'USER_TYPE_STATUS', status: 0 });
                getBusinessCompleteInfo();
              }
            } else if (userData.emailVerified && !userData.fullName) {
              console.log("257 React native")
              navigation.navigate('SignupName');
            } else if (userData.fullName && userData.mobileVerified) {
              // navigation.navigate('SignupPhone');
              console.log("261 React native")
              AsyncStorage.setItem('isValidForLogin', 'yes');
              dispatch(setNavigationValue(4));
            } else if (!userData.emailVerified) {
              console.log("265 React native")
              navigation.navigate('EmailVerification', {
                user_email: userData.email,
                isSocial: isSocial
              });
            }
            else if (!userData.mobileVerified) {
              console.log("270 React native")
              navigation.navigate('SignupPhone', {
                user_email: userData.email,
              });
            }
            else {
              AsyncStorage.setItem('isValidForLogin', 'yes');
              dispatch(setNavigationValue(4));
            }
            AsyncStorage.setItem('isValidForLogin', 'yes');
          }

          checkApplicationPermission();
        } else {
          console.log('error block');
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log('error **', error.response.data);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const checkApplicationPermission = async () => {
    try {
      const authorizationStatus = await messaging().requestPermission();
      postFCMToken();
    } catch (error) {
      global.showToast(error, 'err');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          redirectToExplore();
          return true;
        },
      );
      return () => backHandlerdata.remove();
    }, []),
  );

  const redirectToExplore = async () => {
    await AsyncStorage.setItem('isCompleteOnboarding', '1');
    await AsyncStorage.setItem('isClickedExplore', '1');
    if (navigationValue !== 4) {
      dispatch(setNavigationValue(4));
    } else {
      navigation.navigate('Explore');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {authDetails.loader || loader ? <ActivityLoader /> : null}
        {/* style={commonStyle.headerlogo} */}
        {/* style={commonStyle.logo} */}
        <View style={[commonStyle.headerlogo, { flexDirection: 'row' }]}>
          <TouchableOpacity
            style={{ flexShrink: 1 }}
            onPress={() => {
              redirectToExplore();
              // navigation.goBack();
              // navigation.navigate('signup_account_type');
            }}>
            {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image source={logo} style={[commonStyle.logo]} />
          </View>
        </View>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              Sign In
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter your email
              </Text>
              <Controller
                name="email"
                control={control}
                defaultValue=""
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
                    onFocus={() => setIsEmailFocus(true)}
                    returnKeyType="next"
                    keyboardType="email-address"
                    onSubmitEditing={() => ref_inputpassword.current.focus()}
                    autoCapitalize={'none'}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.email?.message}
                </Text>
              )}
            </View>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Password
              </Text>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: { value: true, message: 'Password is required' },
                }}
                render={({ onChange, value }) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      commonStyle.icontextinput,
                      isPassFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsPassFocus(true)}
                    ref={ref_inputpassword}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    secureTextEntry={showPassword}
                    value={value}
                    onChangeText={(text) => {
                      setPassword(text);
                      onChange(text);
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
            <View style={[commonStyle.fogotpassWrap, commonStyle.mb15]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text style={commonStyle.blackTextR}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={[commonStyle.mb3]}>
              <Button
                title="Sign In"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={handleSubmit(onSubmitHandler)}
              />
            </View>

            {/* <View style={commonStyle.mb15}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.btnsocial}>
                <Image
                  style={commonStyle.socialIcon}
                  source={require('../assets/images/apple.png')}
                />
                <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
                  Sign In with Apple
                </Text>
              </TouchableOpacity>
            </View> */}
            {/*No longer in app scope - Confirmed by Tanmoy  */}

            <View style={[commonStyle.termswrap, commonStyle.mb4]}>
              <Text style={[commonStyle.dividerline]}></Text>
              <Text style={[commonStyle.blackText16, commonStyle.ordivider]}>
                or
              </Text>
              <Text style={[commonStyle.dividerline]}></Text>
            </View>
            <AppleLoginBtn
              appleLoginSuccessHandler={appleLoginSuccessHandler}
              text="Sign In"
            />

            {/* <FacebookLoginBtn
              facebookLoginSuccessHandler={facebookLoginSuccessHandler}
              text="Sign In"
            />
            <GoogleLoginBtn
              googleLoginSuccessHandler={googleLoginSuccessHandler}
              text="Sign In"
            /> */}

            <View style={[commonStyle.termswrap, commonStyle.mb3]}>
              <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
                Don’t have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('signup_account_type')}>
                <Text style={commonStyle.blackText16}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Container>
    </Fragment>
  );
};

export default Login;
