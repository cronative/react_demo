import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Body, Container, Left, List, ListItem, Title} from 'native-base';
import React, {Fragment, useEffect, useRef, useState, useCallback} from 'react';
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import MyLocationMarker from '../components/map/myLocationMarker';
import {Button} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import HTMLView from 'react-native-htmlview';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import {mainAPI} from '../api/apiAgent';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import {
  LeftArrowAndroid,
  LeftArrowIos,
  RightAngle,
  DirectionsIcon,
  MapPointer,
} from '../components/icons';
import {
  userBookingCancelRequest,
  userBookingCancelRequestClear,
  userBookingDetailsRequest,
  userBookingDetailsRequestClear,
} from '../store/actions/bookingAction';
import {getDistance} from 'geolib';
import {fromtoToService, preDepositAmount} from '../utility/booking';
import {timeConversion} from '../utility/commonService';

import GetLocation from 'react-native-get-location';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import CalendarEventButton from '../components/calendar/Calendar';

const {width, height} = Dimensions.get('window');

const CustomMapPointer = () => (
  <View>
    <Image
      style={{
        resizeMode: 'contain',
        width: 35,
        height: 35,
      }}
      source={require('../assets/images/map/marker.png')}
    />
  </View>
);

const BookingsUpcomingInner = ({navigation, route}) => {
  // Declare the constant
  const dispatch = useDispatch();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const [visibleModal, setVisibleModal] = useState(false);
  const [serviceName, setServiceName] = useState(null);
  const [serviceTimeDiff, setServiceTimeDiff] = useState(null);
  const [serviceAmount, setServiceAmount] = useState(null);
  const [scrollOffset, setScrollOffset] = useState();
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const bookingData = useSelector(
    (state) => state.bookingReducer.userBookingDetails,
  );
  const bookingCancelData = useSelector(
    (state) => state.bookingReducer.userBookingCancelDetails,
  );
  const loderStatus = useSelector((state) => state.bookingReducer.loader);
  const scrollViewRef = useRef(0);
  const [bookingId, setBookingId] = useState(null);
  const unconfirmedBookingId = route.params?.notificationBookingId;
  const proMeta = unconfirmedBookingId
    ? bookingData?.data?.businessDetails
    : bookingData?.data?.ProMeta;
  const [userType, setUserType] = useState(0);
  const [loginId, setLoginId] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  // const profileData = useSelector((state) => state.professionalDetails.details);
  const profileData = route.params?.ProMeta;
  const [coordinatePoint, setCoordinatePoint] = useState({
    latitude: null,
    longitude: null,
  });
  const [ProMetas, setProMetas] = useState(null);
  const [shopDistance, setShopDistance] = useState(null);
  const [map_url, set_map_url] = useState(null);
  const proKey = unconfirmedBookingId ? 'businessDetails' : 'pro';
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  const calculateShopDistance = (latitude, longitude) => {
    if (coordinates && latitude && longitude) {
      let distanceMeter = getDistance(
        {latitude: coordinates.latitude, longitude: coordinates.longitude},
        {latitude: latitude, longitude: longitude},
      );
      // return `${distanceMeter} miles`;
      if (distanceMeter > 999) {
        let kmConvert = distanceMeter * 0.00062137;
        kmConvert = Number(kmConvert).toFixed(2);
        // setDistance(kmConvert + 'km');
        return `${kmConvert} miles`;
      } else {
        // setDistance(distanceMeter + 'm');
        return `${(distanceMeter * 0.00062137).toFixed(2)} miles`;
      }
    } else {
      return 0;
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCurrentLocation();
    }, []),
  );

  useEffect(() => {
    // if (!isCallSilimerProfessional && profileData) {
    console.log('Profile Data: ', profileData);
    if (profileData && profileData.ProMetas && profileData.ProMetas[0]) {
      setProMetas(profileData.ProMetas[0]);
      console.log('coordinates is', coordinates);
      if (coordinates) {
        let distance = calculateShopDistance(
          profileData.ProMetas[0].latitude,
          profileData.ProMetas[0].longitude,
        );

        setShopDistance(distance);
      }
      if (
        profileData.ProMetas[0].latitude &&
        profileData.ProMetas[0].longitude
      ) {
        const scheme = Platform.select({
          ios: 'maps:0,0?q=',
          android: 'geo:0,0?q=',
        });
        const latLng = `${profileData.ProMetas[0].latitude},${profileData.ProMetas[0].longitude}`;
        const label = `${profileData.ProMetas[0].businessName}`;
        const address = `${profileData.ProMetas[0].address}`;

        console.log('business name while set up', label);

        let temp_map_url = Platform.select({
          // ios: `${scheme}${label}@${latLng}${address}`,
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`,
        });
        set_map_url(temp_map_url);

        console.log('map url is ** ', temp_map_url);
      }
    }

    // }
  }, [coordinates, profileData]);

  const getCurrentLocation = async () => {
    console.log('location is');
    if (Platform.OS === 'ios') {
      getCurrent();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('GRANTED PermissionsAndroid');
          getCurrent();
        } else {
          // --
          console.log('error happened');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrent = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        console.log('location is ****', location);
        setCoordinates(location);
      })
      .catch((error) => {
        const {code, message} = error;
      });
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
  }, []);

  const goBack = () => {
    if (route.params.fromNotificationList) {
      navigation.goBack();
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } else {
      navigation.navigate('Bookings');
    }
    dispatch(userBookingDetailsRequestClear());
  };

  //  This function will call once
  useEffect(() => {
    if (route.params.bookingId) {
      let obj = {
        id: route.params.bookingId,
      };
      dispatch(userBookingDetailsRequest(obj));
    } else if (unconfirmedBookingId) {
      dispatch(
        userBookingDetailsRequest({orderDisplayId: unconfirmedBookingId}),
      );
    }
  }, [route.params, unconfirmedBookingId]);

  const getUserTypeByStorage = async () => {
    let userType = await AsyncStorage.getItem('userType');
    let userId = await AsyncStorage.getItem('userId');
    setUserType(userType);
    setLoginId(userId);
  };

  // Refresh by event emitter
  useEffect(() => {
    getUserTypeByStorage();
    EventEmitter.on('refreshPage', () => {
      if (route.params.bookingId) {
        let obj = {
          id: route.params.bookingId,
        };
        dispatch(userBookingDetailsRequest(obj));
      } else if (unconfirmedBookingId) {
        dispatch(
          userBookingDetailsRequest({orderDisplayId: unconfirmedBookingId}),
        );
      }
    });
  }, []);

  // This function is for handle the response
  useEffect(() => {
    if (bookingData !== null && bookingData.status == 200) {
      // console.log('\n\n\nBooking Data:', bookingData, '\n\n\n');
      if (
        bookingData?.data?.isCanceled === 1 ||
        (bookingData?.data?.status >= 2 && bookingData?.data?.isConfirmed === 1)
      ) {
        navigation.replace('BookingsPreviousInner', {
          bookingId: route.params.bookingId,
          fromNotificationList: route.params.fromNotificationList,
        });
        return;
      }
      setBookingId(bookingData?.data?.id);
      setServiceName(bookingData?.data?.ReservedServiceMeta?.name);
      setServiceAmount(bookingData?.data?.ReservedServiceMeta?.amount);
      setCoordinatePoint({
        latitude: parseFloat(
          bookingData?.data[
            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
          ]?.latitude
            ? bookingData.data[
                unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
              ].latitude
            : 40.6976701,
        ),
        longitude: parseFloat(
          bookingData?.data[
            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
          ]?.longitude
            ? bookingData.data[
                unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
              ].longitude
            : -74.2598737,
        ),
      });
      // setCoordinatePoint({
      //   latitude: parseFloat(
      //     bookingData.data[proKey].latitude === null
      //       ? 40.6976701
      //       : bookingData.data[proKey].latitude,
      //   ),
      //   longitude: parseFloat(
      //     bookingData.data[proKey].longitude === null
      //       ? -74.2598737
      //       : bookingData?.data[proKey]?.longitude,
      //   ),
      // });
      setRegion({
        latitude: parseFloat(
          bookingData?.data[
            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
          ]?.latitude
            ? bookingData.data[
                unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
              ].latitude
            : 40.6976701,
        ),
        longitude: parseFloat(
          bookingData?.data[
            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
          ]?.longitude
            ? bookingData?.data[
                unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
              ]?.longitude
            : -74.2598737,
        ),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      // setRegion({
      //   latitude: parseFloat(
      //     bookingData.data[proKey].latitude === null
      //       ? 40.6976701
      //       : bookingData.data[proKey].latitude,
      //   ),
      //   longitude: parseFloat(
      //     bookingData.data[proKey].longitude === null
      //       ? -74.2598737
      //       : bookingData?.data[proKey]?.longitude,
      //   ),
      //   latitudeDelta: LATITUDE_DELTA,
      //   longitudeDelta: LONGITUDE_DELTA,
      // });
    } else if (bookingData && bookingData.status != 200) {
      if (
        !!bookingData?.response?.data?.message &&
        bookingData?.response?.data?.message !== null &&
        bookingData?.response?.data?.message !== ''
      ) {
        global.showToast(bookingData?.response?.data?.message, 'error');
      }
    }
  }, [bookingData]);

  // This method will call on Modal show hide.
  const handleOnScroll = (event) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  };
  const handleScrollTo = (p) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

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

  const onMessage = async () => {
    const userId = await AsyncStorage.getItem('userId');

    mainAPI({
      url: '/user/ask',
      data: {
        reservationId: bookingData?.data?.reservationDisplayId,
        proId: bookingData?.data?.pro?.id?.toString(),
      },
      methodType: 'post',
    }).then(({data}) => {
      navigation.navigate('Inbox');
      setTimeout(() => {
        navigation.navigate('Inbox', {
          screen: 'InboxInner',
          params: {
            userType,
            fromBookings: true,
            channelDetails: bookingData?.data,
            loginId: userId,
            channelId: data?.channelId,
          },
        });
      }, 100);
    });
  };

  // This method is to cancel the booking
  const cancelBooking = () => {
    setVisibleModal({visibleModal: null});
    if (bookingId !== null) {
      let dataObj = {
        reservationId: bookingId.toString(),
      };
      dispatch(userBookingCancelRequest(dataObj));
    } else {
      global.showToast(
        'Something went wrong, please try after some times',
        'error',
      );
    }
  };

  // This function is for handle the response of cancel booking
  useEffect(() => {
    if (bookingCancelData !== null && bookingCancelData.status == 200) {
      dispatch(userBookingCancelRequestClear());
      global.showToast(bookingCancelData.message, 'success');
      setTimeout(() => {
        let obj = {
          id: route.params.bookingId,
        };
        dispatch(userBookingDetailsRequest(obj));
      }, 2000);
    } else if (bookingCancelData && bookingCancelData.status != 200) {
      if (
        bookingCancelData.response.data.message !== null &&
        bookingCancelData.response.data.message !== ''
      ) {
        global.showToast(bookingCancelData.response.data.message, 'error');
        dispatch(userBookingCancelRequestClear());
      }
    }
  }, [bookingCancelData]);

  const totalAmount = () => {
    return unconfirmedBookingId
      ? bookingData?.data?.reservations?.reduce(
          (acc, r) => acc + parseFloat(r?.amount),
          0,
        )
      : bookingData?.data?.amount;
  };

  const taxAmount = () => {
    return unconfirmedBookingId
      ? bookingData?.data?.reservations?.reduce(
          (acc, r) => acc + parseFloat(!!r?.tax ? r?.tax : 0),
          0,
        )
      : bookingData?.data?.tax;
  };

  const totalWithTax = () => {
    const amount = totalAmount();
    const tax = taxAmount();
    if (!!amount && !!tax) {
      const withTax = +amount + +tax;
      return [withTax.toFixed(2), (+tax).toFixed(2)];
    } else {
      return [!!amount ? (+amount).toFixed(2) : '0.00', '0.00'];
    }
  };

  const calculateNotes = (noteString) => {
    try {
      const notes = JSON.parse(noteString);
      return notes;
    } catch (error) {
      return [];
    }
  };

  const openCancellationPolicy = () => {
    setVisibleModal(null);
    setTimeout(() => {
      setVisibleModal('CancellationPolicyModal');
    }, 800);
  };

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container style={[commonStyle.mainContainer, commonStyle.pb1]}>
        {loderStatus ? <ActivityLoaderSolid /> : null}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
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
          <View style={[commonStyle.bookingInnerbox, commonStyle.mt1]}>
            <Text style={[commonStyle.subheading, commonStyle.mb1]}>
              {unconfirmedBookingId
                ? timeFormat(
                    bookingData?.data?.reservations?.[0]?.date,
                    bookingData?.data?.reservations?.[0]?.time,
                  )
                : timeFormat(bookingData?.data?.date, bookingData?.data?.time)}
            </Text>
            <View style={{alignSelf: 'flex-start'}}>
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
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 ? (
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
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 ? (
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
              <List
                style={[commonStyle.bookingInnerUser, {paddingVertical: 0}]}>
                <ListItem
                  thumbnail
                  style={[
                    commonStyle.switchAccountView,
                    {marginTop: 20, marginBottom: 20},
                  ]}
                  onPress={() => {
                    navigation.navigate('Explore');
                    setTimeout(() => {
                      navigation.navigate('ProfessionalPublicProfile', {
                        proId:
                          bookingData?.data?.[
                            unconfirmedBookingId ? 'professional' : 'pro'
                          ]?.id,
                        singleBack: false,
                        doubleBack: true,
                      });
                    }, 10);
                  }}>
                  <Left style={commonStyle.favoritesUserAvaterwrap}>
                    <Image
                      style={commonStyle.favoritesUserAvaterImg}
                      defaultSource={require('../assets/images/default.png')}
                      source={
                        !!bookingData?.data?.[
                          unconfirmedBookingId ? 'professional' : 'pro'
                        ]?.profileImage
                          ? {
                              uri: bookingData?.data?.[
                                unconfirmedBookingId ? 'professional' : 'pro'
                              ]?.profileImage,
                            }
                          : require('../assets/images/default.png')
                      }
                    />
                  </Left>
                  <Body style={commonStyle.switchAccountbody}>
                    <Text style={commonStyle.blackTextR}>
                      {/* {
                        bookingData?.data?.[proKey]?.[
                          unconfirmedBookingId ? 'businessName' : 'userName'
                        ]
                      } */}
                      {/* {ProMetas.businessName} */}
                      {profileData?.ProMetas[0]?.businessName}
                    </Text>
                    {bookingData?.data?.[
                      unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
                    ]?.isPhoneNOShare == 1 && (
                      <Text
                        style={commonStyle.categorytagsText}
                        numberOfLines={1}>
                        {
                          bookingData?.data?.[
                            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
                          ]?.countryCode
                        }{' '}
                        {
                          bookingData?.data?.[
                            unconfirmedBookingId ? 'businessDetails' : 'ProMeta'
                          ]?.phoneNumber
                        }
                      </Text>
                    )}
                  </Body>
                  <View style={{marginLeft: 10}}>
                    <RightAngle />
                  </View>
                </ListItem>
              </List>
            </View>
            {!unconfirmedBookingId && (
              <View style={[commonStyle.socialShareRow, commonStyle.mt3]}>
                {bookingData?.data?.isCanceled !== 1 &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.status !== 3 &&
                bookingData?.data?.status !== 4 ? (
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

                {(bookingData?.data?.ProMeta?.subscriptionStatus === 1 ||
                  bookingData?.data?.ProMeta?.subscriptionStatus === 2) &&
                bookingData?.data?.isCanceled !== 1 &&
                bookingData?.data?.isConfirmed == 1 &&
                bookingData?.data?.status !== 3 &&
                bookingData?.data?.status !== 4 &&
                bookingData?.data?.ReservedServiceMeta?.type !== 2 ? (
                  <View style={commonStyle.socialShareRowCol}>
                    <TouchableOpacity
                      style={commonStyle.mb1}
                      onPress={() =>
                        navigation.navigate('BookingsReschedule', {
                          bookingData: bookingData?.data,
                        })
                      }>
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
                        style={[commonStyle.blackTextR, commonStyle.textCenter]}
                        numberOfLines={1}>
                        Reschedule
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <View style={commonStyle.socialShareRowCol}>
                  <TouchableOpacity style={commonStyle.mb1} onPress={onMessage}>
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
              </View>
            )}
            <CalendarEventButton
              data={{
                name: bookingData?.data?.ReservedServiceMeta?.name,
                time: bookingData?.data?.time,
                date: bookingData?.data?.date,
                duration: bookingData?.data?.duration,
                location: bookingData?.data?.ProMeta?.address,
                pro: bookingData?.data?.ProMeta?.businessName,
              }}
            />
          </View>
          <View style={commonStyle.categoriseListWrap}>
            <View style={[commonStyle.setupCardBox]}>
              {bookingData?.data?.ReservedServiceMeta && (
                <List style={commonStyle.mb2}>
                  <ListItem
                    style={[commonStyle.commListitem, commonStyle.mb05]}>
                    <Body>
                      <Text style={commonStyle.blackTextR}>
                        {bookingData?.data?.ReservedServiceMeta?.name}
                      </Text>
                    </Body>
                    <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>
                        ${bookingData?.data?.ReservedServiceMeta?.amount}
                      </Text>
                    </TouchableHighlight>
                  </ListItem>
                  <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                    <Text style={[commonStyle.grayText16, {marginRight: 4}]}>
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
                  </View>
                </List>
              )}

              {bookingData?.data?.reservations?.map((reservation) => (
                <List style={commonStyle.mb2}>
                  <ListItem
                    style={[commonStyle.commListitem, commonStyle.mb05]}>
                    <Body>
                      <Text style={commonStyle.blackTextR}>
                        {reservation?.Service?.name}
                      </Text>
                    </Body>
                    <TouchableHighlight>
                      <Text style={commonStyle.blackTextR}>
                        ${reservation?.Service?.amount}
                      </Text>
                    </TouchableHighlight>
                  </ListItem>
                  <View style={[commonStyle.searchBarText, commonStyle.mb05]}>
                    <Text style={[commonStyle.grayText16, {marginRight: 4}]}>
                      {fromtoToService(
                        reservation?.date,
                        reservation?.time,
                        reservation?.duration,
                        0,
                        reservation?.Service?.extraTimeDuration,
                      )}
                    </Text>
                  </View>
                </List>
              ))}
              {/* Start Change: Snehasish Das, Issue #1772 */}
              {/* {!!bookingData?.data?.note && !!bookingData?.data?.note !== ''
                ? // End Change: Snehasish Das, Issue #1772
                  calculateNotes(bookingData?.data?.note).map(
                    (noteItem, index) => (
                      <View
                        key={index}
                        style={[
                          commonStyle.bookadditionaltext,
                          commonStyle.mb2,
                        ]}>
                        <Text style={commonStyle.blackTextR}>{noteItem}</Text>
                      </View>
                    ),
                  )
                : null} */}
              {!!bookingData?.data?.commentByCustomer &&
              !!bookingData?.data?.commentByCustomer !== '' ? (
                <View style={[commonStyle.bookadditionaltext, commonStyle.mb2]}>
                  <Text style={commonStyle.blackTextR}>
                    {bookingData?.data?.commentByCustomer}
                  </Text>
                </View>
              ) : null}
              {!!parseFloat(totalWithTax()[1]) && (
                <>
                  <View style={commonStyle.dividerlinefull} />
                  <View
                    style={[
                      commonStyle.bookingdatewrap,
                      commonStyle.mb2,
                      commonStyle.mt2,
                    ]}>
                    <Text style={commonStyle.blackTextR} numberOfLines={1}>
                      Tax
                    </Text>
                    <Text style={[commonStyle.blackTextR]}>
                      ${totalWithTax()[1]}
                    </Text>
                  </View>
                </>
              )}
              <View style={commonStyle.dividerlinefull} />
              <View
                style={[
                  commonStyle.bookingdatewrap,
                  commonStyle.mb05,
                  commonStyle.mt2,
                ]}>
                <Text style={commonStyle.blackTextR} numberOfLines={1}>
                  Total
                </Text>
                <Text
                  style={[commonStyle.blackText16, commonStyle.colorOrange]}>
                  ${totalWithTax()[0]}
                </Text>
              </View>
            </View>

            <View style={[commonStyle.setupCardBox]}>
              <Text style={[commonStyle.subtextblack, commonStyle.mb2]}>
                Location
              </Text>
              <View style={commonStyle.setupbusinessmapwrap}>
                {/* <Image
                  style={commonStyle.setupbusinessmap}
                  source={require('../assets/images/dammy-map-2.png')}
                /> */}

                {/* <View
                  style={[
                    commonStyle.setupbusinessmapPointer,
                    commonStyle.pulseposion,
                  ]}>
                  <Pulse
                    color="#ffffff"
                    numPulses={3}
                    diameter={100}
                    speed={20}
                    duration={2000}
                  />
                  <View style={commonStyle.grolocationPointer} />
                </View> */}

                {/* <TouchableOpacity
                  style={commonStyle.directionsbtn}
                  activeOpacity={0.5}>
                  <DirectionsIcon />
                  <Text style={[commonStyle.blackText16, commonStyle.ml1]}>
                    Directions
                  </Text>
                </TouchableOpacity> */}
                {/* Start Change: Snehasish Das Issues #1651, #1652 */}
                {bookingData !== null &&
                !!region &&
                !!region.latitude &&
                !!region.longitude ? (
                  <View
                    style={{
                      width: '100%',
                      borderRadius: 20.8 / 2,
                      overflow: 'hidden',
                      backgroundColor: '#fff',
                    }}>
                    <MapView
                      style={commonStyle.mapview}
                      initialRegion={region}
                      region={region}
                      provider={PROVIDER_GOOGLE}
                      mapType="standard"
                      zoomEnabled={true}
                      minZoomLevel={Platform.OS == 'android' ? 15 : 6}
                      rotateEnabled={false}
                      showsCompass={false}
                      moveOnMarkerPress={false}
                      showsUserLocation={false}
                      customMapStyle={[
                        {
                          featureType: 'all',
                          elementType: 'geometry.fill',
                          stylers: [
                            {
                              weight: '2.00',
                            },
                          ],
                        },
                        {
                          featureType: 'all',
                          elementType: 'geometry.stroke',
                          stylers: [
                            {
                              color: '#9c9c9c',
                            },
                          ],
                        },
                        {
                          featureType: 'all',
                          elementType: 'labels.text',
                          stylers: [
                            {
                              visibility: 'on',
                            },
                          ],
                        },
                        {
                          featureType: 'landscape',
                          elementType: 'all',
                          stylers: [
                            {
                              color: '#f2f2f2',
                            },
                          ],
                        },
                        {
                          featureType: 'landscape',
                          elementType: 'geometry.fill',
                          stylers: [
                            {
                              color: '#e8e9ff',
                            },
                          ],
                        },
                        {
                          featureType: 'landscape.man_made',
                          elementType: 'geometry.fill',
                          stylers: [
                            {
                              color: '#e8e9ff',
                            },
                          ],
                        },
                        {
                          featureType: 'poi',
                          elementType: 'all',
                          stylers: [
                            {
                              visibility: 'off',
                            },
                          ],
                        },
                        {
                          featureType: 'road',
                          elementType: 'all',
                          stylers: [
                            {
                              saturation: -100,
                            },
                            {
                              lightness: 45,
                            },
                          ],
                        },
                        {
                          featureType: 'road',
                          elementType: 'geometry.fill',
                          stylers: [
                            {
                              color: '#ffffff',
                            },
                          ],
                        },
                        {
                          featureType: 'road',
                          elementType: 'labels.text.fill',
                          stylers: [
                            {
                              color: '#7b7b7b',
                            },
                          ],
                        },
                        {
                          featureType: 'road',
                          elementType: 'labels.text.stroke',
                          stylers: [
                            {
                              color: '#ffffff',
                            },
                          ],
                        },
                        {
                          featureType: 'road.highway',
                          elementType: 'all',
                          stylers: [
                            {
                              visibility: 'simplified',
                            },
                          ],
                        },
                        {
                          featureType: 'road.arterial',
                          elementType: 'labels.icon',
                          stylers: [
                            {
                              visibility: 'off',
                            },
                          ],
                        },
                        {
                          featureType: 'transit',
                          elementType: 'all',
                          stylers: [
                            {
                              visibility: 'off',
                            },
                          ],
                        },
                        {
                          featureType: 'water',
                          elementType: 'all',
                          stylers: [
                            {
                              color: '#cccffc',
                            },
                            {
                              visibility: 'on',
                            },
                          ],
                        },
                        {
                          featureType: 'water',
                          elementType: 'geometry.fill',
                          stylers: [
                            {
                              color: '#cccffc',
                            },
                          ],
                        },
                        {
                          featureType: 'water',
                          elementType: 'labels.text.fill',
                          stylers: [
                            {
                              color: '#070707',
                            },
                          ],
                        },
                        {
                          featureType: 'water',
                          elementType: 'labels.text.stroke',
                          stylers: [
                            {
                              color: '#ffffff',
                            },
                          ],
                        },
                      ]}>
                      {!!coordinatePoint &&
                        !!coordinatePoint.longitude &&
                        coordinatePoint.latitude && (
                          <>
                            <Marker coordinate={coordinatePoint}>
                              <CustomMapPointer />
                            </Marker>
                            {/* <Marker
                              coordinate={{
                                latitude: 28.7041,
                                longitude: 77.1025,
                              }}>
                              <CustomMapPointer />
                            </Marker> */}
                          </>
                        )}
                      {!!coordinates && (
                        <Marker coordinate={coordinates}>
                          <View
                            style={{
                              height: 70,
                              width: 70,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <MyLocationMarker />
                          </View>
                        </Marker>
                      )}
                    </MapView>
                  </View>
                ) : null}
                {map_url ? (
                  <TouchableOpacity
                    style={[commonStyle.directionsbtn]}
                    activeOpacity={0.5}
                    onPress={() => {
                      if (map_url) Linking.openURL(map_url);
                      console.log(
                        'business name',
                        profileData.ProMetas[0].businessName,
                      );
                    }}>
                    <DirectionsIcon />
                    <Text style={[commonStyle.blackText16, commonStyle.ml1]}>
                      Directions
                    </Text>
                  </TouchableOpacity>
                ) : null}
                {/* End Change: Snehasish Das Issues #1651, #1652 */}
              </View>
              <View style={commonStyle.mt2}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                  {(ProMetas && ProMetas.address) || 'Address Info Unavailable'}
                </Text>
                {!!shopDistance ? (
                  <TouchableHighlight>
                    <Text style={commonStyle.grayText14}>
                      <MapPointer />
                      {`${' '}${shopDistance} from you`}
                    </Text>
                  </TouchableHighlight>
                ) : null}
              </View>
              {/* <View style={commonStyle.mt2}>
                <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                  {!!bookingData?.data?.ProMeta?.address
                    ? bookingData?.data?.ProMeta?.address
                    : bookingData?.data?.businessDetails?.address}
                </Text>
              </View> */}
            </View>

            {!!proMeta?.applyDeposite && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                  Cancellation policies
                </Text>
                {proMeta?.cancellationHours == -1 ? (
                  <View>
                    <Text style={commonStyle.grayText16}>
                      Cancel for free anytime before your appointment. For{' '}
                      <Title style={commonStyle.blackTextR}>
                        not showing up
                      </Title>{' '}
                      you will loose your full deposit.
                    </Text>
                  </View>
                ) : (
                  <View style={commonStyle.termswrap}>
                    <Text style={commonStyle.grayText16}>
                      Cancel for free up to{' '}
                      <Title style={commonStyle.blackTextR}>
                        {proMeta?.cancellationHours || 0}{' '}
                        {proMeta?.cancellationHours > 1 ? 'hours' : 'hour'}{' '}
                        ahead{' '}
                      </Title>
                      of your appointment time, after this grace period you will
                      loose your deposit. For{' '}
                      <Title style={commonStyle.blackTextR}>
                        not showing up
                      </Title>{' '}
                      you will loose your full deposit too.
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Other Policies */}
            {!!proMeta?.otherPolicies && (
              <View style={[commonStyle.setupCardBox]}>
                <Text style={[commonStyle.subtextblack, commonStyle.mb15]}>
                  Other policies
                </Text>
                <View
                  style={[
                    commonStyle.termswrap,
                    {
                      alignSelf: 'flex-start',
                    },
                  ]}>
                  <HTMLView
                    value={proMeta.otherPolicies}
                    textComponentProps={{style: commonStyle.grayText16}}
                  />
                </View>
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>
      </Container>

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
                  Are you sure you want to cancel your booking?
                </Text>
              </View>
              {/* <View style={commonStyle.mt3}>
                        <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>You will not be charged</Text>
                      </View> */}
              <View style={commonStyle.mt3}>
                {proMeta?.depositType &&
                proMeta?.cancellationHours &&
                moment().isAfter(
                  moment(
                    bookingData?.data?.date +
                      'T' +
                      bookingData?.data?.time +
                      '.000Z',
                  ).subtract(proMeta?.cancellationHours, 'hours'),
                ) ? (
                  <>
                    <Text
                      style={[commonStyle.grayText16, commonStyle.textCenter]}>
                      Due to the late cancellation, you’ll lose your deposit of{' '}
                      {preDepositAmount(proMeta, +totalWithTax()[0])} from the
                      services value ($
                      {bookingData?.data?.ReservedServiceMeta?.amount})
                    </Text>

                    <TouchableOpacity onPress={openCancellationPolicy}>
                      <Text
                        style={[
                          commonStyle.grayText16,
                          commonStyle.textCenter,
                          commonStyle.mt1,
                        ]}>
                        See the{' '}
                        <Text style={[commonStyle.textorange14]}>
                          Cancellation Policy
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text
                    style={[commonStyle.grayText16, commonStyle.textCenter]}>
                    You will receive a full refund
                  </Text>
                )}
              </View>
              {/* <TouchableOpacity
                style={[commonStyle.termswrap, commonStyle.mt2]}>
                <Text style={commonStyle.grayText16}>
                  See the{' '}
                  <Title style={commonStyle.textorange}>
                    Cancellation policy
                  </Title>
                </Text>
              </TouchableOpacity> */}
            </View>
          </ScrollView>
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

      {/* Cancellation Policy Modal */}
      <Modal
        isVisible={visibleModal === 'CancellationPolicyModal'}
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
                Cancellation policies
              </Text>
            </View>

            <View style={[commonStyle.mt3, commonStyle.mb3]}>
              {proMeta?.cancellationHours == -1 ? (
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  Cancel for free anytime before your appointment. For{' '}
                  <Title style={commonStyle.blackTextR}>not showing up</Title>{' '}
                  you will loose your full deposit.
                </Text>
              ) : (
                <Text style={[commonStyle.grayText16, commonStyle.textCenter]}>
                  Cancel for free up to{' '}
                  <Title style={commonStyle.blackTextR}>
                    {proMeta?.cancellationHours || 0}{' '}
                    {proMeta?.cancellationHours > 1 ? 'hours' : 'hour'} ahead{' '}
                  </Title>
                  of your appointment time, after this grace period you will
                  loose your deposit. For{' '}
                  <Title style={commonStyle.blackTextR}>not showing up</Title>{' '}
                  you will loose your full deposit too.
                </Text>
              )}
            </View>
            <View style={commonStyle.plr15}>
              <Button
                title="OK"
                containerStyle={commonStyle.buttoncontainerothersStyle}
                buttonStyle={[
                  commonStyle.buttonStylehalf,
                  commonStyle.lightorang,
                ]}
                titleStyle={[
                  commonStyle.buttontitleStyle,
                  commonStyle.colorOrange,
                ]}
                onPress={() => setVisibleModal(null)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
};

export default BookingsUpcomingInner;
