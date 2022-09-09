import React, { useEffect, useState } from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SetupWelcome from '../../screens/proAccountSetup/setupWelcome';
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
import EventEmitter from 'react-native-eventemitter';
import { useSelector } from 'react-redux';
import Profile from '../../screens/profile';
const Stack = createStackNavigator();
const AfterLoginProfessionalStack = ({ }) => {
  // const [initialRoute, setInitialRoute] = useState(null);
  const isLastStep = useSelector(
    (state) => state.navigationValueDetails.isLastStep,
  );
  console.log('isLastStep', JSON.stringify(isLastStep, null, 2));
  const getInitialRouteName = () => {
    // if (navigationScreenName) {
    //   return navigationScreenName;
    // } else {
    // }
    return 'SetupWelcome';
  };

  // useEffect(() => {
  //   EventEmitter.on('PRO_NOT_CREATED', () => {
  //     setInitialRoute('SetupDOB');
  //   });
  // }, []);
  return (
    <Stack.Navigator
      initialRouteName={isLastStep ? 'SetupDOB' : getInitialRouteName()}
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="SetupWelcome"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupWelcome}></Stack.Screen>
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
    </Stack.Navigator>
  );
};

export default AfterLoginProfessionalStack;
