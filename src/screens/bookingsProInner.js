import {format} from 'date-fns';
import moment from 'moment';
import {Body, Container, Left, List, ListItem} from 'native-base';
import React, {Fragment, useEffect, useRef, useState, useCallback} from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';
import {Button} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import RNModal from 'react-native-modal';
import {TextInput} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {Get, mainAPI, Post, Put} from '../api/apiAgent';
import commonStyle, {Colors} from '../assets/css/mainStyle';
// import defaultImage from '../assets/images/default.png';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {useFocusEffect} from '@react-navigation/native';
import {
  CloseIcon,
  EditIcon,
  LeftArrowAndroid,
  LeftArrowIos,
  RightAngle,
  StarIcon,
} from '../components/icons';
import {
  BookingProGroupListClientModal,
  BookingProSelectClientMessageModal,
  BookingRescheduleCalenderModal,
} from '../components/modal';
import BookingNotesModal from '../components/modal/BookingNotesModal';
import GroupBookingPaidInCashModal from '../components/modal/GroupBookingPaidInCashModal';
import {
  proBookingCancelRequest,
  proBookingCancelRequestClear,
  proBookingCompleteRequest,
  proBookingCompleteRequestClear,
  proBookingInnerRequest,
  proBookingInnerRequestClear,
  proBookingNoShowRequest,
  proBookingNoShowRequestClear,
  userbookingRescheduleRequest,
  userbookingRescheduleRequestClear,
} from '../store/actions/bookingAction';
import {fromtoToService, preDepositAmount} from '../utility/booking';
import {timeConversion} from '../utility/commonService';
import GroupBookingClientsModal from '../components/modal/GroupBookingClientsModal';
import RNBackgroundDownloader from 'react-native-background-downloader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageView from 'react-native-image-viewing';
import ExtraChargesModal from '../components/modal/ExtraChargesModal';
import circleWarningImg from '../assets/images/circle-msg-icon.png';
import {fetchGracePeriodData} from '../utility/fetchGracePeriodData';

const {width, height} = Dimensions.get('window');

const bookingsProInner = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const [visibleModal, setVisibleModal] = useState(false);
  const [scrollOffset, setScrollOffset] = useState();
  const [bookingId, setBookingId] = useState(null);
  const [clientReview, setClientReview] = useState(null);
  const [clientRating, setClientRating] = useState(null);
  const [profReview, setProfReview] = useState(null);
  const [profRating, setProfRating] = useState(null);
  const [displayOrderId, setDisplayOrderId] = useState(null);
  const [exportingText, setExportingText] = useState('Export PDF invoice');
  const {orderDisplayId, rowId} = route.params;
  const [sessionUserList, setUserList] = useState([]);
  const [preBookingAmount, setPreBookingAmount] = useState('');
  const [noteEditId, setNoteEditId] = useState(null);
  const [noteEditText, setNoteEditText] = useState(null);
  const [notesData, setNotesData] = useState([]);
  const [seatCount, setSeatCount] = useState(0);
  const [selectedNoteId, setSelectedNoteId] = useState('');
  const [keyboardStatus, setKeyboardStatus] = useState(0);

  const bookingData = useSelector(
    (state) => state.bookingReducer.profBookingInnerDetails,
  );
  const bookingCancelData = useSelector(
    (state) => state.bookingReducer.proBookingCalcelDetails,
  );
  const bookingNoShowData = useSelector(
    (state) => state.bookingReducer.proBookingNoShowDetails,
  );
  const bookingCompleteData = useSelector(
    (state) => state.bookingReducer.proBookingCompleteDetails,
  );
  const bookingRescheduleData = useSelector(
    (state) => state.bookingReducer.userBookingRescheduleDetails,
  );
  const [bookingState, setBookingState] = useState(null);
  const [loading, setLoading] = useState(false);
  const loderStatus = useSelector((state) => state.bookingReducer.loader);
  const scrollViewRef = useRef(0);

  const [imgViewerData, setImgViewerData] = useState(null);
  const [imgViewerCurrentIndex, setImgViewerCurrentIndex] = useState(null);
  const [visible, setIsVisible] = useState(false);

  // CR Start
  const [extraChargeTitle, setExtraChargeTitle] = useState('');
  const [extraChargeAmount, setExtraChargeAmount] = useState('');
  const [extraChargeDescription, setExtraChargeDescription] = useState('');

  const [successModal, setSuccessModal] = useState(null);

  const [subscriptionPlanStatus, setSubscriptionPlanStatus] = useState(null);
  const [graceExpirationDate, setGraceExpirationDate] = useState(null);

  const [extraChargeErrors, setExtraChargeErrors] = useState({
    title: {
      status: false,
      message: 'Please enter Extra charge title.',
    },
    amount: {
      status: false,
      message: 'Please enter Extra charge amount.',
    },
  });

  const [extraChargesListOngoing, setExtraChargesListOngoing] = useState(null);
  const [extraChargesListCompleted, setExtraChargesListCompleted] =
    useState(null);

  // CR End

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        goBack();
        return true;
      },
    );
    return () => backHandlerdata.remove();
  }, [dispatch]);

  const goBack = () => {
    if (!!route.params.fromNotificationList) {
      console.log('From Notification');
      navigation.goBack();
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } else {
      console.log('From Bookings');
      navigation.navigate('Bookings');
    }
    dispatch(proBookingInnerRequestClear());
  };

  //  This function will call once
  useEffect(() => {
    if (rowId) {
      dispatch(proBookingInnerRequest({pageId: rowId}));
    } else {
      dispatch(proBookingInnerRequest({orderDisplayId}));
    }
    if (Platform.OS !== 'ios') {
      permission();
    }
  }, []);

  // Refresh by event emitter
  useEffect(() => {
    EventEmitter.on('refreshPage', () => {
      if (rowId) {
        dispatch(proBookingInnerRequest({pageId: rowId}));
      } else {
        dispatch(proBookingInnerRequest({orderDisplayId}));
      }
      if (Platform.OS !== 'ios') {
        permission();
      }
    });
  }, []);

  useEffect(() => {
    determineGracePeriodStatus();
  }, []);

  const determineGracePeriodStatus = async () => {
    // 0 = pla active, 1 = everything expired (main plan + grace), 2 = in grace period
    const response = await fetchGracePeriodData();
    console.log('statusss: ', response);
    if (response.subscriptionStatus === 1) {
      setSubscriptionPlanStatus(1);
    } else if (
      response.subscriptionStatus === 2 &&
      response?.gracePeriodExpiryDate
    ) {
      setSubscriptionPlanStatus(2);
      setGraceExpirationDate(response.gracePeriodExpiryDate);
    } else {
      setSubscriptionPlanStatus(0);
    }
  };

  useEffect(() => {
    if (bookingData?.data?.extraChargesOfBooking) {
      let ongoingList = bookingData.data.extraChargesOfBooking.filter((item) =>
        item.status == 0 || item.status == 1 ? item : null,
      );
      let completedList = bookingData.data.extraChargesOfBooking.filter(
        (item) => (item.status == 3 || item.status == 4 ? item : null),
      );

      setExtraChargesListOngoing(ongoingList);
      setExtraChargesListCompleted(completedList);
    }

    console.log('bookingData is ****', JSON.stringify(bookingData));
  }, [bookingData]);

  // This function is to get the permission
  const permission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Given');
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.log('error : ', err);
    }
  };

  // This method is to get the invoice data
  const exportInvoice = () => {
    if (bookingData?.data?.Service?.type == 2) {
      Get(
        `/pro/group-booking-invoice?sessionId=${bookingData?.data?.groupSessionId}`,
      )
        .then((result) => {
          if (result.status === 200) {
            setExportingText('Exporting...');
            let pdfURL = result.data;

            if (Platform.OS == 'android') {
              const dirs =
                Platform.OS == 'ios'
                  ? RNFetchBlob.fs.dirs.DocumentDir
                  : RNFetchBlob.fs.dirs.DownloadDir;
              console.log('dirs', dirs);

              // Configuration
              let configObj = {
                fileCache: true,
                path: Platform.OS == 'ios' ? dirs + `/invoice.pdf` : `${dirs}`,
              };

              if (Platform.OS != 'ios') {
                configObj['addAndroidDownloads'] = {
                  useDownloadManager: true,
                  notification: true,
                  path: `${dirs}/invoiceData-${format(
                    Date.now(),
                    'yyyy-MM-dd-hh-mm-ss',
                  )}.pdf`,
                };
              }

              RNFetchBlob.config(configObj)
                .fetch('GET', pdfURL, {})
                .then((res) => {
                  console.log('The file saved to ', res.path());
                  setExportingText('Export PDF invoice');
                  if (res.path()) {
                    global.showToast('PDF downloaded successfully', 'success');
                  }
                  if (Platform.OS === 'ios') {
                    RNFetchBlob.ios.openDocument(res.data);
                  }
                })
                .catch((e) => {
                  global.showToast(
                    'Something went wrong, please try after some times',
                    'error',
                  );
                  console.trace(e);
                  setExportingText('Export PDF invoice');
                });
            } else {
              let task = RNBackgroundDownloader.download({
                id: 'file123',
                url: pdfURL,
                destination: `${RNBackgroundDownloader.directories.documents}/invoice.pdf`,
              })
                .begin((expectedBytes) => {
                  console.log(`Going to download ${expectedBytes} bytes!`);
                })
                .progress((percent) => {
                  console.log(`Downloaded: ${percent * 100}%`);
                })
                .done(() => {
                  RNFetchBlob.ios.openDocument(
                    `${RNBackgroundDownloader.directories.documents}/invoice.pdf`,
                  );
                  console.log('Download is done!');
                  global.showToast('PDF downloaded successfully', 'success');
                  setExportingText('Export PDF invoice');
                })
                .error((error) => {
                  global.showToast(
                    'Something went wrong, please try after some times',
                    'error',
                  );
                  console.log('Download canceled due to error: ', error);
                  setExportingText('Export PDF invoice');
                });
            }
          } else {
            global.showToast(
              'Something went wrong, please try after some times',
              'error',
            );
            setExportingText('Export PDF invoice');
          }
        })
        .catch((error) => {
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
          setExportingText('Export PDF invoice');
        });
    } else {
      Get(
        `/pro/booking-invoice?bookingId=${bookingData?.data?.id}&invoiceType=1`,
      )
        .then((result) => {
          if (result.status === 200) {
            setExportingText('Exporting...');
            let pdfURL = result.data;

            // Initialize directry
            const dirs =
              Platform.OS == 'ios'
                ? RNFetchBlob.fs.dirs.DocumentDir
                : RNFetchBlob.fs.dirs.DownloadDir;
            console.log('dirs', dirs);
            // Configuration
            let configObj = {
              fileCache: true,
              path: Platform.OS == 'ios' ? dirs + `/invoice.pdf` : `${dirs}`,
              // addAndroidDownloads: {
              //   useDownloadManager: true,
              //   notification: true,
              //   path: `${dirs}/invoiceData-${format(
              //     Date.now(),
              //     'yyyy-MM-dd-hh-mm-ss',
              //   )}.pdf`,
              // },
            };

            if (Platform.OS != 'ios') {
              configObj['addAndroidDownloads'] = {
                useDownloadManager: true,
                notification: true,
                path: `${dirs}/invoiceData-${format(
                  Date.now(),
                  'yyyy-MM-dd-hh-mm-ss',
                )}.pdf`,
              };
            }
            RNFetchBlob.config(configObj)
              .fetch('GET', pdfURL, {})
              .then((res) => {
                console.log('The file saved to ', res.path());
                // let status = res.info().status;
                setExportingText('Export PDF invoice');
                if (res.path()) {
                  global.showToast('PDF downloaded successfully', 'success');
                }
                if (Platform.OS === 'ios') {
                  RNFetchBlob.ios.openDocument(res.data);
                }
              })
              .catch((e) => {
                global.showToast(
                  'Something went wrong, please try after some times',
                  'error',
                );
                console.trace(e);
                setExportingText('Export PDF invoice');
              });
          }
        })
        .catch((error) => {
          console.trace(error);
          global.showToast(
            'Something went wrong, please try after some times',
            'error',
          );
          setExportingText('Export PDF invoice');
        });
    }
  };

  // This function is for handle the response
  useEffect(() => {
    if (bookingData !== null && bookingData.status == 200) {
      if (bookingData?.data?.Service?.type == 2) {
        Get(`pro/group-session/${bookingData.data.groupSessionId}`)
          .then(({data}) => {
            console.log('Group Booking Data', data);
            if (!!data?.groupSession?.notes) {
              setNotesData(JSON.parse(data?.groupSession?.notes));
            }
            setSeatCount(data?.groupSession?.service?.noOfSeat);
            setUserList(data.userDetails);
          })
          .catch((error) => {
            console.log('error', error);
          });
      } else {
        console.log('booking data:', bookingData.data);
        if (bookingData?.data?.note) {
          setNotesData(JSON.parse(bookingData?.data?.note));
        }
      }

      setBookingId(bookingData?.data?.reservationDisplayId);

      // Start Change: Snehasish Das, Issue #1494
      if (!!bookingData?.data?.ReservedServiceMeta) {
        setPreBookingAmount(
          preDepositAmount(bookingData?.data?.ReservedServiceMeta, +getTotal()),
        );
      }
      // End Change: Snehasish Das, Issue #1494

      if (bookingData?.data?.orderDisplayId) {
        setDisplayOrderId(bookingData?.data?.orderDisplayId);
      }
      dispatch(proBookingInnerRequestClear());

      bookingData?.data?.reviewRating?.proReviews.forEach((review) => {
        if (review.commentedBy === 1) {
          let clientObj = {
            name: review.customer?.userName,
            image: review.customer?.profileImage,
            created_at: moment(`${review.createdAt}`).format('MMM DD, YYYY'),
            service: bookingData?.data?.Service?.name,
            content: review.content,
          };
          setClientReview(clientObj);
        } else {
          let proObj = {
            name: review.pro?.userName,
            image: review.pro?.coverImage,
            created_at: moment(`${review.createdAt}`).format('MMM DD, YYYY'),
            service: bookingData?.data?.Service?.name,
            content: review.content,
          };
          setProfReview(proObj);
        }
      });
    } else if (bookingData && bookingData.status != 200) {
      if (
        !!bookingData?.response?.data?.message &&
        bookingData?.response?.data?.message !== null &&
        bookingData?.response?.data?.message !== ''
      ) {
        global.showToast(bookingData?.response?.data?.message, 'error');
        dispatch(proBookingInnerRequestClear());
      }
    }
  }, [bookingData]);

  // This function is for handle the response of cancel booking
  useEffect(() => {
    if (bookingCancelData !== null && bookingCancelData.status == 200) {
      dispatch(proBookingCancelRequestClear());
      global.showToast(bookingCancelData.message, 'success');
      dispatch(
        proBookingInnerRequest({pageId: rowId ? rowId : orderDisplayId}),
      );
      setTimeout(() => {
        // navigation.navigate('Bookings');
      }, 1000);
    } else if (bookingCancelData && bookingCancelData.status != 200) {
      if (
        bookingCancelData.response.data.message !== null &&
        bookingCancelData.response.data.message !== ''
      ) {
        global.showToast(bookingCancelData.response.data.message, 'error');
        dispatch(proBookingCancelRequestClear());
      }
    }
  }, [bookingCancelData]);

  useEffect(() => {
    if (bookingRescheduleData !== null && bookingRescheduleData.status == 200) {
      dispatch(userbookingRescheduleRequestClear());
    } else if (bookingRescheduleData && bookingRescheduleData.status != 200) {
      dispatch(userbookingRescheduleRequestClear());
    }
  }, [bookingRescheduleData]);

  // This function is for handle the response of no show booking
  useEffect(() => {
    if (bookingNoShowData !== null && bookingNoShowData.status == 200) {
      dispatch(proBookingNoShowRequestClear());
      global.showToast(bookingNoShowData.message, 'success');
      dispatch(
        proBookingInnerRequest({pageId: rowId ? rowId : orderDisplayId}),
      );
      setTimeout(() => {
        // navigation.navigate('Bookings');
      }, 1000);
    } else if (bookingNoShowData && bookingNoShowData.status != 200) {
      if (
        bookingNoShowData.response.data.message !== null &&
        bookingNoShowData.response.data.message !== ''
      ) {
        global.showToast(bookingNoShowData.response.data.message, 'error');
        dispatch(proBookingNoShowRequestClear());
      }
    }
  }, [bookingNoShowData]);

  // This function is for handle the response of complete booking
  useEffect(() => {
    console.log('bookingstate', bookingCompleteData);

    if (bookingCompleteData !== null && bookingCompleteData.status == 200) {
      setBookingState('completed');
      setTimeout(() => {
        dispatch(
          proBookingInnerRequest({pageId: rowId ? rowId : orderDisplayId}),
        );
      }, 2000);
      dispatch(proBookingCompleteRequestClear());
      global.showToast(bookingCompleteData.message, 'success');
    } else if (bookingCompleteData && bookingCompleteData.status != 200) {
      console.log('booking state', bookingCompleteData.response.data);
      global.showToast(bookingCompleteData.response.data.message, 'error');
      if (bookingCompleteData.response.data.status !== 403) {
        setBookingState('payInCash');
      }
      dispatch(proBookingCompleteRequestClear());
    }
  }, [bookingCompleteData]);

  // This method is to get the time format
  const timeFormat = (date, time) => {
    if (!!date && !!time) {
      let dateFormat;
      if (date == moment().format('YYYY-MM-DD')) {
        dateFormat = moment(`${date}T${time}.000Z`).format(
          'DD MMM YYYY [at] hh:mm a',
        );
        dateFormat = `Today` + `, ${dateFormat}`;
      } else {
        dateFormat = moment(`${date}T${time}.000Z`).format(
          'dddd, DD MMM YYYY [at] hh:mm a',
        );
      }
      console.log('date is ******', date, moment().format('YYYY-MM-DD'));
      return dateFormat;
    }
  };

  // This method is to cancel the booking
  const cancelBooking = () => {
    setVisibleModal({visibleModal: null});
    if (bookingId !== null) {
      if (bookingData?.data?.Service?.type == 2) {
        setLoading(true);
        Post(
          `/pro/group-booking-cancel/${bookingData?.data?.groupSessionId}`,
          null,
        )
          .then((response) => {
            global.showToast(
              response?.message
                ? response?.message
                : 'Group session cancelled successfully',
              'success',
            );
            dispatch(
              proBookingInnerRequest({pageId: rowId ? rowId : orderDisplayId}),
            );
            setLoading(false);
          })
          .catch((error) => {
            global.showToast(
              error?.response?.data?.message
                ? error?.response?.data?.message
                : 'Something went wrong',
              'error',
            );
            setLoading(false);
          });
      } else {
        let dataObj = {
          reservationId: bookingData?.data?.id,
        };
        dispatch(proBookingCancelRequest(dataObj));
      }
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // This method is to cancel the booking
  const noShowBooking = () => {
    setVisibleModal({visibleModal: null});
    if (bookingId !== null) {
      let dataObj = {
        reservationId: bookingData?.data?.id?.toString(),
      };
      dispatch(proBookingNoShowRequest(dataObj));
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // navigation.navigate('Bookings')

  // This method is to complete the booking confimation
  const markAsCompleteConfirmation = () => {
    if (
      bookingData?.data?.Service?.type == 2 &&
      bookingData?.data?.isPaymentFailed == 1
    ) {
      setVisibleModal('GroupBookingPaidInCash');
    } else {
      let msg = 'Are you sure, the order is completed?';
      Alert.alert(
        '',
        msg,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cencel pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => orderCompleted()},
        ],
        {cancelable: false},
      );
    }
  };

  const onMessage = (params) => {
    setVisibleModal({visibleModal: null});
    console.log('params', {
      reservationId: params.reservationId,
      clientId: params.clientId,
    });
    mainAPI({
      url: '/user/ask',
      data: {
        reservationId: params.reservationId,
        clientId: params.clientId,
      },
      methodType: 'post',
    })
      .then(({data}) => {
        navigation.navigate('Inbox');
        setTimeout(() => {
          navigation.navigate('Inbox', {
            screen: 'InboxInner',
            params: {
              fromBookings: true,
              userType: params.userType,
              channelId: data?.channelId,
              loginId: params.loginId,
              channelDetails: params.channelDetails,
              isSession: true,
            },
          });
        }, 100);
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
        global.showToast(
          !!error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Something went wrong',
          'error',
        );
      });
  };

  const onMessageCTAClick = async () => {
    if (bookingData?.data?.Service?.type == 2) {
      setVisibleModal('BookingsProWriteMessageDialog');
    } else {
      setLoading(true);
      const loginId = await AsyncStorage.getItem('userId');
      console.log(
        console.log('params', {
          reservationId: bookingData?.data?.reservationDisplayId,
          clientId: bookingData?.data?.customerId?.toString(),
        }),
      );
      mainAPI({
        url: '/user/ask',
        data: {
          reservationId: bookingData?.data?.reservationDisplayId,
          clientId: bookingData?.data?.customerId?.toString(),
        },
        methodType: 'post',
      })
        .then(({data}) => {
          setLoading(false);
          navigation.navigate('Inbox');
          setTimeout(() => {
            navigation.navigate('Inbox', {
              screen: 'InboxInner',
              params: {
                fromBookings: true,
                userType: '1',
                channelId: data?.channelId,
                loginId: loginId,
                channelDetails: {
                  User: bookingData?.data?.customer,
                  customerId: bookingData?.data?.customerId,
                },
              },
            });
          }, 100);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error?.response?.data?.message);
          global.showToast(
            !!error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Something went wrong',
            'error',
          );
        });
    }
  };

  // This method is to completed the booking
  const orderCompleted = () => {
    if (bookingId !== null) {
      if (bookingData?.data?.Service?.type == 2) {
        setLoading(true);
        Post(`/pro/complete-group-booking`, {
          groupSessionId: bookingData?.data?.groupSessionId,
        })
          .then((response) => {
            console.log(response);
            if (response?.status == 200) {
              if (
                !!response?.data?.failedOrders &&
                response?.data?.failedOrders.length > 0
              ) {
                setBookingState('payInCash');
                global.showToast(
                  'There was a problem with the payment method of a few clients.',
                  'error',
                );
              } else {
                setBookingState('completed');
                global.showToast(response?.message, 'success');
              }
              dispatch(
                proBookingInnerRequest({
                  pageId: rowId ? rowId : orderDisplayId,
                }),
              );
            } else if (response?.status == 500) {
              setBookingState('payInCash');
              global.showToast(response?.message, 'error');
              dispatch(
                proBookingInnerRequest({
                  pageId: rowId ? rowId : orderDisplayId,
                }),
              );
            } else {
              global.showToast(
                'Something went wrong, please try after some time',
                'error',
              );
            }
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            if (error?.response?.data?.status == 500) {
              setBookingState('payInCash');
              global.showToast(error?.response?.data?.message, 'error');
              dispatch(
                proBookingInnerRequest({
                  pageId: rowId ? rowId : orderDisplayId,
                }),
              );
            } else {
              global.showToast(
                'Something went wrong, please try after some time',
                'error',
              );
            }
            setLoading(false);
          });
      } else {
        let dataObj = {
          reservationId: bookingData?.data?.id?.toString(),
        };
        dispatch(proBookingCompleteRequest(dataObj));
      }
    } else {
      global.showToast(
        'Error',
        'error',
        'bottom',
        'Something went wrong, please try after some times',
      );
    }
  };

  const leaveReview = () => {
    console.log('Leave a Review');
    navigation.navigate('BookingsPreviousInnerLeaveReview', {
      userType: 'pro',
      bookingData: bookingData?.data,
      sessionUserList: sessionUserList,
    });
  };

  const onApplyReschedule = (selectedStartDate, selectedStartTime) => {
    setVisibleModal({visibleModal: null});
    let selectedDate = moment(
      `${selectedStartDate} ${selectedStartTime}`,
      'YYYY-MM-DD HH:mm:ss',
    ).utc();
    if (subscriptionPlanStatus === 2 && graceExpirationDate) {
      if (new Date(selectedDate) > new Date(graceExpirationDate)) {
        Alert.alert("Can't reschedule after expiry of pro's grace period");
        return;
      }
    }

    dispatch(
      userbookingRescheduleRequest({
        reservationId: bookingData?.data?.id?.toString(),
        date: selectedDate.format('YYYY-MM-DD'),
        time: selectedDate.format('HH:mm:ss'),
        type: 'pro',
        reservationDisplayId: bookingData?.data?.reservationDisplayId,
      }),
    );
    setTimeout(() => {
      dispatch(
        proBookingInnerRequest({pageId: rowId ? rowId : orderDisplayId}),
      );
    });
  };

  //Start Change: Snehasish Das, Issue #1714
  const noShowCTAClicked = () => {
    if (moment().isBefore(bookingData?.data?.noShowStartingTime)) {
      let toleranceTime = moment(bookingData?.data?.noShowStartingTime).diff(
        moment(
          bookingData?.data?.date + 'T' + bookingData?.data?.time + '.000Z',
        ),
        'minute',
      );
      global.showToast(
        `You cannot mark a booking as ‘No show’ before Tolerance time (${toleranceTime} minutes) ends`,
        'error',
      );
    } else {
      setVisibleModal('BookingNoShowDialog');
    }
  };
  //End Change: Snehasish Das, Issue #1714

  const onPaidConfirm = (user) => {
    console.log(user);
    setLoading(true);
    Post('/pro/complete-booking', {
      reservationId: user?.reservation?.id.toString(),
    })
      .then((response) => {
        setBookingState(null);
        dispatch(
          proBookingInnerRequest({
            pageId: rowId ? rowId : orderDisplayId,
          }),
        );
        Get(`pro/group-session/${bookingData.data.groupSessionId}`)
          .then(({data}) => {
            console.log('data', data);
            setUserList(data.userDetails);
          })
          .catch((error) => {
            console.log('error', error);
          });
        setVisibleModal(null);
        global.showToast('Reservation completed successfully', 'success');
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setVisibleModal(null);
        global.showToast(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Something went wrong',
          'error',
        );
        setLoading(false);
      });
  };

  const constructNotesData = () => {
    //editing note
    if (!!noteEditId || noteEditId == 0) {
      //noteEditId is the index of the note to be edited
      let notesDataLocal = JSON.parse(JSON.stringify(notesData));
      notesDataLocal.splice(noteEditId, 1, noteEditText);
      updateNotes(notesDataLocal);
    }
    // adding new note
    else {
      updateNotes([...notesData, noteEditText]);
    }
  };

  const deleteNoteData = (noteId = selectedNoteId, type = 'afterConfirm') => {
    if (type == 'beforeConfirm') {
      setSelectedNoteId(noteId);
      setVisibleModal('DeleteNoteModal');
      return false;
    }
    //  noteId is index
    let notesDataLocal = JSON.parse(JSON.stringify(notesData));
    notesDataLocal.splice(noteId, 1);
    updateNotes(notesDataLocal);
    setVisibleModal('');
  };

  const updateNotes = async (notes) => {
    setLoading(true);
    if (bookingData?.data?.Service?.type == 2) {
      try {
        await Put('/pro/group-session-note/', {
          notes: JSON.stringify(notes),
          sessionId: bookingData.data.groupSessionId,
        });
        setNoteEditId(null);
        setNoteEditText(null);
        setNotesData(notes);
        global.showToast('Notes updated successfully', 'success');
      } catch (error) {
        console.log(error);
        global.showToast('Something went wrong', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        await Put('/pro/booking-add-note/', {
          notes: JSON.stringify(notes),
          reservationId: bookingData.data.id,
        });
        setNoteEditId(null);
        setNoteEditText(null);
        setNotesData(notes);
        global.showToast('Notes updated successfully', 'success');
      } catch (error) {
        console.log(error);
        global.showToast('Something went wrong', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  const navigateToClientPage = (id) => {
    console.log('Redirecting to Client: ', id);
    navigation.navigate('Analytics');
    setTimeout(() => {
      navigation.navigate('ClientsProfile', {
        clientId: id,
        fromBookingsProInner: true,
        orderDisplayId: orderDisplayId,
        rowId: rowId,
      });
    }, 10);
  };

  const reviewImagePressHandler = (ProResources, imgIndex) => {
    console.log('pressed');
    console.log(ProResources);
    const imgUrls = ProResources.map((item) => {
      if (item.resourceType == 'image') return {uri: item.url};
    });
    setImgViewerData(imgUrls);
    setImgViewerCurrentIndex(imgIndex);
    setIsVisible(true);
  };

  const getTotal = () => {
    if (!!bookingData) {
      if (!!orderDisplayId) {
        const amount = bookingData?.data?.reservations?.reduce(
          (acc, res) => acc + parseFloat(res?.amount),
          0,
        );
        const tax = bookingData?.data?.reservations?.reduce(
          (acc, res) => acc + parseFloat(!!res?.tax ? res?.tax : 0),
          0,
        );
        return (amount + tax).toFixed(2);
      } else if (bookingData?.data?.Service?.type == 2) {
        return !!bookingData?.data?.amount
          ? (
              (+bookingData?.data?.amount +
                (!!bookingData?.data?.tax ? +bookingData?.data?.tax : 0)) *
              +sessionUserList?.length
            ).toFixed(2)
          : '0.00';
      } else {
        let extraCharges = extraChargesListCompleted?.length
          ? extraChargesListCompleted?.reduce(
              (acc, res) => acc + Number(res.amount),
              0,
            )
          : 0;
        return !!bookingData?.data?.amount
          ? (
              +bookingData?.data?.amount +
              (!!bookingData?.data?.tax ? +bookingData?.data?.tax : 0) +
              extraCharges
            ).toFixed(2)
          : '0.00';
      }
    } else {
      return '0.00';
    }
  };

  const getTaxAmount = () => {
    if (!!bookingData) {
      if (!!orderDisplayId) {
        const tax = bookingData?.data?.reservations
          ?.reduce((acc, res) => acc + parseFloat(!!res?.tax ? res?.tax : 0), 0)
          .toFixed(2);
        return tax;
      } else if (bookingData?.data?.Service?.type == 2) {
        return (
          (!!bookingData?.data?.tax ? +bookingData?.data?.tax : 0) *
          +sessionUserList?.length
        ).toFixed(2);
      } else {
        return (!!bookingData?.data?.tax ? +bookingData?.data?.tax : 0).toFixed(
          2,
        );
      }
    } else {
      return '0.00';
    }
  };

  const onExtraChargeModsetVisibleModalalClose = () => {
    setVisibleModal(null);
    setExtraChargeTitle('');
    setExtraChargeAmount('');
    setExtraChargeDescription('');
  };

  // useEffect(() => { console.log('booking data: ', bookingData) }, [bookingData])

  const onApplyExtraChargeHandler = () => {
    // only if regular booking, andin 'ongoing' state
    if (
      bookingData?.data?.Service?.type == 1 &&
      bookingData?.data?.status == 2 &&
      bookingData?.data?.isConfirmed == 1 &&
      bookingData?.data?.isCanceled == 0
    ) {
      if (extraChargeTitle?.length && extraChargeAmount?.length) {
        Post('pro/booking-extra-charges', {
          reservationId: bookingData?.data?.id,
          title: extraChargeTitle,
          amount: extraChargeAmount,
          description: extraChargeDescription ? extraChargeDescription : '',
          currency: 'USD',
        })
          .then((response) => {
            if (response.status == 200) {
              onExtraChargeModsetVisibleModalalClose();
              setSuccessModal(true);
              setTimeout(() => setSuccessModal(false), 2500);
            }
          })
          .catch((err) => {
            console.log({err});
            onExtraChargeModsetVisibleModalalClose();
            global.showToast('Something went wrong.', 'error');
          });
      } else {
        setExtraChargeErrors((prevState) => ({
          title: {
            ...prevState.title,
            status: !extraChargeTitle?.length,
          },
          amount: {
            ...prevState.amount,
            status: !extraChargeAmount?.length,
          },
          // description: {
          //   ...prevState.description,
          //   status: !extraChargeDescription?.length
          // },
        }));
      }
    }
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus || loading ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          animated={true}
          showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          onScroll={handleOnScroll}
          enableAutomaticScroll={Platform.OS === 'android'}
          keyboardShouldPersistTaps="handled">
          <View
            style={[
              commonStyle.skipHeaderWrap,
              {
                alignItems: 'flex-start',
                alignSelf: 'flex-start',
                justifyContent: 'flex-start',
              },
            ]}>
            <View>
              <TouchableOpacity
                style={commonStyle.haederArrowback}
                onPress={() => {
                  goBack();
                }}>
                {Platform.OS === 'ios' ? (
                  <LeftArrowIos />
                ) : (
                  <LeftArrowAndroid />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={[commonStyle.bookingInnerbox, commonStyle.mt05]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              {bookingData !== null && rowId
                ? timeFormat(bookingData?.data?.date, bookingData?.data?.time)
                : null}
              {bookingData &&
                orderDisplayId &&
                timeFormat(
                  bookingData?.data?.reservations?.[0]?.date,
                  bookingData?.data?.reservations?.[0]?.time,
                )}
            </Text>
            <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
              {bookingData !== null &&
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 &&
              bookingData?.data?.status == 1 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.confirmStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>
                    Confirmed
                  </Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.isCanceled == 1 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.cancelledStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>
                    Cancelled
                  </Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 1 &&
              bookingData?.data?.isConfirmed == 0 &&
              bookingData?.data?.isCanceled == 0 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.noshowStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>Pending</Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 2 &&
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.ongoingStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>Ongoing</Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 3 &&
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.completedStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>
                    Completed
                  </Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 4 &&
              bookingData?.data?.isCanceled == 0 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.noshowStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>No show</Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 5 &&
              bookingData?.data?.isCanceled == 0 &&
              bookingData?.data?.isConfirmed == 1 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.noshowStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>
                    Cash not recieved
                  </Text>
                </TouchableHighlight>
              ) : null}

              {bookingData?.data?.status == 6 &&
              bookingData?.data?.isCanceled == 0 &&
              bookingData?.data?.isConfirmed == 1 ? (
                <TouchableHighlight
                  style={[
                    commonStyle.bookingStatusbtn,
                    commonStyle.noshowStatusbtn,
                  ]}>
                  <Text style={commonStyle.bookingStatusbtnText}>
                    Incomplete
                  </Text>
                </TouchableHighlight>
              ) : null}
            </View>
            <View>
              {bookingData !== null ? (
                <List
                  style={[commonStyle.bookingInnerUser, {paddingVertical: 0}]}>
                  <ListItem
                    thumbnail
                    style={[
                      {
                        ...commonStyle.switchAccountView,
                        justifyContent:
                          bookingData.data?.Service?.type !== 2
                            ? 'space-between'
                            : 'flex-start',
                      },
                      {marginTop: 20, marginBottom: 20},
                    ]}
                    onPress={() =>
                      bookingData?.data?.Service?.type != 2
                        ? navigateToClientPage(bookingData?.data?.customer?.id)
                        : setVisibleModal('GroupBookingClients')
                    }>
                    {bookingData?.data?.Service?.type != 2 ? (
                      <Left style={commonStyle.favoritesUserAvaterwrap}>
                        <Image
                          style={commonStyle.favoritesUserAvaterImg}
                          //Start Change: Snehasish Das, Issue #1734
                          defaultSource={require('../assets/images/default-user.png')}
                          source={
                            !!bookingData?.data?.customer?.profileImage
                              ? {
                                  uri: bookingData?.data?.customer
                                    ?.profileImage,
                                }
                              : require('../assets/images/default-user.png')
                          }
                          //End Change: Snehasish Das, Issue #1734
                        />
                      </Left>
                    ) : (
                      sessionUserList.map((user, index) => (
                        <Left
                          key={index}
                          style={{
                            ...commonStyle.favoritesUserAvaterwrap,
                            marginLeft: -8,
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
                      ))
                    )}
                    {bookingData?.data?.Service?.type !== 2 && (
                      <Body style={commonStyle.switchAccountbody}>
                        <View
                          style={[commonStyle.searchBarText, commonStyle.mb03]}>
                          <Text
                            style={[commonStyle.blackTextR, {marginRight: 4}]}>
                            {orderDisplayId
                              ? bookingData?.data?.clientName
                              : bookingData?.data?.customer?.userName}{' '}
                          </Text>
                          {/* <Text style={[commonStyle.dotSmall, {opacity: 0.4}]}>.</Text> */}
                          {/* <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>Walk-in</Text> */}
                        </View>
                        <Text
                          style={commonStyle.categorytagsText}
                          numberOfLines={1}>
                          {bookingData?.data?.customer?.countryCode}{' '}
                          {orderDisplayId
                            ? bookingData?.data?.clientPhone
                            : bookingData?.data?.customer?.phone}
                        </Text>
                      </Body>
                    )}
                    {bookingData?.data?.Service?.type == 2 && (
                      <Body style={commonStyle.switchAccountbody}>
                        <View
                          style={[commonStyle.searchBarText, commonStyle.mb03]}>
                          <Text
                            style={[commonStyle.blackTextR, {marginRight: 4}]}>
                            · {sessionUserList.length}
                            <Text style={commonStyle.grayText16}>
                              /{seatCount}
                            </Text>
                          </Text>
                        </View>
                      </Body>
                    )}
                    <View style={{marginLeft: 10}}>
                      <RightAngle />
                    </View>
                  </ListItem>
                </List>
              ) : null}
            </View>

            {bookingData !== null ? (
              <View style={[commonStyle.socialShareRow, commonStyle.mt3]}>
                {bookingData?.data?.isCanceled !== 1 &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.status < 2 ? (
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={() => {
                        setVisibleModal('BookingCancelDialog');
                      }}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/close.png')}
                        />
                      </View>
                      <Text
                        style={[commonStyle.blackTextR, commonStyle.textCenter]}
                        numberOfLines={1}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
                {/* Start Change: Snehasish Das, Issue #1714 */}
                {moment().isSameOrAfter(
                  moment(
                    bookingData?.data?.date +
                      'T' +
                      bookingData?.data?.time +
                      '.000Z',
                  ),
                ) &&
                bookingData?.data?.isCanceled !== 1 &&
                bookingData?.data?.status !== 3 &&
                bookingData?.data?.status !== 4 &&
                bookingData.data?.Service?.type !== 2 ? (
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={noShowCTAClicked}>
                      {/* End Change: Snehasish Das, Issue #1714 */}
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/eye-off.png')}
                        />
                      </View>
                      <Text
                        style={[commonStyle.blackTextR, commonStyle.textCenter]}
                        numberOfLines={1}>
                        No-show
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {bookingData?.data?.status === 3 ? (
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={() => {
                        console.log(bookingData?.data?.customer?.userName);
                        navigation.navigate('BookingsPreviousInnerReport', {
                          bookId: bookingId,
                          bookingProImage:
                            bookingData?.data?.customer?.profileImage,
                          bookingProName: bookingData?.data?.customer?.userName,
                          bookingProAddress: `${bookingData?.data?.customer?.city}, ${bookingData?.data?.customer?.country}`,
                          bookingProService:
                            bookingData?.data?.ReservedServiceMeta?.name,
                          bookingCustomerId: bookingData?.data?.customer?.id,
                          reportType: 'professional',
                          reservationId: '',
                          bookingData: bookingData?.data,
                          sessionUserList: sessionUserList,
                        });
                      }}>
                      <View
                        style={[
                          commonStyle.socialShareCircle,
                          commonStyle.mrl,
                        ]}>
                        <Image
                          style={commonStyle.avatericon}
                          source={require('../assets/images/alert-triangle.png')}
                        />
                      </View>
                      <Text
                        style={[commonStyle.blackTextR, commonStyle.textCenter]}
                        numberOfLines={1}>
                        Report
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={commonStyle.socialShareRowCol}>
                  <TouchableOpacity
                    style={commonStyle.mb1}
                    onPress={() => {
                      onMessageCTAClick();
                    }}>
                    <View
                      style={[commonStyle.socialShareCircle, commonStyle.mrl]}>
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

                {(subscriptionPlanStatus === 0 ||
                  subscriptionPlanStatus === 2) &&
                  bookingData?.data?.isCanceled !== 1 &&
                  bookingData?.data?.isConfirmed == 1 &&
                  bookingData?.data?.status < 2 &&
                  bookingData.data?.Service?.type !== 2 && (
                    <View style={commonStyle.socialShareRowCol}>
                      <TouchableOpacity
                        style={commonStyle.mb1}
                        onPress={() => {
                          setVisibleModal('RescheduleDateTimeDialog');
                        }}>
                        <View
                          style={[
                            commonStyle.socialShareCircle,
                            commonStyle.mrl,
                          ]}>
                          <Image
                            style={commonStyle.avatericon}
                            source={require('../assets/images/calendar.png')}
                          />
                        </View>
                        <Text
                          style={[
                            commonStyle.blackTextR,
                            commonStyle.textCenter,
                          ]}
                          numberOfLines={1}>
                          Reschedule
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                {/* <View style={commonStyle.socialShareRowCol}>
                      <TouchableOpacity style={commonStyle.mb1} onPress={() => navigation.navigate('BookingsReschedule')}>
                        <View style={[commonStyle.socialShareCircle, commonStyle.mrl]}>
                          <Image style={commonStyle.avatericon} source={require('../assets/images/calendar.png')}/>
                        </View>
                        <Text style={[commonStyle.blackTextR, commonStyle.textCenter]} numberOfLines={1}>Reschedule</Text>
                      </TouchableOpacity>
                    </View> */}
              </View>
            ) : null}

            {/* CR */}
            {bookingData?.data?.Service?.type == 1 &&
            bookingData?.data?.status == 2 &&
            bookingData?.data?.isConfirmed == 1 &&
            bookingData?.data?.isCanceled == 0 ? (
              <View>
                <TouchableOpacity
                  style={[commonStyle.shadowbtn]}
                  onPress={() => {
                    setExtraChargeErrors((prevState) => ({
                      title: {
                        ...prevState.title,
                        status: false,
                      },
                      amount: {
                        ...prevState.amount,
                        status: false,
                      },
                    }));
                    setVisibleModal('ExtraChargesModal');
                  }}>
                  <Text style={commonStyle.outlinetitleStyle}>
                    + Add Extra Charges
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {/* CR End */}
          </View>

          <View style={commonStyle.categoriseListWrap}>
            {bookingData?.data?.Service?.type == 1 &&
            bookingData?.data?.status == 2 &&
            bookingData?.data?.isConfirmed == 1 &&
            bookingData?.data?.isCanceled == 0 &&
            extraChargesListOngoing?.length ? (
              <View style={commonStyle.setupCardBox}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                  Extra Charges
                </Text>
                {extraChargesListOngoing.map((item, index) => (
                  <View key={index} style={{marginBottom: 20}}>
                    <List style={[commonStyle.setupserviceList]}>
                      <ListItem
                        thumbnail
                        style={commonStyle.categoriseListItem}>
                        <View style={commonStyle.serviceListtouch}>
                          <Body style={commonStyle.categoriseListBody}>
                            <Text
                              style={[commonStyle.blackTextR, commonStyle.mb05]}
                              numberOfLines={1}>
                              {item.title}
                            </Text>
                            <View
                              style={[
                                commonStyle.searchBarText,
                                commonStyle.mb05,
                              ]}>
                              <Text
                                style={[
                                  commonStyle.grayText16,
                                  {marginRight: 4},
                                ]}>
                                {item.description}
                              </Text>
                            </View>
                          </Body>
                          <View style={{alignSelf: 'flex-start'}}>
                            <TouchableHighlight>
                              <Text style={commonStyle.blackTextR}>
                                ${Number(item.amount).toFixed(2)}
                              </Text>
                            </TouchableHighlight>
                          </View>
                        </View>
                      </ListItem>
                    </List>
                    <View
                      style={[
                        commonStyle.bookingdatewrap,
                        commonStyle.mb3,
                        commonStyle.mt1,
                      ]}>
                      <Text style={commonStyle.blackTextR} numberOfLines={1}>
                        Status
                      </Text>
                      {item.status === 0 ? (
                        <TouchableOpacity
                          style={commonStyle.pendingbtn}
                          activeOpacity={0.5}>
                          <Text style={commonStyle.pendingbtnText}>
                            Pending
                          </Text>
                        </TouchableOpacity>
                      ) : null}

                      {item.status === 1 ? (
                        <TouchableHighlight
                          style={[
                            commonStyle.bookingStatusbtn,
                            commonStyle.completedStatusbtn,
                          ]}>
                          <Text style={commonStyle.bookingStatusbtnText}>
                            Completed
                          </Text>
                        </TouchableHighlight>
                      ) : null}
                    </View>
                    <View
                      style={[commonStyle.dividerfull, {width: '100%'}]}></View>
                  </View>
                ))}
              </View>
            ) : null}

            {/* <List style={[commonStyle.setupserviceList]}>
              <ListItem thumbnail style={commonStyle.categoriseListItem}>
                <View style={commonStyle.serviceListtouch}>
                  <Body style={commonStyle.categoriseListBody}>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb05]} numberOfLines={1}>Shampoo</Text>
                  <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                    <Text style={[commonStyle.grayText16, {marginRight:4}]}>Loream if some door text loream if some door text oream if some door oream if some door</Text>
                  </View>
                  </Body>
                  <View style={{alignSelf: 'flex-start',}}>
                  <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>$100</Text>
                  </TouchableHighlight>
                  </View>
                </View>
              </ListItem>
            </List>

              <View style={[commonStyle.bookingdatewrap, commonStyle.mb05, commonStyle.mt1]}>
                <Text style={commonStyle.blackTextR} numberOfLines={1}>Status</Text>
                <TouchableOpacity style={commonStyle.pendingbtn} activeOpacity={0.5}>
                  <Text style={commonStyle.pendingbtnText}>Pending</Text>
                </TouchableOpacity>
              </View>
            </View> */}

            <View style={[commonStyle.setupCardBox]}>
              {bookingData && rowId && (
                <List style={[commonStyle.setupserviceList]}>
                  <ListItem thumbnail style={commonStyle.categoriseListItem}>
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
                              backgroundColor: '#828FE6',
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
                          {bookingData?.data?.Service?.name}
                        </Text>
                        <View
                          style={[commonStyle.searchBarText, commonStyle.mb05]}>
                          <Text
                            style={[commonStyle.grayText16, {marginRight: 4}]}>
                            {/* Start Change: Snehasish Das Issue #1662 */}
                            {fromtoToService(
                              bookingData?.data?.date,
                              bookingData?.data?.time,
                              bookingData?.data?.duration,
                              0,
                              bookingData?.data?.ReservedServiceMeta
                                ?.extraTimeDuration,
                            )}{' '}
                            {'·'} {timeConversion(bookingData?.data?.duration)}
                            {/* End Change: Snehasish Das Issue #1662 */}
                          </Text>
                          {/* <Text style={[commonStyle.dotSmall, {opacity: 0.4}]}>.</Text> */}
                          {/* <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>2 h</Text> */}
                        </View>
                      </Body>
                      <View style={{alignSelf: 'flex-start'}}>
                        <TouchableHighlight>
                          {bookingData?.data?.Service?.type == 2 ? (
                            <Text style={commonStyle.blackTextR}>
                              {sessionUserList?.length} * $
                              {bookingData?.data?.amount}
                            </Text>
                          ) : (
                            <Text style={commonStyle.blackTextR}>
                              ${bookingData?.data?.amount}
                            </Text>
                          )}
                        </TouchableHighlight>
                      </View>
                    </View>
                  </ListItem>
                  {!!bookingData?.data?.commentByCustomer &&
                  !!bookingData?.data?.commentByCustomer !== '' ? (
                    <View
                      style={[commonStyle.bookadditionaltext, commonStyle.mb2]}>
                      <Text style={commonStyle.blackTextR}>
                        {bookingData?.data?.commentByCustomer}
                      </Text>
                    </View>
                  ) : null}
                </List>
              )}

              {bookingData &&
                orderDisplayId &&
                bookingData?.data?.reservations?.map((reservation, index) => (
                  <List style={[commonStyle.setupserviceList]} key={index}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
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
                                backgroundColor: '#828FE6',
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
                            {bookingData?.data?.services?.[index]?.name}
                          </Text>
                          <View
                            style={[
                              commonStyle.searchBarText,
                              commonStyle.mb05,
                            ]}>
                            <Text
                              style={[
                                commonStyle.grayText16,
                                {marginRight: 4},
                              ]}>
                              {fromtoToService(
                                reservation?.date,
                                reservation?.time,
                                reservation?.duration,
                                0,
                                reservation?.extraTimeDuration,
                              )}
                            </Text>
                            {/* <Text style={[commonStyle.dotSmall, {opacity: 0.4}]}>.</Text> */}
                            {/* <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>2 h</Text> */}
                          </View>
                        </Body>
                        <View style={{alignSelf: 'flex-start'}}>
                          <TouchableHighlight>
                            <Text style={commonStyle.blackTextR}>
                              ${reservation?.amount}
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </ListItem>
                    {!!bookingData?.data?.commentByCustomer &&
                    !!bookingData?.data?.commentByCustomer !== '' ? (
                      <View
                        style={[
                          commonStyle.bookadditionaltext,
                          commonStyle.mb2,
                        ]}>
                        <Text style={commonStyle.blackTextR}>
                          {JSON.parse(bookingData?.data?.commentByCustomer)}
                        </Text>
                      </View>
                    ) : null}
                  </List>
                ))}

              {/* only for regular, ompleted booking */}
              {bookingData?.data?.Service?.type == 1 &&
              bookingData?.data?.status == 3 &&
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 &&
              extraChargesListCompleted?.length ? (
                <View>
                  <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                    Extra Charge(s)
                  </Text>
                  <View>
                    {extraChargesListCompleted?.map((item, index) => (
                      <>
                        <View style={[commonStyle.dividerlinefull]} />
                        <View
                          style={[
                            commonStyle.bookingdatewrap,
                            commonStyle.mb1,
                            commonStyle.mt1,
                          ]}
                          key={index}>
                          <Text>{item.title}</Text>
                          <Text>{item.amount}</Text>
                        </View>
                      </>
                    ))}
                  </View>
                </View>
              ) : null}

              {!!parseFloat(getTaxAmount()) ? (
                <>
                  <View style={[commonStyle.bookingdatewrap, commonStyle.mb2]}>
                    <Text style={commonStyle.blackTextR} numberOfLines={1}>
                      Tax
                    </Text>
                    <Text style={[commonStyle.blackTextR]}>
                      ${getTaxAmount()}
                    </Text>
                  </View>
                  <View style={commonStyle.dividerlinefull} />
                </>
              ) : (
                <></>
              )}
              <View
                style={[
                  commonStyle.bookingdatewrap,
                  commonStyle.mb05,
                  commonStyle.mt1,
                ]}>
                <Text style={commonStyle.blackTextR} numberOfLines={1}>
                  Total
                </Text>
                <Text
                  style={[commonStyle.blackText16, commonStyle.colorOrange]}>
                  ${getTotal()}
                </Text>
              </View>

              {bookingData !== null &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.isCanceled == 0 &&
                bookingData?.data?.status == 2 &&
                (bookingState == 'payInCash' ||
                  bookingData?.data?.isPaymentFailed == 1) && (
                  <List
                    style={[commonStyle.payinCashinfowrap, commonStyle.mt1]}>
                    <ListItem thumbnail style={commonStyle.categoriseListItem}>
                      <View style={commonStyle.serviceListtouch}>
                        <Left style={{marginRight: 8, alignSelf: 'flex-start'}}>
                          <Image
                            source={require('../assets/images/payincashicon.png')}
                            style={commonStyle.payincashimg}
                            resizeMode={'contain'}
                          />
                        </Left>
                        <Body style={commonStyle.categoriseListBody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            There are some issues with the client's payment
                            method. The booking was not paid in full, please
                            collect the payment in cash or offer an alternative
                            payment method to your client.
                          </Text>
                        </Body>
                      </View>
                    </ListItem>
                  </List>
                )}

              {((bookingData?.data?.status == 3 &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.isCanceled == 0) ||
                bookingState === 'completed') && (
                <List style={[commonStyle.contactwaylist, {marginTop: 20}]}>
                  <ListItem thumbnail style={commonStyle.switchAccountView}>
                    <Left>
                      <Image
                        style={[
                          commonStyle.paymentCardImg,
                          {marginRight: 0, width: 30},
                        ]}
                        source={require('../assets/images/file-text.png')}
                      />
                    </Left>
                    <Body style={commonStyle.switchAccountbody}>
                      <TouchableOpacity onPress={exportInvoice}>
                        <Text style={commonStyle.blackTextR}>
                          {exportingText}
                        </Text>
                      </TouchableOpacity>
                    </Body>
                    <TouchableOpacity style={{marginLeft: 10}}>
                      <RightAngle />
                    </TouchableOpacity>
                  </ListItem>
                </List>
              )}
              {/* )} */}

              {bookingData !== null &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.isCanceled == 0 &&
                bookingData?.data?.status == 2 &&
                (bookingState == 'payInCash' ||
                  bookingData?.data?.isPaymentFailed == 1) && (
                  <List style={[commonStyle.contactwaylist, {marginTop: 20}]}>
                    <ListItem thumbnail style={commonStyle.switchAccountView}>
                      <Body
                        style={[
                          commonStyle.switchAccountbody,
                          commonStyle.ora,
                          {alignItems: 'center'},
                        ]}>
                        <TouchableOpacity onPress={markAsCompleteConfirmation}>
                          <Text
                            style={[
                              commonStyle.blackTextR,
                              commonStyle.colorOrange,
                            ]}>
                            Mark as Pay In Cash
                          </Text>
                        </TouchableOpacity>
                      </Body>
                    </ListItem>
                  </List>
                )}
            </View>

            {(!!rowId || bookingData?.data?.Service?.type == 2) && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Notes</Text>
                {!!notesData && notesData.length > 0 ? (
                  notesData.map((noteItem, index) => {
                    return (
                      <View
                        key={index}
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
                            {noteItem.text || noteItem}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            style={[
                              commonStyle.moreInfoCircle,
                              {marginRight: 5},
                            ]}
                            onPress={() => {
                              setNoteEditId(index);
                              setNoteEditText(noteItem);
                              setVisibleModal('AddNoteModal');
                            }}>
                            <EditIcon />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={commonStyle.moreInfoCircle}
                            deleteNoteData
                            onPress={() =>
                              deleteNoteData(index, 'beforeConfirm')
                            }>
                            <CloseIcon />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
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
                    setNoteEditId(null);
                    setNoteEditText(null);
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
            )}

            {!!bookingData?.data?.reviewRating?.userReviews &&
            bookingData?.data?.reviewRating?.userReviews?.length > 0 &&
            bookingData?.data?.Service?.type != 2 ? (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Client’s review</Text>
                <View>
                  {bookingData?.data?.reviewRating?.userReviews.map(
                    (clientReview) => (
                      <List
                        key={clientReview.id}
                        style={[
                          commonStyle.reviewslist,
                          {borderBottomWidth: 0},
                        ]}>
                        <ListItem
                          thumbnail
                          style={[
                            commonStyle.switchAccountView,
                            commonStyle.mb15,
                          ]}>
                          <Left style={commonStyle.reviewsAvaterwrap}>
                            <Image
                              style={commonStyle.reviewsAvaterImg}
                              defaultSource={require('../assets/images/default-user.png')}
                              source={
                                !!clientReview?.customer?.profileImage
                                  ? {uri: clientReview?.customer?.profileImage}
                                  : require('../assets/images/default-user.png')
                              }
                            />
                          </Left>
                          <Body style={commonStyle.switchAccountbody}>
                            <Text
                              style={[
                                commonStyle.blackTextR,
                                commonStyle.mb05,
                              ]}>
                              {clientReview?.customer?.userName}
                            </Text>
                            <Text
                              style={commonStyle.grayText14}
                              numberOfLines={1}>
                              {moment(clientReview?.createdAt).format(
                                'D MMM, YYYY',
                              )}
                            </Text>
                          </Body>
                          <TouchableOpacity
                            style={[
                              commonStyle.ratingPoints,
                              {marginLeft: 10},
                            ]}>
                            <StarIcon />
                            <Text
                              style={[commonStyle.text14bold, {marginLeft: 4}]}>
                              {clientReview?.ProRating?.rating}
                            </Text>
                          </TouchableOpacity>
                        </ListItem>
                        <TouchableHighlight style={commonStyle.outlintextbtn}>
                          <Text style={commonStyle.categorytagsText}>
                            {bookingData?.data?.Service?.name}
                          </Text>
                        </TouchableHighlight>
                        {clientReview?.content !== '' && (
                          <View style={commonStyle.mt1}>
                            <Text style={commonStyle.blackTextR}>
                              {clientReview?.content}
                            </Text>
                          </View>
                        )}
                        <ScrollView
                          horizontal
                          showsHorizontalScrollIndicator={false}>
                          {clientReview?.ProReviewResources?.map(
                            (items, index) => (
                              <TouchableOpacity
                                onPress={() =>
                                  reviewImagePressHandler(
                                    clientReview.ProReviewResources,
                                    index,
                                  )
                                }
                                style={[commonStyle.reviewuploadedpicWrap]}
                                key={index}>
                                {items.resourceType == 'image' && (
                                  <Image
                                    source={{uri: items.url}}
                                    style={commonStyle.reviewuploadedpic}
                                  />
                                )}
                              </TouchableOpacity>
                            ),
                          )}
                        </ScrollView>
                      </List>
                    ),
                  )}
                </View>
              </View>
            ) : null}

            {bookingData?.data?.Service?.type == 2 &&
            !!sessionUserList &&
            sessionUserList.length > 0 ? (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Client’s review</Text>
                {sessionUserList.map((singleUser) => {
                  return !!singleUser?.reservation?.customerReview ? (
                    <List
                      key={singleUser.id}
                      style={[commonStyle.reviewslist, {borderBottomWidth: 0}]}>
                      <ListItem
                        thumbnail
                        style={[
                          commonStyle.switchAccountView,
                          commonStyle.mb15,
                        ]}>
                        <Left style={commonStyle.reviewsAvaterwrap}>
                          <Image
                            style={commonStyle.reviewsAvaterImg}
                            defaultSource={require('../assets/images/default-user.png')}
                            source={
                              !!singleUser?.profileImage
                                ? {uri: singleUser?.profileImage}
                                : require('../assets/images/default-user.png')
                            }
                          />
                        </Left>
                        <Body style={commonStyle.switchAccountbody}>
                          <Text
                            style={[commonStyle.blackTextR, commonStyle.mb05]}>
                            {singleUser?.fullName}
                          </Text>
                          <Text
                            style={commonStyle.grayText14}
                            numberOfLines={1}>
                            {moment(
                              singleUser?.reservation?.customerReview
                                ?.createdAt,
                            ).format('D MMM, YYYY')}
                          </Text>
                        </Body>
                        <TouchableOpacity
                          style={[commonStyle.ratingPoints, {marginLeft: 10}]}>
                          <StarIcon />
                          <Text
                            style={[commonStyle.text14bold, {marginLeft: 4}]}>
                            {singleUser?.reservation?.customerRating?.rating}
                          </Text>
                        </TouchableOpacity>
                      </ListItem>
                      <TouchableHighlight style={commonStyle.outlintextbtn}>
                        <Text style={commonStyle.categorytagsText}>
                          {bookingData?.data?.Service?.name}
                        </Text>
                      </TouchableHighlight>
                      {singleUser?.reservation?.customerReview?.content !==
                        '' && (
                        <View style={commonStyle.mt1}>
                          <Text style={commonStyle.blackTextR}>
                            {singleUser?.reservation?.customerReview?.content}
                          </Text>
                        </View>
                      )}
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {singleUser?.reservation?.customerReview?.ProReviewResources?.map(
                          (items, index) => (
                            <TouchableOpacity
                              onPress={() =>
                                reviewImagePressHandler(
                                  singleUser.reservation.customerReview
                                    .ProReviewResources,
                                  index,
                                )
                              }
                              style={[commonStyle.reviewuploadedpicWrap]}
                              key={index}>
                              {items.resourceType == 'image' && (
                                <Image
                                  source={{uri: items.url}}
                                  style={commonStyle.reviewuploadedpic}
                                />
                              )}
                            </TouchableOpacity>
                          ),
                        )}
                      </ScrollView>
                    </List>
                  ) : (
                    <></>
                  );
                })}
              </View>
            ) : (
              <></>
            )}

            {bookingData !== null &&
            bookingData?.data?.reviewRating?.proReviews?.length > 0 ? (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack]}>Your review</Text>
                <View>
                  {bookingData?.data?.reviewRating?.proReviews?.map(
                    (review) => (
                      <List
                        key={review.id}
                        style={[
                          commonStyle.reviewslist,
                          {borderBottomWidth: 0},
                        ]}>
                        <ListItem
                          thumbnail
                          style={[
                            commonStyle.switchAccountView,
                            commonStyle.mb15,
                          ]}>
                          <Left style={commonStyle.reviewsAvaterwrap}>
                            <Image
                              style={commonStyle.reviewsAvaterImg}
                              defaultSource={require('../assets/images/default-user.png')}
                              source={
                                !!review?.professional?.profileImage
                                  ? {
                                      uri: review?.professional?.profileImage,
                                    }
                                  : require('../assets/images/default-user.png')
                              }
                            />
                          </Left>
                          <Body style={commonStyle.switchAccountbody}>
                            <Text
                              style={[
                                commonStyle.blackTextR,
                                commonStyle.mb05,
                              ]}>
                              {review?.professional?.userName}
                            </Text>
                            <Text
                              style={commonStyle.grayText14}
                              numberOfLines={1}>
                              {moment(review?.createdAt).format('D MMM, YYYY')}
                            </Text>
                          </Body>
                          <TouchableOpacity
                            style={[
                              commonStyle.ratingPoints,
                              {marginLeft: 10},
                            ]}>
                            <StarIcon />
                            <Text
                              style={[commonStyle.text14bold, {marginLeft: 4}]}>
                              {review?.ProRating?.rating}
                            </Text>
                          </TouchableOpacity>
                        </ListItem>
                        <TouchableHighlight style={commonStyle.outlintextbtn}>
                          <Text style={commonStyle.categorytagsText}>
                            {bookingData?.data?.Service?.name}
                          </Text>
                        </TouchableHighlight>
                        {review?.content !== '' && (
                          <View style={commonStyle.mt1}>
                            <Text style={commonStyle.blackTextR}>
                              {review?.content}
                            </Text>
                          </View>
                        )}
                      </List>
                    ),
                  )}
                </View>
              </View>
            ) : null}
          </View>
        </KeyboardAwareScrollView>
        {bookingData?.data?.status == 3 &&
        bookingData?.data?.reviewRating?.proReviews.length === 0 ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Leave a Client Review"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={leaveReview}
              />
            </View>
          </View>
        ) : null}
        {bookingData !== null &&
        bookingData?.data?.isConfirmed == 1 &&
        bookingData?.data?.isCanceled == 0 &&
        bookingData?.data?.status == 2 &&
        bookingState !== 'payInCash' &&
        bookingState !== 'completed' &&
        bookingData?.data?.isPaymentFailed == 0 ? (
          <View style={commonStyle.footerwrap}>
            <View style={[commonStyle.footerbtn]}>
              <Button
                title="Mark as Completed"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={commonStyle.commonbuttonStyle}
                titleStyle={commonStyle.buttontitleStyle}
                onPress={markAsCompleteConfirmation}
              />
            </View>
          </View>
        ) : null}
      </Container>

      {/* Image Viewer */}
      <ImageView
        images={imgViewerData}
        imageIndex={imgViewerCurrentIndex}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />

      {/* Booking cancellation modal start */}
      <Modal
        isVisible={visibleModal === 'BookingCancelDialog'}
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
          {/* <ScrollView
                  ref={scrollViewRef}
                  onScroll={handleOnScroll}
									scrollEventThrottle={10}
									> */}
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
                Are you sure you want to cancel your booking?
              </Text>
            </View>
            <View style={commonStyle.mt3}>
              <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                Client will receive a full refund
              </Text>
            </View>
          </View>
          {/* </ScrollView> */}
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Cancel booking"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={cancelBooking}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Keep booking"
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
      {/* Booking cancellation modal end */}

      {/* Booking No-show modal start */}
      <Modal
        isVisible={visibleModal === 'BookingNoShowDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
                  Are you sure you want to mark as no-show?
                </Text>
              </View>
              {/* Start Change: Snehasish Das, Issue #1494 */}
              {!!preBookingAmount && preBookingAmount != '' && (
                <View style={commonStyle.mt3}>
                  {/* Start Change: Snehasish Das, Issue #1817 */}
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    In this case Client’s card will loose his deposit (
                    {preBookingAmount})
                  </Text>
                  {/* End Change: Snehasish Das, Issue #1817 */}
                </View>
              )}
              {/* End Change: Snehasish Das, Issue #1494 */}
            </View>
          </ScrollView>
          <View style={commonStyle.plr15}>
            <View style={[commonStyle.buttonRow]}>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="No Show"
                  containerStyle={commonStyle.buttoncontainerothersStyle}
                  buttonStyle={commonStyle.buttonStylehalf}
                  titleStyle={commonStyle.buttontitleStyle}
                  onPress={noShowBooking}
                />
              </View>
              <View style={commonStyle.buttonCol}>
                <Button
                  title="Keep booking"
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
      {/* Booking No-show modal end */}

      {/* Bookings Pro Group List Client modal start */}
      <Modal
        isVisible={visibleModal === 'BookingsProGroupListClientDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
            <BookingProGroupListClientModal />
          </ScrollView>
        </View>
      </Modal>
      {/* Bookings Pro Group List Client modal end */}

      {/* Bookings Pro Select Client write message modal start */}
      <Modal
        isVisible={visibleModal === 'BookingsProWriteMessageDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
            <BookingProSelectClientMessageModal
              bookingData={bookingData ? bookingData : null}
              onMessage={onMessage}
              sessionUserList={sessionUserList}
            />
          </ScrollView>
        </View>
      </Modal>
      {/* Bookings Pro Select Client write message modal end */}

      {/* Booking Reschedule Date & Time modal start */}
      <Modal
        isVisible={visibleModal === 'RescheduleDateTimeDialog'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
            <BookingRescheduleCalenderModal
              type="pro"
              dateRange={onApplyReschedule}
            />
            {/* dateRange={getSelectedDateRange} */}
          </ScrollView>
        </View>
      </Modal>

      {/* Group Booking Client Details Modal */}
      <Modal
        isVisible={visibleModal === 'GroupBookingClients'}
        onSwipeComplete={() => setVisibleModal(null)}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
            <GroupBookingClientsModal
              bookingData={bookingData ? bookingData : null}
              navigateToClientPage={navigateToClientPage}
              sessionUserList={sessionUserList}
              seatCount={seatCount}
              setVisibleModal={setVisibleModal}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Group booking paid in cash modal */}
      <Modal
        isVisible={visibleModal === 'GroupBookingPaidInCash'}
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
            style={[commonStyle.termswrap, commonStyle.mt2]}
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
            <GroupBookingPaidInCashModal
              bookingData={bookingData ? bookingData : null}
              onPaidConfirm={onPaidConfirm}
              sessionUserList={sessionUserList}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Add/Edit Notes Modal */}
      <Modal
        isVisible={visibleModal === 'AddNoteModal'}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        onSwipeComplete={() => {
          setVisibleModal(null);
          setNoteEditId(null);
          setNoteEditText(null);
        }}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        swipeThreshold={50}
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
            onPress={() => setVisibleModal(null)}>
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
            <BookingNotesModal
              setNoteEditText={setNoteEditText}
              noteEditText={noteEditText}
              noteEditId={noteEditId}
              setKeyboardStatus={setKeyboardStatus}
            />
          </ScrollView>
          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Save a note"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                setVisibleModal(null);
                constructNotesData();
              }}
            />
          </View>
        </View>
      </Modal>

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
                  onPress={() => deleteNoteData()}
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

      {/* Successful Extra CHarge submission modal */}
      <Modal
        visible={successModal}
        onRequestClose={() => {
          setSuccessModal(null);
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
            <View style={[commonStyle.messageIcon, commonStyle.mt05]}>
              <Image source={circleWarningImg} style={commonStyle.messageimg} />
            </View>
            <Text
              style={[
                commonStyle.subtextblack,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              Your request has been sent.
            </Text>
            <Text
              style={[
                commonStyle.grayText16,
                commonStyle.textCenter,
                commonStyle.mb2,
              ]}>
              {''}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Setup Service modal start */}
      <RNModal
        isVisible={visibleModal === 'ExtraChargesModal'}
        swipeDirection="down"
        scrollTo={handleScrollTo}
        onSwipeComplete={() => onExtraChargeModsetVisibleModalalClose()}
        scrollOffset={scrollOffset}
        scrollOffsetMax={500 - 100}
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        swipeThreshold={50}
        propagateSwipe={true}
        style={[
          commonStyle.bottomModal,
          {
            marginBottom: Platform.OS === 'ios' ? keyboardStatus : 0,
          },
        ]}>
        <View
          style={[
            commonStyle.scrollableModal,
            {maxHeight: keyboardStatus > 0 ? '100%' : '50%'},
          ]}>
          <TouchableOpacity
            style={[commonStyle.termswrap, commonStyle.mt2, {height: 15}]}
            onPress={() => onExtraChargeModsetVisibleModalalClose()}>
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
            <ExtraChargesModal
              extraChargeTitle={extraChargeTitle}
              setExtraChargeTitle={setExtraChargeTitle}
              extraChargeAmount={extraChargeAmount}
              setExtraChargeAmount={setExtraChargeAmount}
              extraChargeDescription={extraChargeDescription}
              setExtraChargeDescription={setExtraChargeDescription}
              extraChargeErrors={extraChargeErrors}
              setExtraChargeErrors={setExtraChargeErrors}
              setKeyboardStatus={setKeyboardStatus}
              // extraChargeTitleTemp={extraChargeTitleTemp}
              // setExtraChargeTitleTemp={setExtraChargeTitleTemp}
              // extraChargeAmountTemp={extraChargeAmountTemp}
              // setExtraChargeAmountTemp={setExtraChargeAmountTemp}
              // extraChargeDescriptionTemp={extraChargeDescriptionTemp}
              // setExtraChargeDescriptionTemp={setExtraChargeDescriptionTemp}
            />
          </ScrollView>

          <View style={[commonStyle.categoryselectbtn, commonStyle.plr20]}>
            <Button
              title="Send Request"
              containerStyle={commonStyle.buttoncontainerothersStyle}
              buttonStyle={commonStyle.commonbuttonStyle}
              titleStyle={commonStyle.buttontitleStyle}
              onPress={() => {
                // setVisibleModal(null);
                onApplyExtraChargeHandler();
                // constructNotesData();
              }}
            />
          </View>
          {/* </ScrollView> */}
        </View>
      </RNModal>
    </Fragment>
  );
};

export default bookingsProInner;
