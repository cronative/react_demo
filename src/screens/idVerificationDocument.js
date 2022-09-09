import {Container, Left, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Modal as NativeModal,
  Alert,
} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EventEmitter from 'react-native-eventemitter';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
import ImagePicker from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch, useSelector} from 'react-redux';
import commonStyle from '../assets/css/mainStyle';
import Modal from 'react-native-modal';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import circleMsgImg from '../assets/images/circle-msg-icon.png';
import global from '../components/commonservices/toast';
import RNFetchBlob from 'rn-fetch-blob';
import {useNavigation} from '@react-navigation/native';
import ImageEditor from '@react-native-community/image-editor';
import {Body} from 'native-base';
import {
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../components/icons';
import {IMAGE_MAX_SIZE, IMAGE_MAX_SIZE_VALIDATION_MSG} from '../api/constant';
import {
  verifyIdentityRequest,
  verifyIdentityRequestClear,
} from '../store/actions/verificationAction';
import {UploadPhotoVideoModal} from '../components/modal';
const documentNoteData = [
  'Take a clear picture of your identity document, where every single detail is readable without any blur.',
  'Take the photos somewhere brightly lit.',
  'Turn flash off to avoid glare on your documents.',
  'Make sure the details on your Readyhubb profile match the details on your legal document.',
  'Do not take a picture of a picture.',
];
const IdVerificationDocument = (props) => {
  // Declare the constant
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {cancelVerificationStatus} = false;
  const [dataSelect, setDataSelect] = useState(0);
  const [idVerificationSelect, setIdVerificationSelect] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [imageFileData, setImageFileData] = useState('');
  const verificationData = useSelector(
    (state) => state.VerificationReducer.verifyIdentity,
  );
  const loderStatus = useSelector((state) => state.VerificationReducer.loader);
  const [visibleModal, setVisibleModal] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  // This method will call on Id Verification Select
  const idVerificationSelectHelper = (index, value) => {
    setDataSelect(value);
    setIdVerificationSelect(index);
  };

  // This function is for got to analytics page
  const headerLeftDecide = () => {
    navigation.setOptions({
      headerLeft: () => (
        <MaterialIcons
          name="chevron-left"
          size={30}
          onPress={() => {
            if (cancelVerificationStatus == true) {
              setTimeout(() => {
                navigation.navigate('Analytics');
              }, 100);
              setTimeout(() => {
                EventEmitter.emit('refreshAnalysitPage');
              }, 300);
            } else {
              navigation.goBack();
            }
          }}
        />
      ),
    });
  };

  // Refresh by event emitter
  useEffect(() => {
    headerLeftDecide();
    EventEmitter.on('refreshPage', () => {
      headerLeftDecide();
      dispatch(verifyIdentityRequest());
    });
  }, []);

  // This method will call on Id Verification photo
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
        console.log('Seleted Image Response : ', response);
        if (
          response.type === 'image/jpg' ||
          response.type === 'image/jpeg' ||
          response.type === 'image/png'
        ) {
          let actualImagePath =
            'data:' + response.type + ';base64,' + response.data;
          setFilePath(actualImagePath);
          setImageFileData(imageFile);
        } else {
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
    if (items?.length > 0) {
      let sizeValidationPass = validateFileSizes(items);
      if (!sizeValidationPass) {
        Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
        // global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
        return false;
      }
      // setModalVisible(false)
      let type = items[0].node.type;
      let fileName = items[0].node.image.filename;
      let uri = items[0].node.image.uri;

      if (Platform.OS === 'ios') {
        let path = uri;
        path = '~' + path.substring(path.indexOf('/Documents'));
        fileName = path.split('/').pop();
      }
      let imageFile = {
        name: fileName,
        type: type,
        uri: uri,
      };
      let typeCheckedItems = items.filter((item) => {
        if (
          item.node.type === 'image/jpg' ||
          item.node.type === 'image/jpeg' ||
          item.node.type === 'image/png' ||
          item.node.type === 'image'
        ) {
          return item;
        }
      });

      if (typeCheckedItems.length === items.length) {
        if (Platform.OS === 'ios') {
          ImageEditor.cropImage(typeCheckedItems[0].node.image.uri, {
            size: {
              width: typeCheckedItems[0].node.image.width,
              height: typeCheckedItems[0].node.image.height,
            },
            offset: {
              x: 0,
              y: 0,
            },
          })
            .then((imgUri) => {
              let uri =
                Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
              RNFetchBlob.fs
                .readFile(uri, 'base64')
                .then((fileData) => {
                  console.log('FILE DATA:', fileData);
                  setModalVisible(false);
                  let actualImagePath = 'data:' + type + ';base64,' + fileData;
                  setFilePath(actualImagePath);
                  setImageFileData(imageFile);
                })
                .catch((err) => {
                  console.log('Error in reading file:', err);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          RNFetchBlob.fs
            .readFile(uri, 'base64')
            .then((fileData) => {
              console.log('FILE DATA:', fileData);
              setModalVisible(false);
              let actualImagePath = 'data:' + type + ';base64,' + fileData;
              setFilePath(actualImagePath);
              setImageFileData(imageFile);
            })
            .catch((err) => {
              console.log('Error in reading file:', err);
            });
        }
      } else {
        Alert.alert('Only jpg, jpeg or png images are accepted');
        // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
      }
    }
  };

  const cameraSubmitEvent = (response) => {
    console.log(response);
    let sizeValidationPass = validateFileSizes(response);
    if (!sizeValidationPass) {
      Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
      // global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
      return false;
    }

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
      setImageFileData(imageFile);
    } else {
      Alert.alert('Only jpg, jpeg or png images are accepted');
      // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
    }
  };

  const validateFileSizes = (data) => {
    // for array
    if (data?.length) {
      let validatedItems = data.filter(
        (item) => item.node.image.fileSize <= IMAGE_MAX_SIZE,
      );
      return validatedItems.length === data.length;
    } else {
      // for single image
      return data.fileSize <= IMAGE_MAX_SIZE;
    }
  };

  // This method is for handle the response
  useEffect(() => {
    if (verificationData && verificationData.status == 200) {
      headerLeftDecide();
      console.log(verificationData.message);
      setVisibleModal(true);
      setTimeout(() => {
        setVisibleModal(false);
      }, 2000);
      setFilePath('');
      setDataSelect(0);
      setIdVerificationSelect(0);
      setImageFileData('');
      dispatch(verifyIdentityRequestClear());
      setTimeout(() => {
        navigation.navigate('Analytics');
      }, 2000);
      setTimeout(() => {
        EventEmitter.emit('refreshAnalysitPage');
      }, 2200);
    } else if (verificationData && verificationData.status != 200) {
      headerLeftDecide();
      console.log('Image Response : ', verificationData.message);
      if (
        verificationData?.response?.data?.message !== null &&
        verificationData?.response?.data?.message !== ''
      ) {
        global.showToast(verificationData.response.data.message, 'error');
        dispatch(verifyIdentityRequestClear());
      }
    }
  });

  // This method is for submit the form
  const submitHandler = () => {
    let documentType;
    navigation.setOptions({headerLeft: false});
    if (idVerificationSelect == 0) {
      documentType = 'voterId';
    } else {
      documentType = 'drivingLicence';
    }
    console.log('Image object : ', imageFileData);
    let formObj = new FormData();
    formObj.append('type', 'proIdentification');
    formObj.append('document', imageFileData);
    formObj.append('name', documentType);
    dispatch(verifyIdentityRequest(formObj));
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[commonStyle.fromwrap]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              Verification
            </Text>
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              <View>
                <RadioGroup
                  style={commonStyle.setupradioGroup}
                  color="#ffffff"
                  activeColor="#ffffff"
                  highlightColor={'#ffffff'}
                  selectedIndex={idVerificationSelect}
                  onSelect={(index, value) => {
                    idVerificationSelectHelper(index, value);
                  }}>
                  <RadioButton style={commonStyle.setupradioButton} value="0">
                    <View
                      style={[
                        commonStyle.radioCustomView,
                        {borderBottomWidth: 1, borderBottomColor: '#dcdcdc'},
                      ]}>
                      <Text style={commonStyle.blackTextR}>ID card</Text>
                      {idVerificationSelect == 0 ? (
                        <CircleCheckedBoxActive />
                      ) : (
                        <CircleCheckedBoxOutline />
                      )}
                    </View>
                  </RadioButton>
                  <RadioButton style={commonStyle.setupradioButton} value="1">
                    <View style={[commonStyle.radioCustomView]}>
                      <Text style={commonStyle.blackTextR}>Driver license</Text>
                      {idVerificationSelect == 1 ? (
                        <CircleCheckedBoxActive />
                      ) : (
                        <CircleCheckedBoxOutline />
                      )}
                    </View>
                  </RadioButton>
                </RadioGroup>
              </View>
            </View>
            <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Upload a photo of your document
              </Text>
              {filePath ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setModalVisible(true)}
                  // onPress={chooseFile}
                >
                  <Image
                    style={commonStyle.uploadedidprof}
                    source={{uri: filePath}}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={commonStyle.uploadservicepic}
                  onPress={() => setModalVisible(true)}>
                  {/* onPress={chooseFile}> */}
                  <Image
                    style={commonStyle.defaultpic}
                    source={require('../assets/images/add-img.png')}
                  />
                  <Text
                    style={[commonStyle.outlinetitleStyle, commonStyle.mt2]}>
                    Upload a photo
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={[commonStyle.setupCardBox]}>
              <List
                style={[
                  commonStyle.payinCashinfowrap,
                  commonStyle.mt1,
                  commonStyle.mb15,
                ]}>
                <ListItem thumbnail style={commonStyle.categoriseListItem}>
                  <View style={commonStyle.serviceListtouch}>
                    <Left
                      style={{...commonStyle.mr08, alignSelf: 'flex-start'}}>
                      <Image
                        source={require('../assets/images/payincashicon.png')}
                        style={commonStyle.payincashimg}
                        resizeMode={'contain'}
                      />
                    </Left>

                    <Body style={commonStyle.categoriseListBody}>
                      <Text
                        style={[
                          commonStyle.blackTextR,
                          commonStyle.mb1,
                          {flex: 1},
                        ]}>
                        Here are some tips to ensure your identity verification
                        goes smoothly:
                      </Text>
                    </Body>
                  </View>
                </ListItem>

                {documentNoteData?.map((note, index) => (
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
                    <View style={commonStyle.serviceListtouch}>
                      <Left
                        style={{
                          ...commonStyle.mr08,
                          alignSelf: 'flex-start',
                        }}></Left>

                      <Body style={commonStyle.categoriseListBody}>
                        <View style={{flexDirection: 'row'}}>
                          <View style={commonStyle.idVerificationNote} />

                          <Text
                            style={[
                              commonStyle.blackTextR,
                              commonStyle.mb1,
                              {flex: 1},
                            ]}>
                            {note}
                          </Text>
                        </View>
                      </Body>
                    </View>
                  </ListItem>
                ))}
              </List>
            </View>
          </View>
        </KeyboardAwareScrollView>
        {imageFileData !== '' && idVerificationSelect !== '' ? (
          <View style={[commonStyle.categoryselectbtn]}>
            <Button
              title="Send"
              containerStyle={commonStyle.buttoncontainerStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={submitHandler}
              // onPress={() => navigation.navigate('AnalyticsBalanceWithdrowalMethod')}
            />
          </View>
        ) : null}

        {/* Document verification warning message modal start */}
        <Modal
          visible={visibleModal}
          onRequestClose={() => {
            // console.log('Modal has been closed.');
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
                Your documents are pending verification
              </Text>
              <Text
                style={[
                  commonStyle.textCenter,
                  commonStyle.mb2,
                  {color: '#dcdcdc'},
                ]}>
                It takes 2-3 business days
              </Text>
            </View>
          </View>
        </Modal>
        {/* Document verification warning message modal end */}
      </Container>

      {/* Custom Gallery Modal */}
      <NativeModal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
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
            fileSizeRequired={true}
          />
        </View>
      </NativeModal>
    </Fragment>
  );
};

export default IdVerificationDocument;
