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

// Professional Profile details helper
function* clientsListHelper(action) {
  let url;

  if (
    action.value &&
    action.value.listType &&
    action.value.listType === 'all'
  ) {
    url = '/pro/clients/';
  }
  if (
    action.value &&
    action.value.listType &&
    action.value.listType === 'new'
  ) {
    url = '/pro/clients/new';
  }
  if (
    action.value &&
    action.value.listType &&
    action.value.listType === 'walkin'
  ) {
    url = '/pro/clients/walk-in';
  }
  if (
    action.value &&
    action.value.listType &&
    action.value.listType === 'low'
  ) {
    url = '/pro/clients/low-engagement';
  }
  if (
    action.value &&
    action.value.listType &&
    action.value.listType == 'contacts'
  ) {
    url = '/pro/procontacts-list';
  }
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const clientsListResponse = yield call(mainAPI, getData);
    console.log('Clients List Success', JSON.stringify(clientsListResponse));
    yield put({
      type: actions.CLIENTS_LIST_SUCCESS,
      message: clientsListResponse.message,
      status: clientsListResponse.status,
      details: clientsListResponse.data,
    });
  } catch (e) {
    console.log('Clients List Error', {e});
    yield put({
      type: actions.CLIENTS_LIST_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

function* topClientsHelper(action) {
  let url = '/pro/clients/top';
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const topClientsResponse = yield call(mainAPI, getData);
    console.log('Top Clients Success', topClientsResponse);
    yield put({
      type: actions.TOP_CLIENTS_SUCCESS,
      message: topClientsResponse.message,
      status: topClientsResponse.status,
      top_clients: topClientsResponse.data,
    });
  } catch (e) {
    console.log('Clients List Error', e);
    yield put({
      type: actions.TOP_CLIENTS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

// ANALYTICS DATA
function* professionalAnalyticsHelper(action) {
  let url = '/pro/clients/analytics';
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const professionalAnalyticsResponse = yield call(mainAPI, getData);
    console.log('PRO ANALYTICS Success', professionalAnalyticsResponse);
    yield put({
      type: actions.PROFESSIONAL_ANALYTICS_SUCCESS,
      message: professionalAnalyticsResponse.message,
      status: professionalAnalyticsResponse.status,
      analytics_data: professionalAnalyticsResponse.data,
    });
  } catch (e) {
    console.log('PRO ANALYTICS Success', e);
    yield put({
      type: actions.PROFESSIONAL_ANALYTICS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

// ANALYTICS - GRAPHS DATA
function* professionalAnalyticsGraphsHelper(action) {
  let url = '/pro/clients/analytics/graph';
  const getData = {
    url: url,
    methodType: 'get',
  };

  console.log('URL TO BE FETCHED: ', url);

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    const professionalAnalyticsGraphsResponse = yield call(mainAPI, getData);
    console.log(
      'PRO ANALYTICS GRAPHS Success',
      professionalAnalyticsGraphsResponse,
    );
    yield put({
      type: actions.PROFESSIONAL_ANALYTICS_GRAPHS_SUCCESS,
      message: professionalAnalyticsGraphsResponse.message,
      status: professionalAnalyticsGraphsResponse.status,
      graph_data: professionalAnalyticsGraphsResponse.data,
    });
  } catch (e) {
    console.log('PRO ANALYTICS GRAPHS error', e);
    yield put({
      type: actions.PROFESSIONAL_ANALYTICS_GRAPHS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

// Manual client list helper
function* manualClientListHelper(action) {
  const getData = {
    url: '/pro/add-client',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return theresponse msg, once received we will send it to clientList reducer
    const getResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.MANUAL_CLIENT_CONTACTS_SUCCESS,
      manualClientData: getResponse,
    });
  } catch (e) {
    yield put({
      type: actions.MANUAL_CLIENT_CONTACTS_FAILED,
      manualClientData: e?.response?.data?.status == 500 ? null : e,
    });
  }
}

// Import client list helper
function* importClientListHelper(action) {
  const getData = {
    url: '/pro/add-multiple-clients',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the response msg, once received we will send it to clientList reducer
    const getResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.IMPORT_CLIENT_CONTACTS_SUCCESS,
      importClientData: getResponse,
    });
  } catch (e) {
    yield put({
      type: actions.IMPORT_CLIENT_CONTACTS_FAILED,
      importClientData: e?.response?.data?.status == 500 ? null : e,
    });
  }
}

export function* clientsListSaga() {
  yield takeEvery(actions.CLIENTS_LIST_REQUEST, clientsListHelper);
  yield takeEvery(actions.TOP_CLIENTS_REQUEST, topClientsHelper);
  yield takeEvery(
    actions.PROFESSIONAL_ANALYTICS_REQUEST,
    professionalAnalyticsHelper,
  );
  yield takeEvery(
    actions.PROFESSIONAL_ANALYTICS_GRAPHS_REQUEST,
    professionalAnalyticsGraphsHelper,
  );
  // yield takeEvery(actions.PREVIOUS_BOOKING_LIST_REQUEST, previousBookingListHelper);
  yield takeEvery(
    actions.MANUAL_CLIENT_CONTACTS_REQUEST,
    manualClientListHelper,
  );
  yield takeEvery(
    actions.IMPORT_CLIENT_CONTACTS_REQUEST,
    importClientListHelper,
  );
}
