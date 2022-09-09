import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import {Get, Post, Put} from '../../api/apiAgent';

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

// SIMILAR PROS helper
function* similarProsHelper(action) {
  //   let url = `/user/list-professionals?categories=${action.value.primaryCategory}`;
  let url = `/user/similar-professionals?proId=${action.value.proId}`;
  if (
    action.value.location &&
    action.value.location.latitude &&
    action.value.location.longitude
  ) {
    url = `/user/similar-professionals?proId=${action.value.proId}&latitude=${action.value.location.latitude}&longitude=${action.value.location.longitude}`;
  }
  const getData = {
    url: url,
    methodType: 'get',
  };
  console.log('URL to be fetched: ', url);
  try {
    const similarProsResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.SIMILAR_PROS_SUCCESS,
      message: similarProsResponse.message,
      status: similarProsResponse.status,
      data: similarProsResponse.data,
    });
  } catch (e) {
    yield put({
      type: actions.SIMILAR_PROS_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

export function* similarProsSaga() {
  yield takeEvery(actions.SIMILAR_PROS_REQUEST, similarProsHelper);
}
