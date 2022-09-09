import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BottomTabScreen from '../navigation/BottomTab/BottomTab';
import AfterLoginClientStack from '../navigation/StackNavigation/AfterLoginClientStack';
import AfterLoginProfessionalStack from '../navigation/StackNavigation/AfterLoginProfessionalStack';
import BeforeAuthStack from '../navigation/StackNavigation/BeforeAuthStack';
import { setNavigationValue, setOnboardingValue } from '../store/actions';
import { Post } from '../api/apiAgent';
import postFCMToken from '../utility/postFCMToken';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { Get } from '../api/apiAgent';
import { isReadyRef, navigationRef } from '../helpers/rootNavigation';
import { setInitialStepValue } from '../store/actions/nagationAction';
import { strEmailVerified, strMobileVerified } from '../utility/config';
// import * as RootNavigation from '../helpers/'
const linkingObj = {
  prefixes: ['https://readyhubb.app.link.com', 'https://readyhubb.app.link'],
  config: {
    Login: 'login',
  },
};

export const Navigations = ({ }) => {
  // console.log({shouldNavigate});
  const dispatch = useDispatch();
  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );
  // const [shouldNavigate, setShouldNavigate] = useState(null);
  // const getNavigationRoute = async () => {
  //   const res = await AsyncStorage.getItem('shouldNavigate');
  //   setShouldNavigate(res);
  // };

  // useLayoutEffect(() => {
  //   if (shouldNavigate) {
  //     <AfterLoginProfessionalStack navigationScreenName={shouldNavigate} />;
  //   }
  // }, []);
  const setIpAddress = async () => {
    axios
      .get('https://api.ipify.org/?format=json')
      .then((res) => {
        // console.log('ip address res', res?.data);
        AsyncStorage.setItem('ip_address', res?.data?.ip);
        // AsyncStorage.setItem('ip_address', res?.ip);
      })
      .catch((e) => {
        console.log('ip error', e);
      });
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

  useEffect(() => {
    redirectionLogin();
    setIpAddress();
  }, []);

  // const handleNavigation = () => {
  //   if (shouldNavigate) {
  //     return (
  //       <AfterLoginProfessionalStack navigationScreenName={shouldNavigate} />
  //     );
  //   }
  // };

  const redirectionLogin = async () => {
    try {
      let isCompleteOnboarding = await AsyncStorage.getItem(
        'isCompleteOnboarding',
      );
      let userType = await AsyncStorage.getItem('userType');
      if (userType == 0 || userType == 1) {
        dispatch({ type: 'USER_TYPE_STATUS', status: userType });
      } else {
        dispatch({ type: 'USER_TYPE_STATUS', status: null });
      }
      dispatch(setOnboardingValue(0));
      // if (isCompleteOnboarding) {
      //   dispatch(setOnboardingValue(1));
      //   // dispatch(setOnboardingValue(4));
      // } else {
      //   dispatch(setOnboardingValue(0));
      // }
    } catch (error) {
      dispatch(setOnboardingValue(0));
    }

    try {
      let token = await AsyncStorage.getItem('accessToken');
      let isValidForLogin = await AsyncStorage.getItem('isValidForLogin');
      // let isEmailVerified = await AsyncStorage.getItem('emailVerified');
      // let mobileVerified = await AsyncStorage.getItem('mobileVerified');
      console.log("************* WELCOME LOGIN ******************")
      console.log("isValidForLogin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(isValidForLogin);
      if (isValidForLogin) {
        let isEmailVerified = await AsyncStorage.getItem(strEmailVerified);
        let mobileVerified = await AsyncStorage.getItem(strMobileVerified);
        console.log("isValidForLogin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(isValidForLogin);
        console.log("isEmailVerified >> ", isEmailVerified);
        console.log("mobileVerified >> " + mobileVerified);

        if (isEmailVerified == "0") {
          console.log("EMAIL VERIFIED FAILED");
          dispatch(setOnboardingValue(0));
          dispatch(setNavigationValue(1));
          // dispatch(setNavigationValue(3));
        } else if (mobileVerified == "0") {
          console.log("MOBILE NUMBER VERIFIED FAILED");
          dispatch(setInitialStepValue("SignupPhone"));
          dispatch(setNavigationValue(1));
        } else {
          console.log("USER IS VALID");
          if (token && isValidForLogin) {
            // dispatch(setOnboardingValue(1));
            // dispatch(setNavigationValue(4));
            // checkApplicationPermission();

            let userType = await AsyncStorage.getItem('userType');
            console.log("userType >>>>>> ", userType)

            if (userType == 0) {
              dispatch({ type: 'USER_TYPE_STATUS', status: 0 });
              // dispatch({ type: IS_LAST_STEP, value: true });
              // dispatch(setNavigationValue(2))

              // dispatch(setOnboardingValue(1));
              // dispatch(setNavigationValue(4));
              getClientCompleteInfo();
            } else {
              dispatch({ type: 'USER_TYPE_STATUS', status: 1 });
              getBusinessCompleteInfo();
            }
            // getBusinessCompleteInfo();
          }
        }
      } else {
        console.log("****** Line 167 *********")
        dispatch(setOnboardingValue(0));
        dispatch(setNavigationValue(1));
      }


      return;
      // if (shouldNavigate) {
      //   dispatch(setNavigationValue(3));
      // }
      if (token && isValidForLogin) {
        // dispatch(setOnboardingValue(1));
        dispatch(setNavigationValue(4));
        checkApplicationPermission();
      } else {
        // dispatch(setNavigationValue(1));
        // dispatch(setNavigationValue(4));
        dispatch(setOnboardingValue(0));
        dispatch(setNavigationValue(1));
      }

      // let isCompleteOnboarding = await AsyncStorage.getItem(
      //   'isCompleteOnboarding',
      // );
      // if (isCompleteOnboarding) {
      //   dispatch(setNavigationValue(4));
      // } else {
      //   dispatch(setNavigationValue(1));
      // }
    } catch (error) {
      console.log("****** ERROR IN LINE 197 = ", error)
      dispatch(setNavigationValue(1));
    }
  };

  const getBusinessCompleteInfo = () => {
    console.log("getBusinessCompleteInfo");
    // setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        // setLoader(false);
        console.log(result);
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
        console.log("ERRRRRRR000000>>>>>>>>>>>>>>>> ", error)
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
          if (businessInfoDetails.skipStepDetails != null) {
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



  const checkUserDidCompleteAllTheRequiredStep = async () => {
    try {
      let isEmailVerified = await AsyncStorage.getItem('emailVerified');
      let mobileVerified = await AsyncStorage.getItem('mobileVerified');
      console.log("isValidForLogin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      console.log(isValidForLogin);
      console.log("isEmailVerified >> ", isEmailVerified);
      console.log("mobileVerified >> " + mobileVerified);

      if (isEmailVerified == "0") {
        console.log("EMAIL VERIFIED FAILED");
        dispatch(setOnboardingValue(0));
        dispatch(setNavigationValue(1));
        // dispatch(setNavigationValue(3));
      } else if (mobileVerified == "0") {
        console.log("MOBILE NUMBER VERIFIED FAILED");
        dispatch(setInitialStepValue("SignupPhone"));
        dispatch(setNavigationValue(1));
      } else {
        console.log("USER IS VALID");
        if (token && isValidForLogin) {
          // dispatch(setOnboardingValue(1));
          dispatch(setNavigationValue(4));
          checkApplicationPermission();
        }
      }
    } catch (error) {
      global.showToast(error, 'err');
    }
  };


  const checkApplicationPermission = async () => {
    try {
      const authorizationStatus = await messaging().requestPermission();
      postFCMToken();
    } catch (error) {
      global.showToast(error, 'err');
    }
  };

  const navigationTypeBaseOnSetData = (value) => {
    switch (value) {
      case 1:
        return <BeforeAuthStack />;
      case 2:
        return <AfterLoginClientStack />;
      case 3:
        return <AfterLoginProfessionalStack />;
      case 4:
        return <BottomTabScreen />;
      default:
        break;
    }
  };

  return (
    <NavigationContainer
      linking={linkingObj}
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}>
      {navigationTypeBaseOnSetData(navigationValue)}
    </NavigationContainer>
  );
};
