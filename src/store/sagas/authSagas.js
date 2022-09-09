import {call, put, takeEvery} from 'redux-saga/effects';
import {Post, Put} from '../../api/apiAgent';
import * as actions from '../actionTypes';

function getApi(postData) {
  if (postData.methodType === 'put') {
    return Put(postData.url, postData.data, 'application/json')
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  } else {
    return Post(postData.url, postData.data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }
}

function* forgotPasswordHelper(action) {
  const postData = {
    url: '/user/forgot-password',
    data: action.value,
    methodType: action.methodType,
  };

  try {
    const forgotPasswordReturn = yield call(getApi, postData);
    yield put({
      type: actions.FORGOT_PASSWORD_SUCCESS,
      message: forgotPasswordReturn.message,
    });
  } catch (e) {
    yield put({
      type: actions.FORGOT_PASSWORD_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* createPasswordHelper(action) {
  const postData = {
    url: '/user/reset-password',
    data: action.value,
    methodType: action.methodType,
  };

  try {
    const createPasswordReturn = yield call(getApi, postData);
    yield put({
      type: actions.CREATE_PASSWORD_SUCCESS,
      message: createPasswordReturn.message,
    });
  } catch (e) {
    yield put({
      type: actions.CREATE_PASSWORD_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* logoutHelper(action) {
  // there is no api for logout in the backend
  // ! need to clear async Storage
  yield put({
    type: actions.LOGOUT_SUCCESS,
    message: 'logout Successfuly',
  });
}

export function* authSaga() {
  yield takeEvery(actions.FORGOT_PASSWORD_REQUEST, forgotPasswordHelper);
  yield takeEvery(actions.CREATE_PASSWORD_REQUEST, createPasswordHelper);
  yield takeEvery(actions.LOGOUT_REQUEST, logoutHelper);
}
