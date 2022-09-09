import { useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useRef, useState, useCallback } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
  Alert,
  FlatList,
  Keyboard,
} from 'react-native';
import { Button } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { Body } from 'native-base';
//import ImagePicker from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import InstagramLogin from 'react-native-instagram-login';
import GoogleCalendarConnect from '../../components/socialLogin/GoogleCalendarConnect';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import { Delete, fileUpload, Get, Post, Put } from '../../api/apiAgent';
import commonStyle from '../../assets/css/mainStyle';
// import ActivityLoader from '../../components/ActivityLoader';
import global from '../../components/commonservices/toast';
import {
  CloseIcon,
  LeftArrowAndroid,
  LeftArrowIos,
} from '../../components/icons';
const { width, height } = Dimensions.get('window');
import { UploadPhotoVideoModal } from '../../components/modal';
import { setupProgressionUpdate } from '../../store/actions';
import ImageEditor from '@react-native-community/image-editor';
import { FRONTEND_BASE_PATH } from '../../api/constant';

const AdditionalInfo = ({
  isUpdate,
  setLoader,
  redirectUrlHandler,
  progressionData,
  setKeyboardStatus,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const aditionalInfoDetails = useSelector(
    (state) => state.professionalProfileSetupReducer.aditionalInfoDetails,
  );
  const [isServiceDescriptionFocus, setIsServiceDescriptionFocus] =
    useState(false);
  const [serviceDescription, setServiceDescription] = useState('');
  const [isAdditionalLinkFocus, setIsAdditionalLinkFocus] = useState(false);
  const [additionalLink, setAdditionalLink] = useState('');
  const [filePath, setFilePath] = useState({});
  const [images, setImages] = useState([]);
  const [isError, setIsError] = useState(false);
  const [instaToken, setInstaToken] = useState(false);
  //  const [loader, setLoader] = useState(false);
  const instagramLogin = useRef(null);
  //    set field dynamic
  const [additionalInfoData, setAdditionalInfoData] = useState('');
  const [fields, setFields] = useState([{ value: null }]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [bioData, setbioData] = useState('');
  const [additionalInfoUrl, setAdditionalInfoUrl] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);

  const [isInstaConnected, setIsInstaConnected] = useState(false);
  const [isGCalendarConnected, setIsGCalendarConnected] = useState(false);
  const [userId, setUserId] = useState(null);
  const [instagramPictures, setInstagramPictures] = useState([]);
  const [imageIndex, setImageIndex] = useState('');
  // const [instaToken, setInstaToken] = useState(null);

  // GET /business-details , GET /services, GET /contact-pref, GET /payment-info, GET /additional-info @Sourav.
  //handle change for dynamic field
  function handleChange(i, event) {
    const values = [...fields];
    console.log(event);
    values[i].value = event;
    setFields(values);
    console.log(values);
  }

  // useFocusEffect(
  //   useCallback(() => {
  //     const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
  //       console.log('Keyboard is being visible');
  //       setKeyboardStatus(e.endCoordinates.height);
  //       if (!!scrollViewRef && Platform.OS === 'ios') {
  //         scrollViewRef.current.scrollToPosition(0, 0);
  //       }
  //     });
  //     const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
  //       console.log('Keyboard is being hidden');
  //       setKeyboardStatus(0);
  //     });

  //     return () => {
  //       setKeyboardStatus(0);
  //       showSubscription.remove();
  //       hideSubscription.remove();
  //     };
  //   }, []),
  // );
  //fetch Data
  const fetchData = () => {
    setLoader(true);
    Get('/pro/additional-info', '')
      .then((result) => {
        console.log('additional: ', result);
        setLoader(false);
        if (result.status === 200) {
          console.log('instal token:', result.data.insta);
          if (result.data && result.data.additionalLinks) {
            setIsUpdated(true);
            setAdditionalInfoData(result.data);
            setServiceDescription(result.data.bioData);
            setAdditionalInfoUrl(result.data.additionalLinks);
            console.log('portFolio Image : ', result.data.portfolioImages);
            setImages(result.data.portfolioImages);
            setUserId(result.data.userId);
            setInstaToken(result.data.insta);
            setIsGCalendarConnected(result.data.googleCalenderAccessToken);
          } else {
            setIsUpdated(false);
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log('error', JSON.stringify(error, null, 2));
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  const fetchDataRetainUnsaved = () => {
    setLoader(true);
    Get('/pro/additional-info', '')
      .then((result) => {
        console.log('retain data fetched: ', result);
        setLoader(false);
        if (result.status === 200) {
          console.log('instal token:', result.data.insta);
          if (result.data && result.data.additionalLinks) {
            setIsUpdated(true);
            setAdditionalInfoData(result.data);
            // setServiceDescription(result.data.bioData);
            // setAdditionalInfoUrl(result.data.additionalLinks);
            console.log('portFolio Image : ', result.data.portfolioImages);
            // setImages(result.data.portfolioImages);
            setUserId(result.data.userId);
            setInstaToken(result.data.insta);
            setIsGCalendarConnected(result.data.googleCalenderAccessToken);
          } else {
            setIsUpdated(false);
          }
        } else {
          global.showToast('Something went wrong', 'error');
        }
      })
      .catch((error) => {
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };

  const fetchInstagramPictures = () => {
    // console.log('FETCHING INSTA PICS WITH ID: ', userId)
    Get(`/pro/user-ig-posts/${userId}`)
      .then((response) => {
        let image_urls = response.data.map((item) => item.media_url);
        setInstagramPictures(image_urls);
        console.log('INSTAGRAM PICTURES: ', image_urls);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // handle add for dynamic field
  function handleAdd() {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
  }
  // handle remove dynamic field
  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
    console.log(values);
  }
  function handleRemoveLink(i) {
    if (additionalInfoUrl[i]?.id) {
      Delete(`pro/additional-info/links/${additionalInfoUrl[i]?.id}`)
        .then(() => {
          const newAdditionalInfoUrl = [...additionalInfoUrl];
          newAdditionalInfoUrl.splice(i, 1);
          setAdditionalInfoUrl(newAdditionalInfoUrl);
        })
        .catch((error) => {
          const msg = error.response?.data?.message;
          console.log('error', error.response.data.message);
          global.showToast(msg, 'error');
        });
    } else {
      const newAdditionalInfoUrl = [...additionalInfoUrl];
      newAdditionalInfoUrl.splice(i, 1);
      setAdditionalInfoUrl(newAdditionalInfoUrl);
    }

    console.log(additionalInfoUrl);
  }

  // render image function
  const renderImage = (image) => {
    return (
      <Image
        style={commonStyle.scrollPortfolioPhotosImg}
        source={!image.id ? image : { uri: `${image.url}` }}
      />
    );
  };

  const renderAsset = (image) => {
    return image ? (
      <Image
        style={commonStyle.scrollPortfolioPhotosImg}
        source={!image.id ? image : { uri: `${image.url}` }}
      />
    ) : null;
  };
  // const pickMultiple = () => {
  //   ImagePicker.openPicker({
  //     multiple: true,
  //     waitAnimationEnd: false,
  //     sortOrder: 'desc',
  //     includeExif: true,
  //     mediaType: 'photo',
  //     maxFiles: Platform.OS === 'ios' ? 10 : 0
  //   })
  //     .then((pickedImages) => {
  //       console.log(pickedImages.length);
  //       if (pickedImages.length > 10) {
  //         global.showToast('Only up to 10 image upload', 'error');
  //         return false;
  //       }

  //       let imgs = pickedImages.map((i) => {
  //         let name = i.path.split("/").pop();
  //         return {
  //           name: i.path.split("/").pop(),
  //           uri: i.path,
  //           width: i.width,
  //           height: i.height,
  //           mime: i.mime,
  //           size: i.size,
  //         };
  //       });
  //       setImages([...images, ...imgs]);
  //       console.log('Selected Images : ', images)
  //     })
  //     .catch((e) => alert(e));
  // };

  const fileSelectedEvent = (items) => {
    if (items?.length > 0) {
      let totalFileNumber = parseInt(images?.length) + items?.length;

      if (totalFileNumber > 5) {
        Alert.alert('Only up to 5 image can be uploaded.');
        // global.showToast('Only up to 10 image can be uploaded.', 'error');
        return false;
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
            mime: item.node.type,
            uri: item.node.image.uri,
            size: item.node.image.fileSize,
            height: item.node.image.height,
            width: item.node.image.width,
          };
        });
        setImages([...images, ...imageFiles]);
      } else {
        Alert.alert('Only jpg, jpeg or png images are accepted');
        // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
      }
    }
  };

  const cameraSubmitEvent = (response) => {
    console.log(response);

    let totalFileNumber = parseInt(images?.length) + 1;

    if (totalFileNumber > 5) {
      Alert.alert('Only up to 5 image can be uploaded.');
      // global.showToast('Only up to 10 image can be uploaded.', 'error');
      return false;
    }

    if (Platform.OS === 'ios') {
      let path = response.uri;
      path = '~' + path.substring(path.indexOf('/Documents'));
      response.fileName = path.split('/').pop();
    }
    let imageFile = {
      name: response.fileName,
      mime: response.type,
      uri: response.uri,
      size: response.fileSize,
      // height:,
      // width:,
    };
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png'
    ) {
      setModalVisible(false);
      setImages([...images, imageFile]);
    } else {
      Alert.alert('Only jpg, jpeg or png images are accepted');
      // global.showToast('Only jpg, jpeg or png images are accepted', 'error');
    }
  };

  const deleteImage = (image) => {
    setModalVisible(false);
    setImageIndex('');
    console.log('Deleting', image);
    setImages((images) =>
      images.filter((m) =>
        !!image.id ? m.id != image.id : m.uri != image.uri,
      ),
    );

    if (!!image.id) {
      Delete(`/pro/additional-info/portfolio-image/${image.id}`)
        .then(() => {
          setImageIndex('');
          global.showToast('Image deleted successfully.', 'success');
        })
        .catch((error) => {
          global.showToast('Something went wrong.', 'error');
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (instaToken && userId) {
      setIsInstaConnected(true);
      fetchInstagramPictures();
    } else {
      setInstagramPictures([]);
    }
  }, [instaToken, userId]);
  /*  useEffect(() => {
    console.log('aditionalInfoDetails', aditionalInfoDetails);
    if (aditionalInfoDetails) {
      if (aditionalInfoDetails.status === 201) {
        navigation.navigate('SetupFaq', {
          someParam: '',
        });
      } else if (
        aditionalInfoDetails.message &&
        aditionalInfoDetails.status !== 201
      ) {
        // console.log(termOfPayment.message)
         global.showToast(aditionalInfoDetails.message, 'error');
       }
     }
  }, [aditionalInfoDetails]); */
  // url validation code
  const isUrlValid = (userInput) => {
    var pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
      'i',
    ); // fragment locator
    return !!pattern.test(userInput);
  };
  const setIgToken = (data) => {
    //this.setState({ token: data.access_token })
    setInstaToken(data);
    console.log('insta token:', { data });
    Get(`pro/handleauth?code=${data}`)
      .then((response) => {
        console.log('Insta response: ', response);
        global.showToast('Instagram Connected successfully', 'success');
        // fetchData();
        fetchDataRetainUnsaved();
      })
      .catch((error) => {
        console.log('Instagram error: ', error);
        global.showToast('Something went wrong', 'error');
      });
  };

  // additional info  api  callinh
  const AdditionalInfo = (url, data) => {
    console.log('Total Data : ***', data);
    setLoader(true);

    fileUpload(url, data, 'POST')
      .then((result) => {
        setLoader(false);
        console.log('result ****', result);
        if (result.status === 201) {
          //   navigation.navigate('SetupFaq');
          if (!isUpdate) {
            const updatedProgression = progressionData.map((step) => {
              if (step.stepNo === 9) {
                return { ...step, isCompleted: 1 };
              }
              return step;
            });
            dispatch(setupProgressionUpdate(updatedProgression));
          }
          global.showToast('Additional Info updated successfully.', 'success');
          redirectUrlHandler();
        } else {
          global.showToast(result.message, 'error');
        }
      })
      .catch((error) => {
        console.log('error additonalInfo', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  const handleAdditionalInfo = () => {
    let flag = true;
    let req = [];

    if (serviceDescription == null || serviceDescription == '') {
      setIsError(true);
      flag = false;
      global.showToast('Bio is required', 'error');
      return false;
    } else {
      flag = true;
    }

    fields?.forEach((link, index) => {
      if (link.value) {
        const isValidLink = isUrlValid(link.value);

        if (isValidLink) {
          flag = true;
          req.push({ name: `links[${index}]`, data: link.value });
        } else {
          global.showToast('Invalid url', 'error');

          flag = false;
          return false;
        }
      }
    });

    if (instaToken) {
      req.push({ name: 'instaToken', data: instaToken });
    }

    if (flag) {
      req.push({ name: 'bioData', data: serviceDescription });
      Promise.all(
        images?.map(async (element) => {
          if (!element.id) {
            if (element.mime == 'image') {
              let responseUri = await ImageEditor.cropImage(element.uri, {
                size: {
                  width: element.width,
                  height: element.height,
                },
                offset: {
                  x: 0,
                  y: 0,
                },
              });
              let newFileObj = {
                name: 'portFolioImages',
                filename: element.name,
                type: element.mime == 'image' ? 'image/jpg' : element.mime,
                data: RNFetchBlob.wrap(responseUri.replace('file://', '')),
              };
              req.push(newFileObj);
            } else {
              let newFileObj = {
                name: 'portFolioImages',
                filename: element.name,
                type: element.mime == 'image' ? 'image/jpg' : element.mime,
                data: RNFetchBlob.wrap(
                  Platform.OS === 'android'
                    ? element.uri
                    : element.uri.replace('file://', ''),
                ),
              };
              req.push(newFileObj);
            }
          }
        }),
      )
        .then((res) => {
          AdditionalInfo('/pro/additional-info', req);
        })
        .catch((error) => {
          console.log(
            'upday=te addiional info err',
            JSON.stringify(error, null, 2),
          );
        });
    }

    skipBtnHanler();
  };

  const skipBtnHanler = () => {
    console.log('***');
    setLoader(true);
    Put('pro/skip-step', { additionalInfo: '1' })
      .then((result) => {
        setLoader(false);
        console.log('result is **', result);
        // navigation.navigate(nextStep ? nextStep : 'SetupFaq');
      })
      .catch((error) => {
        console.log('error', error);
        setLoader(false);
        global.showToast(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          'Something went wrong',
          'error',
        );
      });
  };
  const googleLoginSuccessHandler = () => {
    // fetchData();
    fetchDataRetainUnsaved();
  };

  const instagramDisconnectHandler = () => {
    console.log('Disconnecting from instagram');
    Delete(`pro/remove-insta-token`)
      .then((response) => {
        console.log('Insta response: ', response);
        setIsInstaConnected(false);
        global.showToast('Instagram Disconnected successfully', 'success');
        // fetchData();
        fetchDataRetainUnsaved();
      })
      .catch((error) => {
        console.log('Instagram error: ', error);
        global.showToast('Something went wrong', 'error');
      });
  };
  const googleCalendarDisconnectHandler = () => {
    console.log('Disconnecting from Google Calendar');
    Delete(`pro/remove-gc-token`)
      .then((response) => {
        console.log('Google calendar disconnect response: ', response);
        setIsGCalendarConnected(false);
        global.showToast(
          'Google Calendar Disconnected successfully',
          'success',
        );
        // fetchData();
        fetchDataRetainUnsaved();
      })
      .catch((error) => {
        console.log('Instagram error: ', error);
        global.showToast('Something went wrong', 'error');
      });
  };
  const scrollViewRef = useRef(0);

  return (
    <Fragment>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={[commonStyle.fromwrap, commonStyle.mt1]}>
          <Text style={[commonStyle.subheading, commonStyle.mb1]}>
            Additional info
          </Text>
        </View>
        <View style={commonStyle.categoriseListWrap}>
          <View style={commonStyle.horizontalPadd}>
            <View style={commonStyle.mb2}>
              <Text style={[commonStyle.texttimeblack, commonStyle.mb15]}>
                Bio (highly recommended)
              </Text>
              <View
                style={[
                  commonStyle.textInput,
                  commonStyle.textareainput,
                  isServiceDescriptionFocus && commonStyle.focusinput,
                ]}>
                <TextInput
                  style={[
                    commonStyle.newtextareaInput,
                    { height: 110, textAlignVertical: 'top' },
                  ]}
                  onFocus={() => setIsServiceDescriptionFocus(true)}
                  value={serviceDescription}
                  onChangeText={(text) => setServiceDescription(text)}
                  returnKeyType="done"
                  keyboardType="default"
                  autoCapitalize={'none'}
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
                  {(serviceDescription && serviceDescription.length) || 0}
                  /500
                </Text>
              </View>
            </View>
          </View>

          <View style={[commonStyle.horizontalPadd, commonStyle.mb15]}>
            <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
              Upload portfolio photos (up to 5)
            </Text>
            <View style={commonStyle.portfolioPhotosWrap}>
              <TouchableOpacity
                style={commonStyle.addPortfolioPhoto}
                //onPress={chooseFile}>
                onPress={() => setModalVisible(true)}>
                {/* onPress={pickMultiple}> */}
                <Text style={[commonStyle.plusText, { opacity: 0.4 }]}>+</Text>
              </TouchableOpacity>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {/* <View style={commonStyle.scrollPortfolioPhotos}>
                    <Image
                      source={{uri: filePath.uri}}
                      style={commonStyle.scrollPortfolioPhotosImg}
                    />
                  </View> */}
                {images
                  ? images.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        setImageIndex(item),
                          console.log(
                            'key is',
                            index,
                            'item is',
                            item,
                            item.url,
                          );
                      }}
                      style={commonStyle.scrollPortfolioPhotos}
                      key={item.uri || item.id}>
                      {renderAsset(item)}
                      <TouchableOpacity
                        style={commonStyle.portfolioCloseButton}
                        onPress={() => deleteImage(item)}>
                        <CloseIcon />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                  : null}
              </ScrollView>
            </View>
          </View>

          <View style={[commonStyle.exploreCommListWrap, commonStyle.mb2]}>
            <View style={commonStyle.horizontalPadd}>
              <Text style={[commonStyle.blackTextR, commonStyle.mb15]}>
                Instagram feed
              </Text>
            </View>
            <View style={commonStyle.mb15}>
              {!isInstaConnected ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={commonStyle.btnsocial}
                  onPress={() => instagramLogin.current.show()}>
                  {/*  onPress={()=> this.refs.instagramLogin.show()} */}
                  <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/instagramm.png')}
                  />
                  <Text
                    style={[commonStyle.blackText16, commonStyle.socialtext]}>
                    Connect to Instagram
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  {instagramPictures?.length > 0 ? (
                    <FlatList
                      horizontal
                      style={commonStyle.mb05}
                      ItemSeparatorComponent={() => (
                        <View style={{ marginRight: -26 }} />
                      )}
                      showsHorizontalScrollIndicator={false}
                      data={instagramPictures}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => {
                        // console.log('Images: ', imageItem, instagramPictures)
                        return (
                          <TouchableOpacity key={index} activeOpacity={0.8}>
                            <View style={commonStyle.instrafeedImgwrap}>
                              <Image
                                defaultSource={require('../../assets/images/default.png')}
                                source={{ uri: item }}
                                style={commonStyle.instrafeedImg}
                              />
                            </View>
                          </TouchableOpacity>
                        );
                      }}
                    />
                  ) : (
                    <></>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={commonStyle.btnsocial}
                    onPress={instagramDisconnectHandler}>
                    <Image
                      style={commonStyle.socialIcon}
                      source={require('../../assets/images/instagramm.png')}
                    />
                    <Text
                      style={[
                        commonStyle.blackText16,
                        commonStyle.dicconnectInstatext,
                      ]}>
                      Disconnect Instagram
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              <InstagramLogin
                ref={(ref) => {
                  instagramLogin.current = ref;
                }}
                // appId="3926325880815873"
                appId="333211481886516"
                // appSecret="18e4a9dd7db565afb2c2e784d5ee4aff"
                // appSecret="8325ae262732370967300c75ae1670ad"
                // redirectUrl="https://socialsizzle.heroku.com/auth/"
                redirectUrl={FRONTEND_BASE_PATH + '/instalink'}
                scopes={['user_profile', 'user_media']}
                // scopes={['email']}
                onLoginSuccess={setIgToken}
                onLoginFailure={(data) => console.log(JSON.stringify(data))}
              />
            </View>
            {isGCalendarConnected ? (
              <View>
                <TouchableOpacity
                  style={commonStyle.btnsocial}
                  onPress={googleCalendarDisconnectHandler}>
                  <Image
                    style={commonStyle.socialIcon}
                    source={require('../../assets/images/google.png')}
                  />
                  <Text
                    style={[
                      commonStyle.blackText16,
                      commonStyle.disconnectgoogle,
                    ]}>
                    Disconnect Google Calendar
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <GoogleCalendarConnect
                  googleLoginSuccessHandler={googleLoginSuccessHandler}
                  text={
                    isGCalendarConnected
                      ? 'Disconnect Google Calendar'
                      : 'connectGoogle'
                  }
                  disabled={isGCalendarConnected}
                />
              </View>
            )}
            {/*  Instagram Feed FlatList Start  */}
            {/* flap list for image  */}
            {/*   <FlatList
                horizontal
                ItemSeparatorComponent={() => (
                  <View style={{marginRight: -26}} />
                )}
                showsHorizontalScrollIndicator={false}
                data={AdditionalInstraFeedData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => (
                  <TouchableOpacity activeOpacity={0.8}>
                    <View style={commonStyle.additionalInstraFeedCard}>
                      <Image
                        defaultSource={require('../../assets/images/default.png')}
                        source={item.InstraFeedAvater}
                        style={commonStyle.additionalInstraFeedCardImg}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              /> */}
            {/* Instagram Feed FlatList End  */}
          </View>

          <View style={commonStyle.horizontalPadd}>
            <View style={commonStyle.mb1}>
              <Text style={[commonStyle.blackTextR]}>
                Additional link (it’s optional)
              </Text>
              {additionalInfoUrl &&
                additionalInfoUrl.map((singleUrl, index) => {
                  return (
                    <View key={index} style={{ paddingHorizontal: 0 }}>
                      {singleUrl.url ? (
                        <View style={commonStyle.addLinkList}>
                          <TextInput
                            style={[
                              commonStyle.newtextInput,
                              { width: '100%', paddingRight: 30 },
                            ]}
                            returnKeyType="done"
                            value={singleUrl.url ? singleUrl.url : ''}
                            autoCapitalize={'none'}
                            placeholder="e.g. website address"
                            placeholderTextColor={'#939DAA'}
                            maxLength={200}
                            editable={false}
                          />
                          <View
                            style={{
                              right: 12,
                              top: 12,
                              position: 'absolute',
                              backgroundColor: '#f4f5f7',
                              width: 25,
                              height: 25,
                              flexDirection: 'row',
                              borderRadius: 25,
                              zIndex: 1000,
                            }}>
                            <TouchableOpacity
                              onPress={() => handleRemoveLink(index)}
                              style={{
                                backgroundColor: '#f4f5f7',
                                width: 25,
                                height: 25,
                                alignSelf: 'center',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                borderRadius: 25,
                              }}>
                              <CloseIcon />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
            </View>

            {/* dynamic field */}
            <View>
              {additionalInfoUrl?.length < 2 &&
                fields.map((field, idx) => {
                  return (
                    <View
                      key={`${field}-${idx}`}
                      style={{ paddingHorizontal: 0 }}>
                      <View style={commonStyle.addLinkList}>
                        <TextInput
                          style={[
                            commonStyle.newtextInput,
                            { paddingRight: 30, width: '90%' },
                          ]}
                          onFocus={() => setIsAdditionalLinkFocus(true)}
                          onChangeText={(e) => handleChange(idx, e)}
                          returnKeyType="done"
                          autoCapitalize={'none'}
                          placeholder="e.g. website address"
                          placeholderTextColor={'#939DAA'}
                          maxLength={200}
                        />
                      </View>
                      { }
                      <View
                        style={{
                          right: 12,
                          top: 23,
                          position: 'absolute',
                          backgroundColor: '#f4f5f7',
                          width: 25,
                          height: 25,
                          flexDirection: 'row',
                          borderRadius: 25,
                          zIndex: 1000,
                        }}>
                        <TouchableOpacity
                          onPress={() => handleRemove(idx)}
                          style={{
                            backgroundColor: '#f4f5f7',
                            width: 25,
                            height: 25,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            borderRadius: 25,
                          }}>
                          <CloseIcon />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
            </View>

            {additionalInfoUrl?.length + fields?.length < 2 && (
              <View style={(commonStyle.mb2, commonStyle.mt1)}>
                <TouchableOpacity
                  onPress={() => handleAdd()}
                  style={[
                    commonStyle.searchBarText,
                    { alignSelf: 'flex-start' },
                  ]}>
                  <TouchableHighlight>
                    <Text
                      style={{
                        fontSize: 36,
                        fontFamily: 'SofiaPro-ExtraLight',
                        lineHeight: 36,
                        marginRight: 15,
                      }}>
                      +
                    </Text>
                  </TouchableHighlight>
                  <Text style={commonStyle.blackTextR}>Add a link</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* dynamic field addd */}
          {/* <button type="button" onClick={() => handleAdd()}>
                   <Text> +</Text>
                 </button> */}

          {/* dynamic field end */}
        </View>
      </KeyboardAwareScrollView>
      <View style={commonStyle.footerwrap}>
        <View style={[commonStyle.footerbtn]}>
          <Button
            title={isUpdate ? 'Update' : 'Save and Continue'}
            containerStyle={commonStyle.buttoncontainerothersStyle}
            buttonStyle={commonStyle.commonbuttonStyle}
            titleStyle={commonStyle.buttontitleStyle}
            onPress={handleAdditionalInfo}
          />
        </View>
      </View>

      {/* Image Modal Start */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!imageIndex}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setImageIndex('');
        }}
        style={commonStyle.centeredView}>
        <View style={commonStyle.fullmodalView}>
          <View
            style={[
              commonStyle.skipHeaderWrap,
              { marginTop: Platform.OS === 'ios' ? 32 : 0 },
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => setImageIndex('')}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
            <Body style={[commonStyle.headerbacktitle, { marginLeft: 190 }]}>
              <Text
                onPress={() => deleteImage(imageIndex)}
                style={commonStyle.blackText16}>
                Delete
              </Text>
            </Body>
          </View>
          {/* <UploadPhotoVideoModal
            visible={modalVisible}
            multiSelect={true}
            //* Available Types: All, Videos, Photos
            assetType={'Photos'}
            submitEvent={fileSelectedEvent}
            cameraSubmitEvent={cameraSubmitEvent}
            fileSizeRequired={true}
          /> */}
          {/* <Text>Hello {imageIndex.url}</Text> */}
          <Image
            // source={{
            //   uri: 'https://staging.uiplonline.com:3077/uploads/327f4cc4-46ef-4a3f-9f7e-9f751e768684.jpg',
            // }}
            // source={{uri: `${imageIndex.url}`}}
            source={!imageIndex.id ? imageIndex : { uri: `${imageIndex.url}` }}
            style={{
              marginTop: 20,
              width: '95%',
              height: '90%',
              resizeMode: 'contain',
              alignSelf: 'center',
            }}
          />
          {/* <View
            style={{width: 200, height: 70, backgroundColor: '#ff0'}}></View> */}
        </View>
      </Modal>
      {/* Image Modal Start */}

      {/* Custom Gallery Modal */}
      <Modal
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
            multiSelect={true}
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
export default AdditionalInfo;
