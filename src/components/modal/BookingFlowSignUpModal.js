import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useRef, useState} from 'react';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import commonStyle from '../../assets/css/mainStyle';
import {setNavigationValue, setOnboardingValue} from '../../store/actions';
import {STORE_NAVIGATION_ROUTE} from '../../store/actionTypes';
import {Button} from 'react-native-elements';
import RNModal from 'react-native-modal';
import {
  setInitialNavigationRoute,
  storeCustomNavFromLogin,
} from '../../store/actions/nagationAction';

const BookingFlowSignUpModal = ({
  isVisible,
  setVisible,
  isAskAQuestion,
  proId,
  bookingProId,
  bookingServiceId,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const parentNav = navigation.dangerouslyGetParent().dangerouslyGetState();
  const currentNavState = navigation.dangerouslyGetState();
  const dispatch = useDispatch();
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

  const setNavigationObj = () => {
    let navObj = {};
    if (parentNav) {
      navObj.currentNavType = parentNav.type;
      navObj.routeName = parentNav.routes?.[parentNav.index]?.name;
    }

    let childObj = {};
    childObj.currentNavType = currentNavState.type;
    childObj.routeName = currentNavState.routes?.[currentNavState.index]?.name;
    childObj.params = {...route.params};

    if (navObj.currentNavType) {
      navObj.child = childObj;
    }
    console.log(navObj);

    dispatch({type: STORE_NAVIGATION_ROUTE, payload: navObj});
  };

  const storeCustomNavigation = () => {
    if (!!proId) {
      dispatch(storeCustomNavFromLogin({proId: proId}));
    }

    if (!!bookingProId) {
      setNavigationObj();
    }
  };

  const onSignIn = () => {
    dispatch(setNavigationValue(1));
    dispatch(setOnboardingValue(1));
    //setNavigationObj();
    storeCustomNavigation();
    setVisible(false);
  };

  const onSignUp = () => {
    dispatch(setInitialNavigationRoute('signup_account_type'));
    dispatch(setNavigationValue(1));
    dispatch(setOnboardingValue(1));
    //setNavigationObj();
    storeCustomNavigation();
    setVisible(false);
  };

  // console.log(
  //   'BookingFlowSignUpModal ***',
  //   parentNav,
  //   // navigation.dangerouslyGetState(),
  //   // navigation.dangerouslyGetParent().dangerouslyGetState(),
  // );

  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  return (
    <RNModal
      //animationType="slide"
      transparent={true}
      isVisible={isVisible}
      onSwipeComplete={() => setVisible(false)}
      swipeThreshold={50}
      swipeDirection="down"
      hasBackdrop={true}
      avoidKeyboard={true}
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      propagateSwipe={true}
      scrollTo={handleScrollTo}
      scrollOffsetMax={500 - 100}
      backdropColor="rgba(0,0,0,0.5)"
      style={commonStyle.bottomModal}>
      <View>
        <View style={[commonStyle.staticModalContent, commonStyle.rnModalBody]}>
          <View
            style={[
              commonStyle.dialogheadingbg,
              {
                justifyContent: 'center',
                borderBottomWidth: 0,
                paddingHorizontal: 35,
              },
            ]}>
            <TouchableOpacity
              style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
              onPress={() => setVisible(false)}>
              <Text
                style={{
                  backgroundColor: '#ECEDEE',
                  width: 75,
                  height: 4,
                  borderRadius: 2,
                }}></Text>
            </TouchableOpacity>
            <Text
              style={[commonStyle.modalforgotheading, commonStyle.textCenter]}>
              {!!isAskAQuestion
                ? `To ask a question please Sign Up`
                : `To confirm booking please Sign Up`}
            </Text>
          </View>
          <View style={[commonStyle.typeofServiceFilterWrap]}>
            <View style={commonStyle.mb15}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.btnsocial}
                onPress={onSignUp}>
                <Image
                  style={commonStyle.socialIcon}
                  source={require('../../assets/images/login-email.png')}
                />
                <Text
                  style={[
                    commonStyle.blackText16,
                    {flex: 1, textAlign: 'center', marginRight: 25},
                  ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={commonStyle.mb15}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.btnsocial}
                onPress={onSignUp}>
                <Image
                  style={commonStyle.socialIcon}
                  source={require('../../assets/images/apple.png')}
                />
                <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
                  Sign Up with Apple
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={commonStyle.mb15}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.btnsocial}
                onPress={onSignUp}>
                <Image
                  style={commonStyle.socialIcon}
                  source={require('../../assets/images/facebook.png')}
                />
                <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
                  Sign Up with Facebook
                </Text>
              </TouchableOpacity>
            </View> */}
            {/* <View style={commonStyle.mb15}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={commonStyle.btnsocial}
                onPress={onSignUp}>
                <Image
                  style={commonStyle.socialIcon}
                  source={require('../../assets/images/google.png')}
                />
                <Text style={[commonStyle.blackText16, commonStyle.socialtext]}>
                  Sign Up with Google
                </Text>
              </TouchableOpacity>
            </View> */}
          </View>

          <View style={[commonStyle.termswrap, commonStyle.mb3]}>
            <Text style={[commonStyle.grayText16, commonStyle.mrsmall]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={onSignIn}>
              <Text style={commonStyle.blackText16}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Cancel"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisible(false);
              }}
            />
          </View>
        </View>
      </View>
    </RNModal>
  );
};

export default BookingFlowSignUpModal;
