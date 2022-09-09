import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Body, Container, Left, List, ListItem } from 'native-base';
import { NativeModules } from "react-native";
import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  RefreshControl,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Button, colors } from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import PTRView from 'react-native-pull-to-refresh';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../api/apiAgent';
import commonStyle, { fontRegular } from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import NetworkError from '../components/error/NetworkError';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import {
  AccountSettingIcon,
  BusinessSettingIcon,
  CameraSmall,
  EditIconOrange,
  FaqHelpIcon,
  FavoritesIcon,
  InspirationIcon,
  InviteIcon,
  PrivacyIcon,
  RightAngle,
  StarIcon,
  MapPointer,
  LeftArrowAndroid,
  LeftArrowIos,
  CopyIcon,
  EyeOpen,
  CloseIcon,
} from '../components/icons';
import {
  profileImgUpdateRequest,
  profileImgUpdateRequestClear,
  profileViewRequest,
  profileViewRequestClear,
} from '../store/actions/profileAction';
import { CompleteProfileModal, UploadPhotoVideoModal } from '../components/modal';
import Clipboard from '@react-native-community/clipboard';
import { FRONTEND_BASE_PATH } from '../api/constant';
import base64 from 'react-native-base64';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useFocusEffect } from '@react-navigation/native';
import { Get } from '../api/apiAgent';
import { setInitialStepValue } from '../store/actions/nagationAction';
import { checkGracePeriodExpiry } from '../utility/fetchGracePeriodData';
import {
  setNavigationValue,
  trialExpireCheckRequest,
  trialExpireCheckRequestClear,
  setOnboardingValue
} from '../store/actions';
import { setupIntercom } from '../utility/commonService';
import Intercom from '@intercom/intercom-react-native';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { shadow } from 'react-native-paper';
import moment from 'moment';
import {
  IS_LAST_STEP,
  TOGGLE_CLIENT_SIGNUP_BACK_BUTTON,
} from '../store/actionTypes';
import EventEmitter from 'react-native-eventemitter';

const Profile = ({ navigation, route }) => {
  const [modalVisible, setModalVisible] = useState(false);
  // Declare the constant
  const [refreshing, setRefreshing] = React.useState(false);

  const dispatch = useDispatch();
  const [filePath, setFilePath] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setcountryCode] = useState('');
  const [rating, setRating] = useState('');
  const [accountType, setAccountType] = useState();
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  const updateImgDataRes = useSelector(
    (state) => state.profileReducer.updateImgDetails,
  );
  const updateMsg = useSelector((state) => state.profileReducer.updateMsg);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const loginUserType = useSelector((state) => state.auth.userType);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState();
  const [internetConn, setInternetConn] = useState(true);
  const [profileCompleteData, setProfileCompleteData] = useState(null);
  const [isCompleteProfileModalVisible, setIsCompleteProfileModalVisible] =
    useState(false);
  const [scrollOffset, setScrollOffset] = useState();

  const subscriptionData = useSelector(
    (state) => state.VerificationReducer.trialExpireCheckDetails,
  );
  const trialPlanChecking = useSelector(
    (state) => state.VerificationReducer.trialPlanCheckingStatus,
  );
  const scrollViewRef = useRef(0);

  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );


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

  useFocusEffect(
    React.useCallback(() => {
      navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true,
      });
      dispatch({ type: TOGGLE_CLIENT_SIGNUP_BACK_BUTTON, value: false });
    }, [navigation]),
  );
  // console.log('Profile Data: ', profileData);
  console.log('profileData', JSON.stringify(profileData?.data, null, 2));
  // console.log('Login user type : ', loginUserType);
  useEffect(() => {
    if (loginUserType == 1) {
      let mainData = profileData?.data;
      setupIntercom({
        email: mainData?.email,
        name: mainData?.userName,
        id: mainData?.id,
        type: mainData?.isProfessional,
      });


    } else {
      Intercom?.logout();
    }
  }, [loginUserType, profileData]);
  // This is called as main function
  const mainFunction = () => {
    dispatch(profileViewRequest());
  };

  useFocusEffect(
    useCallback(() => {
      getBusinessCompleteInfo();
    }, []),
  );

  useEffect(() => {
    // navigation.push('SubscriptionInfo', {
    //   // day: subscriptionData?.data?.expiresIn,
    //   // trialBtn: false,
    //   // dayText: dateStatusText,
    // });
    // console.log('mera', JSON.stringify(subscriptionData, null, 2));

    dispatch(trialExpireCheckRequest());
  }, []);

  useEffect(() => {
    EventEmitter.on('SwitchProfile', () => {
      checkSwitchPendingTask('stopNavigation');
    });
    return () => {
      EventEmitter.off('SwitchProfile');
    };
  }, []);

  useEffect(() => {
    // setLoderStatus(true);
    // setTimeout(() => {
    //   // setLoderStatus(false);
    // }, 2000);
    if (loginUserType == 1) {
      if (subscriptionData && subscriptionData.status == 200) {
        // console.log('sheela', JSON.stringify(subscriptionData, null, 2));
        if (Object.keys(subscriptionData?.data).length !== 0) {
          let trialDate = subscriptionData?.data?.date;
          let a = moment(subscriptionData?.data?.expiresIn).format(
            'YYYY-MM-DD',
          );
          let dateStatusText;
          let todayDate = moment(new Date()).format('YYYY-MM-DD');
          let remainingDays = moment(trialDate).diff(moment(todayDate), 'day');

          if (todayDate > trialDate) {
            // setPlanActive(false);
            dateStatusText = `Your trial has expired ${remainingDays} days ago`;
          } else if (todayDate == trialDate) {
            dateStatusText = 'Your trial has expired';
            // setPlanActive(false);
          } else {
            dateStatusText = `Your trial will expire in ${remainingDays} ${remainingDays > 1 ? 'days' : 'day'
              }`;
            // setPlanActive(true);
          }

          if (subscriptionData?.data?.planType == '1') {

            dispatch(trialExpireCheckRequestClear());
            if (trialPlanChecking === false) {
              // global.showToast(
              //   'We are fetching your subscription details',
              //   'info',
              // );
              // setTimeout(() => {
              //   navigation.navigate('SubscriptionInfo', {
              //     day: remainingDays + '',
              //     trialBtn: false,
              //     dayText: dateStatusText,
              //   });
              // }, 100);
              // dispatch({ type: 'TRIAL_PLAN_CHANGE_STATUS' });
            }
          }
          // console.log('dateStatusText is', dateStatusText, subscriptionData);
        } else {
          dispatch(trialExpireCheckRequestClear());
        }
      } else if (subscriptionData && subscriptionData.status == 400) {
        dispatch(trialExpireCheckRequestClear());
        setTimeout(() => {
          navigation.navigate('SubscriptionInfo', {
            day: 0,
            trialBtn: true,
            dayText: '',
          });
        }, 100);
      }
    }
  }, [subscriptionData]);

  // useEffect(() => {
  //   EventEmitter.on('GET_PROFILE_COMPLETION_STATUS', () => {
  //     getBusinessCompleteInfo();
  //   });
  //   return () => {
  //     EventEmitter.off('GET_PROFILE_COMPLETION_STATUS');
  //   };
  // }, []);

  const getBusinessCompleteInfo = () => {
    // setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        setProfileCompleteData(result?.data);
        // setLoader(false);
        // console.log(result.data);
        if (result.status === 200) {
          // setBusinessInfoDetails(result.data);
          if (result.data.percentage === 100) {
            // Start Change: Snehasish Das, Issue #1698
            // setProfileFinished(true);
            // End Change: Snehasish Das, Issue #1698
            // formatDate();
          }
        }
      })
      .catch((error) => {
        // setLoader(false);
        // formatDate();
      });
  };

  // This methos is for handle the response
  useEffect(() => {
    if (profileData && profileData.status == 200) {
      // if (profileData.data && profileData.data.currentUserType) {
      //   dispatch({
      //     type: 'USER_TYPE_STATUS',
      //     status: profileData.data.currentUserType,
      //   });
      // }
      dispatch(profileViewRequestClear());
    } else {
      dispatch(profileViewRequestClear());
    }
  }, [profileData]);

  // If user already signin then clear refer code
  const clearReferCode = () => {
    dispatch({ type: 'REFERRAL_CODE_CLEAR' });
  };

  useFocusEffect(
    useCallback(() => {
      NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          setInternetConn(true);
          fetchUserType();
          mainFunction();
          clearReferCode();
        } else {
          setInternetConn(false);
        }
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      checkGracePeriodExpiry()
        .then((isGracePeriodExpired) => {
          if (isGracePeriodExpired) {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, []),
  );

  const navigateBusinessTab = async () => {
    // checkGracePeriodExpiry().then((response) => {
    //   if (response) navigation.navigate('TrialFinished');
    //   else navigation.navigate('BusinessSettings');
    // });

    //* Chidi & Mow issue id 746 - remove account status completion validation

    navigation.navigate('BusinessSettings');

    // const userType = await AsyncStorage.getItem('userType');
    // if (userType == 1) {
    //   setLoading(true);
    //   Get('pro/completion-status', '')
    //     .then((result) => {
    //       setLoading(false);
    //       console.log(result.data.percentage);
    //       if (result.status === 200) {
    //         // setBusinessInfoDetails(result.data);
    //         if (result?.data?.percentage !== 100) {
    //           navigation.navigate('Bookings');
    //         } else {
    //           // global.showToast('Complete your profile first', 'error');
    //           navigation.navigate('BusinessSettings');
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       setLoading(false);
    //       console.log(error);
    //       // formatDate();
    //     });
    // }
  };

  useEffect(() => {
    if (updateImgDataRes && updateImgDataRes.status == 200) {
      global.showToast(updateImgDataRes.message, 'success');
      dispatch(profileImgUpdateRequestClear());
    } else if (
      updateImgDataRes &&
      updateImgDataRes.status != 200 &&
      updateImgDataRes.status != 500
    ) {
      global.showToast(updateImgDataRes.message, 'error');
      dispatch(profileImgUpdateRequestClear());
    } else if (updateImgDataRes && updateImgDataRes.status == 500) {
      if (
        updateImgDataRes.response.data.message !== null &&
        updateImgDataRes.response.data.message !== ''
      ) {
        global.showToast(updateImgDataRes.response.data.message, 'error');
        dispatch(profileImgUpdateRequestClear());
      }
    }
  }, [updateImgDataRes]);

  useEffect(() => {
    if (profileData && profileData.status === 200) {
      let mainData = profileData.data;
      // console.log('Profile Data: ', mainData);
      dispatch({
        type: 'USER_TYPE_STATUS',
        status: mainData && mainData.currentUserType,
      });
      setUserTypeByValue(mainData.currentUserType);
      if (mainData.profileImage !== null && mainData.profileImage !== '') {
        AsyncStorage.setItem('image', mainData.profileImage);
      } else {
        AsyncStorage.setItem('image', '');
      }
      AsyncStorage.setItem('userId', mainData.id && mainData.id.toString());
      mainData.profileImage !== null && mainData.profileImage !== ''
        ? setFilePath(mainData.profileImage)
        : setFilePath('');

      mainData.userName !== null && mainData.userName !== ''
        ? setName(mainData.userName)
        : setName('');
      mainData.email !== null && mainData.email !== ''
        ? setEmail(mainData.email)
        : setEmail('');
      // mainData.phone !== null && mainData.phone !== ''
      //   ? setMobileNumber(mainData.phone)
      //   : setMobileNumber('');
      mainData?.currentUserType == 0
        ? setMobileNumber(mainData?.clientPhone)
        : setMobileNumber(mainData?.phone);
      // mainData.countryCode !== null && mainData.countryCode !== ''
      //   ? setcountryCode(mainData.countryCode)
      //   : setcountryCode('');
      mainData?.currentUserType == 0
        ? setcountryCode(mainData?.clientCountryCode)
        : setcountryCode(mainData?.countryCode);
      mainData.avg_rating !== null && mainData.avg_rating !== ''
        ? setRating(mainData.avg_rating)
        : setRating('');
      mainData.currentUserType !== null && mainData.currentUserType !== ''
        ? setAccountType(mainData.currentUserType)
        : setAccountType('');
    } else {
      if (profileData && profileData.status !== 200) {
        global.showToast(profileData.message, 'error');
      }
    }
  }, [profileData]);

  const fetchUserType = async () => {
    let userType = await AsyncStorage.getItem('userType');
    if (userType === null) {
      navigation.navigate('Explore');
      return;
    }
    setUserType(userType);
    setAccountType(userType);
  };

  const setUserTypeValue = async () => {
    try {
      await AsyncStorage.setItem('userType', userType == '1' ? '0' : '1');
      fetchUserType();
    } catch { }
  };

  const setUserTypeByValue = async (userType) => {
    // console.log('userType', userType);
    try {
      await AsyncStorage.setItem('userType', userType.toString());
      fetchUserType();
    } catch { }
  };

  // Refresh the page
  const refreshPage = () => {
    mainFunction();
  };
  // Once user want to update profile image
  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // Select the image from the picker
    ImagePicker.showImagePicker({ ...options, noData: true }, (response) => {
      // console.log(response);
      // if (response.didCancel) {
      //   console.log('User cancelled image picker');
      // } else if (response.error) {
      //   console.log('ImagePicker Error: ', response.error);
      // } else if (response.customButton) {
      //   console.log('User tapped custom button: ', response.customButton);
      // } else {
      //   if (Platform.OS === 'ios') {
      //     let path = response.uri;
      //     path = '~' + path.substring(path.indexOf('/Documents'));
      //     response.fileName = path.split('/').pop();
      //   }
      //   let imageFile = {
      //     name: response.fileName,
      //     type: response.type,
      //     uri: response.uri,
      //   };
      //   if (
      //     response.type === 'image/jpg' ||
      //     response.type === 'image/jpeg' ||
      //     response.type === 'image/png'
      //   ) {
      //     let actualImagePath =
      //       'data:' + response.type + ';base64,' + response.data;
      //     setFilePath(actualImagePath);
      //     let formObj = new FormData();
      //     formObj.append('profileImage', imageFile);
      //     dispatch(profileImgUpdateRequest(formObj));
      //   } else {
      //     global.showToast(
      //       'Only jpg, jpeg or png images are accepted',
      //       'error',
      //     );
      //   }
      // }
    });
  };

  //* Custom Gallery File Selection Event
  const fileSelectedEvent = (items) => {
    // console.log(
    //   JSON.stringify(items),
    //   // items,
    //   // items[0].node.image,
    //   // items[0].node.image.filename,
    //   // items[0].node.image.uri,
    // );
    setModalVisible(false);
    if (items[0].node.image?.fileSize > 10485760) {
      global.showToast(
        'Oops! The size limit for Profile Pictures is 10 MB. Reduce the file size and try again.',
        'error',
      );
      return;
    }

    let imageFile = {
      name: items[0].node.image.filename,
      type: items[0].node.type === 'image' ? 'image/jpg' : items[0].node.type,
      uri: items[0].node.image.uri,
    };

    if (
      items[0].node.type === 'image/jpg' ||
      items[0].node.type === 'image/jpeg' ||
      items[0].node.type === 'image/png' ||
      items[0].node.type === 'image' ||
      items[0].node.type === 'image/bmp' ||
      items[0].node.type === 'image/x-ms-bmp'
    ) {
      setFilePath(items[0].node.image.uri);

      let formObj = new FormData();
      formObj.append('profileImage', imageFile);
      dispatch(profileImgUpdateRequest(formObj));
    } else {
      global.showToast(
        'Only jpg, jpeg, bmp or png images are accepted',
        'error',
      );
    }
  };

  const cameraSubmitEvent = (response) => {
    // console.log(response);
    setModalVisible(false);

    if (response.fileSize > 10485760) {
      global.showToast(
        'Oops! The size limit for Profile Pictures is 10 MB. Reduce the file size and try again.',
        'error',
      );
      return;
    }

    if (Platform.OS === 'ios') {
      let path = response.uri;
      path = '~' + path.substring(path.indexOf('/Documents'));
      response.fileName = path.split('/').pop();
    }
    let imageFile = {
      name: response.fileName,
      type: response.type,
      uri: response.uri,
    };
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png' ||
      response.type === 'image/bmp' ||
      response.type === 'image/x-ms-bmp'
    ) {
      let actualImagePath =
        'data:' + response.type + ';base64,' + response.data;
      setFilePath(actualImagePath);

      let formObj = new FormData();
      formObj.append('profileImage', imageFile);
      dispatch(profileImgUpdateRequest(formObj));
    } else {
      global.showToast(
        'Only jpg, jpeg, bmp or png images are accepted',
        'error',
      );
    }
  };

  // This method is to start the trial
  const startTrial = () => {
    Post('/pro/start-trial')
      .then((result) => {
        // console.log('Trial Result : ', result);
        if (result.status === 200) {
          // global.showToast('Your trial has started from today', 'success');
          dispatch(trialExpireCheckRequest());
        }
      })
      .catch((error) => {
        if (
          error?.response?.data?.status === 403 ||
          error?.response?.data?.status === '403'
        ) {
          dispatch(trialExpireCheckRequest());
        }
      });
  };

  const getBusinessCompleteInfo1 = () => {
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
        }
      })
      .catch((error) => {
        console.log("ERRrrrrrrr>>>>>>>>> ", error)
        // setLoader(false);
        // formatDate();
      });
  };


  const checkSwitchPendingTask = async (stopNavigation) => {
    setLoading(true);
    Post('common/switch', {})
      .then(async (result) => {
        // console.log('result', result);
        setLoading(false);
        if (result.status === 200) {
          let data = result.data;
          console.log('Switch data : ', data);
          console.log('Switch data USER TYPE >>>> : ', userType);
          if (userType === 0 || userType === '0') {
            dispatch({ type: 'USER_TYPE_STATUS', status: 1 });
          } else {
            dispatch({ type: 'USER_TYPE_STATUS', status: 0 });
          }
          await setUserTypeValue();
          // console.log('Switched user type : ', userType);
          console.log('AFTER Switch data USER TYPE >>>> : ', userType);

          //*Mow chidi To do list issue - 776 - remove check step before switching profile - start
          if (userType === '0') {
            console.log("USER TYPE EEEEE EEE EE >> ", userType)
            getBusinessCompleteInfo1();
            // dispatch(setOnboardingValue(1));
            // dispatch(setNavigationValue(4));
          } else {
            console.log("USER TYPE EEEEE EEE EE  NNN >> ", userType)
            // 
            if (data.categories === 0 || data.location === 0) {
              if (!stopNavigation) {
                dispatch({
                  type: 'SET_CLIENT_LANDING_PAGE',
                  value: 'SignupCategories',
                });
                dispatch({ type: 'SET_NAVIGATION_VALUE', value: 2 });
                dispatch({ type: TOGGLE_CLIENT_SIGNUP_BACK_BUTTON, value: true });
              }
            } else {
              dispatch(setOnboardingValue(1));
              dispatch(setNavigationValue(4));
            }
          }
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  // Swaith to professional account confimation message
  const switchToProfessionalConfimation = () => {
    let msg =
      userType == 0
        ? 'Are you sure?  Confirm switch to your Readyhubb professional account'
        : 'Are you sure? Confirm switch to your Readyhubb client account';
    Alert.alert(
      'Confirmation',
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => checkSwitchPendingTask() },
      ],
      { cancelable: false },
    );
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const determineUserType = async () => {
  //       const userType = await AsyncStorage.getItem('userType');
  //       if (userType == 1) {
  //         setLoading(true);
  //         Get('pro/completion-status', '')
  //           .then((result) => {
  //             setLoading(false);
  //             console.log(result.data.percentage);
  //             if (result.status === 200) {
  //               // setBusinessInfoDetails(result.data);
  //               if (result?.data?.percentage !== 100) {
  //                 navigation.navigate('Bookings');
  //               }
  //             }
  //           })
  //           .catch((error) => {
  //             setLoading(false);
  //             console.log(error);
  //             // formatDate();
  //           });
  //       }
  //     };

  //     determineUserType();
  //   }, []),
  // );

  // useEffect(() => {
  //   console.log('This page is called **********');
  // }, []);

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loderStatus || loading ? <ActivityLoaderSolid /> : null}
        {internetConn !== null && internetConn === true ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={refreshPage} />
            }>
            <View style={commonStyle.accountprofilewrap}>
              <View>
                <View style={commonStyle.clientProfilebox}>
                  {filePath !== '' ? (
                    <Image
                      style={commonStyle.clientProfileimg}
                      source={{ uri: filePath }}
                      resizeMode={'cover'}
                    />
                  ) : (
                    <Image
                      style={commonStyle.defaultprofilepic}
                      source={require('../assets/images/signup/account-avater-1.png')}
                    />
                  )}
                </View>
                <TouchableOpacity
                  style={commonStyle.camerabtn}
                  activeOpacity={0.5}
                  onPress={() => setModalVisible(true)}>
                  {filePath !== '' ? <EditIconOrange /> : <CameraSmall />}
                </TouchableOpacity>
              </View>
              <View style={commonStyle.mt2}>
                <Text
                  style={[
                    commonStyle.modalforgotheading,
                    commonStyle.textCenter,
                    commonStyle.mb1,
                  ]}>
                  {name}
                </Text>
                <Text
                  style={[
                    commonStyle.grayText14,
                    commonStyle.textCenter,
                    commonStyle.mb1,
                  ]}>
                  {email}
                </Text>
                <Text
                  style={[
                    commonStyle.grayText14,
                    commonStyle.textCenter,
                    commonStyle.mb2,
                  ]}>
                  {countryCode} {mobileNumber}
                </Text>
                {userType == 1 && profileCompleteData?.percentage !== 100 ? (
                  <TouchableOpacity
                    onPress={() => {
                      // setIsCompleteProfileModalVisible(true);
                      navigation?.navigate('CompleteProfile', {
                        businessCompletionDetails:
                          profileCompleteData &&
                          profileCompleteData.completionDetails,
                      });
                    }}>
                    <View
                      style={[
                        {
                          backgroundColor: '#fff',
                          marginBottom: 15,
                          padding: 10,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: ScreenWidth * 0.6,
                          justifyContent: 'space-between',
                          paddingHorizontal: 15,
                          height: 52,

                          borderWidth: 1,
                          borderColor: '#ECEDEE',
                        },
                      ]}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <AnimatedCircularProgress
                          size={30}
                          width={2}
                          fill={profileCompleteData?.percentage}
                          tintColor="#f36A46"
                          rotation={0}
                          children={() => (
                            <Text
                              style={{
                                fontSize: 10,
                                ...fontRegular,
                                textAlign: 'center',
                              }}>
                              {`${profileCompleteData?.percentage}%`}
                            </Text>
                          )}
                          // onAnimationComplete={() =>
                          //   console.log('onAnimationComplete')
                          // }
                          backgroundColor="rgba(243, 106, 70, 0.2)"
                        />

                        <Text style={{ paddingStart: 10, ...fontRegular }}>
                          Complete My Profile
                        </Text>
                      </View>
                      <RightAngle />
                    </View>
                  </TouchableOpacity>
                ) : null}
                {/* {loginUserType === 1 &&
                profileData?.data?.mobileVerified != 1 ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation?.navigate('SignupPhone', {
                        navigatedFrom: 'profile',
                        countryCode: profileData?.data?.countryCode,
                        phone: profileData?.data?.phone,
                      });
                    }}>
                    <View
                      style={[
                        {
                          backgroundColor: '#fff',
                          marginBottom: 25,
                          padding: 10,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: ScreenWidth * 0.6,
                          justifyContent: 'space-between',
                          paddingHorizontal: 15,
                          height: 52,
                          borderWidth: 1,
                          borderColor: '#ECEDEE',
                        },
                      ]}>
                      <Text style={{paddingStart: 10, ...fontRegular}}>
                        Verify your mobile
                      </Text>
                      <RightAngle />
                    </View>
                  </TouchableOpacity>
                ) : null} */}
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {loginUserType == 1 && (
                    <TouchableOpacity
                      style={[commonStyle.otherWhiteBtn, commonStyle.shadow]}
                      onPress={async () => {
                        // const profileUrl = `${FRONTEND_BASE_PATH}/profile-pro-details?proProfile=${base64.encode(
                        //   profileData?.data?.id.toString(),
                        // )}&share=1`;

                        const profileUrl = `${FRONTEND_BASE_PATH}/profile-pro-details/${profileData?.data?.id.toString()}/${encodeURIComponent(
                          profileData?.data?.userName,
                        )}?share=1`;

                        Clipboard.setString(profileUrl);
                        global.showToast('Copied to clipboard', 'success');
                      }}>
                      <CopyIcon />
                    </TouchableOpacity>
                  )}
                  {loginUserType == 0 ? (
                    rating !== '' && rating !== 0 ? (
                      <TouchableOpacity
                        style={[commonStyle.ratingWhitebtn, commonStyle.shadow]}
                        onPress={() =>
                          navigation.navigate('ProfileRatingReviews', {
                            avgRatings: rating,
                          })
                        }>
                        <Text style={[commonStyle.blackText16]}>
                          <StarIcon /> {rating}
                        </Text>
                      </TouchableOpacity>
                    ) : null
                  ) : rating !== '' && rating !== 0 ? (
                    <TouchableOpacity
                      style={[commonStyle.ratingWhitebtn, commonStyle.shadow]}
                      onPress={() =>
                        navigation.navigate(
                          'PrefessionalProfileRatingReviews',
                          {
                            avgRatings: rating,
                          },
                        )
                      }>
                      <Text style={[commonStyle.blackText16]}>
                        <StarIcon /> {rating}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                  {loginUserType == 1 && (
                    <TouchableOpacity
                      style={[commonStyle.otherWhiteBtn, commonStyle.shadow]}
                      onPress={() => {
                        navigation.navigate('ProfessionalPublicProfile', {
                          proId: profileData?.data?.id,
                          doubleBack: false,
                          singleBack: true,
                        });
                      }}>
                      <EyeOpen />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View style={commonStyle.horizontalPadd}>
              {accountType && accountType != 1 ? (
                <TouchableOpacity
                  style={commonStyle.profileRoutingList}
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate('ProfileFavorites')}>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight style={commonStyle.haederback}>
                      <FavoritesIcon />
                    </TouchableHighlight>
                    <Text style={commonStyle.texttimeblack}>Favorites</Text>
                  </View>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
              ) : null}

              {accountType && accountType == 1 ? (
                <TouchableOpacity
                  style={commonStyle.profileRoutingList}
                  activeOpacity={0.5}
                  onPress={() => navigateBusinessTab()}>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight style={commonStyle.haederback}>
                      <BusinessSettingIcon />
                    </TouchableHighlight>
                    <Text style={commonStyle.texttimeblack}>
                      Business settings
                    </Text>
                  </View>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={commonStyle.profileRoutingList}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('AccountSettings')}>
                <View style={commonStyle.searchBarText}>
                  <TouchableHighlight style={commonStyle.haederback}>
                    <AccountSettingIcon />
                  </TouchableHighlight>
                  <Text style={commonStyle.texttimeblack}>
                    Account settings
                  </Text>
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>

              {accountType && accountType == 1 ? (
                <>
                  <TouchableOpacity
                    style={commonStyle.profileRoutingList}
                    activeOpacity={0.5}
                    onPress={() =>
                      navigation.navigate('ProfessionalInspirationPostList')
                    }>
                    <View style={commonStyle.searchBarText}>
                      <TouchableHighlight style={commonStyle.haederback}>
                        <InspirationIcon />
                      </TouchableHighlight>
                      <Text style={commonStyle.texttimeblack}>
                        Inspiration posts
                      </Text>
                    </View>
                    <TouchableHighlight>
                      <RightAngle />
                    </TouchableHighlight>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={commonStyle.profileRoutingList}
                    activeOpacity={0.5}
                    onPress={() => navigation.navigate('ProfileInvitePro')}>
                    <View style={commonStyle.searchBarText}>
                      <TouchableHighlight style={commonStyle.haederback}>
                        <InviteIcon />
                      </TouchableHighlight>
                      <Text style={commonStyle.texttimeblack}>Invite Pro</Text>
                    </View>
                    <TouchableHighlight>
                      <RightAngle />
                    </TouchableHighlight>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={commonStyle.profileRoutingList}
                  activeOpacity={0.5}
                  onPress={() => navigation.navigate('ProfileInviteFriends')}>
                  <View style={commonStyle.searchBarText}>
                    <TouchableHighlight style={commonStyle.haederback}>
                      <InviteIcon />
                    </TouchableHighlight>
                    <Text style={commonStyle.texttimeblack}>
                      Invite friends
                    </Text>
                  </View>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={commonStyle.profileRoutingList}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('ProfileFaqHelp')}>
                <View style={commonStyle.searchBarText}>
                  <TouchableHighlight style={commonStyle.haederback}>
                    <FaqHelpIcon />
                  </TouchableHighlight>
                  <Text style={commonStyle.texttimeblack}>FAQ and Help</Text>
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.profileRoutingList}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('TermsOfService')}>
                <View style={commonStyle.searchBarText}>
                  <TouchableHighlight style={commonStyle.haederback}>
                    <PrivacyIcon />
                  </TouchableHighlight>
                  <Text style={commonStyle.texttimeblack}>
                    Terms of Service
                  </Text>
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>
              <TouchableOpacity
                style={commonStyle.profileRoutingList}
                activeOpacity={0.5}
                onPress={() => navigation.navigate('PrivacyPolicy')}>
                <View style={commonStyle.searchBarText}>
                  <TouchableHighlight style={commonStyle.haederback}>
                    <PrivacyIcon />
                  </TouchableHighlight>
                  <Text style={commonStyle.texttimeblack}>Privacy Policy</Text>
                </View>
                <TouchableHighlight>
                  <RightAngle />
                </TouchableHighlight>
              </TouchableOpacity>
            </View>
            <View style={commonStyle.horizontalPadd}>
              <View style={commonStyle.setupCardBox}>
                <List style={commonStyle.switchAccountWrap}>
                  <ListItem thumbnail style={commonStyle.switchAccountView}>
                    <Left style={commonStyle.switchAccountavater}>
                      <Image
                        style={commonStyle.avatericon}
                        defaultSource={require('../assets/images/default.png')}
                        source={
                          userType == 1
                            ? require('../assets/images/signup/client-account.png')
                            : require('../assets/images/signup/pro-account.png')
                        }
                      />
                    </Left>
                    <Body style={commonStyle.switchAccountbody}>
                      {userType == 1 ? (
                        <Text style={commonStyle.subtextbold}>
                          Switch to client account
                        </Text>
                      ) : (
                        <Text style={commonStyle.subtextbold}>
                          Switch to professional account
                        </Text>
                      )}
                    </Body>
                  </ListItem>
                </List>
                <Button
                  title="Switch"
                  containerStyle={[commonStyle.buttoncontainerothersStyle]}
                  buttonStyle={commonStyle.changePassModalbutton}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={switchToProfessionalConfimation}
                //  onPress={() => navigation.navigate('SetupWelcome')}
                />
              </View>

              {/* <View style={commonStyle.setupCardBox}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text style={commonStyle.subtextbold}>
                    Open Photo Gallery
                  </Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </ScrollView>
        ) : (
          <NetworkError refresh={refreshPage} />
        )}
      </Container>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}
        style={commonStyle.centeredView}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              { marginTop: Platform.OS === 'ios' ? 32 : 0 },
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => setModalVisible(false)}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
            <Body style={[commonStyle.headerbacktitle, { marginLeft: -40 }]}>
              <Text style={commonStyle.blackText16}>Upload your photo</Text>
            </Body>
          </View>
          <UploadPhotoVideoModal
            visible={modalVisible}
            multiSelect={false}
            //* Available Types: All, Videos, Photos
            assetType={'Photos'}
            submitEvent={fileSelectedEvent}
            cameraSubmitEvent={cameraSubmitEvent}
            fileSizeRequired={true}
          />
        </View>
      </Modal>
      {isCompleteProfileModalVisible ? (
        <Modal
          isVisible={isCompleteProfileModalVisible}
          onSwipeComplete={() => setIsCompleteProfileModalVisible(false)}
          swipeThreshold={50}
          swipeDirection="down"
          scrollTo={handleScrollTo}
          scrollOffset={scrollOffset}
          scrollOffsetMax={500 - 100}
          animationInTiming={600}
          animationOutTiming={600}
          backdropTransitionInTiming={600}
          backdropTransitionOutTiming={600}
          propagateSwipe={true}
          style={[commonStyle.bottomModal, {}]}>
          <View style={commonStyle.scrollablefullscreenModal}>
            <TouchableOpacity
              style={{
                marginRight: 15,
                marginTop: 50,
                marginBottom: 2,
                width: 30,
                height: 30,
                alignSelf: 'flex-end',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor: 'red'
              }}
              onPress={() => setIsCompleteProfileModalVisible(false)}>
              <CloseIcon />
            </TouchableOpacity>

            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollViewRef}
              contentContainerStyle={{}}
              onScroll={handleOnScroll}
              scrollEventThrottle={10}>
              <CompleteProfileModal
                businessCompletionDetails={
                  profileCompleteData && profileCompleteData.completionDetails
                }
                businessInfoModalClose={() =>
                  setIsCompleteProfileModalVisible(false)
                }
              />
            </ScrollView>
          </View>
        </Modal>
      ) : null}
    </Fragment>
  );
};

export default Profile;
{
  /* <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Preview"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() =>
                setVisibleBusinessInfoModal({ visibleBusinessInfoModal: null }) &
                navigation.navigate('ProfessionalPublicProfile', {
                  proId: loginUserId,
                })
              }
            />
          </View> */
}
