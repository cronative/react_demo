import React, { Fragment, useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Container, Footer, List, ListItem, Body, Left } from 'native-base';
import { Button } from 'react-native-elements';
import commonStyle from '../../assets/css/mainStyle';
import PhoneFream from '../../assets/images/setup-subscription-fream.png';
import { useDispatch, useSelector } from 'react-redux';
import { setNavigationValue } from '../../store/actions';
import { Post } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import ActivityLoaderSolid from '../../components/ActivityLoaderSolid';
import {
  trialExpireCheckRequest,
  trialExpireCheckRequestClear,
} from '../../store/actions/verificationAction';
const { width, height } = Dimensions.get('window');
import { Get } from '../../api/apiAgent';
import Modal from 'react-native-modal';
import { CompleteProfileModal } from '../../components/modal';
import { CloseIcon } from '../../components/icons';
import determineNextStep from '../../utility/determineNextSetupStep';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHeaderHeight } from '@react-navigation/stack';
const SetupSubscription = ({ navigation, route }) => {
  // Declare variable

  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const navigationValue = useSelector(
    (state) => state.navigationValueDetails.navigationValue,
  );
  const subscriptionData = useSelector(
    (state) => state.VerificationReducer.trialExpireCheckDetails,
  );
  const progressionData = useSelector(
    (state) => state.professionalProfileSetupReducer.progression,
  );

  const [businessInfoDetails, setBusinessInfoDetails] = useState(null);
  let [nextStep, setNextStep] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loginUserId, setLoginUserId] = useState();
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

  const [previewStep, setPreviewStep] = useState(null);
  useEffect(() => {
    getLogedinUserId();
    getBusinessCompleteInfo();
  }, []);

  useEffect(() => {
    console.log('Progress: ', businessInfoDetails);
    if (businessInfoDetails?.percentage) {
      if (businessInfoDetails.percentage < 100) {
        console.log('WILL OPEN MODAL NEXT');
        setNextStep('openModal');
        setPreviewStep(determineNextStep(0, progressionData)); //hardcoding 0, so any step that is incomplete which occurs first is selected
      } else {
        console.log('WILL GO TO PROFILE NEXT NEXT');
        setNextStep(null);
        // startTrial();
      }
    }
  }, [businessInfoDetails]);

  const getBusinessCompleteInfo = () => {
    setLoader(true);
    Get('pro/completion-status', '')
      .then((result) => {
        setLoader(false);
        console.log(result.data);
        if (result.status === 200) {
          setBusinessInfoDetails(result.data);
          if (result.data.percentage === 100) {
            // Start Change: Snehasish Das, Issue #1698
            // setProfileFinished(true);
            // End Change: Snehasish Das, Issue #1698
            // formatDate();
          }
        }
      })
      .catch((error) => {
        setLoader(false);
        // formatDate();
      });
  };

  const getLogedinUserId = async () => {
    const userId = (await AsyncStorage.getItem('userId')) || '';
    if (userId) {
      setLoginUserId(userId);
    }
  };

  // This method for current position reference
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const onGetstartedHandler = () => {
    if (navigationValue !== 4) {
      dispatch(setNavigationValue(4));
    } else {
      navigation.navigate('Profile');
    }
  };

  // This method is to start the trial
  const startTrial = () => {
    setLoader(true);
    Post('/pro/start-trial')
      .then((result) => {
        setLoader(false);
        if (result.status === 200) {
          global.showToast('Your trial has started from today', 'success');
          dispatch(trialExpireCheckRequest());
        }
      })
      .catch((error) => {
        setLoader(false);
        dispatch(trialExpireCheckRequest());
        if (
          error?.response?.data?.status === 403 ||
          error?.response?.data?.status === '403'
        ) {
          console.log('error', error);
        }
      });
  };

  const renderScreenText = (type) => {
    if (type === 'paid') {
      return (
        <>
          <Text
            style={[
              commonStyle.subheading,
              commonStyle.textCenter,
              commonStyle.mb15,
            ]}>
            Welcome to Readyhubb!
          </Text>
          <Text
            style={[
              commonStyle.grayText16,
              commonStyle.textCenter,
              commonStyle.mb2,
            ]}>
            You have officially joined our community of professionals.
          </Text>
          <Text
            style={[
              commonStyle.grayText16,
              commonStyle.textCenter,
              commonStyle.mb2,
            ]}>
            We've designed tools to help you manage and grow your business on any device. The Readyhubb app is completely free for all users until October 5th 2022
          </Text>
        </>
      );
    } else if (type === 'trial') {
      return (
        <>
          <Text
            style={[
              commonStyle.subheading,
              commonStyle.textCenter,
              commonStyle.mb15,
            ]}>
            Congrats! You have started your 14 day Readyhubb professional
            free trial
          </Text>
          <Text
            style={[
              commonStyle.grayText16,
              commonStyle.textCenter,
              commonStyle.mb2,
            ]}>
            Our Free Trial gives you access to our core features. We want
            you to experience the full power of Readyhubb without any
            pressure. So no credit card required and you can subscribe
            whenever you are ready to officially join our community of
            professionals. Enjoy!
          </Text>
        </>
      );
    }
  }

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {/* <View style={{flex: 1, backgroundColor: 'red'}}> */}
      {/* <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: 'red',
          zIndex: -1,
          height: '100%',
          backgroundColor: 'red',
        }}
      /> */}
      <SafeAreaView style={{ flex: 0, backgroundColor: '#FFEBCE' }} />
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Back</Text>
        </TouchableOpacity> */}
          <View style={{ flex: 1, paddingBottom: 20 }}>
            <View
              style={[
                commonStyle.signupNotification,
                { paddingTop: 10, height: 'auto' },
              ]}>
              <View style={commonStyle.geolocationAvatarsWrap}>
                <Image
                  source={PhoneFream}
                  style={commonStyle.phoneframImg}
                  resizeMode={'contain'}
                />
                <View style={commonStyle.setupWelcomeOverlay1} />
                <View style={[commonStyle.setupWelcomeOverlay2]} />
              </View>
            </View>
            <View style={[commonStyle.geolocationCardWrap, { marginTop: 0, marginBottom: 40 }]}>
              <View style={[commonStyle.geolocationCard, { borderRadius: 20 }]}>
                {renderScreenText('paid')}
                {/* <List style={[commonStyle.payinCashinfowrap, commonStyle.mb15]}>
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
                          Note that online payments will be unavailable during
                          the trial period
                        </Text>
                      </Body>
                    </View>
                  </ListItem>
                </List> */}
              </View>
            </View>
          </View>

          {/* </View> */}
        </ScrollView>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
          }}>
          <View
            style={[
              commonStyle.footerwrap,
              commonStyle.mt3,
              { borderRadius: 20, alignItems: 'center' },
            ]}>
            <Button
              title="Get started"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                navigation.navigate('SetupAdditionalCategories', {
                  primaryCategoryId: route?.params?.primaryCategoryId,
                });
                // if (nextStep === 'openModal') {
                //   setIsModalVisible(true);
                // } else {
                //   onGetstartedHandler();
                // }
              }}
            />
          </View>
        </View>
      </SafeAreaView>
      {/* </View> */}

      {/* Complete Profile info modal full start */}
      <Modal
        isVisible={isModalVisible}
        onSwipeComplete={() => setIsModalVisible(false)}
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
        style={commonStyle.bottomModal}>
        <View style={commonStyle.scrollablefullscreenModal}>
          <TouchableOpacity
            style={{
              marginRight: 15,
              marginTop: 8,
              marginBottom: 2,
              width: 30,
              height: 30,
              alignSelf: 'flex-end',
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'red'
            }}
            onPress={() => setIsModalVisible(false)}>
            <CloseIcon />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <CompleteProfileModal
              businessCompletionDetails={
                businessInfoDetails && businessInfoDetails.completionDetails
              }
              businessInfoModalClose={() => setIsModalVisible(false)}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Preview"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() =>
                // setVisibleBusinessInfoModal({ visibleBusinessInfoModal: null }) &
                setIsModalVisible(false) &
                // navigation.navigate('ProfessionalPublicProfile', {
                //   proId: loginUserId,
                // })
                navigation.navigate(previewStep)
              }
            />
          </View>
        </View>
      </Modal>
      {/* Complete Profile info modal full end PreviewProfileServices */}
    </Fragment>
  );
};

export default SetupSubscription;
