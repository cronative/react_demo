import AsyncStorage from '@react-native-async-storage/async-storage';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Platform, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {Get} from '../../api/apiAgent';
import FloatingTab from '../../components/FloatingTab';
import {setNavigationValue, setOnboardingValue} from '../../store/actions';
import {
  refreshBottomTabAction,
  setInitialNavigationRoute,
} from '../../store/actions/nagationAction';
import {
  AnalyticsStack,
  BookingsStack,
  CustomerBookingsStack,
  ExploreStack,
  InboxStack,
  InspireStack,
  ProfileStack,
} from '../StackNavigation/AfterLoginStack';

const Tab = createBottomTabNavigator();

const BottomTabScreen = () => {
  // Declare the constant
  const dispatch = useDispatch();
  const [routes, setRoutes] = useState();
  const [initialRoute, setinItialRoute] = useState();
  const navigationContainer = useSelector(
    (state) => state.navigationValueDetails.tempRoutes,
  );
  const userType = useSelector((state) => state.auth.userType);
  const [proNotification, setProNotification] = useState(false);
  const [unread, setUnread] = useState(false);
  const refreshBottomTab = useSelector(
    (state) => state.navigationValueDetails.refreshBottomTab,
  );
  const navigateToProfile = useSelector(
    (state) => state.navigationValueDetails.showClientSignupCategoryBackButton,
  );

  console.log('Bottom Tab User Type : ', userType);

  // If user already signin then clear refer code
  const clearReferCode = () => {
    dispatch({type: 'REFERRAL_CODE_CLEAR'});
  };

  // This method will call one time to clear refer code
  useEffect(() => {
    clearReferCode();
    getCheckedExplore();
  }, []);

  useEffect(() => {
    console.log('refreshBottomTab: ', refreshBottomTab);
    if (refreshBottomTab) {
      refetchNotifications();
      dispatch(refreshBottomTabAction(false));
    }
  }, [refreshBottomTab]);

  const refetchNotifications = async () => {
    console.log('Refetching Notification');
    Get('user/profile')
      .then((response) => {
        console.log('proNotifications: ', response.data.proNotifications);
        setProNotification(response.data.proNotifications == 1);
        if (response.data.proNotifications == 1) {
          let unreadLocal = false;
          Get('user/notifications')
            .then((response) => {
              if (
                !!response?.data?.currentMonthNotifications &&
                response?.data?.currentMonthNotifications?.length > 0
              ) {
                unreadLocal =
                  response.data.currentMonthNotifications[0].isRead === 'unread'
                    ? true
                    : false;
              }

              if (
                !unreadLocal &&
                !!response?.data?.olderNotifications &&
                response?.data?.olderNotifications?.length > 0
              ) {
                unreadLocal =
                  response.data.olderNotifications[0].isRead === 'unread'
                    ? true
                    : false;
              }
              console.log('unreadLocal: ', unreadLocal);
              setUnread(unreadLocal);
            })
            .catch((error) => {
              console.log(error);
              setUnread(false);
            });
        } else {
          setUnread(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setUnread(false);
      });
  };

  const getCheckedExplore = async () => {
    let exploreData = await AsyncStorage.getItem('isClickedExplore');
    if (exploreData === '1') {
      setinItialRoute('Explore');
    } else {
      navigationContainer?.child?.routeName ?? userType == 1
        ? setinItialRoute('Booking')
        : setinItialRoute('Explore');
    }
  };

  const getTabBarVisibility = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'Explore';
    if (routeName === 'AllCategories') {
      return false;
    }
    // else if (routeName === 'SearchMapView') {
    //   return false;
    // }
    else if (routeName === 'SetupWelcome') {
      return false;
    } else if (routeName === 'SetupDOB') {
      return false;
    } else if (routeName === 'SetupMainCategories') {
      return false;
    } else if (routeName === 'SetupAdditionalCategories') {
      return false;
    } else if (routeName === 'SetupBusiness') {
      return false;
    } else if (routeName === 'SetupService') {
      return false;
    } else if (routeName === 'SetupAvailability') {
      return false;
    } else if (routeName === 'SetupContacts') {
      return false;
    } else if (routeName === 'SetupTermsOfPayment') {
      return false;
    } else if (routeName === 'SetupAdditionalInfo') {
      return false;
    } else if (routeName === 'SetupFaq') {
      return false;
    } else if (routeName === 'SetupSubscription') {
      return false;
    } else if (routeName === 'ProfileFavorites') {
      return false;
    } else if (routeName === 'ProfileInviteFriends') {
      return false;
    } else if (routeName === 'ProfileFaqHelp') {
      return false;
    } else if (routeName === 'ProfileFaqHelpDetails') {
      return false;
    } else if (routeName === 'TermsOfService') {
      return false;
    } else if (routeName === 'PrivacyPolicy') {
      return false;
    } else if (routeName === 'ProfileRatingReviews') {
      return false;
    } else if (routeName === 'BookingsUpcomingInner') {
      return false;
    } else if (routeName === 'BookingsPreviousInner') {
      return false;
    } else if (routeName === 'BookingsReschedule') {
      return false;
    } else if (routeName === 'BookingFlowSuccess') {
      return false;
    } else if (routeName === 'BookingsPreviousInnerLeaveReview') {
      return false;
    } else if (routeName === 'BookingsReviewPro') {
      return false;
    } else if (routeName === 'BookingsPreviousInnerReport') {
      return false;
    } else if (routeName === 'BookingFlow') {
      return false;
    } else if (routeName === 'BookingFlowConfirmBooking') {
      return false;
    } else if (routeName === 'BookingFlowAddCard') {
      return false;
    } else if (routeName == 'AccountSettings') {
      return false;
    } else if (routeName == 'ChangeName') {
      return false;
    } else if (routeName == 'ChangeEmail') {
      return false;
    } else if (routeName == 'Forgot Password') {
      return false;
    } else if (routeName == 'Create Password') {
      return false;
    } else if (routeName == 'ChangePassword') {
      return false;
    } else if (routeName == 'ChangePhoneNumber') {
      return false;
    } else if (routeName == 'ChangePhoneNumberVerification') {
      return false;
    } else if (routeName == 'editCard') {
      return false;
    } else if (routeName == 'addCard') {
      return false;
    } else if (routeName == 'BusinessSettings') {
      return false;
    } else if (routeName == 'BusinessSettingsMainCategories') {
      return false;
    } else if (routeName == 'BusinessSettingsAdditionalCategories') {
      return false;
    } else if (routeName == 'BusinessSettingsYourBusiness') {
      return false;
    } else if (routeName == 'BusinessSettingsService') {
      return false;
    } else if (routeName == 'BusinessSettingsAvailability') {
      return false;
    } else if (routeName == 'BusinessSettingsContacts') {
      return false;
    } else if (routeName == 'BusinessSettingsTermsOfPayment') {
      return false;
    } else if (routeName == 'BusinessSettingsAdditionalInfo') {
      return false;
    } else if (routeName == 'BusinessSettingsFaq') {
      return false;
    } else if (routeName == 'ProfileInvitePro') {
      return false;
    } else if (routeName == 'EditWithdrowalMethod') {
      return false;
    } else if (routeName == 'ProfessionalInspirationPostList') {
      return false;
    } else if (routeName == 'InspireInner') {
      return false;
    } else if (routeName == 'InspirationAddOrEdit') {
      return false;
    } else if (routeName == 'InspirationEdit') {
      return false;
    } else if (routeName == 'GoogleLocationAutocompletePage') {
      return false;
    } else if (routeName == 'NewWalkInBooking') {
      return false;
    } else if (routeName == 'bookingsProInner') {
      return false;
    } else if (routeName == 'InboxInner') {
      return false;
    } else if (routeName == 'IdVerification') {
      return false;
    } else if (routeName == 'IdVerificationDocument') {
      return false;
    } else if (routeName == 'AnalyticsBalanceWithdrowalMethod') {
      return false;
    } else if (routeName == 'AnalyticsBalanceWithdrowalConfirmation') {
      return false;
    } else if (routeName == 'ProfessionalPublicProfile') {
      return false;
    } else if (routeName === 'BookService') {
      return false;
    } else if (routeName === 'ConfirmBooking') {
      return false;
    } else if (routeName === 'BookingSuccess') {
      return false;
    } else if (routeName === 'AddCreditCard') {
      return false;
    } else if (routeName === 'ProfileInviteFriends') {
      return false;
    } else if (routeName === 'ClientsProfile') {
      return false;
    } else if (routeName === 'GlobalSearch') {
      return false;
    } else if (routeName === 'IdVerificationPendingDocument') {
      return false;
    } else if (routeName === 'IdVerificationResubmitDocument') {
      return false;
    }
    // Start Change: Snehasish Das Issue #1638
    else if (routeName === 'TermsOfServiceInExplore') {
      return false;
    } else if (routeName === 'PrivacyPolicyInExplore') {
      return false;
    }
    // End Change: Snehasish Das Issue #1638
    return true;
  };

  const tabPress = (e) => {
    if (userType == null) {
      e.preventDefault();
      dispatch(setInitialNavigationRoute('signup_account_type'));
      dispatch(setNavigationValue(1));
      dispatch(setOnboardingValue(1));
    }
  };

  return (
    <Tab.Navigator
      shifting={true}
      initialRouteName={navigateToProfile ? 'Profile' : initialRoute}
      lazy={true}
      sceneAnimationEnabled={true}
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let style;

          if (route.name === 'Explore') {
            style = styles.screenOptionsStyle;
            iconName = focused
              ? require('../../assets/images/tab-icon/explore-active.png')
              : require('../../assets/images/tab-icon/explore-inactive.png');
          } else if (route.name === 'Inspire') {
            style = styles.screenOptionsStyle;
            iconName = focused
              ? require('../../assets/images/tab-icon/inspire-active.png')
              : require('../../assets/images/tab-icon/inspire-inactive.png');
          } else if (route.name === 'Booking') {
            style = {
              width: 22,
              height: 22,
              resizeMode: 'contain',
            };
            iconName = focused
              ? require('../../assets/images/tab-icon/customer-bookings-active.png')
              : require('../../assets/images/tab-icon/customer-bookings-inactive.png');
          } else if (route.name === 'Bookings') {
            style = {
              width: 22,
              height: 22,
              resizeMode: 'contain',
            };
            iconName = focused
              ? require('../../assets/images/tab-icon/bookings-active.png')
              : require('../../assets/images/tab-icon/bookings-inactive.png');
          } else if (route.name === 'Inbox') {
            style = {
              width: 22,
              height: 22,
              resizeMode: 'contain',
            };
            iconName = !unread
              ? focused
                ? require('../../assets/images/tab-icon/inbox-active.png')
                : require('../../assets/images/tab-icon/inbox-inactive.png')
              : focused
              ? require('../../assets/images/tab-icon/inbox-active-notify.png')
              : require('../../assets/images/tab-icon/inbox-inactive-notify.png');
          } else if (route.name === 'Analytics') {
            style = {
              width: 20,
              height: 20,
              resizeMode: 'contain',
            };
            iconName = focused
              ? require('../../assets/images/tab-icon/analytics-active.png')
              : require('../../assets/images/tab-icon/analytics-inactive.png');
          } else if (route.name === 'Profile') {
            style = styles.screenOptionsStyle;
            iconName = focused
              ? require('../../assets/images/tab-icon/profile-active.png')
              : require('../../assets/images/tab-icon/profile-inactive.png');
          }
          return <Image source={iconName} style={style} />;
        },
      })}
      tabBarOptions={{
        showLabel: true,
        activeTintColor: '#F36A46',
        inactiveTintColor: '#939DAA',
        labelStyle: {
          fontSize: 12,
          fontFamily: 'SofiaPro-Bold',
          paddingBottom: 0,
        },
        style: {
          width: '100%',
          borderTopWidth: 0,
          borderTopColor: '#fff',
          borderTopLeftRadius: 20,
          height: Platform.OS === 'ios' ? 75 : 60,
          borderTopRightRadius: 20,
          backgroundColor: '#fff',
          marginBottom: Platform.OS === 'ios' ? 25 : 0,
        },
        tabStyle: {
          paddingTop: 5,
          paddingBottom: 10,
          borderWidth: 0,
          borderColor: '#fff',
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
          height: Platform.OS === 'ios' ? 60 : 60,
        },
      }}>
      {userType == 1 ? (
        <>
          <Tab.Screen
            name="Booking"
            component={CustomerBookingsStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Inbox"
            component={InboxStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />
          <Tab.Screen
            name="AddFloating"
            component={FloatingTab}
            listeners={{
              tabPress: (e) => {
                console.log('tab pressed');
                refetchNotifications();
              },
            }}
            options={({route, navigation}) => ({
              tabBarVisible: false,
              tabBarLabel: '',
              tabBarVisible: getTabBarVisibility(route),
              tabBarIcon: () => <FloatingTab navigation={navigation} />,
            })}
          />
          <Tab.Screen
            name="Analytics"
            component={AnalyticsStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Profile"
            component={ProfileStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />
        </>
      ) : null}

      {userType != 1 ? (
        <>
          <Tab.Screen
            name="Explore"
            component={ExploreStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
            initialParams={{
              screen: navigationContainer?.child?.routeName,
              params: navigationContainer?.child?.params,
            }}
          />

          <Tab.Screen
            name="Inspire"
            component={InspireStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Bookings"
            component={BookingsStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
                tabPress(e);
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Inbox"
            component={InboxStack}
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
                tabPress(e);
              },
            }}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Profile"
            listeners={{
              tabPress: (e) => {
                refetchNotifications();
                tabPress(e);
              },
            }}
            component={ProfileStack}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />
        </>
      ) : null}
      {/* {userType == null ? (
        <>
          <Tab.Screen
            name="Explore"
            component={ExploreStack}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />

          <Tab.Screen
            name="Inspire"
            component={InspireStack}
            options={({route}) => ({
              tabBarVisible: getTabBarVisibility(route),
            })}
          />
        </>
      ) : null} */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenOptionsStyle: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  bookingtabimg: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },
});

export default BottomTabScreen;
