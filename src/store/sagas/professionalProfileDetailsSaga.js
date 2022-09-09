import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actionTypes';
import { Get, Post, Put } from '../../api/apiAgent';
import AsyncStorage from '@react-native-async-storage/async-storage';

function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    console.log('THE API ENDPOINT IS: ', requestedData);
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

const getLoginUserToken = async () => {
  return await AsyncStorage.getItem('accessToken');
}

// Professional Profile details helper
function* professionalProfileDetailsHelper(action) {
  // const loginUserToken = AsyncStorage.getItem('accessToken');
  const loginUserToken = yield call(getLoginUserToken);
  let apiURL;
  if (!!loginUserToken && loginUserToken != '') {
    apiURL = '/user/professional-details/' + action.value.proId + '/loggedInUser';
  } else {
    apiURL = '/user/professional-details/' + action.value.proId;
  }
  console.log('API URLLLLLLLLLLLLLLLLLLLLLLLL : ', apiURL);
  const getData = {
    url: apiURL,
    methodType: 'get',
  };

  try {
    // This response will return data of all upcoimng booking list, once received we will send it to booking reducer
    console.log('Before Call')
    const professionalProfileDetailsResponse = yield call(mainAPI, getData);
    console.log(
      'Professional profile Success',
      professionalProfileDetailsResponse,
    );
    yield put({
      type: actions.PROFESSIONAL_PROFILE_DETAILS_SUCCESS,
      message: professionalProfileDetailsResponse.message,
      status: professionalProfileDetailsResponse.status,
      details: professionalProfileDetailsResponse.data,
    });
  } catch (e) {
    console.log('Professional profile Error', e.response);
    yield put({
      type: actions.PROFESSIONAL_PROFILE_DETAILS_FAILED,
      // error: e.response.data.message,
      error: e,
    });
  }
}

export function* professionalProfileDetailsSaga() {
  yield takeEvery(
    actions.PROFESSIONAL_PROFILE_DETAILS_REQUEST,
    professionalProfileDetailsHelper,
  );
  // yield takeEvery(actions.PREVIOUS_BOOKING_LIST_REQUEST, previousBookingListHelper);
}
