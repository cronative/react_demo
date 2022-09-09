import Intercom from '@intercom/intercom-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Body, Container, Left, List, ListItem } from 'native-base';
import React, { Fragment, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import EventEmitter from 'react-native-eventemitter';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PTRView from 'react-native-pull-to-refresh';
import { useDispatch, useSelector } from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import { CheckedBox, RightAngle, UncheckedBox } from '../../components/icons';
import { setNavigationValue, setOnboardingValue } from '../../store/actions';
import { Get } from './../../api/apiAgent';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import { Contants } from '../../utility/config';
import {
  bookingRemindNotifyRequest,
  bookingRemindNotifyRequestClear,
  customerLogoutRequest,
  customerLogoutRequestClear,
  listCardRequest,
  listCardRequestClear,
  profileViewRequest,
  profileViewRequestClear,
  allNotifRequest,
  allNotifClear,
  promoNotifyRequesr,
  promoNotifyRequesrClear,
  prosNotifyRequest,
  prosNotifyRequestClear,
} from './../../store/actions/profileAction';

const AccountSettings = () => {
  // Declare the constant
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [notificationsTerms, setNotificationsTerms] = useState(false);
  const [modifiedCardData, setModifiedCardData] = useState([]);
  const [withdrawlType, setWithdrawlType] = useState(null);
  const updateLogoutData = useSelector(
    (state) => state.profileReducer.updateLogout,
  );
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  const promoNotificData = useSelector(
    (state) => state.profileReducer.promoNotifyData,
  );
  const prosNotificData = useSelector(
    (state) => state.profileReducer.prosNofifyData,
  );
  const bookingRemindData = useSelector(
    (state) => state.profileReducer.bookingRemindNotifyData,
  );
  const cardData = useSelector((state) => state.profileReducer.listCardData);
  const loderStatus = useSelector((state) => state.profileReducer.loader);
  const userType = useSelector((state) => state.auth.userType);
  const [notificationsPreferences, setNotificationsPreferences] = useState([
    {
      type: 'all_notifications',
      notificationsPreferencesName: 'All Notifications',
      isChacked: true,
    },
    {
      type: 'notify_for_pros',
      notificationsPreferencesName:
        userType == 1 ? 'Notification from  clients' : 'Notification from pros',
      isChacked: true,
    },
    {
      type: 'booking_reminder',
      notificationsPreferencesName: 'Booking reminders',
      isChacked: false,
    },
  ]);

  // This array will manage the list card data
  useEffect(() => {
    if (cardData != null) {
      if (cardData?.data?.length > 0) {
        cardData.data.forEach(function (item, i) {
          if (item.isDefault == 1) {
            cardData.data.splice(i, 1);
            cardData.data.unshift(item);
          }
        });
        setModifiedCardData(cardData.data);
      } else {
        setModifiedCardData([]);
      }
    } else {
      setModifiedCardData([]);
    }
  }, [cardData]);

  // This function is to get the withdrawl method
  const defaultWithdrawlMethods = () => {
    Get('/pro/payment/withdraw')
      .then((result) => {
        console.log('Type : ', result);
        if (result.status === 200 || result.status === '200') {
          if (
            result?.data?.defaultWithdrawalType !== 'null' ||
            result?.data?.defaultWithdrawalType !== null
          ) {
            setWithdrawlType(result.data.defaultWithdrawalType);
          }
        }
        console.log('Result : ', result.data);
      })
      .catch((error) => {
        console.log('Error : ', error.response.data.message);
      });
  };

  // Load one time
  useEffect(() => {
    mainFunction();
    defaultWithdrawlMethods();
  }, []);

  // Refresh by event emitter
  useEffect(() => {
    EventEmitter.on('refreshPage', () => {
      dispatch(listCardRequest());
      defaultWithdrawlMethods();
      // Clear the dispatcher after 3 sec
      setTimeout(() => {
        dispatch(listCardRequestClear());
      }, 3000);
    });
  }, []);

  // Its a repeated function
  const mainFunction = () => {
    // Dispatch the event so that we can get the details of profile
    dispatch(listCardRequest());
    dispatch(profileViewRequest());

    // Clear the dispatcher after 3 sec
    setTimeout(() => {
      dispatch(profileViewRequestClear());
      dispatch(listCardRequestClear());
    }, 3000);
  };

  // This is the response of notification
  useEffect(() => {
    if (promoNotificData && promoNotificData.status == 200) {
      dispatch(promoNotifyRequesrClear());
      global.showToast(
        'Notification preferences updated successfully',
        'success',
      );
    } else if (promoNotificData && promoNotificData.status != 200) {
      if (
        promoNotificData.response.data.message !== null &&
        promoNotificData.response.data.message !== ''
      ) {
        global.showToast(promoNotificData.response.data.message, 'error');
        dispatch(promoNotifyRequesrClear());
      }
    }

    if (prosNotificData && prosNotificData.status == 200) {
      dispatch(prosNotifyRequestClear());
      global.showToast(
        'Notification preferences updated successfully',
        'success',
      );
    } else if (prosNotificData && prosNotificData.status != 200) {
      if (
        prosNotificData.response.data.message !== null &&
        prosNotificData.response.data.message !== ''
      ) {
        global.showToast(prosNotificData.response.data.message, 'error');
        dispatch(prosNotifyRequestClear());
      }
    }

    if (bookingRemindData && bookingRemindData.status == 200) {
      dispatch(bookingRemindNotifyRequestClear());
      global.showToast(
        'Notification preferences updated successfully',
        'success',
      );
    } else if (bookingRemindData && bookingRemindData.status != 200) {
      if (
        bookingRemindData.response.data.message !== null &&
        bookingRemindData.response.data.message !== ''
      ) {
        global.showToast(bookingRemindData.response.data.message, 'error');
        dispatch(bookingRemindNotifyRequestClear());
      }
    }
  }, [promoNotificData, prosNotificData, bookingRemindData]);

  useEffect(() => {
    if (profileData && profileData.status === 200) {
      let mainData = profileData.data;
      console.log('main data: ', mainData);
      let allNotification = mainData.allowNotification == 1 ? true : false;
      // let promoNotification = mainData.promoNotification == 1 ? true : false;
      let proNotifications = mainData.proNotifications == 1 ? true : false;
      let bookingReminder = mainData.bookingReminder == 1 ? true : false;
      setNotificationsPreferences([
        {
          type: 'all_notifications',
          notificationsPreferencesName: 'All Notifications',
          isChacked: allNotification,
        },
        // {
        //   type: 'promo_and_discount',
        //   notificationsPreferencesName: userType == 1 ? 'Messages from clients' : 'Messages from pros',
        //   isChacked: promoNotification,
        // },
        {
          type: 'notify_for_pros',
          notificationsPreferencesName:
            userType == 1
              ? 'Notification from  clients'
              : 'Notification from pros',
          isChacked: proNotifications,
        },
        {
          type: 'booking_reminder',
          notificationsPreferencesName: 'Booking reminders',
          isChacked: bookingReminder,
        },
      ]);
    } else {
      if (profileData && profileData.status !== 200) {
        global.showToast(profileData.message, 'success');
      }
    }
  }, [profileData]);

  // Update notification preferences
  const updateNotification = (item) => {
    notificationsPreferences.forEach((notificationsPreferencesTerms) => {
      if (
        notificationsPreferencesTerms.notificationsPreferencesName ===
        item.notificationsPreferencesName
      ) {
        notificationsPreferencesTerms.isChacked =
          !notificationsPreferencesTerms.isChacked;
        // if (item.type === 'promo_and_discount') {
        //   dispatch(promoNotifyRequesr());
        // }
        if (item.type === 'all_notifications') {
          dispatch(allNotifRequest());
        } else if (item.type === 'notify_for_pros') {
          dispatch(prosNotifyRequest());
        } else if (item.type === 'booking_reminder') {
          dispatch(bookingRemindNotifyRequest());
        }
        if (notificationsPreferencesTerms.isChacked) {
          setNotificationsTerms(true);
        } else {
          setNotificationsTerms(false);
        }
      }
    });

    setNotificationsPreferences([...notificationsPreferences]);
  };

  // This method will call on Type of Services.
  const notificationsPreferencesSelectHelper = (item) => {
    Alert.alert(
      '',
      'Are you sure, you want to update the notification preferences?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => updateNotification(item) },
      ],
      { cancelable: false },
    );
  };

  // Card number format
  const cardNumberFormat = (card_number) => {
    if (!!card_number && card_number.length > 4) {
      let format = '****' + card_number.split(' ').join('').slice(-4);
      return format;
    } else {
      return '****';
    }
  };

  // Request to logout application
  const logoutRequest = async () => {
    Intercom?.logout().then((res) => {
      console.log('logout from intercom');
    });
    let refreshToken = await AsyncStorage.getItem('refreshToken');
    console.log('logout');
    if (refreshToken !== null && refreshToken !== '') {
      let obj = {
        refreshToken: refreshToken,
      };
      await AsyncStorage.setItem('isClickedExplore', '1');
      dispatch(customerLogoutRequest(obj));
    }
  };

  // This will help page to redirect by login page
  useEffect(() => {
    if (updateLogoutData && updateLogoutData.status == 200) {
      dispatch(customerLogoutRequestClear());
      // Clear AsyncStorage to redirect login page
      AsyncStorage.getItem('userType', (error, result) => {
        AsyncStorage.multiRemove(
          [
            'accessToken',
            'refreshToken',
            'email',
            'fullName',
            'userType',
            'image',
            'isValidForLogin',
            'callingCode',
            'phone',
            'userId',
            'mobileVerified',
            'emailVerified'
          ],
          () => {
            // global.showToast('Logout successfully', 'success');
            dispatch(setOnboardingValue(1));
            console.log('UserType: ', result);
            if (result === 1 || result === '1') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Booking' }],
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Explore' }],
              });
            }

            setTimeout(() => {
              dispatch(setNavigationValue(1));
              dispatch({ type: 'ADDITIONAL_REDUCER_CLEAR' });
              dispatch({ type: 'AUTH_REDUCER_CLEAR' });
              dispatch({ type: 'BOOKING_REDUCER_CLEAR' });
              dispatch({ type: 'CAT_LIST_REDUCER_CLEAR' });
              dispatch({ type: 'CLIENT_PROFILE_REDUCER_CLEAR' });
              dispatch({ type: 'CLIENT_LIST_REDUCER_CLEAR' });
              dispatch({ type: 'CMS_PAGE_REDUCER_CLEAR' });
              dispatch({ type: 'FAQ_REDUCER_CLEAR' });
              dispatch({
                type: 'PROFESSIONAL_LIST_BY_CAT_REDUCER_CLEAR',
              });
              dispatch({
                type: 'PROFESSIONAL_PROFILE_DETAILS_REDUCER_CLEAR',
              });
              dispatch({
                type: 'PROFESSIONAL_PROFILE_SETUP_REDUCER_CLEAR',
              });
              dispatch({
                type: 'PROFESSIONAL_SETTING_STEP_REDUCER_CLEAR',
              });
              dispatch({ type: 'PROFILE_REDUCER_CLEAR' });
              dispatch({ type: 'REVIEW_REDUCER_CLEAR' });
              dispatch({ type: 'SIMILER_REDUCER_CLEAR' });
              dispatch({ type: 'VERIFICATION_REDUCER_CLEAR' });
            }, 100);
          },
        );
      });
    } else if (updateLogoutData && updateLogoutData.status != 200) {
      if (
        updateLogoutData?.response?.data?.message !== null &&
        updateLogoutData?.response?.data?.message !== ''
      ) {
        // global.showToast(updateLogoutData.response.data.message, 'error');
        dispatch(customerLogoutRequestClear());
      }
    }
  });

  // Clogout request confirmation
  const confirmLogout = () => {
    Alert.alert(
      '',
      'Are you sure, you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => logoutRequest() },
      ],
      { cancelable: false },
    );
  };

  const logIn = () => {
    dispatch(setNavigationValue(1));
  };

  // Refresh the page
  const refreshPage = () => {
    mainFunction();
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <PTRView
          onRefresh={refreshPage}
          colors="#ff5f22"
          style={{ backgroundColor: '#F5FCFF', color: '#ff5f22' }}>
          <KeyboardAwareScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={[commonStyle.categoriseListWrap, commonStyle.pt15]}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb1]}>
                <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                  Profile and account settings
                </Text>
              </View>
              <View
                style={[
                  commonStyle.setupCardBox,
                  { marginBottom: 30, paddingTop: 0 },
                ]}>
                <TouchableOpacity
                  style={commonStyle.generalFaqList}
                  onPress={() => navigation.navigate('ChangeName')}>
                  <Text style={[commonStyle.blackTextR, { width: '90%' }]}>
                    Change name
                  </Text>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyle.generalFaqList}
                  onPress={() => navigation.navigate('ChangeEmail')}>
                  <Text style={[commonStyle.blackTextR, { width: '90%' }]}>
                    Change email
                  </Text>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyle.generalFaqList}
                  onPress={() => navigation.navigate('ChangePassword')}>
                  <Text style={[commonStyle.blackTextR, { width: '90%' }]}>
                    Change password
                  </Text>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    commonStyle.generalFaqList,
                    { borderBottomWidth: 0, paddingBottom: 5 },
                  ]}
                  onPress={() => navigation.navigate('ChangePhoneNumber')}>
                  <Text style={[commonStyle.blackTextR, { width: '90%' }]}>
                    Change phone number
                  </Text>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
              </View>
            </View>
            {withdrawlType == null && userType != 0 ? (
              <View style={commonStyle.categoriseListWrap}>
                <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                  <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                    Withdrawal method
                  </Text>
                </View>
                <View style={[commonStyle.setupCardBox, { marginBottom: 30 }]}>
                  <List>
                    <ListItem thumbnail style={commonStyle.switchAccountView}>
                      <Left style={commonStyle.howdoseInfoCircle}>
                        <Image
                          style={commonStyle.paymentmethodicon}
                          source={require('../../assets/images/credit-card.png')}
                        />
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('EditWithdrowalMethod', {
                              name: 'none',
                              stack: false,
                            })
                          }>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            Select withdrawal method
                          </Text>
                        </TouchableOpacity>
                      </Body>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('EditWithdrowalMethod', {
                            name: 'none',
                            stack: false,
                          })
                        }>
                        <RightAngle />
                      </TouchableOpacity>
                    </ListItem>
                  </List>
                </View>
              </View>
            ) : null}
            {withdrawlType != null &&
              withdrawlType.toString() === '3' &&
              userType != 0 ? (
              <View style={commonStyle.categoriseListWrap}>
                <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                  <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                    Withdrawal method
                  </Text>
                </View>
                <View style={[commonStyle.setupCardBox, { marginBottom: 30 }]}>
                  <List>
                    <ListItem thumbnail style={commonStyle.switchAccountView}>
                      <Left style={commonStyle.howdoseInfoCircle}>
                        <Image
                          style={commonStyle.paymentmethodicon}
                          source={require('../../assets/images/paypal.png')}
                        />
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('EditWithdrowalMethod', {
                              name: 'paypal',
                              stack: false,
                            })
                          }>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            PayPal
                          </Text>
                        </TouchableOpacity>
                      </Body>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('EditWithdrowalMethod', {
                            name: 'paypal',
                            stack: false,
                          })
                        }>
                        <RightAngle />
                      </TouchableOpacity>
                    </ListItem>
                  </List>
                </View>
              </View>
            ) : null}
            {withdrawlType != null &&
              userType != 0 &&
              withdrawlType.toString() === '2' ? (
              <View style={commonStyle.categoriseListWrap}>
                <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                  <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                    Withdrawal method
                  </Text>
                </View>
                <View style={[commonStyle.setupCardBox, { marginBottom: 30 }]}>
                  <List>
                    <ListItem thumbnail style={commonStyle.switchAccountView}>
                      <Left style={commonStyle.howdoseInfoCircle}>
                        <Image
                          style={commonStyle.paymentmethodicon}
                          source={require('../../assets/images/debit-card-account.png')}
                        />
                      </Left>
                      <Body style={commonStyle.switchAccountbody}>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('EditWithdrowalMethod', {
                              name: 'stripe',
                              stack: false,
                            })
                          }>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            Stripe
                          </Text>
                        </TouchableOpacity>
                      </Body>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('EditWithdrowalMethod', {
                            name: 'stripe',
                            stack: false,
                          })
                        }>
                        <RightAngle />
                      </TouchableOpacity>
                    </ListItem>
                  </List>
                </View>
              </View>
            ) : null}

            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                  Saved payment methods
                </Text>
              </View>
              <View
                style={[
                  commonStyle.setupCardBox,
                  { marginBottom: 30, paddingTop: 0 },
                ]}>
                {modifiedCardData &&
                  modifiedCardData.map((cards, index) => (
                    <View key={index}>
                      {cards.isDeleted == 0 ? (
                        <TouchableOpacity
                          style={commonStyle.generalFaqList}
                          onPress={() =>
                            navigation.navigate('editCard', {
                              card_id: cards.id,
                              name_on_card: cards.name,
                              card_number: cards.cardNumber,
                              expiration_date: cards.expirationDate,
                              is_default: cards.isDefault,
                            })
                          }>
                          <View style={commonStyle.searchBarText}>
                            <View style={[commonStyle.paymentCardSelect]}>
                              {cards.cardType === 7 ||
                                cards.cardType === '7' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/visa.png')}
                                />
                              ) : null}
                              {cards.cardType === 6 ||
                                cards.cardType === '6' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/mastercard.png')}
                                />
                              ) : null}
                              {cards.cardType === 1 ||
                                cards.cardType === '1' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/amex.png')}
                                />
                              ) : null}
                              {cards.cardType === 2 ||
                                cards.cardType === '2' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/cartes_bancaires.png')}
                                />
                              ) : null}
                              {cards.cardType === 3 ||
                                cards.cardType === '3' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/diners_club.png')}
                                />
                              ) : null}
                              {cards.cardType === 4 ||
                                cards.cardType === '4' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/discover.png')}
                                />
                              ) : null}
                              {cards.cardType === 8 ||
                                cards.cardType === '8' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/unionpay.png')}
                                />
                              ) : null}
                              {cards.cardType === 5 ||
                                cards.cardType === '5' ? (
                                <Image
                                  style={[
                                    commonStyle.paymentmethodicon,
                                    { marginRight: 10 },
                                  ]}
                                  source={require('../../assets/images/jcb.png')}
                                />
                              ) : null}
                              <Text style={commonStyle.blackTextR}>
                                {cardNumberFormat(cards.cardNumber)}
                              </Text>
                              {cards.isDefault == 1 ? (
                                <Text style={commonStyle.cardDefault}>
                                  Default Card
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          <TouchableHighlight>
                            <RightAngle />
                          </TouchableHighlight>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  ))}
                <TouchableOpacity
                  style={[
                    commonStyle.generalFaqList,
                    { borderBottomWidth: 0, paddingBottom: 5 },
                  ]}
                  onPress={() => navigation.navigate('addCard')}>
                  <View style={commonStyle.searchBarText}>
                    <View style={[commonStyle.paymentCardSelect]}>
                      <Image
                        style={[
                          commonStyle.paymentmethodicon,
                          { marginRight: 10 },
                        ]}
                        source={require('../../assets/images/credit-card.png')}
                      />
                      <Text style={commonStyle.blackTextR}>
                        Add new payment method
                      </Text>
                    </View>
                  </View>
                  <TouchableHighlight>
                    <RightAngle />
                  </TouchableHighlight>
                </TouchableOpacity>
              </View>
            </View>
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.horizontalPadd, commonStyle.mb2]}>
                <Text style={[commonStyle.grayText16, commonStyle.mb1]}>
                  Notifications preferences
                </Text>
              </View>
              <View
                style={[
                  commonStyle.setupCardBox,
                  { paddingTop: 15, paddingBottom: 15 },
                ]}>
                {notificationsPreferences.map((item, index) => (
                  <View key={index}>
                    <CheckBox
                      style={{ paddingVertical: 10 }}
                      onClick={() => notificationsPreferencesSelectHelper(item)}
                      isChecked={item.isChacked}
                      checkedCheckBoxColor={'#ff5f22'}
                      uncheckedCheckBoxColor={'#e6e7e8'}
                      leftText={item.notificationsPreferencesName}
                      leftTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                  </View>
                ))}
              </View>

              <View style={[commonStyle.setupCardBox, { marginBottom: 30 }]}>
                <TouchableOpacity onPress={profileData ? confirmLogout : logIn}>
                  <Text style={commonStyle.blackTextR}>
                    {profileData ? 'Log out' : 'Log In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </PTRView>
      </Container>
    </Fragment>
  );
};

export default AccountSettings;
