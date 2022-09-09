import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { Button } from 'react-native-elements';
import { RadioButton, RadioGroup } from 'react-native-flexi-radio-button';
import Modal from 'react-native-modal';
import commonStyle from '../../assets/css/mainStyle';
import { DECIMAL_REGX_AMOUNT } from '../../utility/commonRegex';
import { DurationTimeData, ExtraTimeData } from '../../utility/staticData';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  CheckedBox,
  CircleCheckedBoxActive,
  CircleCheckedBoxOutline,
  DownArrow,
  LeftArrowAndroid,
  LeftArrowIos,
  UncheckedBox,
} from '../icons';

import { useFocusEffect } from '@react-navigation/native';
import {
  IMAGE_MAX_SIZE,
  IMAGE_MAX_SIZE_VALIDATION_MSG,
} from '../../api/constant';
import { Body } from 'native-base';
import UploadPhotoVideoModal from './UploadPhotoVideoModal';
import ImageEditor from '@react-native-community/image-editor';
import RNFetchBlob from 'rn-fetch-blob';

const SetupServiceAddModal = ({
  scrollViewRefModal,
  handleOnScrollHandler,
  addServiceHandle,
  editItems,
  deleteServiceHandler,
  businessDetails,
  setKeyboardStatus,
}) => {
  const [nameOfServiceFocus, setNameOfServiceFocus] = useState(false);
  const [isServicePriceFocus, setIsServicePriceFocus] = useState(false);
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [extraTimeVisibleModal, setExtraTimeVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const scrollViewRefTop = useRef(0);

  const [duration, setDuration] = useState(
    (editItems && editItems.duration) || null,
  );
  const [durationText, setDurationText] = useState(null);

  const [extraTimeDuration, setExtraTimeDuration] = useState(
    (editItems && editItems.extraTimeDuration) || null,
  );
  const [extraTimeDurationText, setExtraTimeDurationText] = useState(null);

  const [extraTimeValue, setExtraTimeValue] = useState(false);

  const [description, setDescription] = useState('');
  const { handleSubmit, control, errors, setValue } = useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isValidAmount, setIsValidAmount] = useState(true);
  const [amount, setAmount] = useState();
  const [isValidExtraTime, setIsValidExtraTime] = useState(true);
  const [isCheckedMobileService, setIsCheckedMobileService] = useState(
    editItems?.isMobileService || false,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [filePath, setFilePath] = useState('');
  const [imageRequireText, setImageRequireText] = useState(false);
  const [imageFileData, setImageFileData] = useState('');
  useFocusEffect(
    useCallback(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
        console.log('Keyboard is being visible');
        setKeyboardStatus(e.endCoordinates.height);
        // if (!!scrollViewRefModal && Platform.OS === 'ios') {
        //   scrollViewRefModal.current.scrollToPosition(0, 0);
        // }
      });
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        console.log('Keyboard is being hidden');
        setKeyboardStatus(0);
      });

      return () => {
        setKeyboardStatus(0);
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, []),
  );

  useEffect(() => {
    if (editItems) {
      setAmount(editItems.amount);
      let index = DurationTimeData.findIndex(
        (x) => x.value === editItems.duration,
      );
      setDurationText(DurationTimeData[index].durationTime);
      setDescription(editItems.description);

      if (editItems.extraTimeDuration) {
        let index = ExtraTimeData.findIndex(
          (x) => x.value == editItems.extraTimeDuration,
        );
        setExtraTimeValue(true);
        setExtraTimeDurationText(ExtraTimeData[index]?.displayText);
      }
      setDescription(editItems.description);
      console.log('edit', editItems);
      if (editItems.image) {
        setFilePath(editItems?.imageUrl ?? editItems?.image?.uri);
      }
    }
  }, []);
  /**
   * This method will call on Modal show hide.
   */
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };

  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  // const handleScrollToTopSecton = (p) => {
  //   if (scrollViewRefTop.current) {
  //     scrollViewRefTop.current.scrollTo(p);
  //   }
  // };
  /**
   * This method will call on Business Name Select.
   */
  const serviceDurationSelectHelper = (index, value) => {
    setDuration(value);
    setDurationText(DurationTimeData[index].durationTime);
  };

  const serviceExtraTimeSelectHelper = (index, value) => {
    setIsValidExtraTime(true);
    setExtraTimeDuration(value);
    setExtraTimeDurationText(ExtraTimeData[index]?.displayText);
    if (duration && duration < value) {
      setIsValidExtraTime(false);
    }
  };

  const serviceHandler = async (value) => {
    console.log("167777777777");
    if (!duration) return false;
    await checkIsCorrectPrice();
    setIsSubmit(true);
    setIsValidAmount(true);
    setIsValidExtraTime(true);
    value.id = (editItems && editItems.id) || 0;
    value.durationText = durationText;
    value.duration = duration;
    value.isMobileService = value.isMobileService || 0;
    if (
      value.extraTime &&
      (!extraTimeDuration || duration < extraTimeDuration)
    ) {
      if (extraTimeDuration) {
        setIsValidExtraTime(false);
      }
      return;
    }

    if (value.extraTime) {
      value.extraTimeDuration = extraTimeDuration;
    }
    let amountConvert = parseFloat(value.amount);
    if (amountConvert) {
      if (!DECIMAL_REGX_AMOUNT.test(amountConvert)) {
        setIsValidAmount(false);
        return;
      }
    } else {
      return;
    }
    if (editItems) {
      if (editItems?.imageUrl || editItems?.image?.uri) {
        if (imageFileData?.uri) {
          value.image = imageFileData;
        }
      } else {
        if (imageFileData?.uri) {
          value.image = imageFileData;
        }
        //  else {
        //   setImageRequireText(true);
        //   return;
        // }
      }
    } else {
      if (imageFileData?.uri) {
        value.image = imageFileData;
      }
      // else {
      //   setImageRequireText(true);
      //   return;
      // }
    }

    addServiceHandle(value);
  };

  const checkIsCorrectPrice = async () => {
    setIsValidAmount(true);
    let amountConvert = parseFloat(amount);
    if (amountConvert) {
      if (!DECIMAL_REGX_AMOUNT.test(amountConvert)) {
        setIsValidAmount(false);
      }
    } else {
      setAmount(null);
      setValue('amount', null);
    }
  };

  const confirmCategoryDeleteHandler = (id) => {
    let msg = 'Are you sure, you want to delete?';
    Alert.alert(
      'Confirmation',
      msg,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => deleteServiceHandler(id),
        },
      ],
      { cancelable: false },
    );
  };

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
      console.log('uri----', imageFile);
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
              imageFile.uri =
                Platform.OS === 'ios' ? imgUri.replace('file://', '') : imgUri;
              imageFile.type = `image/${imgUri.split('.').pop()}`;
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
      imageFile.uri =
        Platform.OS === 'ios'
          ? response.uri.replace('file://', '')
          : response.uri;
      imageFile.type = `image/${response.uri.split('.').pop()}`;
      let actualImagePath =
        'data:' + response.type + ';base64,' + response.data;
      setFilePath(response.uri);
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

  return (
    <Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        ref={scrollViewRefModal}
        onScroll={handleOnScrollHandler}
        scrollEventThrottle={10}>
        <View style={commonStyle.modalContent}>

          <View
            style={[
              commonStyle.dialogheadingbg,
              { borderBottomWidth: 0, paddingBottom: 0 },
            ]}>
            <Text style={[commonStyle.modalforgotheading]}>
              Service details
            </Text>
            {editItems ? (
              <TouchableOpacity>
                <Text
                  style={commonStyle.grayText16}
                  onPress={() =>
                    confirmCategoryDeleteHandler(
                      (editItems && editItems.id) || null,
                    )
                  }>
                  Delete
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <Text style={[commonStyle.grayText16, commonStyle.mt1]}>
            You’ll be able to add more details later
          </Text>
          <View style={commonStyle.typeofServiceFilterWrap}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Name of service
              </Text>
              <Controller
                name="name"
                control={control}
                defaultValue={editItems?.name || ''}
                rules={{
                  required: { value: true, message: 'Required' },
                }}
                render={({ onChange, value }) => (
                  <TextInput
                    style={[
                      commonStyle.textInput,
                      nameOfServiceFocus && commonStyle.focusinput,
                    ]}
                    onFocus={() => setNameOfServiceFocus(true)}
                    returnKeyType="done"
                    keyboardType="email-address"
                    autoCapitalize={'none'}
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                    }}
                  />
                )}
              />
              {errors.name && (
                <Text style={commonStyle.inputfielderror}>
                  {errors?.name?.message}
                </Text>
              )}
            </View>
            {businessDetails && businessDetails.mobileType ? (
              <View style={commonStyle.mb2}>
                <Controller
                  name="isMobileService"
                  control={control}
                  defaultValue={editItems?.isMobileService || false}
                  render={({ onChange, value }) => (
                    <CheckBox
                      style={{ paddingVertical: 10 }}
                      onClick={() => {
                        onChange(!value);
                        setIsCheckedMobileService(!value);
                      }}
                      isChecked={value}
                      checkedCheckBoxColor={'#ff5f22'}
                      uncheckedCheckBoxColor={'#e6e7e8'}
                      rightText={
                        <Text style={{ fontWeight: 'bold' }}>
                          Is it a mobile service?
                        </Text>
                      }
                      rightTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                  )}
                />
              </View>
            ) : (
              <View style={commonStyle.mb2}>
                <CheckBox
                  style={{ paddingVertical: 10 }}
                  uncheckedCheckBoxColor={'#e6e7e8'}
                  rightText={
                    <Text style={{ fontWeight: 'bold' }}>
                      Is it a mobile service?
                    </Text>
                  }
                  rightTextStyle={commonStyle.grayText16}
                  unCheckedImage={<UncheckedBox />}
                  onClick={() => {
                    console.log('not click able0');
                  }}
                />
              </View>
            )}
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Price
              </Text>
              <View>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue={editItems?.amount || ''}
                  rules={{
                    required: { value: true, message: 'Required' },
                  }}
                  render={({ onChange, value }) => (
                    <TextInput
                      style={[
                        commonStyle.textInput,
                        commonStyle.prefixInput,
                        isServicePriceFocus && commonStyle.focusinput,
                      ]}
                      onFocus={() => setIsServicePriceFocus(true)}
                      keyboardType="numeric"
                      autoCapitalize={'none'}
                      returnKeyType="done"
                      placeholderTextColor={'#939DAA'}
                      value={value}
                      onChangeText={(text) => {
                        console.log('text amount', text);
                        setAmount(text);
                        onChange(text);
                      }}
                      onBlur={() => checkIsCorrectPrice()}
                    />
                  )}
                />
                <Text style={commonStyle.prefixText}>$</Text>
                {errors.amount ? (
                  <Text style={commonStyle.inputfielderror}>
                    {errors?.amount?.message}
                  </Text>
                ) : null}
                {!isValidAmount ? (
                  <Text style={commonStyle.inputfielderror}>
                    Invalid amount
                  </Text>
                ) : null}
              </View>
            </View>
            {businessDetails &&
              businessDetails.mobileType &&
              isCheckedMobileService ? (
              <View style={commonStyle.mb2}>
                <Text style={commonStyle.grayText16}>
                  {businessDetails.travelFees
                    ? '+ $' + businessDetails.travelFees
                    : '$0'}{' '}
                  Travel fee
                </Text>
              </View>
            ) : null}
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Duration
              </Text>
              <TouchableOpacity
                style={commonStyle.dropdownselectmodal}
                onPress={() => {
                  setVisibleModal('DurationAddDialog');
                }}>
                {!duration ? (
                  <Text style={commonStyle.grayText16}>Add duration</Text>
                ) : (
                  <Text style={commonStyle.blackTextR}>{durationText}</Text>
                )}
                <DownArrow />
              </TouchableOpacity>
              {/* {isSubmit && !duration && (
                <Text style={commonStyle.inputfielderror}>Required</Text>
              )} */}
              {!duration ? (
                <Text style={commonStyle.inputfielderror}>
                  Required {duration}
                </Text>
              ) : null}
            </View>
            <View style={commonStyle.mb2}>
              <Controller
                name="extraTime"
                control={control}
                defaultValue={editItems?.extraTime || false}
                render={({ onChange, value }) => (
                  <CheckBox
                    style={{ paddingVertical: 10 }}
                    onClick={() => {
                      onChange(!value);
                      setExtraTimeValue(!value);
                    }}
                    isChecked={value}
                    checkedCheckBoxColor={'#ff5f22'}
                    uncheckedCheckBoxColor={'#e6e7e8'}
                    rightText={'Enable extra time after the service'}
                    rightTextStyle={commonStyle.blackTextR}
                    checkedImage={<CheckedBox />}
                    unCheckedImage={<UncheckedBox />}
                  />
                )}
              />
            </View>
            {extraTimeValue && (
              <View style={commonStyle.mb2}>
                <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                  Extra Time Duration
                </Text>
                <TouchableOpacity
                  style={commonStyle.dropdownselectmodal}
                  onPress={() => {
                    setExtraTimeVisibleModal('extraTimeDurationAddDialog');
                  }}>
                  {!extraTimeDuration ? (
                    <Text style={commonStyle.grayText16}>Add extra time</Text>
                  ) : (
                    <Text style={commonStyle.blackTextR}>
                      {extraTimeDurationText}
                    </Text>
                  )}
                  <DownArrow />
                </TouchableOpacity>
                {/* {isSubmit && !extraTimeDuration ? (
                  <Text style={commonStyle.inputfielderror}>Required</Text>
                ) : null} */}
                {!extraTimeDuration ? (
                  <Text style={commonStyle.inputfielderror}>Required</Text>
                ) : !isValidExtraTime ? (
                  <Text
                    style={{ ...commonStyle.inputfielderror, marginTop: -10 }}>
                    Extra time duration should not be greater than service
                    duration
                  </Text>
                ) : null}
              </View>
            )}
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Description (it’s optional)
              </Text>

              <View
                style={[
                  commonStyle.textInput,
                  commonStyle.textareainput,
                  isServiceDescriptionFocus && commonStyle.focusinput,
                ]}>
                <Controller
                  name="description"
                  control={control}
                  defaultValue={editItems?.description || ''}
                  render={({ onChange, value }) => (
                    <TextInput
                      style={[
                        commonStyle.newtextareaInput,
                        { height: 110, textAlignVertical: 'top' },
                      ]}
                      onFocus={() => setIsServiceDescriptionFocus(true)}
                      returnKeyType="done"
                      autoCapitalize={'none'}
                      multiline={true}
                      numberOfLines={6}
                      maxLength={500}
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        setDescription(text);
                      }}
                      blurOnSubmit={true}
                      onSubmitEditing={(e) => {
                        console.log('On Submit Editing');
                        e.target.blur();
                      }}
                    />
                  )}
                />
                <Text style={commonStyle.textlength}>
                  {(description && description.length) || 0}/500
                </Text>
              </View>
            </View>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Add image
              </Text>

              {filePath ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => setModalVisible(true)}
                // onPress={chooseFile}
                >
                  <Image
                    style={commonStyle.uploadedidprof}
                    source={{ uri: filePath }}
                  />
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                    }}
                    style={{
                      backgroundColor: '#FEF7F5',
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: '#F9B29F',
                      borderStyle: 'dashed',

                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 20,
                    }}>
                    <Text style={commonStyle.textorange14}>Choose file</Text>
                  </TouchableOpacity>
                  {/* {imageRequireText ? (
                    <Text style={commonStyle.inputfielderror}>Required</Text>
                  ) : null} */}
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[commonStyle.categoryselectbtn, commonStyle.plr20]}
      // onPress={() => setIsSubmit(true)}
      >
        <Button
          title="Apply"
          containerStyle={commonStyle.buttoncontainerothersStyle}
          buttonStyle={commonStyle.commonbuttonStyle}
          titleStyle={commonStyle.buttontitleStyle}
          onPress={handleSubmit(serviceHandler)}
        />
      </View>

      {/* Setup Service modal start */}
      <Modal
        isVisible={visibleModal === 'DurationAddDialog'}
        onSwipeComplete={() => setVisibleModal({ visibleModal: null })}
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
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 10 }]}
            onPress={() => setVisibleModal({ visibleModal: null })}>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}>
            <View style={commonStyle.modalContent}>
              <View
                style={[
                  commonStyle.dialogheadingbg,
                  { borderBottomWidth: 0, paddingBottom: 0 },
                ]}>
                <Text style={[commonStyle.modalforgotheading]}>Duration</Text>
              </View>

              <View style={commonStyle.typeofServiceFilterWrap}>
                <View>
                  <RadioGroup
                    style={commonStyle.setupradioGroup}
                    color="#ffffff"
                    activeColor="#ffffff"
                    highlightColor={'#ffffff'}
                    selectedIndex={duration}
                    onSelect={(index, value) => {
                      serviceDurationSelectHelper(index, value);
                    }}>
                    {DurationTimeData.map((item, index) => (
                      <RadioButton
                        key={index}
                        style={commonStyle.setupradioButton}
                        value={item.value}>
                        <View style={commonStyle.radioCustomView}>
                          <Text style={commonStyle.blackTextR}>
                            {item.durationTime}
                          </Text>
                          {duration == item.value ? (
                            <CircleCheckedBoxActive />
                          ) : (
                            <CircleCheckedBoxOutline />
                          )}
                        </View>
                      </RadioButton>
                    ))}
                  </RadioGroup>
                </View>
              </View>
            </View>
          </ScrollView>

          {duration ? (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => {
                  setVisibleModal({ visibleModal: null });
                }}
              />
            </View>
          ) : null}
        </View>
      </Modal>
      {/* Setup Service modal End */}

      <Modal
        isVisible={extraTimeVisibleModal === 'extraTimeDurationAddDialog'}
        onSwipeComplete={() =>
          setExtraTimeVisibleModal({ extraTimeVisibleModal: null })
        }
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
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, { height: 10 }]}
            onPress={() =>
              setExtraTimeVisibleModal({ extraTimeVisibleModal: null })
            }>
            <Text
              style={{
                backgroundColor: '#ECEDEE',
                width: 75,
                height: 4,
                borderRadius: 2,
              }}></Text>
          </TouchableOpacity>
          {/* <ScrollView
            ref={scrollViewRef}
            onScroll={handleOnScroll}
            scrollEventThrottle={10}> */}
          <View style={commonStyle.modalContent}>
            <View
              style={[
                commonStyle.dialogheadingbg,
                { borderBottomWidth: 0, paddingBottom: 0 },
              ]}>
              <Text style={[commonStyle.modalforgotheading]}>Extra Time</Text>
            </View>

            <View style={commonStyle.typeofServiceFilterWrap}>
              <View>
                <RadioGroup
                  style={commonStyle.setupradioGroup}
                  color="#ffffff"
                  activeColor="#ffffff"
                  highlightColor={'#ffffff'}
                  selectedIndex={extraTimeDuration}
                  onSelect={(index, value) => {
                    serviceExtraTimeSelectHelper(index, value);
                  }}>
                  {ExtraTimeData.map((item, index) => (
                    <RadioButton
                      key={index}
                      style={commonStyle.setupradioButton}
                      value={item.value}>
                      <View style={commonStyle.radioCustomView}>
                        <Text style={commonStyle.blackTextR}>
                          {item.displayText}
                        </Text>
                        {extraTimeDuration == item.value ? (
                          <CircleCheckedBoxActive />
                        ) : (
                          <CircleCheckedBoxOutline />
                        )}
                      </View>
                    </RadioButton>
                  ))}
                </RadioGroup>
              </View>
            </View>
          </View>
          {/* </ScrollView> */}

          {extraTimeDuration ? (
            <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
              <Button
                title="Apply"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={() => {
                  setExtraTimeVisibleModal({ extraTimeVisibleModal: null });
                }}
              />
            </View>
          ) : null}
        </View>
      </Modal>

      {/* image modal  */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(false);
        }}
        style={[commonStyle.centeredView, { margin: 0 }]}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              { marginTop: Platform.OS === 'ios' ? 32 : 0 },
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
            <Body style={[commonStyle.headerbacktitle, { marginLeft: -40 }]}>
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
      </Modal>
    </Fragment>
  );
};

export default SetupServiceAddModal;
