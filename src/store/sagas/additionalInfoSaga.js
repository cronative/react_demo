import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';

import {Post} from '../../api/apiAgent';

function postApi(postdata) {
  return Post('user/additional-info', postdata.data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

function* additionalInfoHelper(action) {
  const postdata = {
    data: action.value,
  };
  try {
    const additionalInfo = yield call(postApi, postdata);
    yield put({
      type: actions.ADDITIONAL_INFO_SUCCESS,
      message: additionalInfo.message,
      status: additionalInfo.status,
    });
  } catch (e) {
    yield put({
      type: actions.ADDITIONAL_INFO_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

export function* additionalInfoSaga() {
  yield takeEvery(actions.ADDITIONAL_INFO_REQUEST, additionalInfoHelper);
}
