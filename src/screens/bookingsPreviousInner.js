import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {Body, Container, Left, List, ListItem} from 'native-base';
import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
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
  Linking,
  PermissionsAndroid,
} from 'react-native';
import {Button} from 'react-native-elements';
import EventEmitter from 'react-native-eventemitter';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Video from 'react-native-video';
import {useDispatch, useSelector} from 'react-redux';
import {mainAPI} from '../api/apiAgent';
import {VIDEO_POSTER_BASE_PATH} from '../api/constant';
import commonStyle from '../assets/css/mainStyle';
import ActivityLoaderSolid from '../components/ActivityLoaderSolid';
import global from '../components/commonservices/toast';
import PTRView from 'react-native-pull-to-refresh';
import {getDistance} from 'geolib';
import GetLocation from 'react-native-get-location';
import {
  LeftArrowAndroid,
  LeftArrowIos,
  RightAngle,
  StarIcon,
  DirectionsIcon,
  MapPointer,
} from '../components/icons';
import {
  userBookingDetailsRequest,
  userBookingDetailsRequestClear,
} from '../store/actions/bookingAction';
import {
  cardNumberFormat,
  fromtoToService,
  selectCardType,
} from '../utility/booking';
import {timeConversion} from '../utility/commonService';
import ImageView from 'react-native-image-viewing';
import {useFocusEffect} from '@react-navigation/core';
import {Get} from '../api/apiAgent';
import MyLocationMarker from '../components/map/myLocationMarker';
import {fetchGracePeriodData} from '../utility/fetchGracePeriodData';
const {width, height} = Dimensions.get('window');
const images = [
  {
    uri: 'https://images.unsplash.com/photo-1571501679680-de32f1e7aad4',
  },
  {
    uri: 'https://images.unsplash.com/photo-1573273787173-0eb81a833b34',
  },
  {
    uri: 'https://images.unsplash.com/photo-1569569970363-df7b6160d111',
  },
];

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

const BookingsPreviousInner = ({navigation, route}) => {
  const [visible, setIsVisible] = useState(false);
  // Declare the constant
  const dispatch = useDispatch();
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const scrollViewRef = useRef(0);
  const [cardNumber, setCardNumber] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const bookingData = useSelector(
    (state) => state.bookingReducer.userBookingDetails,
  );
  const loderStatus = useSelector((state) => state.bookingReducer.loader);
  const [userType, setUserType] = useState(0);
  const [loginId, setLoginId] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  // const profileData = useSelector((state) => state.professionalDetails.details);
  const profileData = route.params?.ProMeta;

  const [coordinatePoint, setCoordinatePoint] = useState({
    latitude: null,
    longitude: null,
  });
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [ProMetas, setProMetas] = useState(null);
  const [shopDistance, setShopDistance] = useState(null);
  const [map_url, set_map_url] = useState(null);
  const [imgViewerData, setImgViewerData] = useState(null);
  const [imgViewerCurrentIndex, setImgViewerCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const getUserTypeByStorage = async () => {
    let userType = await AsyncStorage.getItem('userType');
    let userId = await AsyncStorage.getItem('userId');
    setUserType(userType);
    setLoginId(userId);
  };

  const [extraChargesListOngoing, setExtraChargesListOngoing] = useState(null);
  const [extraChargesListCompleted, setExtraChargesListCompleted] =
    useState(null);

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

    if (profileData && profileData.ProMetas && profileData.ProMetas[0]) {
      console.log('Profile Data: ', profileData);
      setProMetas(profileData.ProMetas[0]);
      if (!!coordinates) {
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

        let temp_map_url = Platform.select({
          // ios: `${scheme}${label}@${latLng}${address}`,
          ios: `${scheme}${label}@${latLng}`,
          android: `${scheme}${latLng}(${label})`,
        });
        set_map_url(temp_map_url);
      }
    }

    // }
  }, [coordinates, profileData]);

  const getCurrentLocation = async () => {
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
        console.log('location is ', location);
        setCoordinates(location);
      })
      .catch((error) => {
        const {code, message} = error;
      });
  };

  //  This function will call once
  useEffect(() => {
    let obj = {
      id: route.params.bookingId,
    };
    dispatch(userBookingDetailsRequest(obj));
    getUserTypeByStorage();
  }, []);
  // Refresh by event emitter
  useEffect(() => {
    EventEmitter.on('refreshPage', () => {
      let obj = {
        id: route.params.bookingId,
      };
      dispatch(userBookingDetailsRequest(obj));
    });
  }, []);

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
  // This function is for handle the response
  useEffect(() => {
    if (bookingData !== null && bookingData.status == 200) {
      // console.log('\n\n\nBooking Data:', bookingData, '\n\n\n');
      if (
        bookingData?.data?.isCanceled === 0 &&
        (bookingData?.data?.isConfirmed === 0 ||
          bookingData?.data?.status === 1)
      ) {
        navigation.replace('BookingsUpcomingInner', {
          bookingId: route.params.bookingId,
          fromNotificationList: route.params.fromNotificationList,
        });
        return;
      }
      let firstTran = bookingData?.data?.paymentDetails?.firstTransaction;
      let lastTran = bookingData?.data?.paymentDetails?.lastTransaction;

      if (!!firstTran) {
        if (!firstTran.cardNumber) {
          setPaymentMethod(firstTran);
          setCardNumber(null);
          setCardType(null);
        } else {
          setCardNumber(firstTran?.cardNumber);
          setCardType(firstTran?.cardType);
        }
      }
      if (!!lastTran) {
        if (!lastTran.cardNumber) {
          setPaymentMethod(lastTran);
          setCardNumber(null);
          setCardType(null);
        } else {
          setCardNumber(lastTran?.cardNumber);
          setCardType(lastTran?.cardType);
        }
      }
      if (firstTran == 'Paid in Cash') {
        setPaymentMethod('Paid in Cash');
        setCardNumber('');
        setCardType('');
      } else if (lastTran == 'Paid in Cash') {
        setPaymentMethod('Paid in Cash');
        setCardNumber('');
        setCardType('');
      }
      console.log('set data is', firstTran, lastTran, '************');
      console.log('payment method is', paymentMethod);
      console.log(' Data: ', bookingData?.data);
      setCoordinatePoint({
        latitude: parseFloat(
          bookingData?.data?.ProMeta?.latitude === null
            ? 40.6976701
            : bookingData?.data?.ProMeta?.latitude,
        ),
        longitude: parseFloat(
          bookingData?.data?.ProMeta?.longitude === null
            ? -74.2598737
            : bookingData?.data?.ProMeta?.longitude,
        ),
      });
      setRegion({
        latitude: parseFloat(
          bookingData?.data?.ProMeta?.latitude === null
            ? 40.6976701
            : bookingData?.data?.ProMeta?.latitude,
        ),
        longitude: parseFloat(
          bookingData?.data?.ProMeta?.longitude === null
            ? -74.2598737
            : bookingData?.data?.ProMeta?.longitude,
        ),
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      // if (bookingData?.data?.ProMeta?.currentSubscribtionPlanId) {
      //   console.log(
      //     'PLAN ID: ',
      //     bookingData?.data?.ProMeta?.currentSubscribtionPlanId,
      //   );
      //   fetchGracePeriodData();
      // }

      // dispatch(userBookingDetailsRequestClear());
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

  useEffect(() => {
    if (bookingData?.data?.extraChargesOfBooking) {
      let ongoingList = bookingData.data.extraChargesOfBooking.filter((item) =>
        item.status == 0 || item.status == 1 ? item : null,
      );
      let completedList = bookingData.data.extraChargesOfBooking.filter(
        (item) => (item.status == 3 || item.status == 4 ? item : null),
      );

      console.log('booking list:', bookingData);
      console.log('ongoing list:', ongoingList);
      console.log('completed list:', completedList);
      setExtraChargesListOngoing(ongoingList);
      setExtraChargesListCompleted(completedList);
    }
  }, [bookingData]);

  // const onMessage = async () => {
  //   const userId = await AsyncStorage.getItem('userId');
  //   navigation.navigate('Inbox', {
  //     screen: 'InboxInner',
  //     params: {
  //       userType,
  //       channelDetails: bookingData?.data,
  //       loginId: userId,
  //       channelId: bookingData?.data?.id?.toString(),
  //     },
  //   });
  // };

  const onMessage = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const params = {
      reservationId: bookingData?.data?.reservationDisplayId,
      proId: bookingData?.data?.proId?.toString(),
    };
    mainAPI({
      url: '/user/ask',
      data: params,
      methodType: 'post',
    })
      .then(({data}) => {
        navigation.navigate('Inbox');
        setTimeout(() => {
          navigation.navigate('Inbox', {
            screen: 'InboxInner',
            params: {
              ...params,
              fromBookings: true,
              userType: '0',
              channelId: data?.channelId,
              channelDetails: bookingData?.data,
              loginId: userId,
            },
          });
        }, 100);
      })
      .catch(() => global.showToast('Something went wrong', 'error'));
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
  // This method is to get the time format
  const reviewTimeAndDate = (date) => {
    if (date !== null) {
      let dateFormat = moment(`${date}`).utc().format('MMM DD, YYYY');
      return dateFormat;
    }
  };
  const refreshScreen = () => {
    let obj = {
      id: route.params.bookingId,
    };
    dispatch(userBookingDetailsRequest(obj));
  };
  const reviewImagePressHandler = (ProResources, imgIndex) => {
    console.log(ProResources);
    const imgUrls = ProResources.map((item) => {
      if (item.resourceType == 'image') return {uri: item.url};
    });
    setImgViewerData(imgUrls);
    setImgViewerCurrentIndex(imgIndex);
    setIsVisible(true);
  };

  const calculateTotalAmount = (amount, extraCharges, tax) => {
    if (!!extraCharges?.length) {
      let extraChargeAmount = extraCharges?.reduce(
        (acc, res) => acc + Number(res.amount),
        0,
      );
      return !!parseFloat(tax)
        ? (
            +bookingData?.data?.amount +
            extraChargeAmount +
            +bookingData?.data?.tax
          ).toFixed(2)
        : (+bookingData?.data?.amount + extraChargeAmount).toFixed(2);
    } else {
      return !!parseFloat(tax)
        ? (+bookingData?.data?.amount + +bookingData?.data?.tax).toFixed(2)
        : (+bookingData?.data?.amount).toFixed(2);
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

  return (
    <Fragment>
      <StatusBar backgroundColor="#F36A46" />
      <Container
        style={[commonStyle.mainContainer, commonStyle.pb1, {paddingTop: 10}]}>
        <PTRView
          onRefresh={refreshScreen}
          colors="#ff5f22"
          style={{backgroundColor: '#fff', color: '#ff5f22'}}>
          {loderStatus ? (
            <ActivityLoaderSolid />
          ) : (
            <>
              <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                <View
                  style={[
                    commonStyle.skipHeaderWrap,
                    {
                      marginTop: Platform.OS === 'ios' ? 32 : 0,
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
                    {bookingData !== null
                      ? timeFormat(
                          bookingData?.data?.date,
                          bookingData?.data?.time,
                        )
                      : null}
                  </Text>
                  <View style={{alignSelf: 'flex-start'}}>
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
                    {bookingData !== null &&
                    bookingData?.data?.isConfirmed == 1 &&
                    bookingData?.data?.isCanceled == 0 &&
                    bookingData?.data?.status == 2 ? (
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.confirmStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          Ongoing
                        </Text>
                      </TouchableHighlight>
                    ) : null}
                    {bookingData !== null &&
                    bookingData?.data?.isConfirmed == 0 &&
                    bookingData?.data?.isCanceled == 0 &&
                    bookingData?.data?.status == 1 ? (
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.confirmStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          Pending
                        </Text>
                      </TouchableHighlight>
                    ) : null}
                    {bookingData !== null &&
                    bookingData?.data?.isConfirmed == 1 &&
                    bookingData?.data?.status == 5 &&
                    bookingData?.data?.isCanceled == 0 ? (
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.confirmStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          Cash not recieved
                        </Text>
                      </TouchableHighlight>
                    ) : null}
                    {bookingData !== null &&
                    bookingData?.data?.isConfirmed == 1 &&
                    bookingData?.data?.status == 6 &&
                    bookingData?.data?.isCanceled == 0 ? (
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.confirmStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          Incomplete
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
                    {bookingData?.data?.status == 4 &&
                    bookingData?.data?.isCanceled == 0 ? (
                      <TouchableHighlight
                        style={[
                          commonStyle.bookingStatusbtn,
                          commonStyle.noshowStatusbtn,
                        ]}>
                        <Text style={commonStyle.bookingStatusbtnText}>
                          No show
                        </Text>
                      </TouchableHighlight>
                    ) : null}
                  </View>
                  <View>
                    <List
                      style={[
                        commonStyle.bookingInnerUser,
                        {paddingVertical: 0},
                      ]}>
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
                              proId: bookingData?.data?.pro?.id,
                              singleBack: false,
                              doubleBack: true,
                            });
                          }, 10);
                        }}>
                        <Left style={commonStyle.favoritesUserAvaterwrap}>
                          <Image
                            style={commonStyle.favoritesUserAvaterImg}
                            source={
                              bookingData?.data?.pro?.profileImage
                                ? {uri: bookingData?.data?.pro?.profileImage}
                                : require('../assets/images/default-user.png')
                            }
                          />
                        </Left>
                        <Body style={commonStyle.switchAccountbody}>
                          <Text style={commonStyle.blackTextR}>
                            {/* {bookingData?.data?.pro?.userName} */}
                            {profileData?.ProMetas[0]?.businessName}
                          </Text>
                          {bookingData?.data?.ProMeta?.isPhoneNOShare == 1 && (
                            <Text
                              style={commonStyle.categorytagsText}
                              numberOfLines={1}>
                              {bookingData?.data?.ProMeta?.countryCode}{' '}
                              {bookingData?.data?.ProMeta?.phoneNumber}
                            </Text>
                          )}
                        </Body>
                        <View style={{marginLeft: 10}}>
                          <RightAngle />
                        </View>
                      </ListItem>
                    </List>
                  </View>
                  <View style={[commonStyle.socialShareRow, commonStyle.mt3]}>
                    {bookingData?.data?.ProMeta?.subscriptionStatus === 1 &&
                    ((bookingData?.data?.ReservedServiceMeta?.type === 1 &&
                      bookingData?.data?.status == 3 &&
                      bookingData?.data?.isConfirmed == 1 &&
                      bookingData?.data?.isCanceled == 0) ||
                      bookingData?.data?.isCanceled == 1 ||
                      (bookingData?.data?.status == 4 &&
                        bookingData?.data?.isCanceled == 0)) ? (
                      <View style={commonStyle.socialShareRowCol}>
                        <TouchableOpacity
                          style={commonStyle.mb1}
                          onPress={() => {
                            navigation.navigate('Explore');
                            setTimeout(() => {
                              navigation.navigate('BookService', {
                                proId: bookingData?.data?.proId,
                                serviceId: bookingData?.data?.serviceId,
                                isRebook: true,
                              });
                            }, 100);
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
                            Rebook
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    {bookingData?.data?.reportedByCustomer == 0 ? (
                      <View style={commonStyle.socialShareRowCol}>
                        <TouchableOpacity
                          style={commonStyle.mb1}
                          onPress={() =>
                            navigation.navigate('BookingsPreviousInnerReport', {
                              bookId: bookingData?.data?.id,
                              reservationId: bookingData?.data?.id,
                              bookingProImage:
                                bookingData?.data?.pro?.profileImage,
                              bookingProName:
                                profileData?.ProMetas[0]?.businessName,
                              bookingProAddress: ProMetas.address,
                              bookingProService:
                                bookingData?.data?.ReservedServiceMeta?.name,
                              bookingCustomerId: '',
                              bookingData: bookingData?.data,
                              reportType: 'client',
                            })
                          }>
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
                            style={[
                              commonStyle.blackTextR,
                              commonStyle.textCenter,
                            ]}
                            numberOfLines={1}>
                            Report
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                    <View style={commonStyle.socialShareRowCol}>
                      <TouchableOpacity
                        style={commonStyle.mb1}
                        onPress={onMessage}>
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
                          style={[
                            commonStyle.blackTextR,
                            commonStyle.textCenter,
                          ]}
                          numberOfLines={1}>
                          Message
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={commonStyle.categoriseListWrap}>
                  {bookingData?.data?.ReservedServiceMeta?.type == 1 &&
                    bookingData?.data?.status == 2 &&
                    bookingData?.data?.isConfirmed == 1 &&
                    bookingData?.data?.isCanceled == 0 &&
                    extraChargesListOngoing?.length > 0 && (
                      <View style={commonStyle.setupCardBox}>
                        <Text
                          style={[commonStyle.subtextblack, commonStyle.mb2]}>
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
                                      style={[
                                        commonStyle.blackTextR,
                                        commonStyle.mb05,
                                      ]}
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
                              <Text
                                style={commonStyle.blackTextR}
                                numberOfLines={1}>
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
                                  <Text
                                    style={commonStyle.bookingStatusbtnText}>
                                    Completed
                                  </Text>
                                </TouchableHighlight>
                              ) : null}
                            </View>
                            <View
                              style={[
                                commonStyle.dividerfull,
                                {width: '100%'},
                              ]}></View>
                          </View>
                        ))}
                      </View>
                    )}
                </View>
                <View style={commonStyle.categoriseListWrap}>
                  <View style={[commonStyle.setupCardBox]}>
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
                            ${bookingData?.data?.amount}
                          </Text>
                        </TouchableHighlight>
                      </ListItem>
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
                        {/* <Text style={commonStyle.dotSmall}>.</Text>
                  <Text style={[commonStyle.grayText16, {marginLeft: 4}]}>
                    1 h
                  </Text> */}
                      </View>
                    </List>
                    {/* {!!bookingData?.data?.note &&
                    !!bookingData?.data?.note !== ''
                      ? // End Change: Snehasish Das, Issue #1772
                        calculateNotes(bookingData?.data?.note).map(
                          (noteItem, index) => (
                            <View
                              key={index}
                              style={[
                                commonStyle.bookadditionaltext,
                                commonStyle.mb2,
                              ]}>
                              <Text style={commonStyle.blackTextR}>
                                {noteItem}
                              </Text>
                            </View>
                          ),
                        )
                      : null} */}
                    {!!bookingData?.data?.commentByCustomer &&
                    !!bookingData?.data?.commentByCustomer !== '' ? (
                      <View
                        style={[
                          commonStyle.bookadditionaltext,
                          commonStyle.mb2,
                        ]}>
                        <Text style={commonStyle.blackTextR}>
                          {bookingData?.data?.commentByCustomer}
                        </Text>
                      </View>
                    ) : null}

                    {/* only for regular, ompleted booking */}
                    {bookingData?.data?.ReservedServiceMeta?.type == 1 &&
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
                            <React.Fragment key={index}>
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
                            </React.Fragment>
                          ))}
                        </View>
                      </View>
                    ) : null}
                    {!!parseFloat(bookingData?.data?.tax) && (
                      <>
                        <View style={commonStyle.dividerlinefull} />
                        <View
                          style={[
                            commonStyle.bookingdatewrap,
                            commonStyle.mb2,
                            commonStyle.mt2,
                          ]}>
                          <Text
                            style={commonStyle.blackTextR}
                            numberOfLines={1}>
                            Tax
                          </Text>
                          <Text style={[commonStyle.blackTextR]}>
                            ${(+bookingData?.data?.tax).toFixed(2)}
                          </Text>
                        </View>
                      </>
                    )}
                    {!!bookingData?.data?.amount && (
                      <>
                        <View style={commonStyle.dividerlinefull} />
                        <View
                          style={[
                            commonStyle.bookingdatewrap,
                            commonStyle.mb05,
                            commonStyle.mt2,
                          ]}>
                          <Text
                            style={commonStyle.blackTextR}
                            numberOfLines={1}>
                            Total
                          </Text>
                          <Text
                            style={[
                              commonStyle.blackText16,
                              commonStyle.colorOrange,
                            ]}>
                            {calculateTotalAmount(
                              bookingData?.data?.amount,
                              extraChargesListCompleted,
                              bookingData?.data?.tax,
                            )}
                          </Text>
                        </View>
                      </>
                    )}
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
                                <Marker coordinate={coordinatePoint}>
                                  <CustomMapPointer />
                                </Marker>
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
                          }}>
                          <DirectionsIcon />
                          <Text
                            style={[commonStyle.blackText16, commonStyle.ml1]}>
                            Directions
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                      {/* End Change: Snehasish Das Issues #1651, #1652 */}
                    </View>
                    <View style={commonStyle.mt2}>
                      <Text style={[commonStyle.blackTextR, commonStyle.mb1]}>
                        {(ProMetas && ProMetas.address) ||
                          'Address Info Unavailable'}
                      </Text>
                      {shopDistance ? (
                        <TouchableHighlight>
                          <Text style={commonStyle.grayText14}>
                            <MapPointer />
                            {`${' '}${shopDistance} from you`}
                          </Text>
                        </TouchableHighlight>
                      ) : null}
                    </View>
                  </View>
                  {!!bookingData?.data?.paymentDetails && (
                    <View style={[commonStyle.setupCardBox]}>
                      <Text
                        style={[commonStyle.subtextblack, commonStyle.mb15]}>
                        Payment method
                      </Text>
                      <View
                        style={[commonStyle.paymentCardWrap, commonStyle.mb1]}>
                        {cardType ? (
                          <Image
                            style={commonStyle.paymentCardImg}
                            source={selectCardType(cardType)}
                          />
                        ) : null}
                        <Text style={commonStyle.blackTextR}>
                          {cardNumber ? cardNumberFormat(cardNumber) : null}
                        </Text>
                        {!!cardNumber && !!paymentMethod && (
                          <Text style={commonStyle.blackTextR}>{' & '}</Text>
                        )}
                        <Text style={commonStyle.blackTextR}>
                          {paymentMethod ? paymentMethod : null}
                        </Text>
                      </View>
                    </View>
                  )}
                  {bookingData != null &&
                  bookingData?.data?.reviewRating?.userReviews?.length > 0 ? (
                    <View style={[commonStyle.setupCardBox]}>
                      <Text style={[commonStyle.subtextblack, commonStyle.mb1]}>
                        Your review
                      </Text>
                      {bookingData?.data?.reviewRating?.userReviews?.map(
                        (review) => (
                          <>
                            <List
                              style={[
                                commonStyle.reviewslist,
                                {borderBottomWidth: 0, marginTop: 0},
                              ]}>
                              <ListItem
                                thumbnail
                                style={[
                                  commonStyle.switchAccountView,
                                  commonStyle.mb15,
                                ]}>
                                <Left style={commonStyle.reviewsAvaterwrap}>
                                  {review?.commentedBy == 1 ? (
                                    <Image
                                      style={commonStyle.reviewsAvaterImg}
                                      defaultSource={require('../assets/images/signup/account-avater-1.png')}
                                      source={
                                        review?.customer?.profileImage
                                          ? {
                                              uri: `${review?.customer?.profileImage}`,
                                            }
                                          : require('../assets/images/signup/account-avater-1.png')
                                      }
                                    />
                                  ) : (
                                    <Image
                                      style={commonStyle.reviewsAvaterImg}
                                      defaultSource={require('../assets/images/signup/account-avater-1.png')}
                                      source={
                                        bookingData?.data?.pro
                                          ? {
                                              uri: `${bookingData?.data?.pro?.profileImage}`,
                                            }
                                          : require('../assets/images/signup/account-avater-1.png')
                                      }
                                    />
                                  )}
                                </Left>
                                <Body style={commonStyle.switchAccountbody}>
                                  <Text
                                    style={[
                                      commonStyle.blackTextR,
                                      commonStyle.mb05,
                                    ]}>
                                    {review?.commentedBy == 1
                                      ? review?.customer?.userName
                                      : review?.pro?.businessName}
                                  </Text>
                                  <Text
                                    style={commonStyle.grayText14}
                                    numberOfLines={1}>
                                    {reviewTimeAndDate(
                                      moment(review?.createdAt).format(
                                        'D MMM, YYYY',
                                      ),
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
                                    style={[
                                      commonStyle.text14bold,
                                      {marginLeft: 4},
                                    ]}>
                                    {/* {review?.ProRating?.rating?.toFixed(1)} */}
                                    {review?.commentedBy == 1
                                      ? review?.ProRating?.rating?.toFixed(1)
                                      : parseFloat(
                                          bookingData?.data
                                            ?.professionalOverallRating?.rating,
                                        )?.toFixed(1)}
                                  </Text>
                                </TouchableOpacity>
                              </ListItem>
                              <TouchableHighlight
                                style={commonStyle.outlintextbtn}>
                                <Text style={commonStyle.categorytagsText}>
                                  {bookingData?.data?.ReservedServiceMeta?.name}
                                </Text>
                              </TouchableHighlight>
                            </List>
                            <View>
                              <Text
                                style={[
                                  commonStyle.blackTextR,
                                  commonStyle.mb15,
                                ]}>
                                {review?.content}
                              </Text>
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}>
                                {review?.ProReviewResources?.map(
                                  (items, index) => (
                                    <TouchableOpacity
                                      onPress={() =>
                                        reviewImagePressHandler(
                                          review.ProReviewResources,
                                          index,
                                        )
                                      }
                                      style={[
                                        commonStyle.reviewuploadedpicWrap,
                                        {
                                          borderWidth: 1,
                                          borderColor: 'red',
                                        },
                                      ]}
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
                              <ImageView
                                images={imgViewerData}
                                imageIndex={imgViewerCurrentIndex}
                                visible={visible}
                                onRequestClose={() => setIsVisible(false)}
                              />
                            </View>
                          </>
                        ),
                      )}
                    </View>
                  ) : null}
                </View>
              </KeyboardAwareScrollView>
              {/* bookingData?.data?.status == 3 && bookingData?.data?.reviewRating?.review != null*/}
              {bookingData?.data?.status == 3 &&
              bookingData?.data?.reviewRating?.userReviews?.length === 0 &&
              bookingData?.data?.isConfirmed == 1 &&
              bookingData?.data?.isCanceled == 0 ? (
                <View style={commonStyle.footerwrap}>
                  <View style={[commonStyle.footerbtn]}>
                    <Button
                      title="Leave a review"
                      containerStyle={commonStyle.buttoncontainerothersStyle}
                      buttonStyle={commonStyle.commonbuttonStyle}
                      titleStyle={commonStyle.buttontitleStyle}
                      onPress={() =>
                        navigation.navigate(
                          'BookingsPreviousInnerLeaveReview',
                          {
                            userType: 'customer',
                            bookingData: bookingData?.data,
                            businessName:
                              profileData?.ProMetas[0]?.businessName,
                          },
                        )
                      }
                    />
                  </View>
                </View>
              ) : (
                <></>
              )}
            </>
          )}
        </PTRView>
      </Container>
    </Fragment>
  );
};
export default BookingsPreviousInner;
