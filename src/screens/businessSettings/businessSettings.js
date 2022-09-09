import React, { Fragment, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Switch,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Linking,
} from 'react-native';
import { Container, List, ListItem, Body, Left, Right, Title } from 'native-base';
import { Button } from 'react-native-elements';
import Modal from 'react-native-modal';
import {
  MainCategoryIcon,
  AdditionalCatIcon,
  YourBusinessIcon,
  ServicesIcon,
  AvailabilityIcon,
  PreferencesIcon,
  TermsPaymentIcon,
  AdditionalInfoIcon,
  RightAngle,
  PrivacyIcon,
  FaqHelpIcon,
} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  trialExpireCheckRequest,
  trialExpireCheckRequestClear,
} from '../../store/actions/verificationAction';
import { Get, Post, Put } from '../../api/apiAgent';
import { FAQ_LISTING_CLEAR } from '../../store/actionTypes';
import moment from 'moment';
import global from '../../components/commonservices/toast';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';
import { SUBSCRIPTION_MANAGEMENT_URL_WEB } from '../../api/constant';

const BusinessSettings = ({ navigation }) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isEnabled, setIsEnabled] = useState(false);
  const [loginUserId, setLoginUserId] = useState(null);
  const [loderStatus, setLoderStatus] = useState(false);
  const [planActive, setPlanActive] = useState(false);
  const subscriptionData = useSelector(
    (state) => state.VerificationReducer.trialExpireCheckDetails,
  );
  const trialPlanChecking = useSelector(
    (state) => state.VerificationReducer.trialPlanCheckingStatus,
  );

  // console.log('no', JSON.stringify(subscriptionData, null, 2));

  // const SUBSCRIPTION_MANAGEMENT_URL_WEB =
  //   'https://staging.uiplonline.com/readyhubb-frontend-angular/dist/pro-account-subscription?redirectToSub=1';

  // This method is to handle the subscription details response
  // useEffect(() => {
  //   getBusinessDetails();
  // })
  //   setLoderStatus(true);
  //   setTimeout(() => {
  //     setLoderStatus(false);
  //   }, 2000);
  //   if (subscriptionData && subscriptionData.status == 200) {
  //     if (Object.keys(subscriptionData?.data).length !== 0) {
  //       let trialDate = subscriptionData?.data?.date;
  //       let dateStatusText;
  //       let todayDate = moment(new Date()).format('YYYY-MM-DD');
  //       if (todayDate > trialDate) {
  //         setPlanActive(false);
  //         dateStatusText = `Your trial has expired ${subscriptionData?.data?.expiresIn}`;
  //       } else if (todayDate == trialDate) {
  //         dateStatusText = 'Your trial has expired';
  //         setPlanActive(false);
  //       } else {
  //         dateStatusText = `Your trial will expire ${subscriptionData?.data?.expiresIn}`;
  //         setPlanActive(true);
  //       }

  //       if (subscriptionData?.data?.planType == '1') {
  //         dispatch(trialExpireCheckRequestClear());
  //         if (trialPlanChecking === false) {
  //           global.showToast(
  //             'We are fetching your subscription details',
  //             'info',
  //           );
  //           setTimeout(() => {
  //             navigation.navigate('SubscriptionInfo', {
  //               day: subscriptionData?.data?.expiresIn,
  //               trialBtn: false,
  //               dayText: dateStatusText,
  //             });
  //           }, 100);
  //           dispatch({type: 'TRIAL_PLAN_CHANGE_STATUS'});
  //         }
  //       }
  //       console.log('dateStatusText is', dateStatusText, subscriptionData);
  //     } else {
  //       dispatch(trialExpireCheckRequestClear());
  //     }
  //   } else if (subscriptionData && subscriptionData.status == 400) {
  //     dispatch(trialExpireCheckRequestClear());
  //     setTimeout(() => {
  //       navigation.navigate('SubscriptionInfo', {
  //         day: 0,
  //         trialBtn: true,
  //         dayText: '',
  //       });
  //     }, 100);
  //   }
  // }, [subscriptionData]);

  useEffect(() => {
    // dispatch(trialExpireCheckRequest());
    getLoginUserId();
    getBusinessDetails();
  }, []);

  const getLoginUserId = async () => {
    const userId = (await AsyncStorage.getItem('userId')) || '';
    if (userId) {
      setLoginUserId(userId);
    }
  };

  const [visibleModal, setVisibleModal] = useState(false);
  // const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const toggleSwitch = () => {
    // if (!planActive) {
    // setVisibleModal(true);
    // setTimeout(() => {
    //   setVisibleModal(false);
    //   //navigation.navigate('BusinessSettings');
    // }, 5000);
    // } else {
    toggleHandle();
    setIsEnabled((previousState) => !previousState);
    // }
  };

  const toggleHandle = () => {
    console.log('***');
    // setLoader(true);
    Put('pro/sms-notification', {})
      .then((result) => {
        // setLoader(false);
        console.log('result is **', result);
        // navigation.navigate('SignupGeolocation')
        // navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
      })
      .catch((error) => {
        console.log('error', error);
        // setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const getBusinessDetails = () => {
    console.log('***');
    // setLoader(true);
    Get('pro/fetch-business-details', {})
      .then((result) => {
        // setLoader(false);
        console.log('result is **', result);
        let objData = result.data;
        let objData1 = objData?.businessDetails;
        if (objData1.length > 0) {
          let objData2 = objData1[0];
          setIsEnabled(objData2?.smsNotification == 1 ? true : false);
          console.log('result is **', objData2?.smsNotification);
        }
        console.log('result is **', objData1);
        // navigation.navigate('SignupGeolocation')
        // navigation.navigate(nextStep ? nextStep : 'SetupTermsOfPayment');
      })
      .catch((error) => {
        console.log('error', error);
        // setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };


  const onUpgradeClick = () => {
    Linking.canOpenURL(SUBSCRIPTION_MANAGEMENT_URL_WEB)
      .then((supported) => {
        if (!supported) {
          global.showToast('Something went wrong.');
        } else {
          Linking.openURL(SUBSCRIPTION_MANAGEMENT_URL_WEB);
        }
      })
      .catch((err) => global.showToast('Something went wrong.'));
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, { paddingTop: 0 }]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Business settings
            </Text>
          </View>

          <View style={commonStyle.horizontalPadd}>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('BusinessSettingsMainCategories')
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <MainCategoryIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Main category</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('BusinessSettingsAdditionalCategories')
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <AdditionalCatIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>
                  Additional categories
                </Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('BusinessSettingsYourBusiness')
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <YourBusinessIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Your business</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('BusinessSettingsService')}>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <ServicesIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Services</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('BusinessSettingsAvailability')
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <AvailabilityIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Availability</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('BusinessSettingsContacts')}>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <PreferencesIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>
                  Contact details preferences
                </Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('BusinessSettingsTermsOfPayment')
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <TermsPaymentIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Terms of payment</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={
                () => navigation.navigate('BusinessSettingsAdditionalInfo')
                //SetupAdditionalInfo
              }>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <AdditionalInfoIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>Additional info</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
            <TouchableOpacity
              style={commonStyle.profileRoutingList}
              activeOpacity={0.5}
              onPress={() => navigation.navigate('BusinessSettingsFaq')}>
              <View style={commonStyle.searchBarText}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <FaqHelpIcon />
                </TouchableHighlight>
                <Text style={commonStyle.texttimeblack}>FAQ</Text>
              </View>
              <TouchableHighlight>
                <RightAngle />
              </TouchableHighlight>
            </TouchableOpacity>
          </View>
          <View style={commonStyle.horizontalPadd}>
            <View style={commonStyle.setupCardBox}>
              <List style={[commonStyle.switchAccountWrap]}>
                <ListItem
                  style={[
                    commonStyle.switchAccountView,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: '#dcdcdc',
                      paddingBottom: 15,
                    },
                  ]}>
                  <Left>
                    <Text style={commonStyle.blackTextR}>
                      SMS notifications
                    </Text>
                  </Left>
                  <Right>
                    <Switch
                      trackColor={{ false: '#939DAA', true: '#F36A46' }}
                      thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </Right>
                </ListItem>
              </List>
              <Text style={commonStyle.grayText14}>
                By enabling SMS notifications your clients get confirmations and
                reminders
              </Text>
              {/* {!planActive && (
                <List style={[commonStyle.payinCashinfowrap, commonStyle.mt15]}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                        <Image
                          source={require('../../assets/images/payincashicon.png')}
                          style={commonStyle.payincashimg}
                          resizeMode={'contain'}
                        />
                      </Left>

                      <Body style={commonStyle.categoriseListBody}>
                        <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                          This feature is a part of the Readyhubb Pro plan.{' '}
                          <Title
                            style={[
                              commonStyle.blackTextR,
                              {textDecorationLine: 'underline'},
                            ]}
                            onPress={onUpgradeClick}>
                            Upgrade your subscription
                          </Title>{' '}
                          to unlock it
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List>
              )} */}
            </View>
          </View>
        </ScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Profile preview"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                if (loginUserId)
                  navigation.navigate('ProfessionalPublicProfile', {
                    proId: loginUserId,
                    doubleBack: false,
                    singleBack: true,
                  });
              }}
            />
          </View>
        </View>
      </Container>
      {/* SMS Notification Message modal start */}
      <Modal
        visible={visibleModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        onBackdropPress={() => {
          setVisibleModal(false);
        }}
        transparent
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        style={commonStyle.centerModal}>
        <View style={commonStyle.centerModalBody}>
          <View style={commonStyle.modalContent}>
            <View style={commonStyle.messageIcon}>
              <Image
                style={commonStyle.messageimg}
                source={require('../../assets/images/bell-circle.png')}
              />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb1,
              ]}>
              SMS notifications are only availialble with Pro Subscription plan
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Upgrade your plan from the web version of the Readyhubb to unlock
              this feature
            </Text>
          </View>
        </View>
      </Modal>
      {/* SMS Notification Message modal end */}
    </Fragment>
  );
};

export default BusinessSettings;
