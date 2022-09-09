import React, {
  Fragment,
  useState,
  useEffect,
  RefObject,
  useRef,
  useCallback,
} from 'react';
import {
  ScrollView,
  Dimensions,
  Linking,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  Platform,
  Image,
  Alert,
  Modal as NativeModal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  Container,
  Footer,
  Title,
  List,
  ListItem,
  Body,
  Left,
  Right,
} from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import ImagePicker from 'react-native-image-picker';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  EditIconOrange,
  CameraSmall,
  MapPointer,
  MoreVertical,
  CloseIcon,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {
  ClientsProfileAddNoteModal,
  BlockTimeModal,
  ClientsProfileEditNoteModal,
} from '../components/modal';
import {useSelector, useDispatch} from 'react-redux';
import moment from 'moment';
import {Post, Delete, Put} from '../api/apiAgent';
import {
  clientProfileDetailsRequest,
  clientProfileDetailsClear,
  walkinClientProfileDetailsRequest,
  walkinClientProfileDetailsClear,
} from '../store/actions/clientProfileDetailsAction';
import {
  clientsListRequest,
  clientsListClear,
} from '../store/actions/clientsListAction';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteIcon from '../components/icons/DeleteIcon';
import EditIcon from '../components/icons/EditIcon';
import global from '../components/commonservices/toast';
import EventEmitter from 'react-native-eventemitter';
import {IMAGE_MAX_SIZE, IMAGE_MAX_SIZE_VALIDATION_MSG} from '../api/constant';
import {UploadPhotoVideoModal} from '../components/modal';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const ClientsProfileWalkIn = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [preferredServices, setPreferredServices] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserImage, setCurrentUserImage] = useState(null);
  const [notes, setNotes] = useState(null);
  const [noteTextBoxContent, setNoteTextBoxContent] = useState('');
  const [editFormPropsData, setEditFormPropsData] = useState(null);
  const [editNoteModalOldContent, setEditNoteModalOldContent] = useState(''); // for editing notes
  const [currentlyEditedNoteId, setCurrentlyEditedNoteId] = useState(null); // fID of note being edited
  const [isModalApplyDisabled, setIsModalApplyDisabled] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  // Get the current state
  const clientProfileData = useSelector(
    (state) => state.clientProfileDetailsReducer.details,
  );
  const loderStatus = useSelector(
    (state) => state.clientProfileDetailsReducer.loader,
  );
  const status = useSelector(
    (state) => state.clientProfileDetailsReducer.status,
  );

  useEffect(() => {
    let obj = {customerId: props.route.params.clientId};
    dispatch(walkinClientProfileDetailsRequest(obj));

    // get name and image of currently logged in user
    setCurrentUserInfo();

    return () => {
      console.log('MOUNT');
      dispatch(walkinClientProfileDetailsClear());
    };
  }, []);

  useEffect(() => {
    //setting preferred services
    if (
      clientProfileData &&
      clientProfileData.servicePrefered &&
      clientProfileData.servicePrefered.length
    ) {
      console.log('PREFERRED SERVICES: ', clientProfileData.servicePrefered);
      if (
        clientProfileData.servicePrefered.length > 0 &&
        clientProfileData.servicePrefered.length <= 2
      ) {
        setPreferredServices(clientProfileData.servicePrefered);
      } else if (clientProfileData.servicePrefered.length > 2) {
        let topservices = clientProfileData.servicePrefered.slice(0, 2);
        setPreferredServices(topservices);
      } else {
        setPreferredServices(null);
      }
    }
    //Setting Notes
    if (
      clientProfileData &&
      clientProfileData.notes &&
      clientProfileData.notes.rows
    ) {
      setNotes(clientProfileData.notes.rows);
    }

    if (
      clientProfileData &&
      clientProfileData?.customerDetails &&
      clientProfileData?.customerDetails?.profileImage
    ) {
      setFilePath(clientProfileData.customerDetails.profileImage);
    }

    // Setting Client Edit Form Props Data
    if (clientProfileData && clientProfileData.customerDetails) {
      setEditFormPropsData({
        id: clientProfileData.customerDetails.id || '',
        name: clientProfileData.customerDetails.name || '',
        DOB: clientProfileData.customerDetails.dob || '',
        phone: clientProfileData.customerDetails.phone || '',
        countryCode: clientProfileData.customerDetails.countryCode || '',
        email: clientProfileData.customerDetails.email || '',
        profileImage: clientProfileData.customerDetails.profileImage || '',
      });
    }
  }, [clientProfileData]);

  useEffect(() => {
    console.log('content:', noteTextBoxContent);
    if (noteTextBoxContent.trim().length <= 0) {
      // global.showToast('Can not be blank', 'error');
      setIsModalApplyDisabled(true);
    } else {
      setIsModalApplyDisabled(false);
    }
  }, [noteTextBoxContent]);

  const setCurrentUserInfo = async () => {
    setCurrentUserName(await AsyncStorage.getItem('fullName'));
    setCurrentUserImage(await AsyncStorage.getItem('image'));
  };

  const getBookingStatus = (bookingItem) => {
    // let isCanceled = bookingItem.isCanceled || 0;
    // let isConfirmed = bookingItem.isConfirmed ||0;
    let status = bookingItem.status || 0;
    if (status === 1) {
      return 'Confirmed';
    }
    if (status === 2) {
      return 'Ongoing';
    }
    if (status === 3) {
      return 'Completed';
    }
    if (status === 4) {
      return 'Cancelled';
    }
  };

  const getBookingStatusStyle = (bookingStatus) => {
    switch (bookingStatus) {
      case 'Confirmed':
        return [commonStyle.bookingStatusbtn, commonStyle.confirmStatusbtn];
      case 'Ongoing':
        return [commonStyle.bookingStatusbtn, commonStyle.ongoingStatusbtn];
      case 'Completed':
        return [commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn];
      case 'Cancelled':
        return [commonStyle.bookingStatusbtn, commonStyle.cancelledStatusbtn];
      default:
        return [commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn];
    }
  };

  // const hasCompletedBooking = () => {
  //   if(clientProfileData &&
  //     clientProfileData.bookingDetails &&
  //     clientProfileData.bookingDetails.data &&
  //     clientProfileData.bookingDetails.data.length) {
  //       let bookingHistory = clientProfileData.bookingDetails.data;

  //       const numberOfConfirmedBookings = bookingHistory.filter(bookingItem => bookingItem.isConfirmed === 1).length
  //       console.log("NUMBER OF CONFIRMED BOOKINGS: ", numberOfConfirmedBookings)
  //       if(numberOfConfirmedBookings>0) {
  //         return true
  //       } else {
  //         return false
  //       }
  //     } else {
  //       return false
  //     }
  // }

  const showAlert = (title, msg) => {
    Alert.alert(
      title,
      msg,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('Ok Pressed')},
      ],
      {cancelable: false},
    );
  };

  const timeConversion = (timeInMins) => {
    if (timeInMins < 60) {
      return `${timeInMins} m`;
    } else {
      return `${Math.round(timeInMins / 60)} h`;
    }
  };

  const addNote = (note) => {
    if (
      clientProfileData &&
      clientProfileData.customerDetails &&
      clientProfileData.customerDetails.id
    ) {
      setLoader(true);
      Post('/pro/client-inorganic/add-note', {
        customerId: clientProfileData.customerDetails.id,
        notes: note,
      })
        .then((response) => {
          setLoader(false);
          global.showToast('Note is added sucessfully', 'success');
          let obj = {customerId: props.route.params.clientId};
          dispatch(walkinClientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setLoader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      setLoader(false);
      global.showToast('Unable to add note.', 'error');
    }
  };

  const editNote = (noteContent) => {
    if (
      clientProfileData &&
      clientProfileData.customerDetails &&
      clientProfileData.customerDetails.id
    ) {
      setLoader(true);
      Put('/pro/client/note', {
        id: currentlyEditedNoteId,
        notes: noteContent,
      })
        .then((response) => {
          setLoader(false);
          global.showToast('Note has been updated successfully', 'success');
          setCurrentlyEditedNoteId(null);
          let obj = {customerId: props.route.params.clientId};
          // dispatch(clientProfileDetailsRequest(obj))
          navigation.push('ClientsProfileWalkIn', {
            clientId: clientProfileData.customerDetails.id,
          });
        })
        .catch((err) => {
          setLoader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      setLoader(false);
      global.showToast('Can not update note.', 'error');
    }
  };

  const deleteNote = (noteId = selectedNoteId, type = 'afterConfirm') => {
    if (type == 'beforeConfirm') {
      setSelectedNoteId(noteId);
      setVisibleModal('DeleteNoteModal');
      return false;
    }
    setVisibleModal({visibleModal: null});
    if (
      clientProfileData &&
      clientProfileData.customerDetails &&
      clientProfileData.customerDetails.id
    ) {
      setLoader(true);
      Delete(`/pro/client-inorganic/note/${noteId}`)
        .then((response) => {
          setLoader(false);
          global.showToast('Note is deleted successfully', 'success');
          let obj = {customerId: props.route.params.clientId};
          dispatch(walkinClientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setLoader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      setLoader(false);
      global.showToast('Unable to delete note', 'error');
    }
  };

  const deleteClient = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to remove this client from this list?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setVisibleModal({visibleModal: null});
            setLoader(true);
            Delete(
              `/pro/clients/walk-in/${clientProfileData.customerDetails.id}`,
            )
              .then((response) => {
                setLoader(false);
                if (response.status == 200) {
                  global.showToast(response.message, 'success');
                  EventEmitter.emit('refreshPage');
                  navigation.push('ClientsWalkInClient', {
                    clientId: clientProfileData.customerDetails.id,
                  });
                }
              })
              .catch((err) => {
                setLoader(false);
                if (err.response.status == 422) {
                  global.showToast(err.response.data.message, 'error');
                } else {
                  global.showToast(
                    'Something went wrong, please try after some times',
                    'error',
                  );
                }
              });
          },
        },
      ],
      {cancelable: false},
    );
  };

  // const blockClient = () => {
  //   const customerId = clientProfileData.customerDetails.id || null;
  //   if(customerId) {
  //     Put(`/pro/clients/${customerId}/block`)
  //     .then(response => {
  //       console.log("BLOCK RESPONSE:", response)
  //       //Refresh page
  //       let obj = { 'customerId' : route.params.clientId }
  //       setVisibleModal ({ visibleModal: null });
  //       dispatch(walkinClientProfileDetailsRequest(obj))
  //     })
  //     .catch(err => {
  //       console.log('CHECK 1')
  //        showAlert(
  //         'Can\'t Block Client',
  //         'Client Data not available, can not block.'
  //       )
  //     })
  //   } else {
  //     console.log('CHECK 2')
  //     showAlert(
  //       'Can\'t Block Client',
  //       'Client Data not available, can not block.'
  //     )
  //   }
  // }

  const [filePath, setFilePath] = useState(null);

  // Choose The file
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
        if (response.fileSize > IMAGE_MAX_SIZE) {
          global.showToast(IMAGE_MAX_SIZE_VALIDATION_MSG, 'error');
          return;
        } else {
          if (Platform.OS === 'ios') {
            let path = response.uri;
            path = '~' + path.substring(path.indexOf('/Documents'));
            response.fileName = path.split('/').pop();
          }
          if (
            response.type === 'image/jpg' ||
            response.type === 'image/jpeg' ||
            response.type === 'image/png'
          ) {
            setLoader(true);
            const formData = new FormData();
            formData.append('image', {
              name: response.fileName,
              type: response.type,
              uri:
                Platform.OS === 'android'
                  ? response.uri
                  : response.uri.replace('file://', ''),
            });

            Post('/pro/clients/upload-pic', formData)
              .then((res) => {
                if (res.status == 200) {
                  updateClientProfileImage(res.data.url, response.uri);
                } else {
                  global.showToast(
                    'Something went wrong, please try after some times',
                    'error',
                  );
                  setLoader(false);
                }
              })
              .catch((err) => {
                setLoader(false);
                global.showToast(
                  'Something went wrong, please try after some times',
                  'error',
                );
              });
          } else {
            global.showToast(
              'Only jpg, jpeg or png images are accepted',
              'error',
            );
          }
        }
      }
    });
  };

  const fileSelectedEvent = (items) => {
    console.log(items);
    if (items?.length > 0) {
      const type = items[0].node.type;
      const fileName = items[0].node.image.filename;
      const uri = items[0].node.image.uri;

      let sizeValidationPass = validateFileSizes(items);
      if (!sizeValidationPass) {
        Alert.alert(IMAGE_MAX_SIZE_VALIDATION_MSG);
        return false;
      }
      if (Platform.OS === 'ios') {
        let path = uri;
        path = '~' + path.substring(path.indexOf('/Documents'));
        fileName = path.split('/').pop();
      }
      let typeCheckedItems = items.filter((item) => {
        if (
          type === 'image/jpg' ||
          type === 'image/jpeg' ||
          type === 'image/png' ||
          type === 'image'
        ) {
          return item;
        }
      });

      if (typeCheckedItems.length === items.length) {
        setLoader(true);
        setModalVisible(false);
        const formData = new FormData();
        formData.append('image', {
          name: fileName,
          type: type,
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        });
        Post('/pro/clients/upload-pic', formData)
          .then((res) => {
            console.log('response received: ', res);
            if (res.status == 200) {
              console.log('200 receivced');
              updateClientProfileImage(res.data.url, uri);
            } else {
              global.showToast(
                'Something went wrong, please try after some times',
                'error',
              );
              setLoader(false);
            }
          })
          .catch((err) => {
            setLoader(false);
            global.showToast(
              'Something went wrong, please try after some times',
              'error',
            );
          });
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

    const type = response.type;
    const fileName = response.fileName;
    const uri = response.uri;

    setModalVisible(false);
    if (Platform.OS === 'ios') {
      let path = uri;
      path = '~' + path.substring(path.indexOf('/Documents'));
      fileName = path.split('/').pop();
    }
    if (
      response.type === 'image/jpg' ||
      response.type === 'image/jpeg' ||
      response.type === 'image/png'
    ) {
      setLoader(true);
      const formData = new FormData();
      formData.append('image', {
        name: fileName,
        type: type,
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
      });

      Post('/pro/clients/upload-pic', formData)
        .then((res) => {
          if (res.status == 200) {
            updateClientProfileImage(res.data.url, uri);
          } else {
            global.showToast(
              'Something went wrong, please try after some times',
              'error',
            );
            setLoader(false);
          }
        })
        .catch((err) => {
          setLoader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
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

  // Thsi function is for update the profile image
  const updateClientProfileImage = (imageURL, imageURI) => {
    let bodyObj = {
      profileImage: imageURL,
    };
    Put(`/pro/clients/${props.route.params.clientId}`, bodyObj)
      .then((response) => {
        if (response.status == 200) {
          setFilePath(imageURI);
          setTimeout(() => {
            setLoader(false);
            global.showToast('Successfully updated client photo', 'success');
          }, 500);
        } else {
          setLoader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        }
      })
      .catch((err) => {
        setLoader(false);
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  const [visibleModal, setVisibleModal] = useState('');
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);

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
  /**
   * =======================.
   */

  /**
   * @description:This Method is use to Open a dial pad onclick the call Icon
   */
  const callNumber = (number) => {
    // const hasCompletedBookingFlag =  hasCompletedBooking();
    const hasCompletedBookingFlag = true;
    let phoneNumber =
      Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (!supported) {
          global.showToast(
            'Unable to handle phone call, please try manually',
            'error',
          );
        } else if (!hasCompletedBookingFlag) {
          global.showToast(
            "Can't call a client without any confirmed bookings.",
            'error',
          );
        } else {
          return Linking.openURL(phoneNumber);
        }
      })
      .catch((err) => {
        global.showToast(
          'Something went wrong, please try after some times',
          'error',
        );
      });
  };

  const navigateClientPage = () => {
    let obj = {listType: 'walkin'};
    dispatch(clientsListRequest(obj));
    navigation.navigate('ClientsWalkInClient', {listType: 'walkin'});
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loader ? <ActivityLoaderSolid /> : null}
        <View style={commonStyle.skipHeaderWrap}>
          <View>
            <TouchableOpacity
              style={commonStyle.haederArrowback}
              onPress={() => navigateClientPage()}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={commonStyle.headerbacktitle}>
            <Text style={commonStyle.blackText16}>Client’s profile</Text>
          </Body>
          <View style={{alignSelf: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={commonStyle.skipbtn}
              activeOpacity={0.5}
              onPress={() => {
                setVisibleModal('clientsProfileInfoDialog');
              }}>
              <MoreVertical />
            </TouchableOpacity>
          </View>
        </View>
        {!loderStatus &&
        clientProfileData &&
        clientProfileData.customerDetails ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                commonStyle.setupCardBox,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 20,
                }}>
                <View>
                  <View style={commonStyle.clientProfilebox}>
                    {filePath ? (
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
                    onPress={() => setModalVisible(true)}
                    // activeOpacity={.5} onPress={chooseFile}
                  >
                    {clientProfileData.customerDetails.profileImage ? (
                      <EditIconOrange />
                    ) : (
                      <CameraSmall />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={commonStyle.mt2}>
                  <Text
                    style={[
                      commonStyle.modalforgotheading,
                      commonStyle.textCenter,
                      commonStyle.mb1,
                    ]}>
                    {clientProfileData.customerDetails.name}
                  </Text>
                </View>
              </View>
              <View style={commonStyle.dividerlinefull} />
              <View style={[commonStyle.socialShareRow, commonStyle.pt2]}>
                <View style={commonStyle.socialShareRowCol}>
                  <TouchableOpacity
                    style={commonStyle.mb1}
                    onPress={() =>
                      navigation.navigate('NewWalkInBooking', {
                        preSelected: true,
                        selectedUser: clientProfileData.customerDetails.id,
                      })
                    }>
                    <View
                      style={[commonStyle.socialShareCircle, commonStyle.mrl]}>
                      <Image
                        style={commonStyle.avatericon}
                        source={require('../assets/images/calendar-check.png')}
                      />
                    </View>
                    <Text
                      style={[commonStyle.blackTextR, commonStyle.textCenter]}
                      numberOfLines={1}>
                      New booking
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={commonStyle.socialShareRowCol}>
                  <TouchableOpacity
                    style={commonStyle.mb1}
                    // onPress={callNumber}
                    onPress={() =>
                      callNumber(
                        `${clientProfileData.customerDetails.countryCode}${clientProfileData.customerDetails.phone}`,
                      )
                    }>
                    <View
                      style={[commonStyle.socialShareCircle, commonStyle.mrl]}>
                      <Image
                        style={commonStyle.avatericon}
                        source={require('../assets/images/call.png')}
                      />
                    </View>
                    <Text
                      style={[commonStyle.blackTextR, commonStyle.textCenter]}
                      numberOfLines={1}>
                      Call
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={commonStyle.categoriseListWrap}>
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Client Info</Text>
                <View
                  style={[
                    commonStyle.bookingdatewrap,
                    commonStyle.mb05,
                    commonStyle.mt2,
                  ]}>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>
                    Phone number
                  </Text>
                  <Text style={[commonStyle.blackTextR]} numberOfLines={1}>
                    {clientProfileData.customerDetails.countryCode
                      ? `${clientProfileData.customerDetails.countryCode}`
                      : ''}{' '}
                    {clientProfileData.customerDetails.phone
                      ? `${clientProfileData.customerDetails.phone}`
                      : '-'}
                  </Text>
                </View>
                <View
                  style={[
                    commonStyle.bookingdatewrap,
                    commonStyle.mb05,
                    commonStyle.mt2,
                  ]}>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>
                    Email
                  </Text>
                  <Text style={[commonStyle.blackTextR]} numberOfLines={1}>
                    {clientProfileData.customerDetails.email
                      ? clientProfileData.customerDetails.email
                      : 'N/A'}
                  </Text>
                </View>
                <View
                  style={[
                    commonStyle.bookingdatewrap,
                    commonStyle.mb05,
                    commonStyle.mt2,
                  ]}>
                  <Text style={commonStyle.grayText16} numberOfLines={1}>
                    Date of Birth
                  </Text>
                  <Text style={[commonStyle.blackTextR]} numberOfLines={1}>
                    {clientProfileData.customerDetails.dob
                      ? moment(clientProfileData.customerDetails.dob).format(
                          'LL',
                        )
                      : 'N/A'}
                  </Text>
                </View>
              </View>

              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  Services preferred (
                  {preferredServices ? preferredServices.length : 0})
                </Text>
                {preferredServices ? (
                  preferredServices.map((preferredServiceItem, index) => (
                    <List key={index} style={[commonStyle.setupserviceList]}>
                      <ListItem
                        thumbnail
                        style={commonStyle.categoriseListItem}>
                        <View style={commonStyle.serviceListtouch}>
                          <Left
                            style={{
                              alignSelf: 'flex-start',
                              marginTop: 7,
                              marginRight: 15,
                            }}>
                            <Text
                              style={[
                                commonStyle.dotLarge,
                                {
                                  backgroundColor:
                                    preferredServiceItem &&
                                    preferredServiceItem.Service &&
                                    preferredServiceItem.Service.ProCategory &&
                                    preferredServiceItem.Service.ProCategory
                                      .categoryColor
                                      ? `${preferredServiceItem.Service.ProCategory.categoryColor}`
                                      : `#FF9589`,
                                  marginLeft: 0,
                                  marginRight: 0,
                                },
                              ]}>
                              .
                            </Text>
                          </Left>
                          <Body style={commonStyle.categoriseListBody}>
                            <Text
                              style={[commonStyle.blackTextR, commonStyle.mb05]}
                              numberOfLines={1}>
                              {preferredServiceItem &&
                              preferredServiceItem.Service &&
                              preferredServiceItem.Service.name
                                ? preferredServiceItem.Service.name
                                : '-'}
                            </Text>
                            <Text
                              style={[commonStyle.grayText16, {marginLeft: 4}]}>
                              {preferredServiceItem &&
                              preferredServiceItem.Service &&
                              preferredServiceItem.Service.duration
                                ? timeConversion(
                                    preferredServiceItem.Service.duration,
                                  )
                                : '-'}
                            </Text>
                          </Body>
                          <TouchableHighlight style={{alignSelf: 'flex-start'}}>
                            <Text style={commonStyle.blackTextR}>
                              {preferredServiceItem &&
                              preferredServiceItem.Service &&
                              preferredServiceItem.Service.amount
                                ? `$${preferredServiceItem.Service.amount}`
                                : '-'}
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </ListItem>
                    </List>
                  ))
                ) : (
                  <Text>No Preferred Services to Show</Text>
                )}
              </View>

              {/* <View style={[commonStyle.setupCardBox]}>
                      <Text style={[commonStyle.subtextblack]}>Notes</Text>
                      <View style={{borderBottomWidth: 1, borderBottomColor: '#dcdcdc', paddingVertical:18}}>
                        <Text style={commonStyle.blackTextR}>Address: Rooley Ln, Bradford BD4 7SR</Text>
                      </View>
                      <TouchableOpacity style={[commonStyle.searchBarText, {alignSelf: 'flex-start', marginTop: 10}]} onPress={() => { setVisibleModal('FaqQuestionAddDialog'); }}>
                        <TouchableHighlight>
                          <Text style={{fontSize: 36, fontFamily: 'SofiaPro-ExtraLight', lineHeight: 36, marginRight: 15}}>+</Text>
                        </TouchableHighlight> 
                        <Text style={commonStyle.blackTextR}>Add a note</Text>
                      </TouchableOpacity>
                    </View> */}

              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Notes</Text>
                {notes && notes.length ? (
                  notes.map((noteItem) => {
                    return noteItem.isDeleted === 0 ? (
                      <View
                        key={noteItem.id}
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: '#dcdcdc',
                          paddingVertical: 18,
                          flexDirection: 'row',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{width: '78%'}}>
                          <Text style={commonStyle.blackTextR}>
                            {noteItem.notes ? noteItem.notes : '-'}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            style={[
                              commonStyle.moreInfoCircle,
                              {marginRight: 5},
                            ]}
                            onPress={() => {
                              setVisibleModal('EditNoteModal');
                              setCurrentlyEditedNoteId(noteItem.id);
                              setNoteTextBoxContent(noteItem.notes || '');
                              setEditNoteModalOldContent(noteItem.notes || '');
                            }}>
                            <EditIcon />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={commonStyle.moreInfoCircle}
                            onPress={() =>
                              deleteNote(noteItem.id, 'beforeConfirm')
                            }>
                            <CloseIcon />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : null;
                  })
                ) : (
                  <Text style={[commonStyle.grayText14]}>No Notes to Show</Text>
                )}
                <TouchableOpacity
                  style={[
                    commonStyle.searchBarText,
                    {alignSelf: 'flex-start', marginTop: 10},
                  ]}
                  onPress={() => {
                    setVisibleModal('FaqQuestionAddDialog');
                  }}>
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
                  <Text style={commonStyle.blackTextR}>Add a note</Text>
                </TouchableOpacity>
              </View>

              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                  Bookings
                </Text>
                <View style={commonStyle.bookingboxRow}>
                  <View style={[commonStyle.bookingboxCol, {paddingRight: 5}]}>
                    <TouchableOpacity
                      style={[commonStyle.bookingcountbox]}
                      activeOpacity={1}>
                      <View
                        style={[
                          commonStyle.bookingCirclebg,
                          {backgroundColor: '#ED5088'},
                        ]}>
                        <Text style={commonStyle.whiteText16}>
                          {clientProfileData?.bookingDetails?.rows?.length}
                        </Text>
                      </View>
                      <Text
                        style={[commonStyle.grayText14, commonStyle.textCenter]}
                        numberOfLines={1}>
                        All bookings
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {/* <View style={[commonStyle.bookingboxCol, {paddingLeft: 5}]}>
                        <TouchableOpacity style={[commonStyle.bookingcountbox,]} activeOpacity={1}>
                            <View style={[commonStyle.bookingCirclebg, {backgroundColor: '#939DAA'}]}>
                              <Text style={commonStyle.whiteText16}>0</Text>
                            </View>
                            <Text style={[commonStyle.grayText14, commonStyle.textCenter]} numberOfLines={1}>No-shows</Text>
                          </TouchableOpacity>  
                        </View> */}
                </View>
                <View style={commonStyle.mt1}>
                  <TouchableHighlight style={commonStyle.mb2}>
                    <Text style={commonStyle.grayText16}>List of bookings</Text>
                  </TouchableHighlight>
                  {clientProfileData?.bookingDetails?.rows?.length &&
                    clientProfileData.bookingDetails.rows.map(
                      (bookingItem, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            commonStyle.bookingCardBox,
                            commonStyle.mt05,
                            {
                              borderLeftWidth: 3,
                              borderLeftColor:
                                bookingItem.Service &&
                                bookingItem.Service.ProCategory &&
                                bookingItem.Service.ProCategory.categoryColor
                                  ? bookingItem.Service.ProCategory
                                      .categoryColor
                                  : '#FF9589',
                            },
                          ]}>
                          <List
                            style={[
                              commonStyle.bookingdateUserwrap,
                              {
                                borderBottomWidth: 0,
                                paddingBottom: 10,
                                paddingTop: 10,
                              },
                            ]}>
                            <ListItem
                              thumbnail
                              style={[commonStyle.commListitem]}>
                              <Left style={commonStyle.bookingUserAvaterwrap}>
                                <Image
                                  style={commonStyle.bookingUserAvaterImg}
                                  // defaultSource={require('../assets/images/default.png')}
                                  source={
                                    currentUserImage
                                      ? {uri: currentUserImage}
                                      : require('../assets/images/default-user.png')
                                  }
                                />
                              </Left>
                              <Body style={commonStyle.categoriseListBody}>
                                {/* <Text style={commonStyle.blackText16} numberOfLines={1}>{clientProfileData.customerDetails.userName ? clientProfileData.customerDetails.userName : '-' }</Text> */}
                                <Text
                                  style={commonStyle.blackText16}
                                  numberOfLines={1}>
                                  {currentUserName ? currentUserName : '-'}
                                </Text>
                              </Body>
                              <TouchableHighlight
                                // style={[commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn]}
                                style={getBookingStatusStyle(
                                  getBookingStatus(bookingItem),
                                )}>
                                <Text style={commonStyle.bookingStatusbtnText}>
                                  {getBookingStatus(bookingItem)}
                                </Text>
                              </TouchableHighlight>
                            </ListItem>
                            <View
                              style={[
                                commonStyle.bookingdatewrap,
                                commonStyle.mt15,
                              ]}>
                              <Text
                                style={commonStyle.blackTextR}
                                numberOfLines={1}>
                                {bookingItem.Service && bookingItem.Service.name
                                  ? bookingItem.Service.name
                                  : '-'}
                              </Text>
                              <TouchableHighlight>
                                <Text style={commonStyle.blackTextR}>
                                  {moment(bookingItem.blockTimeFrom).format(
                                    'll',
                                  )}
                                </Text>
                              </TouchableHighlight>
                            </View>
                          </List>
                        </TouchableOpacity>
                      ),
                    )}
                  {/* <TouchableOpacity style={[commonStyle.bookingCardBox, commonStyle.mt05, {borderLeftWidth: 3, borderLeftColor: '#FF9589'}]}>
                          <List style={[commonStyle.bookingdateUserwrap, {borderBottomWidth: 0, paddingBottom: 10, paddingTop: 10}]}>
                            <ListItem thumbnail style={[commonStyle.commListitem]}>
                              <Left style={commonStyle.bookingUserAvaterwrap}>
                                <Image style={commonStyle.bookingUserAvaterImg} defaultSource={require('../assets/images/default.png')} source={require("../assets/images/users/user-1.png")}/>
                              </Left>
                              <Body style={commonStyle.categoriseListBody}>
                              <Text style={commonStyle.blackText16} numberOfLines={1}>Mandy Miles</Text>
                              </Body>
                              <TouchableHighlight style={[commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn]}>
                                <Text style={commonStyle.bookingStatusbtnText}>Completed</Text>
                              </TouchableHighlight>
                            </ListItem>
                            <View style={[commonStyle.bookingdatewrap, commonStyle.mt15]}>
                              <Text style={commonStyle.blackTextR} numberOfLines={1}>Professional Make Up</Text>
                              <TouchableHighlight>
                                <Text style={commonStyle.blackTextR}>12pm - 1pm</Text>
                              </TouchableHighlight>
                            </View>
                          </List>
                        </TouchableOpacity> */}
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ActivityLoaderSolid />
        )}
      </Container>
      {/* Inspire Inner modal start */}
      <Modal
        isVisible={visibleModal === 'clientsProfileInfoDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
        swipeThreshold={50}
        swipeDirection="down"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        propagateSwipe={true}
        style={commonStyle.othersbottomModal}>
        <View>
          <View style={commonStyle.othersModal}>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() =>
                callNumber(
                  `${clientProfileData.customerDetails.countryCode}${clientProfileData.customerDetails.phone}`,
                )
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/call-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Call a client</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setVisibleModal(null);
                navigation.navigate('NewWalkInBooking', {
                  preSelected: true,
                  selectedUser: clientProfileData.customerDetails.id,
                });
              }}
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/walk-in-booking-img.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Create new booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                commonStyle.searchBarText,
                {
                  borderBottomWidth: 1,
                  borderBottomColor: '#dcdcdc',
                  padding: 12,
                },
              ]}
              onPress={() =>
                navigation.navigate('ClientsEditClientInfo', {
                  clientInfo: editFormPropsData,
                  showAlert: showAlert,
                }) & setVisibleModal({visibleModal: null})
              }>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/edit-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Edit client info</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[commonStyle.searchBarText, {padding: 12}]}
              onPress={() => deleteClient()}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/trash-orange.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>Delete client</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={commonStyle.modalcancle}
            activeOpacity={0.9}
            onPress={() => setVisibleModal({visibleModal: null})}>
            <Text style={commonStyle.outlinetitleStyle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Inspire Inner modal end */}

      {/* Clients note modal start */}
      <Modal
        isVisible={visibleModal === 'FaqQuestionAddDialog'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View style={[commonStyle.scrollableModal, {maxHeight: '100%'}]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
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
            <ClientsProfileAddNoteModal
              setNoteTextBoxContent={setNoteTextBoxContent}
              setKeyboardStatus={setKeyboardStatus}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save a note"
              disabled={isModalApplyDisabled}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal({visibleModal: null});
                addNote(noteTextBoxContent);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Clients note modal End */}

      {/* Clients Edit note modal start */}
      <Modal
        isVisible={visibleModal === 'EditNoteModal'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View style={[commonStyle.scrollableModal, {maxHeight: '100%'}]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
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
            <ClientsProfileEditNoteModal
              oldContent={editNoteModalOldContent}
              setNoteTextBoxContent={setNoteTextBoxContent}
              setKeyboardStatus={setKeyboardStatus}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save note"
              disabled={isModalApplyDisabled}
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal({visibleModal: null});
                editNote(noteTextBoxContent);
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Clients Edit note modal End */}

      {/* Delete note modal start */}
      <Modal
        isVisible={visibleModal === 'DeleteNoteModal'}
        onSwipeComplete={() => setVisibleModal({visibleModal: null})}
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
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => setVisibleModal({visibleModal: null})}>
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
                  {borderBottomWidth: 0, paddingBottom: 0},
                ]}>
                <Text
                  style={[
                    commonStyle.modalforgotheading,
                    commonStyle.textCenter,
                  ]}>
                  Are you sure you want to delete this note?
                </Text>
              </View>
            </View>
          </ScrollView>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Delete"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={() => deleteNote()}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Cancel"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={[
                    commonStyle.buttonStylehalf,
                    commonStyle.lightorang,
                  ]}
                  titleStyle={[
                    commonStyle.buttontitleStyle,
                    commonStyle.colorOrange,
                  ]}
                  onPress={() => setVisibleModal({visibleModal: null})}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete note modal end */}

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
          />
        </View>
      </NativeModal>
    </Fragment>
  );
};

export default ClientsProfileWalkIn;
