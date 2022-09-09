import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Footer, List, ListItem, Body, Left} from 'native-base';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {CloseIcon} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {useSelector, useDispatch} from 'react-redux';
import {useForm, Controller} from 'react-hook-form';
import {forgotPasswordRequest, clearForgotPassword} from '../store/actions';
import global from '../components/commonservices/toast';
import {EMAIL_PATTERN} from '../utility/commonRegex';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const ForgotPassword = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.auth);
  const [isForgotEmilFocus, setIsForgotEmilFocus] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const {handleSubmit, control, errors, watch} = useForm();
  const isEmailAwailable = watch('email');
  const navigationRoute = !!route?.params?.navigationRoute
    ? route.params.navigationRoute
    : '';

  // This method will handle the auth saga
  useEffect(() => {
    if (authStore.mailSentForForgotPassword) {
      dispatch(clearForgotPassword());
      setTimeout(() => {
        setVisibleModal(true);
      }, 500);
    } else if (authStore.error !== null) {
      global.showToast(authStore.error, 'error');
    }
  }, [authStore, dispatch]);

  // This method for reference of email field
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // This method for change the visibility
  const changeVisibleModal = () => {
    setVisibleModal(!visibleModal);
  };

  // This method is for submit the data
  const onSubmitHandler = (value) => {
    if (forgotEmail.trim().length > 0) {
      if (EMAIL_PATTERN.test(forgotEmail)) {
        dispatch(forgotPasswordRequest(value));
      } else {
        global.showToast('Invalid email', 'error');
      }
    } else {
      global.showToast('Email is required', 'error');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {authStore.loader !== null && authStore.loader === true ? (
          <ActivityLoaderSolid />
        ) : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              Forgot your password?
            </Text>
            <Text style={[commonStyle.grayText14, commonStyle.mb2]}>
              {/* Enter the email you signed up with and we will send you a new
              password */}
              We'll send you instructions to reset your password.
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter your email
              </Text>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                render={({onChange, value}) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isForgotEmilFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsForgotEmilFocus(true)}
                    autoFocus={true}
                    keyboardType="email-address"
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    value={value}
                    onChangeText={(text) => {
                      setForgotEmail(text);
                      onChange(text);
                    }}
                  />
                )}
              />
              {errors.email && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.email?.message}
                </Text>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
        {isEmailAwailable ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Send"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                //onPress={changeVisibleModal} //!
                onPress={handleSubmit(onSubmitHandler)}
              />
            </View>
          </View>
        ) : null}
      </Container>

      {/* Forgot Password modal start */}
      <Modal
        isVisible={visibleModal}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
        <View style={commonStyle.scrollableModal}>
          <View style={[commonStyle.termswrap, commonStyle.mt2]}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <View style={commonStyle.modalContent}>
              <Text style={[commonStyle.modalforgotheading, commonStyle.mb15]}>
                Please check your email
              </Text>
              <Text style={commonStyle.grayText16}>
                {/* We've sent you an email with password reset instructions. If you
                didn't receive this email, please contact info@readyhubb.com */}
                We've sent you an email with password reset instructions, if you
                didn't receive this email, please contact hello@readyhubb.com
              </Text>

              <View style={[commonStyle.mt2, commonStyle.mb1]}>
                <Button
                  title="Ok"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.commonbuttonStyle}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() =>
                    changeVisibleModal() &
                    navigation.navigate('CreatePassword', {
                      email: forgotEmail,
                      navigationRoute,
                    })
                  }
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Forgot Password modal end */}
    </Fragment>
  );
};

export default ForgotPassword;
