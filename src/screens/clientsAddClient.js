import React, {Fragment, useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Platform,
  Switch,
  TextInput,
  View,
  Text,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Container, List, ListItem, Body, Left, Right} from 'native-base';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker';
import PhoneInput from 'react-native-phone-number-input';
import {
  CameraSmall,
  EditIconOrange,
  CloseIcon,
  UncheckedBox,
  CheckedBox,
  DownArrow,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {useDispatch, useSelector} from 'react-redux';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {Get, Post} from '../api/apiAgent';
import {NAME_CHARECTER_PATTERN, EMAIL_PATTERN} from '../utility/commonRegex';
import moment from 'moment';
import {
  manualClientContactsRequest,
  manualClientContactsClear,
} from '../store/actions/clientsListAction';
const {width, height} = Dimensions.get('window');
import EventEmitter from 'react-native-eventemitter';
import {FRONTEND_BASE_PATH} from '../api/constant';
import {
  profileViewRequest,
  profileViewRequestClear,
} from '../store/actions/profileAction';
import {getCurrentCountryCode} from '../utility/commonService';
import {UploadPhotoVideoModal} from '../components/modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ClientsAddClient = ({navigation}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [filePath, setFilePath] = useState(null);
  const [selectedImageFile, setSselectedImageFile] = useState(null);
  const [isFullNameFocus, setIsFullNameFocus] = useState(false);
  const [fullName, setFullName] = useState('');
  let ageLimit = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18),
  );
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const phoneInput = useRef('');
  const [isClientEmailFocus, setIsClientEmailFocus] = useState(false);
  const [clientemail, setClientEmail] = useState('');
  const [isnotesFocus, setIsNotesFocus] = useState(false);
  const [notes, setNotes] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [countryCode, setCountryCode] = useState('+44');
  const clientAddData = useSelector(
    (state) => state.clientsListReducer.manualClientDetails,
  );
  const profileData = useSelector(
    (state) => state.profileReducer.profileDetails,
  );
  const [referralLink, setReferralLink] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  // This function will load only once
  useEffect(() => {
    dispatch(profileViewRequest());
  }, []);

  // This method is to handle the response
  useEffect(() => {
    if (profileData && profileData.status === 200) {
      let mainData = profileData.data;
      mainData.referralId != null && mainData.referralId != ''
        ? setReferralLink(`${FRONTEND_BASE_PATH}?ref=${mainData.referralId}`)
        : setReferralLink('');
    }
  }, [profileData]);

  // This method is to upload the client image
  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // Select the image from the picker
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        if (Platform.OS === 'ios') {
          let path = response.uri;
          path = '~' + path.substring(path.indexOf('/Documents'));
          response.fileName = path.split('/').pop();
        }
        let imageFile = {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        };
        if (
          response.type === 'image/jpg' ||
          response.type === 'image/jpeg' ||
          response.type === 'image/png'
        ) {
          let actualImagePath =
            'data:' + response.type + ';base64,' + response.data;
          setFilePath(actualImagePath);
          setSselectedImageFile(imageFile);
        } else {
          setFilePath(null);
          setSselectedImageFile(null);
          global.showToast(
            'Only jpg, jpeg or png images are accepted',
            'error',
          );
        }
      }
    });
  };

  //* Custom Gallery File Selection Event
  const fileSelectedEvent = (items) => {
    console.log(
      items,
      items[0].node.image,
      items[0].node.image.filename,
      items[0].node.image.uri,
    );
    setModalVisible(false);

    if (Platform.OS === 'ios') {
      let path = response.uri;
      path = '~' + path.substring(path.indexOf('/Documents'));
      response.fileName = path.split('/').pop();
    }

    let imageFile = {
      name: items[0].node.image.filename,
      type: items[0].node.type,
      uri: items[0].node.image.uri,
    };

    if (
      items[0].node.type === 'image/jpg' ||
      items[0].node.type === 'image/jpeg' ||
      items[0].node.type === 'image/png' ||
      items[0].node.type === 'image'
    ) {
      // let actualImagePath =
      //   'data:' + response.type + ';base64,' + response.data;

      setFilePath(items[0].node.image.uri);
      setSselectedImageFile(imageFile);

      // let formObj = new FormData();
      // formObj.append('profileImage', imageFile);
      // dispatch(profileImgUpdateRequest(formObj));
    } else {
      setFilePath(null);
      setSselectedImageFile(null);
      global.showToast('Only jpg, jpeg or png images are accepted', 'error');
    }
  };

  const cameraSubmitEvent = (response) => {
    setModalVisible(false);
    if (Platform.OS === 'ios') {
      let path = response.uri;
      path = '~' + path.substring(path.indexOf('/Documents'));
      response.fileName = path.split('/').pop();
    }
    let imageFile = {
      name: response.fileName,
      type: response.type,
      uri: response.uri,
    };
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png'
    ) {
      let actualImagePath =
        'data:' + response.type + ';base64,' + response.data;
      setFilePath(actualImagePath);
      setSselectedImageFile(imageFile);

      // let formObj = new FormData();
      // formObj.append('profileImage', imageFile);
      // dispatch(profileImgUpdateRequest(formObj));
    } else {
      global.showToast('Only jpg, jpeg or png images are accepted', 'error');
    }
  };

  // This function is to set the invite client toggle
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  // This method is to send the message and email
  const sendMsgEmail = (cntryCode, phone, email) => {
    let formObj = {
      countryCode: cntryCode ? `+${cntryCode}` : '',
      phone: phone,
      email: email,
      referralLink: referralLink,
    };
    Post('pro/invite-sms-email', formObj)
      .then((result) => {
        console.log('Response : ', result);
      })
      .catch((error) => {
        console.log('Error : ', error);
      });
  };

  // This function is to add the clients manually
  const addClientsManually = () => {
    if (fullName.trim() == '') {
      global.showToast('Name is required', 'error');
    } else if (countryCode == '') {
      global.showToast('Country code is required', 'error');
    } else if (NAME_CHARECTER_PATTERN.test(fullName) == false) {
      global.showToast('Please use a suitable name', 'error');
      // } else if (value == '') {
      //   global.showToast('Phone number is required', 'error');
    } else if (
      clientemail.trim() > 0 &&
      EMAIL_PATTERN.test(clientemail) == false
    ) {
      global.showToast('Invalid email', 'error');
    } else {
      if (selectedImageFile == null) {
        setLoader(true);
        let dispatchObj = {
          name: fullName,
          phone: value,
          note: notes,
          profileImage: '',
          dob: moment(dateOfBirth, ['DD-MM-YYYY', 'YYYY-MM-DD']).format(
            'YYYY-MM-DD',
          ),
          countryCode: countryCode && value != '' ? `+${countryCode}` : '',
        };
        if (clientemail != '') {
          dispatchObj.email = clientemail;
        }
        if (value == '') {
          delete dispatchObj.phone;
          delete dispatchObj.countryCode;
        }
        if (notes == '') {
          delete dispatchObj.note;
        }
        console.log('sending value', dispatchObj);
        dispatch(manualClientContactsRequest(dispatchObj));
      } else {
        let formObj = new FormData();
        formObj.append('image', selectedImageFile);
        setLoader(true);
        Post('pro/clients/upload-pic', formObj)
          .then((result) => {
            if (result.status == 200) {
              let profileURL = result?.data?.url;
              if (profileURL != '') {
                let dispatchObj = {
                  name: fullName,
                  phone: value,
                  note: notes ? notes : '',
                  profileImage: profileURL,
                  dob: moment(dateOfBirth, ['DD-MM-YYYY', 'YYYY-MM-DD']).format(
                    'YYYY-MM-DD',
                  ),
                  countryCode: countryCode ? `+${countryCode}` : '',
                };
                if (clientemail != '') {
                  dispatchObj.email = clientemail;
                }
                if (value == '') {
                  delete dispatchObj.phone;
                  delete dispatchObj.countryCode;
                }
                if (notes == '') {
                  delete dispatchObj.note;
                }
                dispatch(manualClientContactsRequest(dispatchObj));
              }
            }
          })
          .catch((error) => {
            setLoader(false);
            if (error.response.data.status == 500) {
              global.showToast(
                'Something went wrong, please try after some times',
                'error',
              );
            }
          });
      }
    }
  };

  // This method will handle the response
  useEffect(() => {
    if (clientAddData && clientAddData.status == 200) {
      if (isEnabled === true) {
        sendMsgEmail(countryCode, value, clientemail);
      }
      setLoader(false);
      dispatch(manualClientContactsClear());
      setFilePath(null);
      setSselectedImageFile(null);
      setIsFullNameFocus(false);
      setFullName('');
      setDateOfBirth('');
      setValue('');
      setFormattedValue('');
      setIsClientEmailFocus(false);
      setClientEmail('');
      setIsNotesFocus(false);
      setNotes('');
      setIsEnabled(false);
      setCountryCode('+44');
      global.showToast(clientAddData.message, 'success');
      setTimeout(() => {
        navigation.navigate('Analytics');
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1200);
    } else if (clientAddData && clientAddData.status != 200) {
      setLoader(false);
      if (
        clientAddData.response.data.message !== null &&
        clientAddData.response.data.message !== ''
      ) {
        global.showToast(clientAddData.response.data.message, 'error');
        dispatch(manualClientContactsClear());
      }
    }
  }, [clientAddData]);

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.accountprofilewrap, {paddingTop: 15}]}>
            <View style={commonStyle.mb2}>
              <View style={commonStyle.clientProfilebox}>
                {filePath != null ? (
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={{uri: filePath}}
                    resizeMode={'cover'}
                  />
                ) : (
                  <Image
                    style={commonStyle.defaultprofilepic}
                    source={require('../assets/images/signup/account-avater-1.png')}
                  />
                )}
              </View>
              <TouchableOpacity
                style={commonStyle.camerabtn}
                activeOpacity={0.5}
                // onPress={chooseFile}
                onPress={() => setModalVisible(true)}>
                {filePath !== null ? <EditIconOrange /> : <CameraSmall />}
              </TouchableOpacity>
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Enter full name
              </Text>
              <TextInput
                style={[
                  commonStyle.textInput,
                  isFullNameFocus && commonStyle.focusinput,
                  {width: width - 40},
                ]}
                onFocus={() => setIsFullNameFocus(true)}
                onChangeText={(text) => setFullName(text)}
                returnKeyType="done"
                autoCapitalize={'none'}
                placeholder={'Client’s name'}
                placeholderTextColor={'#939DAA'}
              />
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Date of Birth (it’s optional)
              </Text>
              <DatePicker
                placeholder={'DD-MM-YYYY'}
                style={[commonStyle.textInput, {width: width - 40}]}
                date={dateOfBirth}
                mode="date"
                maxDate={ageLimit}
                format="DD-MM-YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput: {
                    marginLeft: 0,
                    borderBottomWidth: 0,
                    borderTopWidth: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    paddingLeft: 0,
                  },
                  dateText: {
                    fontSize: 16,
                    color: '#8c8c8c',
                    fontFamily: 'SofiaPro',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                  btnTextText: {
                    color: '#8c8c8c',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextConfirm: {
                    color: '#8c8c8c',
                    fontFamily: 'SofiaPro',
                  },
                  btnTextCancel: {
                    color: '#8c8c8c',
                    fontFamily: 'SofiaPro',
                  },
                  placeholderText: {
                    fontFamily: 'SofiaPro',
                    fontSize: 16,
                    color: '#939DAA',
                    textAlign: 'left',
                    alignSelf: 'flex-start',
                    alignItems: 'center',
                    marginTop: 3,
                  },
                }}
                onDateChange={(date) => {
                  setDateOfBirth(date);
                }}
              />
            </View>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                Contact details
              </Text>
              <View style={[commonStyle.newclientwrap]}>
                <View style={[commonStyle.mb2]}>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Phone number (it’s optional)
                  </Text>
                  <PhoneInput
                    ref={phoneInput}
                    defaultValue={value}
                    defaultCode={getCurrentCountryCode()}
                    layout="first"
                    placeholder={'XXXX XXX XXX'}
                    placeholderTextColor={'#939DAA'}
                    onChangeText={(text) => {
                      setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                      let countycodes = phoneInput.current?.getCallingCode()
                        ? phoneInput.current?.getCallingCode()
                        : countryCode;
                      setCountryCode(countycodes);
                      setFormattedValue(text);
                    }}
                    withDarkTheme={false}
                    withShadow={false}
                    autoFocus={false}
                    containerStyle={[
                      commonStyle.phonecontainerBorder,
                      formattedValue && commonStyle.phonecontainerBorderFocus,
                    ]}
                    textContainerStyle={commonStyle.phonetextContainerStyle}
                    textInputStyle={commonStyle.phonetextInputStyle}
                    codeTextStyle={commonStyle.phonecodeTextStyle}
                    flagButtonStyle={commonStyle.phoneflagButtonStyle}
                    countryPickerButtonStyle={
                      commonStyle.phonecountryPickerButtonStyle
                    }
                  />
                </View>
                <View>
                  <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                    Email (it’s optional)
                  </Text>
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      isClientEmailFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setIsClientEmailFocus(true)}
                    onChangeText={(text) => setClientEmail(text)}
                    // autoFocus={true}
                    returnKeyType="done"
                    keyboardType="email-address"
                    autoCapitalize={'none'}
                    placeholder="Email"
                    placeholderTextColor={'#939DAA'}
                  />
                </View>
              </View>
            </View>

            <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                Notes
              </Text>
              <View style={[commonStyle.mb2]}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Internal note (viewable by Pro only)
                </Text>
                <TextInput
                  style={[
                    commonStyle.textInput,
                    isnotesFocus && commonStyle.focusinput,
                  ]}
                  onFocus={() => setIsNotesFocus(true)}
                  onChangeText={(text) => setNotes(text)}
                  // autoFocus={true}
                  returnKeyType="done"
                  keyboardType="default"
                  autoCapitalize={'none'}
                />
              </View>
            </View>

            <View style={[commonStyle.setupCardBox]}>
              <List style={[commonStyle.switchAccountWrap]}>
                <ListItem
                  style={[commonStyle.switchAccountView, {paddingTop: 10}]}>
                  <Left>
                    <Text style={commonStyle.blackTextR}>Invite Client</Text>
                  </Left>
                  <Right>
                    <Switch
                      trackColor={{false: '#939DAA', true: '#F36A46'}}
                      thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </Right>
                </ListItem>
              </List>
            </View>
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={addClientsManually}
              // onPress={() => navigation.navigate('ClientsWalkInClient')}
            />
          </View>
        </View>
      </Container>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
        style={commonStyle.centeredView}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              {marginTop: Platform.OS === 'ios' ? 32 : 0},
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => setModalVisible(false)}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
            <Body style={[commonStyle.headerbacktitle, {marginLeft: -40}]}>
              <Text style={commonStyle.blackText16}>Upload your photo</Text>
            </Body>
          </View>
          <UploadPhotoVideoModal
            visible={modalVisible}
            multiSelect={false}
            //* Available Types: All, Videos, Photos
            assetType={'Photos'}
            submitEvent={fileSelectedEvent}
            cameraSubmitEvent={cameraSubmitEvent}
          />
        </View>
      </Modal>
    </Fragment>
  );
};

export default ClientsAddClient;
