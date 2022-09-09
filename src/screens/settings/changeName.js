import React, {Fragment, useState, useEffect} from 'react';
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
  StatusBar,
  TextInput,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Container, Footer} from 'native-base';
import {Button} from 'react-native-elements';
import Modal from 'react-native-modal';
import circleMsgImg from '../../assets/images/circle-msg-icon.png';
import commonStyle from '../../assets/css/mainStyle';
import {
  changeNameUpdateRequest,
  changeNameUpdateRequestClear,
} from './../../store/actions/profileAction';
import ActivityLoaderSolid from './../../components/ActivityLoaderSolid';
import global from './../../components/commonservices/toast';
import {useSelector, useDispatch} from 'react-redux';
import {NAME_CHARECTER_PATTERN} from '../../utility/commonRegex';

const ChangeName = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [isFullNameFocus, setIsFullNameFocus] = useState(false);
  const [fullName, setFullName] = useState('');
  const [visibleModal, setVisibleModal] = useState(false);
  const updateNameData = useSelector(
    (state) => state.profileReducer.updateName,
  );
  const loderStatus = useSelector((state) => state.profileReducer.loader);

  // Call the function after save the name
  const showMsgModal = () => {
    if (fullName.trim().length > 0) {
      if (fullName.trim().length > 50) {
        global.showToast(
          'Name should not be greater than 50 characters',
          'error',
        );
        return false;
      }
      let formObj = {
        userName: fullName,
      };
      if (NAME_CHARECTER_PATTERN.test(fullName)) {
        dispatch(changeNameUpdateRequest(formObj));
      } else {
        global.showToast('Please use a suitable name', 'error');
      }
    } else {
      global.showToast('Name is required', 'error');
    }
  };

  useEffect(() => {
    if (updateNameData && updateNameData.status == 200) {
      setIsFullNameFocus(false);
      setFullName('');
      dispatch(changeNameUpdateRequestClear());
      setVisibleModal(true);
      setTimeout(() => {
        setVisibleModal(false);
      }, 2000);
      setTimeout(() => {
        navigation.navigate('AccountSettings');
      }, 1000);
    } else if (updateNameData && updateNameData.status != 200) {
      if (
        updateNameData.response.data.message !== null &&
        updateNameData.response.data.message !== ''
      ) {
        global.showToast(updateNameData.response.data.message, 'error');
        dispatch(changeNameUpdateRequestClear());
      }
    }
  });

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      {/* <Container style={[commonStyle.mainContainer]}> */}
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
                Full name
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  isFullNameFocus && commonStyle.focusinput,
                ]}
                onFocus={() => setIsFullNameFocus(true)}
                onChangeText={(text) => setFullName(text)}
                autoFocus={true}
                returnKeyType="done"
                maxLength={50}
                autoCapitalize={'none'}
              />
            </View>
          </View>
        </ScrollView>
        {fullName.trim().length > 0 ? (
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
      {/* </Container> */}
      {/* Name change Message modal start */}
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
              Your name has been changed successfully
            </Text>
          </View>
        </View>
      </Modal>
      {/* Name change Message modal end */}
    </Fragment>
  );
};

export default ChangeName;
