import {Container} from 'native-base';
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import PhoneInput from 'react-native-phone-number-input';
import {Post, Put} from '../api/apiAgent';
import moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import commonStyle from '../assets/css/mainStyle';
import {CameraSmall, EditIconOrange} from '../components/icons';
import {getCurrentCountryCode} from '../utility/commonService';
import global from '../components/commonservices/toast';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import {NAME_CHARECTER_PATTERN, EMAIL_PATTERN} from '../utility/commonRegex';
import {IMAGE_MAX_SIZE, IMAGE_MAX_SIZE_VALIDATION_MSG} from '../api/constant';
const {width, height} = Dimensions.get('window');

const ClientsEditClientInfo = ({navigation, route}) => {
  const [filePath, setFilePath] = useState({});
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [loader, setLoader] = useState(false);
  const clientInfo = route.params.clientInfo;

  const chooseFile = () => {
    let options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = response;
        if (response.fileSize > IMAGE_MAX_SIZE) {
          setIsNewImagePicked(false);
          setFilePath({});
          global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
          return;
        }
        setIsNewImagePicked(true);
        generateProfileImageUrl(response);
        setFilePath(source);
      }
    });
  };

  const [isFullNameFocus, setIsFullNameFocus] = useState(false);
  const [fullName, setFullName] = useState(clientInfo.name || '');
  const [profileImage, setProfileImage] = useState(
    clientInfo.profileImage || '',
  );
  const [isNewImagePicked, setIsNewImagePicked] = useState(false);

  let ageLimit = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18),
  );
  const [dateOfBirth, setDateOfBirth] = useState(
    clientInfo.DOB
      ? moment(clientInfo.DOB, 'YYYY-MM-DD').format('DD-MM-YYYY')
      : '',
  );

  // const [value, setValue] = useState('567 902 467');
  const [value, setValue] = useState(clientInfo.phone || '');
  const [countryCodeString, setCountryCodeString] = useState(
    clientInfo?.countryCode == '+1'
      ? 'US'
      : clientInfo?.countryCode == '+44'
      ? 'GB'
      : clientInfo?.countryCode == '+91'
      ? 'IN'
      : 'US',
  );
  const [countryCode, setCountryCode] = useState(clientInfo?.countryCode || '');
  const [formattedValue, setFormattedValue] = useState(
    `${clientInfo.countryCode || '+44'}${clientInfo.phone}` || null,
  );
  const phoneInput = useRef('');

  const [isClientEmailFocus, setIsClientEmailFocus] = useState(false);
  const [clientemail, setClientEmail] = useState(clientInfo.email || '');
  const profileImageUrl = useState(null);

  const updateClientInfo = () => {
    let bodyObj = {};
    bodyObj['id'] = Number(`${clientInfo.id}`);

    // if (value.trim().length > 0) {
    //   if (value.trim().length > 9 && value.trim().length < 11) {
    //     let phoneNumber = value.replace(/[^0-9]/g, '-');
    //     if (phoneNumber.includes('-')) {
    //       global.showToast('Invalid phone number', 'error');
    //       return false;
    //     }
    //   } else {
    //     global.showToast('Invalid phone number', 'error');
    //     return false;
    //   }
    // } else {
    //   global.showToast('Phone number is required', 'error');
    //   return false;
    // }

    if (fullName.trim().length > 0) {
      if (NAME_CHARECTER_PATTERN.test(fullName)) {
        bodyObj['name'] = fullName;
      } else {
        global.showToast('Invalid name', 'error');
        return false;
      }
    } else {
      global.showToast('Name is required', 'error');
      return false;
    }

    if (fullName.trim().length > 70) {
      global.showToast('Name cannot be more than 70 characters', 'error');
      return false;
    }

    if (dateOfBirth) {
      let tempDate = dateOfBirth.split('-');
      bodyObj['dob'] = `${tempDate[2]}-${tempDate[1]}-${tempDate[0]}`;
    }
    // if (value) {
    bodyObj['phone'] = value;
    // }
    if (!!countryCode) {
      if (!!value) bodyObj['countryCode'] = countryCode;
      else bodyObj['countryCode'] = '';
    }
    if (clientemail) {
      if (EMAIL_PATTERN.test(clientemail)) {
        bodyObj['email'] = clientemail;
      } else {
        global.showToast('Invalid email', 'error');
        return;
      }
    } else {
      bodyObj['email'] = '';
    }

    if (isImageUpload === true) {
      bodyObj['profileImage'] = profileImage;
    }

    console.log('*****', bodyObj);

    navigation.setOptions({headerLeft: false});
    setLoader(true);
    Put(`/pro/edit-client`, bodyObj)
      .then((response) => {
        setLoader(false);
        if (response.status == 200) {
          setIsImageUpload(false);
          navigation.push('ClientsProfileWalkIn', {clientId: clientInfo.id});
          global.showToast('Successfully updated client info', 'success');
        }
      })
      .catch((err) => {
        let msg =
          err.response.data.status == 422
            ? err.response.data.message
            : 'Something went wrong, please try after some times';
        global.showToast(msg, 'error');
        navigation.setOptions({
          headerLeft: () => (
            <Feather
              name="arrow-left"
              size={24}
              onPress={() => {
                navigation.goBack();
              }}
            />
          ),
        });
        setLoader(false);
        setIsImageUpload(false);
      });
  };

  const generateProfileImageUrl = (imageData) => {
    const formData = new FormData();
    formData.append('image', {
      name: imageData.fileName,
      type: imageData.type,
      uri:
        Platform.OS === 'android'
          ? imageData.uri
          : imageData.uri.replace('file://', ''),
    });

    setLoader(true);
    Post('/pro/clients/upload-pic', formData)
      .then((response) => {
        if (response.status == 200) {
          global.showToast(response.message, 'success');
        }
        setLoader(false);
        setIsNewImagePicked(true);
        setProfileImage(response.data.url);
        setIsImageUpload(true);
      })
      .catch((err) => {
        setLoader(false);
        setIsImageUpload(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[commonStyle.accountprofilewrap, {paddingTop: 15}]}>
            <View style={commonStyle.mb2}>
              <View style={commonStyle.clientProfilebox}>
                {filePath.uri ? (
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={{uri: filePath.uri}}
                    resizeMode={'cover'}
                  />
                ) : clientInfo.profileImage ? (
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={{uri: clientInfo.profileImage}}
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
                onPress={chooseFile}>
                {filePath.uri ? <EditIconOrange /> : <CameraSmall />}
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
                value={fullName}
                returnKeyType="done"
                autoCapitalize={'none'}
                placeholder={'Client’s name'}
                maxLength={70}
                placeholderTextColor={'#939DAA'}
              />
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Date of Birth (it’s optional)
              </Text>
              <DatePicker
                placeholder={'DD/MM/YYYY'}
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
                    color: '#110F17',
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
                    defaultCode={countryCodeString}
                    layout="first"
                    placeholder={'XXXX XXX XXX'}
                    placeholderTextColor={'#939DAA'}
                    onChangeText={(text) => {
                      setValue(text);
                    }}
                    onChangeFormattedText={(text) => {
                      console.log('Formatted phone', text);
                      setFormattedValue(text);
                    }}
                    onChangeCountry={(countryInfo) => {
                      console.log(
                        'COUNTRY CHANGE: ',
                        countryInfo.callingCode[0],
                      );
                      setCountryCode(`+${countryInfo.callingCode[0]}`);
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
                    value={clientemail}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Save changes"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={updateClientInfo}
            />
          </View>
        </View>
      </Container>
    </Fragment>
  );
};

export default ClientsEditClientInfo;
