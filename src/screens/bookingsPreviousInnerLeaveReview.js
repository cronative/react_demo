import {Container, Left, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal as NativeModal,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import {Button} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import {RadioButton, RadioGroup} from 'react-native-flexi-radio-button';
// import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImageEditor from '@react-native-community/image-editor';
import Stars from 'react-native-stars';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {fileUpload, Post} from '../api/apiAgent';
import {
  VIDEO_POSTER_BASE_PATH,
  IMAGE_MAX_SIZE,
  IMAGE_MAX_SIZE_VALIDATION_MSG,
} from '../api/constant';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {DECIMAL_REGX_AMOUNT} from '../utility/commonRegex';
import {
  CheckedBox,
  UncheckedBox,
  CheckedBoxDisable,
  CloseIcon,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../components/icons';
import {Body} from 'native-base';
import {
  proBookingInnerRequest,
  userBookingDetailsRequest,
} from '../store/actions';
import {userRatingReviewRequestClear} from '../store/actions/profileAction';
import {UploadPhotoVideoModal} from '../components/modal';
import {Buffer} from 'buffer';

const {width, height} = Dimensions.get('window');

const target = (userType) => (userType == 'pro' ? 'customer' : 'pro');
const BookingsPreviousInnerLeaveReview = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  let blankImageData = [];
  const [defaultRating, setDefaultRating] = useState(0);
  const [isLeaveCommentFocus, setIsLeaveCommentFocus] = useState(false);
  const [leaveComment, setLeaveComment] = useState('');
  const [tipAmount, setTip] = useState('0');
  const {userType, bookingData, sessionUserList, businessName} = route.params;
  const [priceRangeFilterSelect, setPriceRangeFilterSelect] = useState(null);
  const [isCustomAmountChecked, setIsCustomAmountChecked] = useState(false);
  const [isamountFocus, setIsamountFocus] = useState(false);
  const [reviewFiles, setReviewFiles] = useState([]);
  const [loderStatus, setLoderStatus] = useState(false);
  const reviewRatingRes = useSelector(
    (state) => state.profileReducer.userRatingReviewData,
  );

  const [modalVisible, setModalVisible] = useState(false);

  // Thias methods is to add the review image (OLD CODE)
  // const chooseFile = () => {
  //   ImagePicker.openPicker({
  //     multiple: true,
  //     waitAnimationEnd: false,
  //     sortOrder: 'desc',
  //     includeExif: true,
  //     mediaType: 'photo',
  //   })
  //     .then((files) => {
  //       if (files?.length > 0) {
  //         let newFiles = reviewFiles;
  //         let imageErrorArray = [];
  //         let totalFile = parseInt(reviewFiles?.length) + files?.length;
  //         if (files?.length > 10) {
  //           global.showToast('Only up to 10 image upload', 'error');
  //           return false;
  //         } else if (newFiles.length > 9) {
  //           global.showToast('Only up to 10 image upload', 'error');
  //           return false;
  //         } else if (totalFile > 10) {
  //           global.showToast('Only up to 10 image upload', 'error');
  //           return false;
  //         } else {
  //           files.map((response) => {
  //             if (response.size > IMAGE_MAX_SIZE) {
  //               imageErrorArray.push({ isValidate: true });
  //             }
  //           });
  //         }
  //         if (imageErrorArray?.length > 0) {
  //           global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
  //           return false;
  //         }
  //         files.map((res) => {
  //           let fileExtension = res.mime.split('/')[1];
  //           let imageType = ['jpg', 'png', 'jpeg'];
  //           if (imageType.includes(fileExtension)) {
  //             let filename = res.path.substring(res.path.lastIndexOf('/') + 1);
  //             let imageFile = {
  //               name: filename,
  //               type: res.mime,
  //               size: res.size,
  //               uri:
  //                 Platform.OS === 'android'
  //                   ? res.path
  //                   : res.path.replace('file://', ''),
  //             };

  //             newFiles = [...newFiles, imageFile];
  //           } else {
  //             global.showToast(
  //               'Only jpg, jpeg or png images are accepted',
  //               'error',
  //             );
  //             setReviewFiles([]);
  //             return;
  //           }
  //         });

  //         setReviewFiles(newFiles);
  //       }
  //     })
  //     .catch((e) => console.log('Error : ', e));
  // };

  //* Custom Gallery File Selection Event
  const fileSelectedEvent = (items) => {
    if (items?.length > 0) {
      let totalFileNumber = parseInt(reviewFiles?.length) + items?.length;

      if (totalFileNumber > 10) {
        Alert.alert('Only up to 10 image can be uploaded.');
        // global.showToast('Only up to 10 image can be uploaded.', 'error');
        return false;
      } else {
        let sizeValidationPass = validateFileSizes(items);
        if (!sizeValidationPass) {
          Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
          // global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
          return false;
        }
      }
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
        setModalVisible(false);
        let imageFiles = typeCheckedItems.map((item) => {
          return {
            name: item.node.image.filename,
            type: item.node.type,
            uri: item.node.image.uri,
            size: item.node.image.fileSize,
            width: item.node.image.width,
            height: item.node.image.height,
          };
        });
        setReviewFiles([...reviewFiles, ...imageFiles]);
      } else {
        Alert.alert('Only jpg, jpeg or png images are accepted');
        // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
      }
    }
  };

  const cameraSubmitEvent = (response) => {
    console.log(response);

    let totalFileNumber = parseInt(reviewFiles?.length) + 1;

    if (totalFileNumber > 10) {
      Alert.alert('Only up to 10 image can be uploaded.');
      // global.showToast('Only up to 10 image can be uploaded.', 'error');
      return false;
    } else {
      let sizeValidationPass = validateFileSizes(response);
      if (!sizeValidationPass) {
        Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
        // global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
        return false;
      }
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
      size: response.fileSize,
    };
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png'
    ) {
      setReviewFiles([...reviewFiles, imageFile]);
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

  // This method will call on Price Range Select
  const priceRangeFilterSelectHelper = (index, value) => {
    setTip(value);
    setIsamountFocus(false);
    setPriceRangeFilterSelect(index);
    setTimeout(() => {
      setIsCustomAmountChecked(false);
    }, 100);
  };

  // This method will call on Current Location Select
  const customAmountSelectHelper = () => {
    setPriceRangeFilterSelect(null);
    setTip('0');
    setTimeout(() => {
      setIsCustomAmountChecked(!isCustomAmountChecked);
    }, 100);
  };

  const leaveReview = () => {
    if (defaultRating < 1) {
      global.showToast('Rating is required', 'error');
      return false;
    }

    if (userType === 'pro') {
      if (isCustomAmountChecked === true && tipAmount == 0) {
        global.showToast(
          'Amount is required and must be greater than 0',
          'error',
        );
        return false;
      }

      if (tipAmount.trim().length > 0) {
        let tip = tipAmount.replace(/[^0-9.]/g, '-');
        if (tip.includes('-')) {
          global.showToast('Invalid amount', 'error');
          return false;
        }
      }

      if (tipAmount.trim().length > 7) {
        global.showToast('Invalid amount', 'error');
        return false;
      } else {
        if (DECIMAL_REGX_AMOUNT.test(tipAmount) === false) {
          global.showToast('Invalid amount', 'error');
          return false;
        }
      }

      if (parseInt(tipAmount) > parseFloat(bookingData?.amount)) {
        global.showToast(
          'Tip cannot be greater than the service charge',
          'error',
        );
        return false;
      }
    }

    let reviewId = null;
    setLoderStatus(true);
    if (bookingData?.Service?.type == 2) {
      Post(`pro/group-reviews/`, {
        groupSessionId: bookingData?.groupSessionId,
        content: leaveComment || '',
        reviewType: 2,
      })
        .then((response) => {
          setLoderStatus(false);
          if (response.status == 200) {
            Post(`pro/group-rating/`, {
              groupSessionId: bookingData?.groupSessionId,
              rating: defaultRating,
            })
              .then((rateResponse) => {
                if (rateResponse.status == 200) {
                  global.showToast('Review submitted successfully', 'success');
                  dispatch(
                    proBookingInnerRequest({
                      pageId: bookingData?.reservationDisplayId,
                    }),
                  );
                  navigation.goBack();
                } else {
                  global.showToast(
                    'Rating cannot be submitted successfully',
                    'error',
                  );
                  dispatch(
                    proBookingInnerRequest({
                      pageId: bookingData?.reservationDisplayId,
                    }),
                  );
                  navigation.goBack();
                }
              })
              .catch((rateError) => {
                console.error(rateError);
                global.showToast(
                  'Rating cannot be submitted successfully',
                  'error',
                );
                dispatch(
                  proBookingInnerRequest({
                    pageId: bookingData?.reservationDisplayId,
                  }),
                );
                navigation.goBack();
              });
          } else {
            global.showToast(
              'Review cannot be submitted successfully',
              'error',
            );
            dispatch(
              proBookingInnerRequest({
                pageId: bookingData?.reservationDisplayId,
              }),
            );
            navigation.goBack();
          }
        })
        .catch((error) => {
          console.error(error);
          setLoderStatus(false);
          global.showToast('Review cannot be submitted successfully', 'error');
          dispatch(
            proBookingInnerRequest({
              pageId: bookingData?.reservationDisplayId,
            }),
          );
          navigation.goBack();
        });
    } else {
      Post(`${userType === 'pro' ? 'pro' : 'user'}/reviews`, {
        reservationId: bookingData?.id,
        content: leaveComment || '',
        reviewType: userType == 'pro' ? 2 : 1,
        [userType == 'pro' ? 'customerId' : 'proId']:
          bookingData?.[target(userType)]?.id,
      })
        .then((result) => {
          if (result.status == 200) {
            reviewId = result?.data?.id;
            return Post(`${userType === 'pro' ? 'pro' : 'user'}/rating`, {
              reservationId: bookingData?.id,
              rating: defaultRating,
              [userType == 'pro' ? 'customerId' : 'proId']:
                bookingData?.[target(userType)]?.id,
            });
          }
        })
        .then(async (reviewRes) => {
          if (
            userType == 'customer' &&
            reviewRes.status == 200 &&
            reviewFiles.length > 0
          ) {
            const req = [];
            req.push({name: 'reviewId', data: reviewId.toString()});
            req.push({
              name: 'resourceType',
              data: 'image',
            });

            if (Platform.OS === 'android') {
              reviewFiles.forEach((file, index) => {
                const fileObj = {
                  name: `reviewFile`,
                  filename: file.name,
                  type: file.type === 'image' ? 'image/jpg' : file.type,
                  data: RNFetchBlob.wrap(file.uri),
                };
                req.push(fileObj);
              });
              console.log('to be submitted:', req);
              return fileUpload(
                `/${userType === 'pro' ? 'pro' : 'user'}/reviewResource`,
                req,
                'POST',
              );
            } else {
              await Promise.all(
                reviewFiles.map(async (file, index) => {
                  if (file.type === 'image') {
                    let imgUri = await ImageEditor.cropImage(file.uri, {
                      size: {
                        width: !!file.width ? file.width : 100,
                        height: !!file.height ? file.height : 100,
                      },
                      offset: {
                        x: 0,
                        y: 0,
                      },
                    });
                    //let imageData = await RNFetchBlob.fs.readFile(imgUri.replace("file://", ""), 'base64')
                    const fileObj = {
                      name: `reviewFile`,
                      filename: file.name,
                      type: file.type === 'image' ? 'image/jpg' : file.type,
                      data: RNFetchBlob.wrap(imgUri.replace('file://', '')),
                    };
                    req.push(fileObj);
                  } else {
                    const fileObj = {
                      name: `reviewFile`,
                      filename: file.name,
                      type: file.type === 'image' ? 'image/jpg' : file.type,
                      data: RNFetchBlob.wrap(file.uri.replace('file://', '')),
                    };
                    req.push(fileObj);
                  }
                }),
              );
              console.log('to be submitted:', req);
              return fileUpload(
                `/${userType === 'pro' ? 'pro' : 'user'}/reviewResource`,
                req,
                'POST',
              );
            }
          } else {
            return reviewRes;
          }
        })
        .then((res) => {
          if (
            userType === 'customer' &&
            tipAmount &&
            parseInt(tipAmount) > 0 &&
            res.status == 200
          ) {
            return Post('/user/booking-pay-tip', {
              reservationId: bookingData?.id,
              amount: parseInt(tipAmount),
            });
          }

          return res;
        })
        .then((res) => {
          if (res?.status == 200) {
            global.showToast('Review submitted successfully', 'success');

            if (userType === 'pro') {
              dispatch(
                proBookingInnerRequest({
                  pageId: bookingData?.reservationDisplayId,
                }),
              );
            } else {
              dispatch(userBookingDetailsRequest({id: bookingData?.id}));
            }

            navigation.goBack();
          } else {
            console.log('Response: ', res);
            global.showToast(
              'Review cannot be subbmitted successfully',
              'error',
            );
          }
        })
        .catch((error) => {
          // const msg = error.response?.data?.message
          //   ? error.response?.data?.message
          //   : 'Something went wrong, please try after some times';
          console.log('error: ', error);
          if (userType === 'pro') {
            global.showToast('Review subbmitted successfully', 'success');
          } else {
            global.showToast(
              'Review subbmitted successfully, but your payment transaction failed for the tip amount',
              'success',
            );
          }

          if (userType === 'pro') {
            dispatch(
              proBookingInnerRequest({
                pageId: bookingData?.reservationDisplayId,
              }),
            );
          } else {
            dispatch(userBookingDetailsRequest({id: bookingData?.id}));
          }
          navigation.goBack();
        })
        .finally(() => {
          setLoderStatus(false);
        });
    }
  };

  // This is the response of review and rating response
  useEffect(() => {
    if (reviewRatingRes && reviewRatingRes.status == 200) {
      setLoderStatus(false);
      dispatch(userRatingReviewRequestClear());
      global.showToast('Review added successfully', 'success');
      setTimeout(() => {
        navigation.navigate('BookingsPreviousInner', {
          bookingId: route?.params?.bookingId,
          fromNotificationList: false,
        });
      }, 1000);
      setTimeout(() => {
        EventEmitter.emit('refreshPage');
      }, 1200);
    } else if (reviewRatingRes && reviewRatingRes.status != 200) {
      if (
        reviewRatingRes.response.data.message !== null &&
        reviewRatingRes.response.data.message !== ''
      ) {
        global.showToast(reviewRatingRes.response.data.message, 'error');
        setLoderStatus(false);
        dispatch(userRatingReviewRequestClear());
      } else {
        setLoderStatus(false);
        dispatch(userRatingReviewRequestClear());
      }
    }
  }, [reviewRatingRes]);

  const removeReviewFile = (fileIndex) => {
    console.log('removeReviewFile', fileIndex);
    let tempFiles = reviewFiles.filter((file, index) => {
      if (index != fileIndex) {
        return file;
      }
    });

    if (tempFiles.length > 0) {
      setReviewFiles([...tempFiles]);
    } else {
      setReviewFiles([]);
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          extraScrollHeight={100}>
          <View style={commonStyle.leaveReviewwrap}>
            <View>
              {bookingData?.Service?.type == 2 ? (
                <List>
                  <ListItem
                    thumbnail
                    style={{
                      ...commonStyle.switchAccountView,
                      justifyContent: 'flex-start',
                    }}>
                    {sessionUserList.map((user, index) => (
                      <Left
                        key={index}
                        style={{
                          ...commonStyle.favoritesUserAvaterwrap,
                          marginLeft: index * -8,
                          zIndex: index,
                        }}>
                        <Image
                          style={commonStyle.favoritesUserAvaterImg}
                          //Start Change: Snehasish Das, Issue #1734
                          defaultSource={require('../assets/images/default-user.png')}
                          source={
                            // user?.profileImage
                            !!user?.profileImage
                              ? {
                                  uri: user?.profileImage,
                                }
                              : require('../assets/images/default-user.png')
                            // : defaultImage
                          }
                          //End Change: Snehasish Das, Issue #1734
                        />
                      </Left>
                    ))}
                  </ListItem>
                </List>
              ) : (
                <View style={commonStyle.clientProfilebox}>
                  <Image
                    style={commonStyle.clientProfileimg}
                    source={
                      bookingData?.[target(userType)]?.profileImage
                        ? {
                            uri: bookingData?.[target(userType)]?.profileImage,
                          }
                        : require('../assets/images/default.png')
                    }
                  />
                </View>
              )}
            </View>
            <View style={[commonStyle.mt2, commonStyle.mb3]}>
              {bookingData?.Service?.type != 2 && (
                <>
                  <Text
                    style={[
                      commonStyle.modalforgotheading,
                      commonStyle.textCenter,
                      commonStyle.mb1,
                    ]}>
                    {businessName}
                  </Text>
                  <Text
                    style={[
                      commonStyle.grayText14,
                      commonStyle.textCenter,
                      commonStyle.mb15,
                    ]}>
                    {bookingData?.ProMeta?.address}
                  </Text>
                </>
              )}
              <TouchableHighlight
                style={[commonStyle.outlintextbtn, {alignSelf: 'center'}]}>
                <Text style={commonStyle.categorytagsText}>
                  {userType === 'pro'
                    ? bookingData?.Service?.name
                    : bookingData?.ReservedServiceMeta?.name}
                </Text>
              </TouchableHighlight>
              <View style={commonStyle.mt3}>
                <Stars
                  half={false}
                  default={defaultRating}
                  update={(val) => {
                    setDefaultRating(val);
                  }}
                  spacing={10}
                  starSize={32}
                  count={5}
                  fullStar={require('../assets/images/starFilled.png')}
                  emptyStar={require('../assets/images/starEmpty.png')}
                />
              </View>
            </View>
            <View style={commonStyle.dividerlinefull} />
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={commonStyle.horizontalPadd}>
              {userType !== 'pro' && (
                <View style={commonStyle.mb03}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                    Add a tip for {bookingData?.ProMeta?.businessName}
                  </Text>
                  <RadioGroup
                    style={commonStyle.filtergroup}
                    color="#ffffff"
                    activeColor="#110F17"
                    highlightColor={'#110F17'}
                    selectedIndex={priceRangeFilterSelect}
                    onSelect={(index, value) => {
                      priceRangeFilterSelectHelper(index, value);
                    }}>
                    {[10, 20, 30, 40, 50]
                      .filter((tip) => parseFloat(bookingData?.amount) >= tip)
                      .map((tip, index) => (
                        <RadioButton
                          style={commonStyle.priceRangeradiofiltercol}
                          value={tip.toString()}>
                          <Text
                            style={
                              priceRangeFilterSelect == index
                                ? commonStyle.priceRangeradiofiltertextactive
                                : commonStyle.priceRangeradiofiltertext
                            }>
                            ${tip}
                          </Text>
                        </RadioButton>
                      ))}
                  </RadioGroup>
                </View>
              )}
              {userType !== 'pro' && (
                <>
                  <View style={commonStyle.mb15}>
                    <CheckBox
                      style={{paddingVertical: 10}}
                      onClick={() => {
                        customAmountSelectHelper();
                      }}
                      isChecked={isCustomAmountChecked}
                      rightText={'Enter custom amount'}
                      rightTextStyle={commonStyle.blackTextR}
                      checkedImage={<CheckedBox />}
                      unCheckedImage={<UncheckedBox />}
                    />
                    {isCustomAmountChecked == true && (
                      <View style={[commonStyle.mb1, commonStyle.mt1]}>
                        <View>
                          <TextInput
                            style={[
                              commonStyle.textInput,
                              commonStyle.prefixInput,
                              isamountFocus && commonStyle.focusinput,
                            ]}
                            onFocus={() => setIsamountFocus(true)}
                            onBlur={() => setIsamountFocus(false)}
                            onChangeText={(text) => setTip(text)}
                            value={tipAmount != 0 ? tipAmount : null}
                            keyboardType="number-pad"
                            autoCapitalize={'none'}
                            returnKeyType="done"
                            placeholder="Enter amount"
                            maxLength={7}
                            placeholderTextColor={'#939DAA'}
                          />
                          <Text style={commonStyle.prefixText}>$</Text>
                        </View>
                      </View>
                    )}
                  </View>
                  <View style={commonStyle.dividerlinefull} />
                </>
              )}
              <View style={[commonStyle.mb2, commonStyle.mt2]}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Leave a comment
                </Text>
                <View
                  style={[
                    commonStyle.textInput,
                    commonStyle.textareainput,
                    isLeaveCommentFocus && commonStyle.focusinput,
                  ]}>
                  <TextInput
                    style={[
                      commonStyle.newtextareaInput,
                      {height: 110, textAlignVertical: 'top'},
                    ]}
                    onFocus={() => setIsLeaveCommentFocus(true)}
                    onBlur={() => setIsLeaveCommentFocus(false)}
                    onChangeText={(text) => setLeaveComment(text)}
                    value={leaveComment}
                    returnKeyType="done"
                    autoCapitalize={'none'}
                    keyboardType="default"
                    multiline={true}
                    numberOfLines={6}
                    maxLength={500}
                    blurOnSubmit={true}
                    onSubmitEditing={(e) => {
                      console.log('On Submit Editing');
                      e.target.blur();
                    }}
                  />
                  <Text style={commonStyle.textlength}>
                    {(leaveComment && leaveComment.length) || 0}/500
                  </Text>
                </View>
              </View>
            </View>

            {userType != 'pro' ? (
              <View style={[commonStyle.horizontalPadd, commonStyle.mb15]}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                  Upload Photos
                </Text>
                <View style={commonStyle.portfolioPhotosWrap}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      style={commonStyle.addPortfolioPhoto}
                      // onPress={chooseFile}>
                      onPress={() => setModalVisible(true)}>
                      <Text style={[commonStyle.plusText, {opacity: 0.4}]}>
                        +
                      </Text>
                    </TouchableOpacity>
                    {reviewFiles &&
                      reviewFiles.map((items, index) => (
                        <View
                          key={index}
                          style={[
                            commonStyle.scrollPortfolioPhotos,
                            {marginStart: 0},
                          ]}>
                          <Image
                            source={{uri: items.uri}}
                            style={commonStyle.scrollPortfolioPhotosImg}
                          />
                          <TouchableOpacity
                            style={{
                              position: 'absolute',
                              top: 6,
                              right: 3,
                              backgroundColor: '#fff',
                              width: 24,
                              height: 24,
                              borderRadius: 6,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() => {
                              removeReviewFile(index);
                            }}>
                            <CloseIcon />
                          </TouchableOpacity>
                        </View>
                      ))}
                  </ScrollView>
                </View>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        <View style={commonStyle.footerwrap}>
          <View style={[commonStyle.footerbtn]}>
            <Button
              title="Leave a review"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={leaveReview}
            />
          </View>
        </View>
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
            multiSelect={true}
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

export default BookingsPreviousInnerLeaveReview;
