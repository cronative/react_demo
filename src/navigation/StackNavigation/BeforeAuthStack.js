import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import * as React from 'react';
import { Image, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import CreatePassword from '../../screens/createPassword';
import ForgotPassword from '../../screens/forgotPassword';
import Login from '../../screens/login';
import Onboarding from '../../screens/onboarding';
import EmailVerification from '../../screens/signup/emailVerification';
import Signup from '../../screens/signup/signup';
import SignupAccountType from '../../screens/signup/signupAccountType';
import SignupCategories from '../../screens/signup/signupCategories';
import SignupGeolocation from '../../screens/signup/signupGeolocation';
import SignupLocationSearch from '../../screens/signup/signupLocationSearch';
import SignupName from '../../screens/signup/signupName';
import SignupNotifications from '../../screens/signup/signupNotifications';
import SignupPhone from '../../screens/signup/signupPhone';
import SignupPhoneVerification from '../../screens/signup/signupPhoneVerification';
import SetupDOB from '../../screens/proAccountSetup/setupDOB';
import SetupMainCategories from '../../screens/proAccountSetup/setupMainCategories';
import SetupAdditionalCategories from '../../screens/proAccountSetup/setupAdditionalCategories';
import SetupBusiness from '../../screens/proAccountSetup/setupBusiness';
import SetupService from '../../screens/proAccountSetup/setupService';
import SetupAvailability from '../../screens/proAccountSetup/setupAvailability';
import SetupContacts from '../../screens/proAccountSetup/setupContacts';
import SetupTermsOfPayment from '../../screens/proAccountSetup/setupTermsOfPayment';
import SetupAdditionalInfo from '../../screens/proAccountSetup/setupAdditionalInfo';
import SetupFaq from '../../screens/proAccountSetup/setupFaq';
import SetupSubscription from '../../screens/proAccountSetup/setupSubscription';
import GoogleLocationAutocompletePage from '../../screens/proAccountSetup/googleLocationAutocompletePage';
import SubscriptionInfo from '../../screens/subscriptionInfo';

import Profile from '../../screens/profile';
const Stack = createStackNavigator();



function LogoTitle() {
  return (
    <Image
      style={{
        resizeMode: 'contain',
        width: 100,
        marginRight: Platform.OS === 'ios' ? 0 : 50,
        alignItems: 'center',
        alignSelf: 'center',
      }}
      source={require('../../assets/images/logo.png')}
    />
  );
}

const BeforeAuthStack = () => {
  const onBoardingValue = useSelector(
    (state) => state.navigationValueDetails.onBoardingValue,
  );
  const referCodeByUrl = useSelector((state) => state.auth.referralCode);

  const initialNav = useSelector(
    (state) => state.navigationValueDetails.initialNav,
  );
  const initialStep = useSelector(
    (state) => state.navigationValueDetails.initialStep,
  );

  console.log('on boarding val', onBoardingValue);
  console.log('on referral val', referCodeByUrl);
  console.log('initialStep>>> ', initialStep);
  console.log('initialNav>>> ', initialNav);

  console.log('initialStep>>>>>>>>>>>>>>>>>>>>>', JSON.stringify(initialStep));

  return (

    <Stack.Navigator
      // initialRouteName={initialStep ? initialStep : referCodeByUrl
      //   ? 'signup_account_type'
      //   : initialNav
      //     ? initialNav
      //     : onBoardingValue
      //       ? 'Login'
      //       : 'Onboarding'}
      initialRouteName={initialStep ? initialStep :
        referCodeByUrl
          ? 'signup_account_type'
          : initialNav
            ? initialNav
            : onBoardingValue
              ? 'Login'
              : 'Onboarding'
      }
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
        component={Onboarding}></Stack.Screen>
      <Stack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={Login}></Stack.Screen>
      <Stack.Screen
        name="SetupDOB"
        options={{
          headerShown: false,
          tabBarVisible: false,
        }}
        component={SetupDOB}></Stack.Screen>
      <Stack.Screen
        name="SetupMainCategories"
        options={{
          tabBarVisible: false,
          headerShown: false,
          // headerTruncatedBackTitle: false,
          // headerBackTitle: false,
          // headerTitle: 'Profile setup. Step 2',
          // headerStyle: {
          //   backgroundColor: '#ffffff',
          //   shadowOffset: {
          //     width: 0,
          //     height: 0,
          //   },
          //   shadowOpacity: 0,
          //   shadowRadius: 0,
          //   elevation: 0,
          //   borderBottomWidth: 0,
          // },
          // headerTintColor: '#110F17',
          // headerTitleStyle: {
          //   marginLeft: 0,
          //   paddingLeft: 0,
          //   fontFamily: 'SofiaPro-Bold',
          //   fontSize: 16,
          //   marginRight: 0,
          //   alignItems: 'center',
          //   alignSelf: 'center',
          // },
        }}
        component={SetupMainCategories}></Stack.Screen>
      <Stack.Screen
        name="SetupAdditionalCategories"
        options={{
          tabBarVisible: false,
          headerShown: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={SetupAdditionalCategories}></Stack.Screen>
      <Stack.Screen
        name="SetupBusiness"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupBusiness}></Stack.Screen>
      <Stack.Screen
        name="GoogleLocationAutocompletePage"
        options={{ headerShown: false, tabBarVisible: false }}
        component={GoogleLocationAutocompletePage}></Stack.Screen>
      <Stack.Screen
        name="SetupService"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupService}></Stack.Screen>
      <Stack.Screen
        name="SetupAvailability"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupAvailability}></Stack.Screen>
      <Stack.Screen
        name="SetupContacts"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupContacts}></Stack.Screen>
      <Stack.Screen
        name="SetupTermsOfPayment"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupTermsOfPayment}></Stack.Screen>
      <Stack.Screen
        name="SetupAdditionalInfo"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupAdditionalInfo}></Stack.Screen>
      <Stack.Screen
        name="SetupFaq"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupFaq}></Stack.Screen>
      <Stack.Screen
        name="SetupSubscription"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupSubscription}></Stack.Screen>
      <Stack.Screen
        name="SubscriptionInfo"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SubscriptionInfo}></Stack.Screen>
      <Stack.Screen
        name="signup_account_type"
        options={{ headerShown: false }}
        component={SignupAccountType}></Stack.Screen>
      <Stack.Screen
        name="Signup"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#110F17',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
          },
        }}
        component={Signup}></Stack.Screen>
      <Stack.Screen
        name="SignupName"
        options={{ headerShown: false }}
        component={SignupName}></Stack.Screen>
      <Stack.Screen
        name="SignupPhone"
        options={{ headerShown: false }}
        component={SignupPhone}></Stack.Screen>
      <Stack.Screen
        name="SignupPhoneVerification"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#110F17',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
          },
        }}
        component={SignupPhoneVerification}></Stack.Screen>
      <Stack.Screen
        name="EmailVerification"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#110F17',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
          },
        }}
        component={EmailVerification}></Stack.Screen>
      <Stack.Screen
        name="SignupCategories"
        options={{ headerShown: false }}
        component={SignupCategories}></Stack.Screen>
      <Stack.Screen
        name="SignupGeolocation"
        options={{ headerShown: false }}
        component={SignupGeolocation}></Stack.Screen>
      <Stack.Screen
        name="SignupLocationSearch"
        options={{ headerShown: false }}
        component={SignupLocationSearch}></Stack.Screen>
      <Stack.Screen
        name="SignupNotifications"
        options={{ headerShown: false }}
        component={SignupNotifications}></Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#110F17',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
          },
        }}
        component={ForgotPassword}></Stack.Screen>
      <Stack.Screen
        name="CreatePassword"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: (props) => <LogoTitle {...props} />,
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowOffset: {
              width: 0,
              height: 0,
            },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#110F17',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
          },
        }}
        component={CreatePassword}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default BeforeAuthStack;
