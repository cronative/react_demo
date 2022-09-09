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
  Platform,
  Image,
  Alert,
  BackHandler,
  Keyboard,
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
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {Button} from 'react-native-elements';
import {
  LeftArrowIos,
  LeftArrowAndroid,
  RightAngle,
  StarIcon,
  DirectionsIcon,
  MapPointer,
  MoreVertical,
  CloseIcon,
} from '../components/icons';
import commonStyle from '../assets/css/mainStyle';
import {
  ClientsProfileAddNoteModal,
  ClientsProfileEditNoteModal,
} from '../components/modal';
import {useSelector, useDispatch} from 'react-redux';
import global from '../components/commonservices/toast';
import {
  clientProfileDetailsRequest,
  clientProfileDetailsClear,
  clientProfileLoadMoreRequest,
  clientProfileLoadMoreClear,
} from '../store/actions/clientProfileDetailsAction';
import {Post, Delete, Put, Get, mainAPI} from '../api/apiAgent';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeleteIcon from '../components/icons/DeleteIcon';
import EditIcon from '../components/icons/EditIcon';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const ClientsProfile = ({route}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const scrollViewRef = useRef(0);
  const [preferredServices, setPreferredServices] = useState(null);
  const [currentUserName, setCurrentUserName] = useState(null);
  const [currentUserImage, setCurrentUserImage] = useState(null);
  const [notes, setNotes] = useState(null);
  const [loader, setloader] = useState(false);
  const [noteTextBoxContent, setNoteTextBoxContent] = useState('');
  const [editNoteModalOldContent, setEditNoteModalOldContent] = useState(''); // for editing notes
  const [currentlyEditedNoteId, setCurrentlyEditedNoteId] = useState(null); // fID of note being edited
  const [selectedNoteId, setSelectedNoteId] = useState('');

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

  const [isModalApplyDisabled, setIsModalApplyDisabled] = useState(false);
  const [page, setPage] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const [keyboardStatus, setKeyboardStatus] = useState(false);

  useEffect(() => {
    console.log('CLIENT PROFILE DATA:', clientProfileData);

    console.log(
      'LOADED: &&&&&&',
      clientProfileData?.bookingDetails?.data?.length,
    );
    console.log('TOTAL: ', clientProfileData?.bookingDetails?.rows);
    if (
      clientProfileData?.bookingDetails?.data?.length &&
      clientProfileData?.bookingDetails?.rows &&
      clientProfileData?.bookingDetails?.data?.length ==
        clientProfileData?.bookingDetails?.rows
    ) {
      console.log('LOADED: ***', clientProfileData.bookingDetails.data.length);
      console.log('TOTAL: ***', clientProfileData?.bookingDetails?.rows);
      console.log('DISABLING LOAD MORE');

      setDisableLoadMore(true);
    }
  }, [clientProfileData]);

  useFocusEffect(
    useCallback(() => {
      const backHandlerdata = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (
            !!route.params.fromBookingsProInner ||
            !!route.params.fromInboxInner
          ) {
            navigation.goBack();
            setTimeout(() => {
              navigation.goBack();
            }, 10);
          } else {
            navigation.goBack();
          }
          return true;
        },
      );

      return () => backHandlerdata.remove();
    }, []),
  );

  useEffect(() => {
    let obj = {customerId: route.params.clientId};
    dispatch(clientProfileDetailsRequest(obj));

    // get name and image of currently logged in user
    setCurrentUserInfo();

    return () => {
      dispatch(clientProfileDetailsClear());
    };
  }, [route.params.clientId]);

  useEffect(() => {
    if (page > 1) {
      let obj = {customerId: route.params.clientId, page: page};
      console.log('obj is', obj);
      dispatch(clientProfileLoadMoreRequest(obj));
    }
  }, [route.params.clientId, page]);

  useEffect(() => {
    console.log('content:', noteTextBoxContent);
    if (noteTextBoxContent.trim().length <= 0) {
      // global.showToast('Can not be blank', 'error');
      setIsModalApplyDisabled(true);
    } else {
      setIsModalApplyDisabled(false);
    }
  }, [noteTextBoxContent]);

  // useState(() => {

  // }, [clientProfileData])

  useEffect(() => {
    //setting preferred services
    if (
      clientProfileData &&
      clientProfileData.customerServices &&
      clientProfileData.customerServices.data
    ) {
      if (clientProfileData.customerServices.data.length > 0) {
        setPreferredServices(clientProfileData.customerServices.data);
      } else {
        setPreferredServices(null);
      }
      // if(clientProfileData.customerServices.data.length > 0 &&
      // clientProfileData.customerServices.data.length <= 2) {
      //   setPreferredServices(clientProfileData.customerServices.data)
      // }
      // else if(clientProfileData.customerServices.data.length > 2) {
      //   let topservices = clientProfileData.customerServices.data.slice(0,2)
      //   setPreferredServices(topservices)
      // }
      // else {
      //   setPreferredServices(null)
      // }
    }
    //Setting Notes
    if (
      clientProfileData &&
      clientProfileData.notes &&
      clientProfileData.notes.rows
    ) {
      setNotes(clientProfileData.notes.rows);
    }
  }, [clientProfileData]);

  useEffect(() => {
    console.log('NOTES: ', notes);
  }, [notes]);

  const setCurrentUserInfo = async () => {
    setCurrentUserName(await AsyncStorage.getItem('fullName'));
    setCurrentUserImage(await AsyncStorage.getItem('image'));
  };

  const getBookingStatus = (bookingItem) => {
    let isCanceled = bookingItem.isCanceled || 0;
    let isConfirmed = bookingItem.isConfirmed || 0;
    let status = bookingItem.status || 0;

    if (isCanceled === 1) {
      return 'Cancelled';
    } else {
      if (isConfirmed === 0) {
        if (status === 1) return 'Pending';
      } else {
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
          return 'No Show';
        }
        if (status === 5) {
          return 'Cash not recieved';
        }
        if (status === 6) {
          return 'Incomplete';
        }
      }
    }
  };

  const getBookingStatusStyle = (bookingStatus) => {
    switch (bookingStatus) {
      case 'Cancelled':
        return [commonStyle.bookingStatusbtn, commonStyle.cancelledStatusbtn];
      case 'Pending':
        return [commonStyle.bookingStatusbtn, commonStyle.pendingStatusbtn];
      case 'Placed':
        return [commonStyle.bookingStatusbtn, commonStyle.confirmStatusbtn];
      case 'Ongoing':
        return [commonStyle.bookingStatusbtn, commonStyle.ongoingStatusbtn];
      case 'Completed':
        return [commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn];
      case 'No Show':
        return [commonStyle.bookingStatusbtn, commonStyle.noshowStatusbtn];
      case 'Incomplete':
        return [commonStyle.bookingStatusbtn, commonStyle.noshowStatusbtn];
      case 'Cash not recieved':
        return [commonStyle.bookingStatusbtn, commonStyle.noshowStatusbtn];
      default:
        return [commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn];
    }
  };

  const hasCompletedBooking = () => {
    if (
      clientProfileData &&
      clientProfileData.bookingDetails &&
      clientProfileData.bookingDetails.data &&
      clientProfileData.bookingDetails.data.length
    ) {
      let bookingHistory = clientProfileData.bookingDetails.data;

      const numberOfConfirmedBookings = bookingHistory.filter(
        (bookingItem) => bookingItem.isConfirmed === 1,
      ).length;
      if (numberOfConfirmedBookings > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

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

  /**
   * @description:This Method is use to Open a dial pad onclick the call Icon
   */
  const callNumber = (number) => {
    const hasCompletedBookingFlag = hasCompletedBooking();
    setVisibleModal({visibleModal: null});
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
      setloader(true);
      Post('/pro/client-organic/add-note', {
        customerId: clientProfileData.customerDetails.id,
        notes: note,
      })
        .then((response) => {
          setloader(false);
          global.showToast('Note is added sucessfully', 'success');
          let obj = {customerId: route.params.clientId};
          dispatch(clientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setloader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      global.showToast('Unable to add note', 'error');
    }
  };

  const editNote = (noteContent) => {
    if (
      clientProfileData &&
      clientProfileData.customerDetails &&
      clientProfileData.customerDetails.id
    ) {
      setloader(true);
      Put('/pro/client/note', {
        id: currentlyEditedNoteId,
        notes: noteContent,
      })
        .then((response) => {
          setloader(false);
          global.showToast('Note has been updated successfully', 'success');
          setCurrentlyEditedNoteId(null);
          let obj = {customerId: route.params.clientId};
          dispatch(clientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setloader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      global.showToast('Unable to update note.', 'error');
    }
  };

  const deleteNote = (noteId = selectedNoteId, type = 'afterConfirm') => {
    if (type == 'beforeConfirm') {
      setSelectedNoteId(noteId);
      setVisibleModal('DeleteNoteModal');
      return false;
    }
    setVisibleModal('');
    if (
      clientProfileData &&
      clientProfileData.customerDetails &&
      clientProfileData.customerDetails.id
    ) {
      setloader(true);
      Delete(`/pro/client/note/${noteId}`)
        .then((response) => {
          setloader(false);

          global.showToast('Note is deleted successfully', 'success');
          let obj = {customerId: route.params.clientId};
          dispatch(clientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setloader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      global.showToast('Unable to delete note', 'error');
    }
  };

  const clientBlockToggle = () => {
    setVisibleModal({visibleModal: null});
    const customerId = clientProfileData.customerDetails.id || null;
    if (customerId) {
      setloader(true);
      Put(`/pro/clients/${customerId}/block`)
        .then((response) => {
          setloader(false);
          let msg = response?.data?.blockedBy
            ? 'Blocked successfully'
            : 'UnBlocked successfully';
          global.showToast(msg, 'success');
          let obj = {customerId: route.params.clientId};
          dispatch(clientProfileDetailsRequest(obj));
        })
        .catch((err) => {
          setloader(false);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
        });
    } else {
      global.showToast('Unable to block or unblock client', 'error');
    }
  };

  const cardDictionary = {
    1: {
      cardName: 'Amex',
      cardImage: '../assets/images/amex.png',
    },
    2: {
      cardName: 'Cartes Bancaires',
      cardImage: '../assets/images/cartes_bancaires.png',
    },
    3: {
      cardName: 'Diners Club',
      cardImage: '../assets/images/diners_club.png',
    },
    4: {
      cardName: 'Discover',
      cardImage: '../assets/images/discover.png',
    },
    5: {
      cardName: 'JCB',
      cardImage: '../assets/images/jcb.png',
    },
    6: {
      cardName: 'MasterCard',
      cardImage: '../assets/images/mastercard.png',
    },
    7: {
      cardName: 'Visa',
      cardImage: '../assets/images/visa.png',
    },
    8: {
      cardName: 'UnionPay',
      cardImage: '../assets/images/unionpay.png',
    },
  };

  // This message is to chatting with the user
  const writeMessage = async () => {
    setVisibleModal(null);
    let clientProfile = clientProfileData?.customerDetails || null;
    const userId = await AsyncStorage.getItem('userId');
    if (clientProfile != null) {
      setloader(true);
      mainAPI({
        url: '/user/ask',
        data: {
          // proId: userId,
          clientId: clientProfile?.id,
        },
        methodType: 'post',
      })
        .then(({data}) => {
          console.log('\n\ndata recieved************', data);
          setloader(false);
          dispatch({type: 'CLEAR_MESSAGE_DETAILS'});
          navigation.navigate('Inbox');
          setTimeout(() => {
            navigation.navigate('Inbox', {
              screen: 'InboxInner',
              params: {
                fromBookings: true,
                userType: '1',
                channelDetails: {
                  customerId: clientProfile?.id,
                  User: clientProfile,
                },
                loginId: userId,
                channelId: data?.channelId,
              },
            });
          }, 100);
        })
        .catch((err) => {
          console.log('\n\ndata recieved in error************', err);
          setloader(false);
          global.showToast('Something went wrong', 'error');
        });
    } else {
      global.showToast('Something went wrong', 'error');
    }
  };

  const loadMoreHandler = () => {
    setPage((prevPageCount) => prevPageCount + 1);
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
              onPress={() => {
                if (
                  !!route.params.fromBookingsProInner ||
                  !!route.params.fromInboxInner
                ) {
                  navigation.goBack();
                  setTimeout(() => {
                    navigation.goBack();
                  }, 10);
                } else {
                  navigation.goBack();
                }
              }}>
              {Platform.OS === 'ios' ? <LeftArrowIos /> : <LeftArrowAndroid />}
            </TouchableOpacity>
          </View>
          <Body style={[commonStyle.headerbacktitle, {marginRight: 10}]}>
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
        clientProfileData.customerDetails &&
        clientProfileData.rating ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={[
                commonStyle.setupCardBox,
                {borderTopLeftRadius: 0, borderTopRightRadius: 0},
              ]}>
              <View style={{alignSelf: 'center', marginBottom: 20}}>
                <View style={commonStyle.clientProfilebox}>
                  <Image
                    style={commonStyle.clientProfileimg}
                    // source={require('../assets/images/users/user-10.png')}
                    source={
                      clientProfileData.customerDetails.profileImage
                        ? {uri: clientProfileData.customerDetails.profileImage}
                        : require('../assets/images/default.png')
                    }
                  />
                </View>
                {clientProfileData.rating &&
                clientProfileData?.rating?.avgRatingPersons == 'NaN' ? (
                  <View style={commonStyle.mt2}>
                    <Text
                      style={[
                        commonStyle.modalforgotheading,
                        commonStyle.textCenter,
                        commonStyle.mb2,
                      ]}>
                      {clientProfileData.customerDetails.userName
                        ? clientProfileData.customerDetails.userName
                        : '-'}
                    </Text>
                    <TouchableOpacity
                      style={[commonStyle.ratingWhitebtn, commonStyle.shadow]}
                      onPress={() =>
                        navigation.navigate('ClientsProfileReviews', {
                          customerId: clientProfileData.customerDetails.id,
                          ratingData: clientProfileData.rating,
                          clientName:
                            clientProfileData.customerDetails.userName,
                        })
                      }>
                      <Text style={[commonStyle.blackText16, commonStyle.mb03]}>
                        {' '}
                        <StarIcon /> {'N/A'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={commonStyle.mt2}>
                    <Text
                      style={[
                        commonStyle.modalforgotheading,
                        commonStyle.textCenter,
                        commonStyle.mb2,
                      ]}>
                      {clientProfileData.customerDetails.userName
                        ? clientProfileData.customerDetails.userName
                        : '-'}
                    </Text>
                    <TouchableOpacity
                      style={[commonStyle.ratingWhitebtn, commonStyle.shadow]}
                      onPress={() =>
                        navigation.navigate('ClientsProfileReviews', {
                          customerId: clientProfileData.customerDetails.id,
                          ratingData: clientProfileData.rating,
                          clientName:
                            clientProfileData.customerDetails.userName,
                        })
                      }>
                      <Text style={[commonStyle.blackText16, commonStyle.mb03]}>
                        {' '}
                        <StarIcon />{' '}
                        {Number(
                          clientProfileData.rating.avgRatingPersons,
                        ).toFixed(1)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={commonStyle.dividerlinefull} />
              {clientProfileData?.chatBlock == 0 ? (
                <View style={[commonStyle.socialShareRow, commonStyle.pt2]}>
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={() =>
                        callNumber(
                          `${clientProfileData.customerDetails.countryCode}${clientProfileData.customerDetails.phone}`,
                        )
                      }>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
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
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={() => writeMessage()}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/message-square.png')}
                        />
                      </View>
                      <Text
                        style={[commonStyle.blackTextR, commonStyle.textCenter]}
                        numberOfLines={1}>
                        Message
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : null}
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
                      : "'N/A'"}
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
                    {clientProfileData?.customerDetails?.dateOfBirth
                      ? moment(
                          clientProfileData.customerDetails.dateOfBirth,
                        ).format('LL')
                      : 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  Service{preferredServices?.length > 1 ? 's' : ''} Preferred (
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
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'stretch',
                              }}>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb05,
                                  {width: '60%'},
                                ]}
                                numberOfLines={1}>
                                {preferredServiceItem &&
                                preferredServiceItem.Service &&
                                preferredServiceItem.Service.name
                                  ? preferredServiceItem.Service.name
                                  : '-'}
                              </Text>
                              <View style={{marginTop: 3}}>
                                {preferredServiceItem?.Service?.type === 2 && (
                                  <TouchableHighlight
                                    style={[
                                      commonStyle.paidbtn,
                                      {marginLeft: 10},
                                    ]}>
                                    <Text
                                      style={[
                                        commonStyle.paidbtntext,
                                        {fontSize: 8},
                                      ]}>
                                      Group Session
                                    </Text>
                                  </TouchableHighlight>
                                )}
                              </View>
                            </View>
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
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    No Preferred Services yet
                  </Text>
                )}
              </View>

              {clientProfileData?.customerPaymentMethod?.Card?.cardType ? (
                <View style={[commonStyle.setupCardBox]}>
                  <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                    Payment methods preferred
                  </Text>
                  <View>
                    <List style={{paddingVertical: 10}}>
                      <ListItem thumbnail style={commonStyle.switchAccountView}>
                        <Left style={commonStyle.howdoseInfoCircle}>
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 1 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/amex.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 2 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/cartes_bancaires.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 3 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/diners_club.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 4 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/discover.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 5 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/jcb.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 6 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/mastercard.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 7 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/visa.png')}
                            />
                          ) : null}
                          {clientProfileData.customerPaymentMethod.Card
                            .cardType == 8 ? (
                            <Image
                              style={commonStyle.paymentmethodicon}
                              source={require('../assets/images/unionpay.png')}
                            />
                          ) : null}
                        </Left>
                        <Body style={commonStyle.switchAccountbody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            {
                              cardDictionary[
                                clientProfileData.customerPaymentMethod.Card
                                  .cardType
                              ].cardName
                            }
                          </Text>
                        </Body>
                      </ListItem>
                    </List>
                    {/* <List style={{paddingVertical: 10}}>
                            <ListItem thumbnail style={commonStyle.switchAccountView}>
                              <Left style={commonStyle.howdoseInfoCircle}>
                              <Image style={commonStyle.paymentmethodicon} source={require('../assets/images/ios.png')}/>
                              </Left>
                              <Body style={commonStyle.switchAccountbody}>
                              <Text style={[commonStyle.blackTextR, commonStyle.mb05]}>ApplePay</Text>
                              </Body>
                            </ListItem>
                        </List> */}
                  </View>
                </View>
              ) : null}

              {clientProfileData?.customerPaymentMethod?.Bank ? (
                <Text>BANK INFO NEEDS WORD</Text>
              ) : null}

              {/* {!clientProfileData?.customerPaymentMethod?.Bank &&
                !clientProfileData?.customerPaymentMethod?.Card ?
                (
                  <Text>Bank</Text>
                ) : null} */}
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
                    setVisibleModal('AddNoteModal');
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
              {clientProfileData &&
              clientProfileData.bookingDetails &&
              clientProfileData.bookingDetails.data ? (
                <>
                  <View style={[commonStyle.setupCardBox]}>
                    <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                      Bookings
                    </Text>
                    <View style={commonStyle.bookingboxRow}>
                      <View
                        style={[commonStyle.bookingboxCol, {paddingRight: 5}]}>
                        <TouchableOpacity
                          style={[commonStyle.bookingcountbox]}
                          activeOpacity={1}>
                          <View
                            style={[
                              commonStyle.bookingCirclebg,
                              {backgroundColor: '#ED5088'},
                            ]}>
                            <Text style={commonStyle.whiteText16}>
                              {clientProfileData.bookingDetails.data
                                ? clientProfileData.bookingDetails.rows
                                : 0}
                            </Text>
                          </View>
                          <Text
                            style={[
                              commonStyle.grayText14,
                              commonStyle.textCenter,
                            ]}
                            numberOfLines={1}>
                            All bookings
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={[commonStyle.bookingboxCol, {paddingLeft: 5}]}>
                        <TouchableOpacity
                          style={[commonStyle.bookingcountbox]}
                          activeOpacity={1}>
                          <View
                            style={[
                              commonStyle.bookingCirclebg,
                              {backgroundColor: '#939DAA'},
                            ]}>
                            <Text style={commonStyle.whiteText16}>
                              {clientProfileData.bookingDetails.noShow
                                ? clientProfileData.bookingDetails.noShow
                                : 0}
                            </Text>
                          </View>
                          <Text
                            style={[
                              commonStyle.grayText14,
                              commonStyle.textCenter,
                            ]}
                            numberOfLines={1}>
                            No-shows
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={commonStyle.mt1}>
                      <TouchableHighlight style={commonStyle.mb2}>
                        <Text style={commonStyle.grayText16}>
                          List of bookings
                        </Text>
                      </TouchableHighlight>
                      {clientProfileData.bookingDetails.data &&
                        clientProfileData.bookingDetails.data.map(
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
                                    bookingItem.Service.ProCategory
                                      .categoryColor
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
                                  <Left
                                    style={commonStyle.bookingUserAvaterwrap}>
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
                                    style={
                                      getBookingStatusStyle(
                                        getBookingStatus(bookingItem),
                                      )
                                      // [commonStyle.bookingStatusbtn, commonStyle.completedStatusbtn]
                                    }>
                                    <Text
                                      style={commonStyle.bookingStatusbtnText}>
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
                                    {bookingItem.Service &&
                                    bookingItem.Service.name
                                      ? bookingItem.Service.name
                                      : '-'}
                                  </Text>
                                  <TouchableHighlight>
                                    <Text style={commonStyle.blackTextR}>
                                      {moment(bookingItem.date).format('ll')}
                                    </Text>
                                  </TouchableHighlight>
                                </View>
                              </List>
                            </TouchableOpacity>
                          ),
                        )}
                    </View>
                  </View>
                  {!disableLoadMore ? (
                    <View style={commonStyle.footerwrap}>
                      <View style={[commonStyle.footerbtn]}>
                        <Button
                          title="Load More"
                          onPress={loadMoreHandler}
                          disabled={disableLoadMore}
                          containerStyle={
                            commonStyle.buttoncontainerothersStyle
                          }
                          buttonStyle={commonStyle.commonbuttonStyle}
                          titleStyle={commonStyle.buttontitleStyle}
                          disabledStyle={commonStyle.commondisabledbuttonStyle}
                        />
                      </View>
                    </View>
                  ) : null}
                </>
              ) : (
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  No Booking History
                </Text>
              )}
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
            {clientProfileData?.chatBlock == 0 ? (
              <TouchableOpacity
                style={[
                  commonStyle.searchBarText,
                  {
                    borderBottomWidth: 1,
                    borderBottomColor: '#dcdcdc',
                    padding: 12,
                  },
                ]}
                onPress={() => writeMessage()}>
                <TouchableHighlight style={commonStyle.haederback}>
                  <Image
                    style={commonStyle.paymentmethodicon}
                    source={require('../assets/images/mail.png')}
                  />
                </TouchableHighlight>
                <Text style={commonStyle.blackTextR}>Write a message</Text>
              </TouchableOpacity>
            ) : null}
            {clientProfileData?.chatBlock == 0 ? (
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
            ) : null}

            <TouchableOpacity
              style={[commonStyle.searchBarText, {padding: 12}]}
              onPress={() => clientBlockToggle()}>
              <TouchableHighlight style={commonStyle.haederback}>
                <Image
                  style={commonStyle.paymentmethodicon}
                  source={require('../assets/images/block-time-img.png')}
                />
              </TouchableHighlight>
              <Text style={commonStyle.blackTextR}>
                {clientProfileData && clientProfileData.chatBlock === 1
                  ? 'Unblock Client'
                  : 'Block Client'}
              </Text>
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

      {/* Clients Add note modal start */}
      <Modal
        isVisible={visibleModal === 'AddNoteModal'}
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
      {/* Clients Add note modal End */}
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
      {/* Clients Edit note modal end */}
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
    </Fragment>
  );
};

export default ClientsProfile;
