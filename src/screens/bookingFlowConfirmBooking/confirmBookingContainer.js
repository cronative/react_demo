import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {BackHandler, Dimensions} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {mainAPI, Get, Post} from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import {
  bookServiceRequest,
  listCardRequest,
  updateCardRequest,
} from '../../store/actions';
import {bookServiceClear} from '../../store/actions/bookingAction';
import ConfirmBookingComponent from './confirmBookingComponent';

const {width, height} = Dimensions.get('window');

const ConfirmBookingContainer = ({navigation, route}) => {
  //* Constants and Variables
  const isFocused = useIsFocused();

  //* Redux Selectors
  const dispatch = useDispatch();
  const professionalProfileDetailsData = useSelector(
    (state) => state.professionalDetails.details,
  );
  const proMetaInfo = useSelector(
    (state) => state.professionalDetails.details?.ProMetas?.[0],
  );
  const bookingError = useSelector((state) => state.bookingReducer.error);
  const bookingLoaderStatus = useSelector(
    (state) => state.bookingReducer.loader,
  );
  const cardsList = useSelector(
    (state) => state.profileReducer.listCardData,
  )?.data;
  const bookingSuccess = useSelector(
    (state) => state.bookingReducer.bookingSuccess,
  );
  const cartCreation = useSelector(
    (state) => state.bookingReducer.cartCreation,
  );

  //* Route Params
  const {groupSessionId, comment: sessionComment} = route.params || {};

  //* Component States
  const [visibleModal, setVisibleModal] = useState(false);
  const [date, setDate] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(undefined);
  const [comment, setComment] = useState('');
  const [tncAgreed, setTncAgreed] = useState(false);
  const [cardData, setCardData] = useState(undefined);
  const [timerLimit, setTimerLimit] = useState(10);
  const [cartTime, setCartTime] = useState(null);

  //* Interval reference
  let cartInterval;

  //* Component Effects
  useEffect(() => {
    AsyncStorage.getItem('cartData').then((cartData) => {
      let prevSelectedServices;

      if (cartData) {
        cartData = JSON.parse(cartData);
        prevSelectedServices = cartData?.selectedServices.map((s) => ({
          ...s,
          timeSlot: moment(s.timeSlot),
        }));

        setSelectedServices(prevSelectedServices);
        setDate(moment(prevSelectedServices[0].timeSlot).format('D MMMM YYYY'));
        setComment(cartData.comment);
      }
    });

    dispatch(listCardRequest());
    Get('admin/site-settings/cartEmptyTime')
      .then((response) => {
        if (!!response?.data?.keyValue && !isNaN(+response?.data?.keyValue)) {
          setTimerLimit(+response.data.keyValue);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const backHandlerdata = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        dispatch({type: 'SET_BOOKING_EDIT', payload: true});
        navigation.goBack();
        return true;
      },
    );

    return () => backHandlerdata.remove();
  }, []);

  useEffect(() => {
    if (
      isFocused &&
      cardsList &&
      Array.isArray(cardsList) &&
      cardsList.length > 0 &&
      !!proMetaInfo?.payInApp
    ) {
      setCardData(cardsList.find((card) => card.isDefault));
      setPaymentMethod(2);
    }
  }, [cardsList]);

  useEffect(() => {
    if (bookingSuccess) {
      navigation.navigate('BookingSuccess');
      dispatch(bookServiceClear());
    }
  }, [bookingSuccess]);

  useEffect(() => {
    if (!!bookingError) {
      console.log('Booking Error: ', bookingError);
      if (
        bookingError.status === 403 &&
        bookingError.message === 'Cart is Empty'
      ) {
        navigation.pop(2);
        dispatch(bookServiceClear());
      }
    }
  }, [bookingError]);

  useFocusEffect(
    useCallback(() => {
      setCartTime(null);
      clearInterval(cartInterval);

      if (!!timerLimit && !!cartCreation) {
        cartInterval = setInterval(() => {
          setCartTime(
            moment(cartCreation).add(timerLimit, 'minutes') - moment(),
          );
        }, 1000);
      }

      return () => {
        clearInterval(cartInterval);
      };
    }, [timerLimit, cartCreation]),
  );

  //* Event Handlers
  const onEditServices = () => {
    dispatch({type: 'SET_BOOKING_EDIT', payload: true});
    navigation.goBack();
  };

  const onBookService = async () => {
    console.log('selectedServices: ', selectedServices);
    if (
      selectedServices.findIndex((m) =>
        moment(m.timeSlot).isBefore(moment()),
      ) != -1
    ) {
      global.showToast(
        'One or more booking time has passed already. Please edit your booking',
        'error',
      );
      return;
    }
    if (!!paymentMethod) {
      try {
        const response = await Get(
          `pro/verify-rf-token/${professionalProfileDetailsData.id}`,
        );
        console.log('Success');
      } catch (error) {
        console.log('Error: ', error);
      }
      if (groupSessionId) {
        //const userId = await AsyncStorage.getItem('userId');
        if (!!cardData && !cardData.isDefault) {
          try {
            let obj = {
              cardId: cardData.id,
              name: cardData.name,
              expirationDate: cardData.expirationDate,
              isDefault: 1,
            };

            const updateCard = {
              url: '/user/update-card',
              methodType: 'put',
              data: obj,
              contentType: 'application/json',
            };
            await mainAPI(updateCard);
          } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message;
            global.showToast(msg ? msg : 'Something went wrong', 'error');
            return;
          }
        }
        Post('user/book-service-group', {
          groupSessionId,
          proUserId: professionalProfileDetailsData.id,
          paymentMethod: paymentMethod,
          note: sessionComment
        })
          .then(() => {
            navigation.navigate('BookingSuccess');
          })
          .catch((e) => {
            let message =
              e?.response?.data?.status === 500 ||
              e?.response?.data?.status === '500'
                ? 'Something went wrong'
                : e?.response?.data?.message;
            message = !!e?.response?.data?.error?.raw?.message
              ? `Payment could not go through with your card ending with ****${e?.response?.data?.error?.payment_method?.card?.last4}`
              : message;
            global.showToast(message, 'error');
          });
        return;
      }

      dispatch(
        bookServiceRequest(
          {paymentMethod: paymentMethod},
          cardData ? cardData : cardsList.find((card) => card.isDefault),
        ),
      );
    } else {
      global.showToast('Please select a payment method', 'error');
    }
  };

  return (
    <ConfirmBookingComponent
      tncAgreed={tncAgreed}
      setTncAgreed={setTncAgreed}
      onBookService={onBookService}
      bookingLoaderStatus={bookingLoaderStatus}
      visibleModal={visibleModal}
      setVisibleModal={setVisibleModal}
      proMetaInfo={proMetaInfo}
      selectedServices={selectedServices}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      cardData={cardData}
      setCardData={setCardData}
      date={date}
      onEditServices={onEditServices}
      professionalProfileDetailsData={professionalProfileDetailsData}
      comment={comment}
      navigation={navigation}
      cardsList={cardsList}
      cartCreation={cartCreation}
      timerLimit={timerLimit}
      cartTime={cartTime}
      groupSessionId={groupSessionId}
    />
  );
};

export default ConfirmBookingContainer;
