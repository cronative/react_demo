import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import {Get, Post, Put} from '../../api/apiAgent';

function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    console.log('THE API ENDPOINT IS: '.requestedData);
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

// Organic Client Profile details helper
function* clientProfileDetailsHelper(action) {
  let url = `/pro/clients/${action.value.customerId}`;
  const getData = {
    url: url,
    methodType: 'get',
  };

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const clientProfileDetailsResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.CLIENT_PROFILE_DETAILS_SUCCESS,
      message: clientProfileDetailsResponse.message,
      status: clientProfileDetailsResponse.status,
      details: clientProfileDetailsResponse.data,
    });
  } catch (e) {
    console.log('Client profile details Error', e);
    yield put({
      type: actions.CLIENT_PROFILE_DETAILS_FAILED,
      error: e,
    });
  }
}
// Organic Client Profile Load More helper
function* clientProfileDetailsLoadMoreHelper(action) {
  let url = `/pro/clients/${action.value.customerId}?page=${action.value.page}`;
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const clientProfileDetailsLoadMoreResponse = yield call(mainAPI, getData);
    console.log(
      'Client profile Load More Success',
      clientProfileDetailsLoadMoreResponse.data.bookingDetails.data,
    );
    yield put({
      type: actions.CLIENT_PROFILE_LOADMORE_SUCCESS,
      message: clientProfileDetailsLoadMoreResponse.message,
      status: clientProfileDetailsLoadMoreResponse.status,
      nextPageBookings:
        clientProfileDetailsLoadMoreResponse.data.bookingDetails.data,
    });
  } catch (e) {
    console.log('Client profile details Error', e);
    yield put({
      type: actions.CLIENT_PROFILE_LOADMORE_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}
// Walkin Client Profile details helper
function* walkinClientProfileDetailsHelper(action) {
  let url = '/pro/clients/walk-in/' + action.value.customerId;
  const getData = {
    url: url,
    methodType: 'get',
  };

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const walkinClientProfileDetailsResponse = yield call(mainAPI, getData);
    console.log(
      'Walkin Client profile details Success',
      walkinClientProfileDetailsResponse,
    );
    yield put({
      type: actions.WALKIN_CLIENT_PROFILE_DETAILS_SUCCESS,
      message: walkinClientProfileDetailsResponse.message,
      status: walkinClientProfileDetailsResponse.status,
      details: walkinClientProfileDetailsResponse.data,
    });
  } catch (e) {
    console.log('Walkin Client profile details Error', e);
    yield put({
      type: actions.WALKIN_CLIENT_PROFILE_DETAILS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

// Client Reviews by Pros Self helper
function* clientReviewsSelfHelper(action) {
  let url = `/pro/clients/${action.value.customerId}/review/self`;
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    const clientReviewsSelfResponse = yield call(mainAPI, getData);
    console.log(
      'Client Reviews by pros Self Success',
      clientReviewsSelfResponse,
    );
    yield put({
      type: actions.CLIENT_REVIEWS_SELF_SUCCESS,
      message: clientReviewsSelfResponse.message,
      status: clientReviewsSelfResponse.status,
      self_reviews: clientReviewsSelfResponse.data,
    });
  } catch (e) {
    console.log('Client Reviews by pros Self Error', e);
    yield put({
      type: actions.CLIENT_REVIEWS_SELF_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}
// Client Reviews by Pros Others helper
function* clientReviewsOthersHelper(action) {
  let url = `/pro/clients/${action.value.customerId}/review/others`;
  const getData = {
    url: url,
    methodType: 'get',
  };
  console.log('GET DATA', getData);
  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const clientReviewsOthersResponse = yield call(mainAPI, getData);
    console.log(
      'Client Reviews by pros Others Success',
      clientReviewsOthersResponse,
    );
    yield put({
      type: actions.CLIENT_REVIEWS_OTHERS_SUCCESS,
      message: clientReviewsOthersResponse.message,
      status: clientReviewsOthersResponse.status,
      others_reviews: clientReviewsOthersResponse.data,
    });
  } catch (e) {
    console.log('Client Reviews by pros Others Error', e);
    yield put({
      type: actions.CLIENT_REVIEWS_OTHERS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

export function* clientProfileDetailsSaga() {
  yield takeEvery(
    actions.CLIENT_PROFILE_DETAILS_REQUEST,
    clientProfileDetailsHelper,
  );
  yield takeEvery(
    actions.CLIENT_PROFILE_LOADMORE_REQUEST,
    clientProfileDetailsLoadMoreHelper,
  );
  yield takeEvery(
    actions.WALKIN_CLIENT_PROFILE_DETAILS_REQUEST,
    walkinClientProfileDetailsHelper,
  );
  yield takeEvery(actions.CLIENT_REVIEWS_SELF_REQUEST, clientReviewsSelfHelper);
  yield takeEvery(
    actions.CLIENT_REVIEWS_OTHERS_REQUEST,
    clientReviewsOthersHelper,
  );
  // yield takeEvery(actions.PREVIOUS_BOOKING_LIST_REQUEST, previousBookingListHelper);
}
