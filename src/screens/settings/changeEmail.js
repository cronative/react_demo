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
  changeEmailUpdateRequest,
  changeEmailUpdateRequestClear,
} from './../../store/actions/profileAction';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {EMAIL_PATTERN} from '../../utility/commonRegex';

const ChangeEmail = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [press, setPress] = useState(false);
  const [password, setPassword] = useState('');
  const [isNewEmilFocus, setIsNewEmilFocus] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const ref_newemail = useRef();
  const [visibleModal, setVisibleModal] = useState(false);
  const updateEmailData = useSelector(
    (state) => state.profileReducer.updateEmail,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  // Call the function after click on password eye icon
  const showPass = () => {
    if (!press) {
      setShowPassword(false);
      setPress(true);
    } else {
      setShowPassword(true);
      setPress(false);
    }
  };

  // Call the function after save the email
  const showMsgModal = () => {
    if (password.trim().length > 0 && newEmail.trim().length > 0) {
      let formObj = {
        password: password,
        email: newEmail,
      };
      if (EMAIL_PATTERN.test(newEmail)) {
        dispatch(changeEmailUpdateRequest(formObj));
      } else {
        global.showToast('Invalid email', 'error');
      }
    } else {
      global.showToast('Password and email are required', 'error');
    }
  };

  useEffect(() => {
    if (updateEmailData && updateEmailData.status == 200) {
      let userEmail = newEmail;
      setIsPassFocus(false);
      setIsNewEmilFocus(false);
      setPassword('');
      setNewEmail('');
      dispatch(changeEmailUpdateRequestClear());
      global.showToast(
        'We sent a verification code to your email id',
        'success',
      );
      navigation.navigate('changeEmailOtpVerification', {
        user_email: userEmail,
      });
    } else if (updateEmailData && updateEmailData.status != 200) {
      if (
        updateEmailData.response.data.message !== null &&
        updateEmailData.response.data.message !== ''
      ) {
        global.showToast(updateEmailData.response.data.message, 'error');
        dispatch(changeEmailUpdateRequestClear());
      }
    }
  });

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
                Enter your password
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  commonStyle.icontextinput,
                  isPassFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsPassFocus(true)}
                onChangeText={(text) => setPassword(text)}
                onSubmitEditing={() => ref_newemail.current.focus()}
                returnKeyType="next"
                autoCapitalize={'none'}
                secureTextEntry={showPassword}
              />
              {password.length > 0 ? (
                <TouchableOpacity style={commonStyle.btnEye} onPress={showPass}>
                  {!press ? <EyeOpen /> : <EyeClose />}
                </TouchableOpacity>
              ) : null}
            </View>
            <View style={[commonStyle.fogotpassWrap, commonStyle.mb15]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ForgotPassword', {
                    navigationRoute: 'ChangeEmail',
                  })
                }>
                <Text style={commonStyle.blackTextR}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter new email
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  isNewEmilFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsNewEmilFocus(true)}
                onChangeText={(text) => setNewEmail(text)}
                ref={ref_newemail}
                keyboardType="email-address"
                returnKeyType="done"
                autoCapitalize={'none'}
              />
            </View>
          </View>
        </ScrollView>
        {password.trim().length > 0 && newEmail.trim().length > 0 ? (
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
      {/* Email change Message modal start */}
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
              Your email has been changed successfully
            </Text>
          </View>
        </View>
      </Modal>
      {/* Email change Message modal end */}
    </Fragment>
  );
};

export default ChangeEmail;
