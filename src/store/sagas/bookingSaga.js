import {call, put, takeEvery, takeLatest} from 'redux-saga/effects';
import {Get, Post, Put} from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import * as actions from '../actionTypes';

function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    return Get(requestedData.url)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'post') {
    return Post(requestedData.url, requestedData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'put') {
    return Put(requestedData.url, requestedData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }
}

// Upcoming booking list helper
function* upcominBookingListHelper(action) {
  const getData = {
    // Start Change: Snehasish Das, Issue #1687
    url: '/user/bookings/up?filter[isCanceled] = 0',
    // End Change: Snehasish Das, Issue #1687
    methodType: 'get',
  };
  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const upcomingBookingResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.UPCOMING_BOOKING_LIST_SUCCESS,
      message: upcomingBookingResponse.message,
      upcomingBookingListDetails: upcomingBookingResponse,
    });
  } catch (e) {
    yield put({
      type: actions.UPCOMING_BOOKING_LIST_FAILED,
      error:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e?.response?.data?.message,
      upcomingBookingListDetails: null,
    });
  }
}

// Previous booking list helper
function* previousBookingListHelper(action) {
  const getData = {
    url: '/user/bookings/prev',
    methodType: 'get',
  };
  try {
    // This response will return data of all previous booking list, once received we will send it to booking reducer
    const previousBookingResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.PREVIOUS_BOOKING_LIST_SUCCESS,
      message: previousBookingResponse.message,
      previousBookingListDetails: previousBookingResponse,
    });
  } catch (e) {
    yield put({
      type: actions.PREVIOUS_BOOKING_LIST_FAILED,
      error:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e?.response?.data?.message,
      previousBookingListDetails: null,
    });
  }
}

// Professional booking inner page details
function* professionalBookingInnerDataHelper(action) {
  const getData = {
    url: action.value.orderDisplayId
      ? `/pro/booking-details?bookingId=${action.value.orderDisplayId}`
      : `/pro/reservation-details?id=${action.value.pageId}`,
    methodType: 'get',
  };
  try {
    // This response will return data of Professional booking inner page, once received we will send it to booking reducer
    const profBookingInnerRes = yield call(mainAPI, getData);
    console.log('booking details : ', profBookingInnerRes);
    yield put({
      type: actions.PRO_BOOKING_INNER_SUCCESS,
      profBookingInnerData: profBookingInnerRes,
    });
  } catch (e) {
    yield put({
      type: actions.PRO_BOOKING_INNER_FAILED,
      profBookingInnerData: e,
    });
  }
}

// Previous booking list helper
function* professionalBookingListHelper(action) {
  let dateFilter = action.value.date;
  let dateFilterTo = action.value.toDate;
  let apiURl;
  if (dateFilterTo === null) {
    apiURl = `/pro/booking/calendar?date=${dateFilter}`;
  } else {
    apiURl = `/pro/booking/calendar?date=${dateFilter}&toDate=${dateFilterTo}`;
  }
  const getData = {
    url: apiURl,
    methodType: 'get',
  };
  try {
    // This response will return data of all professional upcoming booking list, once received we will send it to booking reducer
    const profUpcomingBooking = yield call(mainAPI, getData);
    yield put({
      type: actions.PROF_UPCOMING_BOOKING_SUCCESS,
      profBookingListData: profUpcomingBooking,
    });
  } catch (e) {
    yield put({
      type: actions.PROF_UPCOMING_BOOKING_FAILED,
      profBookingListData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Professional cencel booking inner page details
function* proCancelBookingHelper(action) {
  const getData = {
    url: '/pro/cancel-booking',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return data of Professional cancel booking inner page, once received we will send it to booking reducer
    const proCancelBookingRes = yield call(mainAPI, getData);
    yield put({
      type: actions.PRO_BOOKING_CANCEL_SUCCESS,
      proBookingCalcelData: proCancelBookingRes,
    });
  } catch (e) {
    console.log('Message : ', e?.response?.data?.message);
    yield put({
      type: actions.PRO_BOOKING_CANCEL_FAILED,
      proBookingCalcelData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Professional booking re-schedule inner page details
function* proNoShowBookingHelper(action) {
  const getData = {
    url: '/pro/booking-no-show',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return data of Professional re-schedule booking inner page, once received we will send it to booking reducer
    const proNoShowResponse = yield call(mainAPI, getData);
    console.log('data', proNoShowResponse);
    yield put({
      type: actions.PRO_BOOKING_NOSHOW_SUCCESS,
      proBookingNoShowData: proNoShowResponse,
    });
  } catch (e) {
    yield put({
      type: actions.PRO_BOOKING_NOSHOW_FAILED,
      proBookingNoShowData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
    console.log('error', e);
  }
}

// Professional booking add notes inner page details
function* proAddNotesBookingHelper(action) {
  const getData = {
    url: '/pro/add-notes',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return data of Professional add notes booking inner page, once received we will send it to booking reducer
    const proAddNotesRes = yield call(mainAPI, getData);
    yield put({
      type: actions.PRO_BOOKING_NOTES_Add_SUCCESS,
      proBookingAddNotesData: proAddNotesRes,
    });
  } catch (e) {
    yield put({
      type: actions.PRO_BOOKING_NOTES_Add_FAILED,
      proBookingAddNotesData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Professional booking complete inner page details
function* proCompleteBookingHelper(action) {
  const getData = {
    url: '/pro/complete-booking',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the message of logged out customer, once received we will send it to profile reducer
    const proBookingCompleteRes = yield call(mainAPI, getData);
    console.log('proBookingCompleteRes', proBookingCompleteRes);
    yield put({
      type: actions.PRO_BOOKING_COMPLETE_SUCCESS,
      proBookingCompleteData: proBookingCompleteRes,
    });
  } catch (e) {
    console.log('error', e);
    yield put({
      type: actions.PRO_BOOKING_COMPLETE_FAILED,
      proBookingCompleteData: e,
    });
  }
}

// User booking inner page details
function* userBookingDetailsHelper(action) {
  const getData = {
    url: action.value.orderDisplayId
      ? `/user/booking-details?bookingId=${action.value.orderDisplayId}`
      : `/user/bookings/${action.value.id}`,
    methodType: 'get',
  };
  console.log('Details saga : ', getData);
  try {
    // This response will return the details of user booking, once received we will send it to booking reducer
    const userBookingDetailsRes = yield call(mainAPI, getData);
    yield put({
      type: actions.USER_BOOKING_DETAILS_SUCCESS,
      userBookingData: userBookingDetailsRes,
    });
  } catch (e) {
    yield put({
      type: actions.USER_BOOKING_DETAILS_FAILED,
      userBookingData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// User booking inner page details
function* userBookingCancelHelper(action) {
  const getData = {
    url: `/user/booking-cancel`,
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the cencel of user booking, once received we will send it to booking reducer
    const userBookingCancelRes = yield call(mainAPI, getData);
    yield put({
      type: actions.USER_BOOKING_CANCEL_SUCCESS,
      userBookingCencelData: userBookingCancelRes,
    });
  } catch (e) {
    const msg =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    global.showToast(msg, 'error');
    yield put({
      type: actions.USER_BOOKING_CANCEL_FAILED,
      error: msg,
    });
  }
}

// User booking inner page details
function* userBookingRescheduleHelper({value}) {
  const type = value.type;
  const reservationDisplayId = value.reservationDisplayId;
  delete value.type;
  delete value.reservationDisplayId;

  const getData = {
    url: `/${type ? 'pro' : 'user'}/booking-reschedule`,
    methodType: 'post',
    data: value,
  };
  try {
    // This response will return the reschedule of user booking, once received we will send it to booking reducer
    const userBookingRescheduleRes = yield call(mainAPI, getData);
    global.showToast(userBookingRescheduleRes.message, 'success');
    yield put({
      type: actions.USER_BOOKING_RESCHEDULE_SUCCESS,
      userBookingRescheduleData: userBookingRescheduleRes,
    });
    yield put({
      type:
        type == 'pro'
          ? actions.PRO_BOOKING_INNER_REQUEST
          : actions.USER_BOOKING_DETAILS_REQUEST,
      value:
        type == 'pro'
          ? {pageId: reservationDisplayId}
          : {id: value.reservationId},
    });
  } catch (e) {
    console.log('Result: ', e?.response);
    const message = e?.response?.data?.message;
    global.showToast(
      message !== '' ? message : 'Something went wrong',
      'error',
    );

    yield put({
      type: actions.USER_BOOKING_RESCHEDULE_FAILED,
      userBookingRescheduleData: e,
    });
  }
}

function* getBookingSlots({payload: {proId}}) {
  try {
    const data = yield call(mainAPI, {
      url: `/user/booking-slots/${proId}`,
      methodType: 'get',
    });
    yield put({
      type: actions.GET_BOOKING_SLOTS_SUCCESS,
      payload: data,
    });
  } catch (e) {
    const message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    yield put({
      type: actions.GET_BOOKING_SLOTS_FAILED,
      error: message,
    });
    global.showToast(message, 'error');
  }
}

function* addToCart({payload}) {
  console.log('payload', payload);
  try {
    const data = yield call(mainAPI, {
      url: `/user/cart`,
      methodType: 'post',
      data: payload,
    });
    console.log('Add Cart Data: ', data);
    yield put({
      type: actions.ADD_TO_CART_SUCCESS,
      payload: data,
    });
    global.showToast('Services added to cart successfully', 'success');
  } catch (e) {
    const message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    yield put({
      type: actions.ADD_TO_CART_FAILED,
      error: e.response.data,
    });
    console.log('error', e);
    global.showToast(message, 'error');
  }
}

function* removeCartItem({payload}) {
  try {
    const data = yield call(mainAPI, {
      url: `/user/cart/${payload.id}`,
      methodType: 'delete',
    });
    yield put({
      type: actions.DELETE_CART_ITEM_SUCCESS,
      payload: data,
    });
  } catch (e) {
    const message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    yield put({
      type: actions.DELETE_CART_ITEM_FAILED,
      error: message,
    });
    global.showToast(message, 'error');
  }
}

function* updateCart({payload}) {
  try {
    const data = yield call(mainAPI, {
      url: `/user/cart`,
      methodType: 'put',
      data: payload,
    });
    console.log('Updated Cart Data: ', data);
    yield put({
      type: actions.UPDATE_CART_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log('Updated Cart Error: ', e);
    const message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    yield put({
      type: actions.UPDATE_CART_FAILED,
      error: message,
    });
    global.showToast(message, 'error');
  }
}

function* bookService({payload, cardData}) {
  try {
    console.log(cardData);
    if (!!cardData && !cardData.isDefault) {
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

      const updateResponse = yield call(mainAPI, updateCard);
      console.log(updateResponse);
    }

    const response = yield call(mainAPI, {
      url: `/user/book-service-single`,
      methodType: 'post',
      data: payload,
    });
    yield put({
      type: actions.BOOK_SERVICE_SUCCESS,
      payload: response.data,
    });
    global.showToast(response?.message, 'success');
  } catch (e) {
    let message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Something went wrong'
        : e?.response?.data?.message;
    message =
      e?.response?.data?.status === 403 &&
      e?.response?.data?.message === 'Cart is Empty'
        ? 'Cart has expired. New booking needs to be done.'
        : message;
    //Start Change: Snehasish Das, Issue #1805
    message = !!e?.response?.data?.error?.raw?.message
      ? `Payment could not go through with your card ending with ****${e?.response?.data?.error?.payment_method?.card?.last4}`
      : message;
    //End Change: Snehasish Das, Issue #1805
    yield put({
      type: actions.BOOK_SERVICE_FAILED,
      error: e.response.data,
    });
    global.showToast(message, 'error');
  }
}

export function* bookingSaga() {
  yield takeEvery(
    actions.UPCOMING_BOOKING_LIST_REQUEST,
    upcominBookingListHelper,
  );
  yield takeEvery(
    actions.PREVIOUS_BOOKING_LIST_REQUEST,
    previousBookingListHelper,
  );
  yield takeEvery(
    actions.PROF_UPCOMING_BOOKING_REQUEST,
    professionalBookingListHelper,
  );
  yield takeEvery(
    actions.PRO_BOOKING_INNER_REQUEST,
    professionalBookingInnerDataHelper,
  );
  yield takeEvery(actions.PRO_BOOKING_CANCEL_REQUEST, proCancelBookingHelper);
  yield takeEvery(actions.PRO_BOOKING_NOSHOW_REQUEST, proNoShowBookingHelper);
  yield takeEvery(
    actions.PRO_BOOKING_NOTES_Add_REQUEST,
    proAddNotesBookingHelper,
  );
  yield takeEvery(
    actions.PRO_BOOKING_COMPLETE_REQUEST,
    proCompleteBookingHelper,
  );
  yield takeLatest(actions.GET_BOOKING_SLOTS_REQUEST, getBookingSlots);
  yield takeLatest(actions.ADD_TO_CART_REQUEST, addToCart);
  yield takeLatest(actions.DELETE_CART_ITEM_REQUEST, removeCartItem);
  yield takeLatest(actions.UPDATE_CART_REQUEST, updateCart);
  yield takeLatest(actions.BOOK_SERVICE_REQUEST, bookService);
  yield takeEvery(
    actions.USER_BOOKING_DETAILS_REQUEST,
    userBookingDetailsHelper,
  );
  yield takeEvery(actions.USER_BOOKING_CANCEL_REQUEST, userBookingCancelHelper);
  yield takeEvery(
    actions.USER_BOOKING_RESCHEDULE_REQUEST,
    userBookingRescheduleHelper,
  );
}
