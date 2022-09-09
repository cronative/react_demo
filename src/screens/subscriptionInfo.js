import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {Get} from '../api/apiAgent';
import {Container, Footer, List, ListItem, Body, Left} from 'native-base';
import {Button} from 'react-native-elements';
import commonStyle from '../assets/css/mainStyle';
import PhoneFream from '../assets/images/setup-subscription-fream.png';
import {
  trialExpireCheckRequest,
  trialExpireCheckRequestClear,
} from '../store/actions/verificationAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {useSelector, useDispatch} from 'react-redux';
import Modal from 'react-native-modal';
import {CompleteProfileModal} from '../components/modal';
import {CloseIcon} from '../components/icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SubscriptionInfo = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [message, setMessage] = useState(route?.params?.dayText);
  const [businessInfoDetails, setBusinessInfoDetails] = useState(null);
  const subscriptionData = useSelector(
    (state) => state.VerificationReducer.trialExpireCheckDetails,
  );
  const loderStatus = useSelector((state) => state.VerificationReducer.loader);

  const [nextStep, setNextStep] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loginUserId, setLoginUserId] = useState();
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [loader, setLoader] = useState(false);
  // This method is to dipatch the request
  useEffect(() => {
    dispatch(trialExpireCheckRequest());
    if (route?.params?.day == 0) {
      setMessage('Your trial has expired');
    }

    getLogedinUserId();
    getBusinessCompleteInfo();
  }, []);

  useEffect(() => {
    console.log('Progress: ', businessInfoDetails);
    if (businessInfoDetails?.percentage) {
      // let unfinishedSteps = Object.entries(businessInfoDetails.completionDetails).filter(step => step[1] === 0);
      // console.log('Unfinished STeps: ', unfinishedSteps);
      // if (unfinishedSteps.length > 0) {
      //   console.log('WILL OPEN MODAL NEXT')
      //   setNextStep('openModal');
      // } else {
      //   console.log('WILL GO TO PROFILE NEXT NEXT')
      //   setNextStep(null)
      // }
      if (businessInfoDetails.percentage < 100) {
        console.log('WILL OPEN MODAL NEXT');
        setNextStep('openModal');
      } else {
        console.log('WILL GO TO PROFILE NEXT NEXT');
        setNextStep(null);
      }
    }
  }, [businessInfoDetails]);

  // This method is to handle the subscription details response
  useEffect(() => {
    if (subscriptionData && subscriptionData.status == 200) {
      dispatch(trialExpireCheckRequestClear());
    } else if (subscriptionData && subscriptionData.status != 200) {
      dispatch(trialExpireCheckRequestClear());
    }
  });

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

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <SafeAreaView style={{flex: 0, backgroundColor: '#FFEBCE'}} />

      {/* <ScrollView style={commonStyle.mainContainer}> */}
      {loderStatus || loader ? <ActivityLoaderSolid /> : null}

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[commonStyle.trialExpireCheck, commonStyle.pt3]}>
          <View style={commonStyle.geolocationAvatarsWrap}>
            <Image
              source={PhoneFream}
              style={commonStyle.phoneframImg}
              resizeMode={'contain'}
            />
            <View style={commonStyle.setupWelcomeOverlay1} />
            <View style={commonStyle.setupWelcomeOverlay2} />
          </View>
          <View style={commonStyle.geolocationCardWrap}>
            <View style={[commonStyle.geolocationCard, {borderRadius: 20}]}>
              {message !== null ? (
                <Text
                  style={[
                    commonStyle.subheading,
                    commonStyle.textCenter,
                    commonStyle.mb1,
                  ]}>
                  {message}
                </Text>
              ) : null}
              <Text
                style={[
                  commonStyle.grayText16,
                  commonStyle.textCenter,
                  commonStyle.mb15,
                ]}>
                You can always subscribe via the web-version of Readyhubb
              </Text>
              {route?.params?.trialBtn === true ? (
                <Button
                  title="Go to my Pro account"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.changePassModalbutton}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => {
                    navigation.navigate('TrialFinished');
                  }}
                />
              ) : (
                <Button
                  title="Continue"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.changePassModalbutton}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => {
                    // if (nextStep === 'openModal') {
                    //   setIsModalVisible(true);
                    // } else {
                    navigation.navigate('Profile');
                    // }
                  }}
                />
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* </ScrollView> */}

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

          {/* <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
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
          </View> */}
        </View>
      </Modal>
      {/* Complete Profile info modal full end PreviewProfileServices */}
    </Fragment>
  );
};

export default SubscriptionInfo;
