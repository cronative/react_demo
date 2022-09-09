import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actionTypes';

import { Post, Put } from '../../api/apiAgent';

function getApi(postData) {
  var contentType = '';
  if (postData.methodType === 'put') {
    console.log('postData', postData);
    return Put(postData.url, postData.data, 'application/json')
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else {
    if (postData.contentType) {
      contentType = 'multipart/form-data';
    } else {
      contentType = 'application/json';
    }

    return (
      Post(postData.url, postData.data, '', contentType)
        //,contentType='multipart/form-data'
        .then((response) => response)
        .catch((error) => {
          throw error;
        })
    );
  }
}
// profile setup step seven
function* contectSetupHelper(action) {
  console.log('contectSetupHelper', action);
  const postData = {
    url: '/pro/add-contact-prefs',
    data: action.value,
    methodType: 'post',
  };
  try {
    // this response will return data about user we will send it to user reducer when we work on that
    const contectSetupDetails = yield call(getApi, postData);
    console.log('contectSetupDetails', contectSetupDetails);
    yield put({
      type: actions.CONTECT_SETUP_SUCCESS,
      message: contectSetupDetails.message,
      contectSetupDetails: contectSetupDetails,
    });
  } catch (e) {
    console.log(e);
    console.log(e.response);
    yield put({
      type: actions.CONTECT_SETUP_FAILED,
      error: e?.response?.data?.message,
      //contectSetupDetails: e.response.data
    });
  }
}

// profile setup step eight
function* profileSetupStepEightHelper(action) {
  console.log('profileSetupStepEightHelper', action);
  const postData = {
    url: '/pro/add-payment-terms',
    data: action.value,
    methodType: 'post',
  };
  try {
    // this response will return data about user we will send it to user reducer when we work on that
    const termOfPaymentDetails = yield call(getApi, postData);
    console.log('termOfPaymentDetails', termOfPaymentDetails);
    yield put({
      type: actions.TERM_OF_PAYMENT_SETUP_SUCCESS,
      message: termOfPaymentDetails.message,
      termOfPaymentDetails: termOfPaymentDetails,
    });
  } catch (e) {
    console.log(e);
    console.log(e.response);
    yield put({
      type: actions.TERM_OF_PAYMENT_SETUP_FAILED,
      error: e?.response?.data?.message,
    });
  }
}
//step nine additional info
function* additionalInfSetupoHelper(action) {
  // console.log('additionalInfSetupoHelper', action);
  const postData = {
    url: '/pro/additional-info',
    data: action.value,
    methodType: 'post',
    contentType: 'multipart/form-data',
  };
  try {
    // this response will return data about user we will send it to user reducer when we work on that
    const aditionalInfoDetails = yield call(getApi, postData);
    console.log('aditionalInfoDetails', aditionalInfoDetails);
    yield put({
      type: actions.ADDITIONAL_INFO_SUCCESS,
      message: aditionalInfoDetails.message,
      aditionalInfoDetails: aditionalInfoDetails,
    });
  } catch (e) {
    // console.log(e);
    // console.log(e.response);
    yield put({
      type: actions.ADDITIONAL_INFO_FAILED,
      //message: aditionalInfoDetails.message,
      error: e?.response?.data?.message,
      aditionalInfoDetails: e.response.data,
    });
  }
}
export function* professionalProfileSetupSaga() {
  yield takeEvery(actions.CONTECT_SETUP_REQUEST, contectSetupHelper);
  yield takeEvery(
    actions.TERM_OF_PAYMENT_SETUP_REQUEST,
    profileSetupStepEightHelper,
  );
  yield takeEvery(actions.ADDITIONAL_INFO_REQUEST, additionalInfSetupoHelper);
}
