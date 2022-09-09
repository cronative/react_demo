import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupCategories from '../../screens/signup/signupCategories';
import SignupGeolocation from '../../screens/signup/signupGeolocation';
import SignupLocationSearch from '../../screens/signup/signupLocationSearch';
import SignupNotifications from '../../screens/signup/signupNotifications';
import { useSelector } from 'react-redux';

const Stack = createStackNavigator();

const AfterLoginClientStack = () => {
  const onClientLandingPage = useSelector(
    (state) => state.navigationValueDetails.onClientLandingPage,
  );
  return (
    <Stack.Navigator
      initialRouteName={onClientLandingPage || 'SignupCategories'}
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
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
    </Stack.Navigator>
  );
};

export default AfterLoginClientStack;
