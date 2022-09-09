import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Footer} from 'native-base';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import {EyeOpen, EyeClose} from '../components/icons';
import {ChangePasswordMessageModal} from '../components/modal';
import commonStyle from '../assets/css/mainStyle';
import {useForm, Controller} from 'react-hook-form';
import {createPasswordRequest} from '../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import global from '../components/commonservices/toast';
import {passwordPost} from '../api/apiAgent';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {PASSWORD_PATTERN} from '../utility/commonRegex';

const CreatePassword = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const authStore = useSelector((state) => state.auth);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [isOtpFocus, setIsOtpFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [press, setPress] = useState(false);
  const [password, setPassword] = useState('');
  const [enterotp, setEnterotp] = useState('');
  const [loader, setLoader] = useState(false);
  const ref_inputpassword = useRef();
  const [visibleModal, setVisibleModal] = useState(false);
  const {handleSubmit, control, errors, watch} = useForm();
  const isPasswordAwailable = watch('password');
  const [logedInUserId, setLogedInUserId] = useState('');
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  const navigationRoute = !!route?.params?.navigationRoute
    ? route.params.navigationRoute
    : '';

  // This method is for after successfully changed the email
  const showMsgModal = () => {
    setVisibleModal(true);
    setTimeout(() => {
      setVisibleModal(false);
      if (!!profileData) navigation.navigate(navigationRoute);
      else navigation.navigate('Login');
    }, 3000);
  };

  useEffect(() => {
    getLogedInUserId();
  }, []);

  // This Method will use to show and hide the password
  const showPass = () => {
    if (!press) {
      setShowPassword(false);
      setPress(true);
    } else {
      setShowPassword(true);
      setPress(false);
    }
  };
  const getLogedInUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      setLogedInUserId(userId);
    } catch (e) {}
  };

  // This method is for submit the data and handle the response
  const onSubmitHandler = (value) => {
    if (
      route.params.email !== null &&
      route.params.email !== '' &&
      enterotp !== null &&
      enterotp !== ''
    ) {
      if (PASSWORD_PATTERN.test(password)) {
        setLoader(true);
        let postData = {
          email: route.params.email,
          otp: enterotp,
          newPassword: password,
          cnfNewPassword: password,
        };
        passwordPost('/user/reset-password', postData)
          .then((result) => {
            setLoader(false);
            if (result.status === 200) {
              showMsgModal();
            } else {
              if (result.message === 'Invalid Token') {
                result.message = 'Invalid OTP';
              }
              global.showToast(result.message, 'error');
            }
          })
          .catch((error) => {
            setLoader(false);
            if (
              error.response.data.status !== 500 ||
              error.response.data.status !== '500'
            ) {
              global.showToast(error.response.data.message, 'error');
            }
          });
      } else {
        global.showToast(
          'Unformatted new password, which should contain one uppercase, one special character & one number',
          'error',
        );
      }
    } else {
      global.showToast('Invalid form inputs', 'error');
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loader === true ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={commonStyle.fromwrap}>
            <Text style={[commonStyle.subheading, commonStyle.mb2]}>
              Enter new password
            </Text>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Create password
              </Text>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({onChange, value}) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      commonStyle.icontextinput,
                      isPassFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsPassFocus(true)}
                    ref={ref_inputpassword}
                    autoFocus={true}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    secureTextEntry={showPassword}
                    value={value}
                    onChangeText={(text) => {
                      setPassword(text);
                      onChange(text);
                    }}
                  />
                )}
              />
              {isPasswordAwailable ? (
                <TouchableOpacity style={commonStyle.btnEye} onPress={showPass}>
                  {!press ? <EyeOpen /> : <EyeClose />}
                </TouchableOpacity>
              ) : null}

              {errors.password && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.password?.message}
                </Text>
              )}
            </View>

            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                OTP
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  isOtpFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsOtpFocus(false)}
                onChangeText={(text) => setEnterotp(text)}
                autoFocus={false}
                keyboardType="number-pad"
                returnKeyType="done"
                autoCapitalize={'none'}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        {isPasswordAwailable && enterotp ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Save"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={handleSubmit(onSubmitHandler)}
              />
            </View>
          </View>
        ) : null}
      </Container>

      {/* New Password Message modal start */}
      <Modal
        visible={visibleModal}
        onRequestClose={() => {
          console.log('Modal has been closed.');
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
          <ChangePasswordMessageModal
            type={!!navigationRoute ? 'afterLogin' : 'beforeLogin'}
          />
        </View>
      </Modal>
      {/* New Password Change Message modal end */}
    </Fragment>
  );
};

export default CreatePassword;
