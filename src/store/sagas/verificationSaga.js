import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import {Get, Post, Put, DeleteBodyParameter} from '../../api/apiAgent';

function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    return Get(requestedData.url)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'post') {
    return Post(
      requestedData.url,
      requestedData.data,
      '',
      requestedData.contentType,
    )
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'put') {
    return Put(requestedData.url, requestedData.data, requestedData.contentType)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else if (requestedData.methodType === 'delete') {
    return DeleteBodyParameter(requestedData.url, requestedData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }
}
//   proIdentication
// Verify identity helper
function* veryfyIdentityHelper(action) {
  const getData = {
    url: '/pro/upload-id',
    methodType: 'post',
    data: action.value,
    contentType: 'multipart/form-data',
  };
  try {
    // This response will return the verify identity details, once received we will send it to verification reducer
    const verificationRes = yield call(mainAPI, getData);
    yield put({
      type: actions.VERIFY_IDENTITY_SUCCESS,
      verifyIdentityData: verificationRes,
    });
  } catch (e) {
    yield put({
      type: actions.VERIFY_IDENTITY_FAILED,
      verifyIdentityData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Pending verification helper
function* pendingVerificationHelper(action) {
  const getData = {
    url: '/pro/business-details',
    methodType: 'get',
  };
  try {
    // This response will return the pending verification details, once received we will send it to verification reducer
    const pendingVerificationRes = yield call(mainAPI, getData);
    yield put({
      type: actions.PENDING_VERIFICATION_SUCCESS,
      pendingVerificationData: pendingVerificationRes,
    });
  } catch (e) {
    yield put({
      type: actions.PENDING_VERIFICATION_FAILED,
      pendingVerificationData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// pro trial expire check helper
function* trialExpireCheckHelper(action) {
  const getData = {
    url: '/pro/plan-expiry',
    methodType: 'get',
  };
  try {
    // This response will return trial expire check details, once received we will send it to verification reducer
    const trialExpireCheckRes = yield call(mainAPI, getData);
    yield put({
      type: actions.PRO_TRIAL_EXPIRE_CHECK_SUCCESS,
      trialExpireCheckData: trialExpireCheckRes,
    });
  } catch (e) {
    yield put({
      type: actions.PRO_TRIAL_EXPIRE_CHECK_FAILED,
      trialExpireCheckData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

export function* verificationSaga() {
  yield takeEvery(actions.VERIFY_IDENTITY_REQUEST, veryfyIdentityHelper);
  yield takeEvery(
    actions.PENDING_VERIFICATION_REQUEST,
    pendingVerificationHelper,
  );
  yield takeEvery(
    actions.PRO_TRIAL_EXPIRE_CHECK_REQUEST,
    trialExpireCheckHelper,
  );
}
