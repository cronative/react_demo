import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {List, ListItem, Body, Left} from 'native-base';
import {Container, Footer} from 'native-base';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import {EyeOpen, EyeClose} from '../../components/icons';
import commonStyle from '../../assets/css/mainStyle';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';
import {
  changePasswordUpdateRequest,
  changePasswordUpdateRequestClear,
} from './../../store/actions/profileAction';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {PASSWORD_PATTERN} from '../../utility/commonRegex';
import GetLocation from 'react-native-get-location';

const ChangePassword = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isOldPassFocus, setIsOldPassFocus] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [oldPasspress, setOldPasspress] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [isNewPassFocus, setIsNewPassFocus] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [newPasspress, setNewPasspress] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const ref_newpassword = useRef();
  const [visibleModal, setVisibleModal] = useState(false);
  const updatePasswordData = useSelector(
    (state) => state.profileReducer.updatePassword,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Call the function after click on password eye icon
  const showOldPass = () => {
    if (!oldPasspress) {
      setShowOldPassword(false);
      setOldPasspress(true);
    } else {
      setShowOldPassword(true);
      setOldPasspress(false);
    }
  };

  // Call the function will update the state
  const showNewPass = () => {
    if (!newPasspress) {
      setShowNewPassword(false);
      setNewPasspress(true);
    } else {
      setShowNewPassword(true);
      setNewPasspress(false);
    }
  };

  // Call the function after save the email
  const showMsgModal = () => {
    if (oldPassword.trim().length > 0 && newPassword.trim().length > 0) {
      let formObj = {
        oldPassword: oldPassword.trim(),
        newPassword: newPassword.trim(),
        cnfNewPassword: newPassword.trim(),
        lat: latitude,
        long: longitude,
      };
      if (PASSWORD_PATTERN.test(newPassword)) {
        dispatch(changePasswordUpdateRequest(formObj));
      } else {
        global.showToast(
          'Unformatted new password, which should contain one uppercase, one special character & one number',
          'error',
        );
      }
    } else {
      global.showToast('Old and new password are required', 'error');
    }
  };

  const getLatLong = () => {
    // setLoader(true);
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      })
      .catch((error) => {
        // setLoader(false);
        const {code, message} = error;
        console.log({error});
      });
  };

  useEffect(() => {
    getLatLong();
  }, []);

  useEffect(() => {
    if (updatePasswordData && updatePasswordData.status == 200) {
      setIsOldPassFocus(false);
      setOldPasspress(false);
      setIsNewPassFocus(false);
      setNewPasspress(false);
      setOldPassword('');
      setNewPassword('');
      dispatch(changePasswordUpdateRequestClear());
      setVisibleModal(true);
      setTimeout(() => {
        setVisibleModal(false);
      }, 2000);
      setTimeout(() => {
        navigation.navigate('AccountSettings');
      }, 1000);
    } else if (updatePasswordData && updatePasswordData.status != 200) {
      console.log('Message : ', updatePasswordData.response.data.message);
      if (
        updatePasswordData.response.data.message !== null &&
        updatePasswordData.response.data.message !== ''
      ) {
        global.showToast(updatePasswordData.response.data.message, 'error');
        dispatch(changePasswordUpdateRequestClear());
      }
    }
  }, [updatePasswordData]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS == 'ios' ? 80 : 0}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={{flex: 1, backgroundColor: 'white'}}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter old password
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  commonStyle.icontextinput,
                  isOldPassFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsOldPassFocus(true)}
                onChangeText={(text) => setOldPassword(text)}
                onSubmitEditing={() => ref_newpassword.current.focus()}
                returnKeyType="next"
                autoCapitalize={'none'}
                secureTextEntry={showOldPassword}
              />
              {oldPassword.length > 0 ? (
                <TouchableOpacity
                  style={commonStyle.btnEye}
                  onPress={showOldPass}>
                  {!oldPasspress ? <EyeOpen /> : <EyeClose />}
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={[commonStyle.fogotpassWrap, commonStyle.mb15]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    navigationRoute: 'ChangePassword',
                  })
                }>
                <Text style={commonStyle.blackTextR}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Create new password
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  commonStyle.icontextinput,
                  isNewPassFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsNewPassFocus(true)}
                onChangeText={(text) => setNewPassword(text)}
                ref={ref_newpassword}
                returnKeyType="done"
                autoCapitalize={'none'}
                secureTextEntry={showNewPassword}
              />
              {newPassword.length > 0 ? (
                <TouchableOpacity
                  style={commonStyle.btnEye}
                  onPress={showNewPass}>
                  {!newPasspress ? <EyeOpen /> : <EyeClose />}
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </ScrollView>
        {newPassword?.trim().length > 0 && oldPassword?.trim().length > 0 ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Save"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => {
                  showMsgModal();
                }}
              />
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
      {/* Password change Message modal start */}
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
          <View style={commonStyle.modalContent}>
            <View style={commonStyle.messageIcon}>
              <Image source={circleMsgImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Your password has been changed successfully
            </Text>
          </View>
        </View>
      </Modal>
      {/* Password change Message modal end */}
    </Fragment>
  );
};

export default ChangePassword;
