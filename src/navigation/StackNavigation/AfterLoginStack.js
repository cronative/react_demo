import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AllCategories from '../../screens/allCategories';
import Analytics from '../../screens/analytics';
import AnalyticsBalanceWithdrowalConfirmation from '../../screens/analyticsBalanceWithdrowalConfirmation';
import AnalyticsBalanceWithdrowalMethod from '../../screens/analyticsBalanceWithdrowalMethod';
import BookingFlow from '../../screens/bookingFlow';
import BookingFlowAddCard from '../../screens/bookingFlowAddCard';
import ConfirmBookingContainer from '../../screens/bookingFlowConfirmBooking/confirmBookingContainer';
import Bookings from '../../screens/bookings';
import BookingFlowSuccess from '../../screens/bookingsFlowSuccess';
import BookingsPreviousInner from '../../screens/bookingsPreviousInner';
import BookingsPreviousInnerLeaveReview from '../../screens/bookingsPreviousInnerLeaveReview';
//BookingsPreviousInnerLeaveReview
import BookingsPreviousInnerReport from '../../screens/bookingsPreviousInnerReport';
import bookingsProInner from '../../screens/bookingsProInner';
import BookingsReschedule from '../../screens/bookingsReschedule';
import BookingsReviewPro from '../../screens/bookingsReviewPro';
import BookingsUpcomingInner from '../../screens/bookingsUpcomingInner';
import BusinessSettings from '../../screens/businessSettings/businessSettings';
import BusinessSettingsAdditionalCategories from '../../screens/businessSettings/businessSettingsAdditionalCategories';
import BusinessSettingsAdditionalInfo from '../../screens/businessSettings/businessSettingsAdditionalInfo';
import BusinessSettingsAvailability from '../../screens/businessSettings/businessSettingsAvailability';
import BusinessSettingsContacts from '../../screens/businessSettings/businessSettingsContacts';
import BusinessSettingsFaq from '../../screens/businessSettings/businessSettingsFaq';
import BusinessSettingsMainCategories from '../../screens/businessSettings/businessSettingsMainCategories';
import BusinessSettingsService from '../../screens/businessSettings/businessSettingsService';
import BusinessSettingsTermsOfPayment from '../../screens/businessSettings/businessSettingsTermsOfPayment';
import BusinessSettingsYourBusiness from '../../screens/businessSettings/businessSettingsYourBusiness';
import ClientsAddClient from '../../screens/clientsAddClient';
import ClientsAllContacts from '../../screens/clientsAllContacts';
import ClientsEditClientInfo from '../../screens/clientsEditClientInfo';
import ClientsImport from '../../screens/clientsImport';
import ClientsProfile from '../../screens/clientsProfile';
import ClientsProfileReviews from '../../screens/clientsProfileReviews';
import ClientsProfileWalkIn from '../../screens/clientsProfileWalkIn';
import ClientsWalkInClient from '../../screens/clientsWalkInClient';
import CreatePassword from '../../screens/createPassword';
import CustomerBookings from '../../screens/customerBookings';
import Explore from '../../screens/explore';
import ExploreViewAllRated from '../../screens/exploreViewAllRated';
import ForgotPassword from '../../screens/forgotPassword';
import GlobalSearch from '../../screens/GlobalSearch';
import IdVerification from '../../screens/idVerification';
import IdVerificationDocument from '../../screens/idVerificationDocument';
import IdVerificationPendingDocument from '../../screens/idVerificationPendingDocument';
import IdVerificationResubmitDocument from '../../screens/idVerificationResubmitDocument';
import Inbox from '../../screens/inbox';
import InboxInner from '../../screens/inboxInner';

import {
  InspirationAddOrEdit,
  Inspire,
  InspireInner,
  ProfessionalInspirationPostList,
} from '../../screens/inspire';
import NewWalkInBooking from '../../screens/newWalkInBooking';
import PrefessionalProfileRatingReviews from '../../screens/prefessionalProfileRatingReviews';
import PrivacyPolicy from '../../screens/privacyPolicy';
import GoogleLocationAutocompletePage from '../../screens/proAccountSetup/googleLocationAutocompletePage';
import SetupAdditionalCategories from '../../screens/proAccountSetup/setupAdditionalCategories';
import SetupAdditionalInfo from '../../screens/proAccountSetup/setupAdditionalInfo';
import SetupAvailability from '../../screens/proAccountSetup/setupAvailability';
import SetupBusiness from '../../screens/proAccountSetup/setupBusiness';
import SetupContacts from '../../screens/proAccountSetup/setupContacts';
import SetupDOB from '../../screens/proAccountSetup/setupDOB';
import SetupFaq from '../../screens/proAccountSetup/setupFaq';
import SetupMainCategories from '../../screens/proAccountSetup/setupMainCategories';
import SetupService from '../../screens/proAccountSetup/setupService';
import SetupSubscription from '../../screens/proAccountSetup/setupSubscription';
import SetupTermsOfPayment from '../../screens/proAccountSetup/setupTermsOfPayment';
import SetupWelcome from '../../screens/proAccountSetup/setupWelcome';
import Profile from '../../screens/profile';
import ProfileFaqHelp from '../../screens/profileFaqHelp';
import profileFaqHelpDetails from '../../screens/profileFaqHelpDetails';
import ProfileFavorites from '../../screens/profileFavorites';
import ProfileInviteFriends from '../../screens/profileInviteFriends';
import ProfileInvitePro from '../../screens/profileInvitePro';
import ProfileRatingReviews from '../../screens/profileRatingReviews';
import ProfileServicesNew from '../../screens/profileServices_new';
import ProfessionalPublicProfile from '../../screens/publicProfile/ProfessionalPublicProfile';
import SearchMapView from '../../screens/searchMapView';
import ServiceBookingList from '../../screens/ServiceBookingList';
import AccountSettings from '../../screens/settings/accountSettings';
import addCard from '../../screens/settings/addCard';
import ChangeEmail from '../../screens/settings/changeEmail';
import changeEmailOtpVerification from '../../screens/settings/changeEmailOtpVerification';
import ChangeName from '../../screens/settings/changeName';
import ChangePassword from '../../screens/settings/changePassword';
import ChangePhoneNumber from '../../screens/settings/changePhoneNumber';
import ChangePhoneNumberVerification from '../../screens/settings/changePhoneNumberVerification';
import editCard from '../../screens/settings/editCard';
import EditWithdrowalMethod from '../../screens/settings/editWithdrowalMethod';
import SubscriptionInfo from '../../screens/subscriptionInfo';
import TermsOfService from '../../screens/termsOfService';
import TrialFinished from '../../screens/trialFinished';
import ProWalkinDetailsContainer from '../../screens/proWalkinDetails/proWalkinDetailsContainer';
import { Delete } from '../../api/apiAgent';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { profileLinkClear } from '../../store/actions/authActions';
import SignupPhone from '../../screens/signup/signupPhone';
import SignupPhoneVerification from '../../screens/signup/signupPhoneVerification';
import { Dimensions, Image, Platform } from 'react-native';
import CompleteProfile from '../../screens/completeProfile/CompleteProfile';

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
export function ExploreStack({ route }) {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profileLink = useSelector((state) => state.auth.profileLink);
  useEffect(() => {
    if (!!profileLink) {
      setTimeout(() => {
        navigation.navigate('Explore', {
          screen: 'ProfessionalPublicProfile',
          params: {
            proId: profileLink,
            singleBack: true,
            doubleBack: false,
          },
        });
        dispatch(profileLinkClear());
      }, 100);
    }
  }, [profileLink]);

  return (
    <Stack.Navigator
      initialRouteName="Explore"
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Explore"
        options={{ headerShown: false }}
        component={Explore}></Stack.Screen>
      <Stack.Screen
        name="ExploreViewAllRated"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'View List Of Details',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ExploreViewAllRated}></Stack.Screen>
      <Stack.Screen
        name="AllCategories"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'All Categories',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={AllCategories}></Stack.Screen>
      <Stack.Screen
        name="SearchMapView"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SearchMapView}></Stack.Screen>
      <Stack.Screen
        name="GlobalSearch"
        options={{ headerShown: false, tabBarVisible: false }}
        component={GlobalSearch}></Stack.Screen>
      <Stack.Screen
        name="ProfessionalPublicProfile"
        options={{ headerShown: false, tabBarVisible: false }}
        component={ProfessionalPublicProfile}></Stack.Screen>
      <Stack.Screen
        name="BookService"
        options={({ navigation }) => ({
          tabBarVisible: false,
          headerShown: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerLeft: () => (
            <MaterialIcons
              name="chevron-left"
              size={30}
              onPress={() => {
                Delete('/user/cart')
                  .then((response) => {
                    console.log('Cart Deleted Successfully');
                  })
                  .catch((error) => {
                    console.log(error);
                  });
                navigation.goBack();
              }}
            />
          ),
          headerStyle: { elevation: 0 },
          headerTitle: 'Booking',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        })}
        component={ServiceBookingList}></Stack.Screen>
      <Stack.Screen
        name="ConfirmBooking"
        options={({ navigation }) => ({
          tabBarVisible: false,
          headerLeft: () => (
            <MaterialIcons
              name="chevron-left"
              size={30}
              onPress={() => {
                dispatch({ type: 'SET_BOOKING_EDIT', payload: true });
                navigation.goBack();
              }}
            />
          ),
          headerStyle: { elevation: 0 },
          headerTitle: 'Confirm Booking',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        })}
        component={ConfirmBookingContainer}></Stack.Screen>
      <Stack.Screen
        name="AddCreditCard"
        options={({ navigation }) => ({
          tabBarVisible: false,
          headerLeft: () => (
            <MaterialIcons
              name="chevron-left"
              size={30}
              onPress={() => navigation.goBack()}
            />
          ),
          headerStyle: { elevation: 0 },
          headerTitle: 'Add Card',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            marginLeft: 0,
            paddingLeft: 0,
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        })}
        component={BookingFlowAddCard}></Stack.Screen>
      <Stack.Screen
        name="BookingSuccess"
        component={BookingFlowSuccess}
        options={{ headerShown: false }}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            paddingLeft: 0,
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="ProfileServicesNew"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: 'Profile Service New',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileServicesNew}></Stack.Screen>
      {/* Start Change: Snehasish Das Issue #1638 */}
      <Stack.Screen
        name="TermsOfServiceInExplore"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Terms of service',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={TermsOfService}></Stack.Screen>
      <Stack.Screen
        name="PrivacyPolicyInExplore"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Privacy Policy',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={PrivacyPolicy}></Stack.Screen>
      {/* End Change: Snehasish Das Issue #1638 */}
    </Stack.Navigator>
  );
}

export function InspireStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Inspire"
        options={{ headerShown: false }}
        component={Inspire}></Stack.Screen>
      <Stack.Screen
        name="InspireInner"
        options={{ headerShown: false, tabBarVisible: false }}
        component={InspireInner}></Stack.Screen>
      <Stack.Screen
        name="ProfessionalPublicProfile"
        options={{ headerShown: false, tabBarVisible: false }}
        component={ProfessionalPublicProfile}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
    </Stack.Navigator>
  );
}

export function CustomerBookingsStack() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const profileLink = useSelector((state) => state.auth.profileLink);
  useEffect(() => {
    console.log('CustomerBooking Effect Triggered');
    if (!!profileLink) {
      navigation.navigate('Profile');
      setTimeout(() => {
        navigation.navigate('ProfessionalPublicProfile', {
          proId: profileLink,
          singleBack: true,
          doubleBack: false,
        });
      }, 100);
      dispatch(profileLinkClear());
    }
  }, [profileLink]);

  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Bookings"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={CustomerBookings}></Stack.Screen>
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
        name="NewWalkInBooking"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'New Walk-in booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={NewWalkInBooking}></Stack.Screen>
      <Stack.Screen
        name="bookingsProInner"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={bookingsProInner}></Stack.Screen>
      <Stack.Screen
        name="bookingsProWalkinDetails"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProWalkinDetailsContainer}></Stack.Screen>
      <Stack.Screen
        name="BookingFlow"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingFlow}></Stack.Screen>
      <Stack.Screen
        name="BookingFlowConfirmBooking"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Confirm booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ConfirmBookingContainer}></Stack.Screen>
      <Stack.Screen
        name="BookingFlowAddCard"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add card',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingFlowAddCard}></Stack.Screen>

      <Stack.Screen
        name="BookingsPreviousInnerLeaveReview"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Leave a review',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsPreviousInnerLeaveReview}></Stack.Screen>
      <Stack.Screen
        name="BookingsPreviousInnerReport"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Report a problem',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsPreviousInnerReport}></Stack.Screen>

      <Stack.Screen
        name="ProfessionalPublicProfile"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={ProfessionalPublicProfile}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsMainCategories"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsMainCategories}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAdditionalCategories"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAdditionalCategories}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsYourBusiness"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsYourBusiness}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsService"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsService}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAvailability"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAvailability}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsContacts"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsContacts}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsTermsOfPayment"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsTermsOfPayment}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAdditionalInfo"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAdditionalInfo}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsFaq"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsFaq}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="GoogleLocationAutocompletePage"
        options={{ headerShown: false, tabBarVisible: false }}
        component={GoogleLocationAutocompletePage}></Stack.Screen>
      <Stack.Screen
        name="TrialFinished"
        options={{ headerShown: false, tabBarVisible: false }}
        component={TrialFinished}></Stack.Screen>
    </Stack.Navigator>
  );
}

export function BookingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Bookings"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={Bookings}></Stack.Screen>
      <Stack.Screen
        name="BookingsUpcomingInner"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={BookingsUpcomingInner}></Stack.Screen>
      <Stack.Screen
        name="BookingsPreviousInner"
        options={{
          headerShown: false,
          tabBarVisible: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
        }}
        component={BookingsPreviousInner}></Stack.Screen>
      <Stack.Screen
        name="BookingsReschedule"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Reschedule booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsReschedule}></Stack.Screen>
      <Stack.Screen
        name="BookingFlowSuccess"
        options={{ headerShown: false, tabBarVisible: false }}
        component={BookingFlowSuccess}></Stack.Screen>
      <Stack.Screen
        name="BookingsPreviousInnerLeaveReview"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Leave a review',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsPreviousInnerLeaveReview}></Stack.Screen>
      {/* client rating page */}
      <Stack.Screen
        name="BookingsReviewPro"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Leave a review',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsReviewPro}></Stack.Screen>
      <Stack.Screen
        name="BookingsPreviousInnerReport"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Report a problem',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingsPreviousInnerReport}></Stack.Screen>
      <Stack.Screen
        name="BookingFlow"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingFlow}></Stack.Screen>
      <Stack.Screen
        name="BookingFlowConfirmBooking"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Confirm booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ConfirmBookingContainer}></Stack.Screen>
      <Stack.Screen
        name="BookingFlowAddCard"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add card',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BookingFlowAddCard}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
    </Stack.Navigator>
  );
}

export function InboxStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Inbox"
        options={{ headerShown: false }}
        component={Inbox}></Stack.Screen>
      <Stack.Screen
        name="InboxInner"
        options={{ headerShown: false }}
        component={InboxInner}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="TrialFinished"
        options={{ headerShown: false, tabBarVisible: false }}
        component={TrialFinished}></Stack.Screen>
    </Stack.Navigator>
  );
}

export function AnalyticsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Analytics"
        options={{ headerShown: false }}
        component={Analytics}></Stack.Screen>
      <Stack.Screen
        name="ClientsAllContacts"
        options={{ headerShown: false }}
        component={ClientsAllContacts}></Stack.Screen>
      <Stack.Screen
        name="ClientsWalkInClient"
        options={{ headerShown: false }}
        component={ClientsWalkInClient}></Stack.Screen>
      <Stack.Screen
        name="ClientsAddClient"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add walk-in client',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ClientsAddClient}></Stack.Screen>
      <Stack.Screen
        name="ClientsImport"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add clients',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ClientsImport}></Stack.Screen>
      <Stack.Screen
        name="ClientsProfile"
        options={{ headerShown: false }}
        component={ClientsProfile}></Stack.Screen>
      <Stack.Screen
        name="ClientsProfileWalkIn"
        options={{ headerShown: false }}
        component={ClientsProfileWalkIn}></Stack.Screen>
      <Stack.Screen
        name="ClientsProfileReviews"
        options={{ headerShown: false }}
        component={ClientsProfileReviews}></Stack.Screen>
      <Stack.Screen
        name="ClientsEditClientInfo"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit client info',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ClientsEditClientInfo}></Stack.Screen>
      <Stack.Screen
        name="NewWalkInBooking"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'New Walk-in booking',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={NewWalkInBooking}></Stack.Screen>
      <Stack.Screen
        name="IdVerification"
        options={{ headerShown: false }}
        component={IdVerification}></Stack.Screen>
      <Stack.Screen
        name="IdVerificationDocument"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={IdVerificationDocument}></Stack.Screen>
      <Stack.Screen
        name="IdVerificationPendingDocument"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={IdVerificationPendingDocument}></Stack.Screen>
      <Stack.Screen
        name="IdVerificationResubmitDocument"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={IdVerificationResubmitDocument}></Stack.Screen>
      <Stack.Screen
        name="AccountSettings"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Account settings',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={AccountSettings}></Stack.Screen>
      <Stack.Screen
        name="EditWithdrowalMethod"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Default withdrawal method',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={EditWithdrowalMethod}></Stack.Screen>
      <Stack.Screen
        name="AnalyticsBalanceWithdrowalMethod"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Choose withdrawal method',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={AnalyticsBalanceWithdrowalMethod}></Stack.Screen>
      <Stack.Screen
        name="AnalyticsBalanceWithdrowalConfirmation"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Confirmation',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={AnalyticsBalanceWithdrowalConfirmation}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="SubscriptionInfo"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SubscriptionInfo}></Stack.Screen>
      <Stack.Screen
        name="TrialFinished"
        options={{ headerShown: false, tabBarVisible: false }}
        component={TrialFinished}></Stack.Screen>
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        gestureEnabled: false,
        gestureDirection: 'horizontal',
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <Stack.Screen
        name="Profile"
        options={{ headerShown: false }}
        component={Profile}></Stack.Screen>
      <Stack.Screen
        name="SetupWelcome"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupWelcome}></Stack.Screen>
      <Stack.Screen
        name="changeEmailOtpVerification"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Otp Verification',
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
        component={changeEmailOtpVerification}></Stack.Screen>

      <Stack.Screen
        name="SetupDOB"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SetupDOB}></Stack.Screen>
      <Stack.Screen
        name="CompleteProfile"
        options={{
          headerShown: false,
          tabBarVisible: false,

          // ...TransitionPresets.ModalPresentationIOS,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          gestureResponseDistance: {
            vertical: Dimensions.get('screen').height,
          },
        }}
        component={CompleteProfile}></Stack.Screen>
      <Stack.Screen
        name="SubscriptionInfo"
        options={{ headerShown: false, tabBarVisible: false }}
        component={SubscriptionInfo}></Stack.Screen>
      <Stack.Screen
        name="TrialFinished"
        options={{ headerShown: false, tabBarVisible: false }}
        component={TrialFinished}></Stack.Screen>
      <Stack.Screen
        name="SetupMainCategories"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Profile setup. Step 2',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={SetupMainCategories}></Stack.Screen>
      <Stack.Screen
        name="SetupAdditionalCategories"
        options={{
          tabBarVisible: false,
          headerShown: false,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Profile setup. Step 3',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
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
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerLeft: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ffebce',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={SetupSubscription}></Stack.Screen>
      <Stack.Screen
        name="ProfileFavorites"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Favorites',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileFavorites}></Stack.Screen>
      <Stack.Screen
        name="ProfileInvitePro"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Invite your friends',
          headerStyle: {
            backgroundColor: '#ecedff',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileInvitePro}></Stack.Screen>
      <Stack.Screen
        name="ProfileInviteFriends"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
          headerStyle: {
            backgroundColor: '#ecedff',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileInviteFriends}></Stack.Screen>
      <Stack.Screen
        name="ProfileFaqHelp"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'FAQ and Help',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileFaqHelp}></Stack.Screen>
      <Stack.Screen
        name="profileFaqHelpDetails"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'FAQ and Help',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={profileFaqHelpDetails}></Stack.Screen>
      <Stack.Screen
        name="TermsOfService"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Terms of service',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={TermsOfService}></Stack.Screen>
      <Stack.Screen
        name="PrivacyPolicy"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Privacy Policy',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={PrivacyPolicy}></Stack.Screen>
      <Stack.Screen
        name="PrefessionalProfileRatingReviews"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Rating and reviews',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={PrefessionalProfileRatingReviews}></Stack.Screen>
      <Stack.Screen
        name="ProfileRatingReviews"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Rating and reviews',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ProfileRatingReviews}></Stack.Screen>
      <Stack.Screen
        name="AccountSettings"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Account settings',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={AccountSettings}></Stack.Screen>

      <Stack.Screen
        name="ChangeName"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Change name',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ChangeName}></Stack.Screen>
      <Stack.Screen
        name="ChangeEmail"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Change email',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ChangeEmail}></Stack.Screen>
      <Stack.Screen
        name="ForgotPassword"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Forgot Password',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ForgotPassword}></Stack.Screen>
      <Stack.Screen
        name="CreatePassword"
        options={{
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Create Password',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={CreatePassword}></Stack.Screen>
      <Stack.Screen
        name="ChangePassword"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Change password',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ChangePassword}></Stack.Screen>
      <Stack.Screen
        name="ChangePhoneNumber"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Change phone number',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ChangePhoneNumber}></Stack.Screen>
      <Stack.Screen
        name="ChangePhoneNumberVerification"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Change phone number',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={ChangePhoneNumberVerification}></Stack.Screen>
      <Stack.Screen
        name="editCard"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit card',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={editCard}></Stack.Screen>
      <Stack.Screen
        name="addCard"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add card',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={addCard}></Stack.Screen>
      <Stack.Screen
        name="EditWithdrowalMethod"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Withdrawal',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={EditWithdrowalMethod}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettings"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettings}></Stack.Screen>
      <Stack.Screen
        name="ProfessionalPublicProfile"
        options={{ headerShown: false, tabBarVisible: false }}
        component={ProfessionalPublicProfile}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsMainCategories"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsMainCategories}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAdditionalCategories"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAdditionalCategories}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsYourBusiness"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsYourBusiness}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsService"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsService}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAvailability"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAvailability}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsContacts"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsContacts}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsTermsOfPayment"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsTermsOfPayment}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsAdditionalInfo"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTitle: '',
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsAdditionalInfo}></Stack.Screen>
      <Stack.Screen
        name="BusinessSettingsFaq"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: '',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={BusinessSettingsFaq}></Stack.Screen>
      <Stack.Screen
        name="InspirationAddOrEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Add new post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: Platform.OS === 'ios' ? 0 : 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="InspirationEdit"
        options={{
          tabBarVisible: false,
          headerShown: true,
          headerTruncatedBackTitle: false,
          headerBackTitle: false,
          headerTitle: 'Edit your post',
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
            fontFamily: 'SofiaPro-Bold',
            fontSize: 16,
            marginRight: 50,
            alignItems: 'center',
            alignSelf: 'center',
          },
        }}
        component={InspirationAddOrEdit}></Stack.Screen>
      <Stack.Screen
        name="ProfessionalInspirationPostList"
        options={{ headerShown: false }}
        component={ProfessionalInspirationPostList}></Stack.Screen>
      <Stack.Screen
        name="InspireInner"
        options={{ headerShown: false, tabBarVisible: false }}
        component={InspireInner}></Stack.Screen>
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
    </Stack.Navigator>
  );
}
