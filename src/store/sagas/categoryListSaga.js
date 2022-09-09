import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';

import {Get} from '../../api/apiAgent';

function getApi() {
  return Get('user/list-categories', '')
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

function* categoryListHelper(action) {
  try {
    const categoryList = yield call(getApi);
    yield put({
      type: actions.CATEGORY_LIST_SUCCESS,
      message: categoryList.message,
      categoryListDetails: categoryList,
    });
  } catch (e) {
    yield put({
      type: actions.CATEGORY_LIST_FAILED,
      error: e?.response?.data?.message,
    });
  }
}

export function* categoryListSaga() {
  yield takeEvery(actions.CATEGORY_LIST_REQUEST, categoryListHelper);
}
