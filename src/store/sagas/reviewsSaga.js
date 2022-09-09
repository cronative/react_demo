import {call, put, takeEvery} from 'redux-saga/effects';
import {Get, Post, Put} from '../../api/apiAgent';
import * as actions from '../actionTypes';

function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    return Get(requestedData.url)
      .then((response) => {
        return response;
      })
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

// REVIEWS helper
function* reviewsHelper(action) {
  let url = '/user/reviews?proId=' + action.value.proId;
  if (action.value.page && action.value.limit) {
    url += `&limit=${action.value.limit}&page=${action.value.page}`;
  }

  console.log('REVIEW URL TO BE FETCHED: ', url);

  const getData = {
    url: url,
    methodType: 'get',
  };

  try {
    const result = yield call(mainAPI, getData);
    console.log('review saga result', {
      type: actions.REVIEWS_SUCCESS,
      message: result.message,
      status: result.status,
      rows: result.rows,
      data: result.data,
    });
    yield put({
      type: actions.REVIEWS_SUCCESS,
      message: result.message,
      status: result.status,
      rows: result.rows,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: actions.REVIEWS_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}
// RATINGS helper
function* ratingsHelper(action) {
  const getData = {
    url: '/user/ratings?proId=' + action.value.proId,
    methodType: 'get',
  };

  try {
    const result = yield call(mainAPI, getData);
    console.log(result);
    yield put({
      type: actions.RATINGS_SUCCESS,
      message: result.message,
      status: result.status,
      data: result.data,
    });
  } catch (e) {
    console.log('Reviews Error', e);
    yield put({
      type: actions.RATINGS_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

// User own review and rating details helper
function* userOwnReviewRatingHelper(action) {
  const getData = {
    url: 'user/myRatingsReviwes',
    methodType: 'get',
  };
  try {
    // This response will return user own review and rating details,
    // once received we will send it to review reducer
    const userOwnReviewRatingRes = yield call(mainAPI, getData);
    yield put({
      type: actions.USER_OWN_REVIEW_RATING_SUCCESS,
      userOwnRatingRevieData: userOwnReviewRatingRes,
    });
  } catch (e) {
    yield put({
      type: actions.USER_OWN_REVIEW_RATING_FAILED,
      userOwnRatingRevieData:
        e?.response?.data?.status == 500 ? null : e?.response?.data?.message,
    });
  }
}

export function* reviewsSaga() {
  yield takeEvery(actions.REVIEWS_REQUEST, reviewsHelper);
  yield takeEvery(actions.RATINGS_REQUEST, ratingsHelper);
  yield takeEvery(
    actions.USER_OWN_REVIEW_RATING_REQUEST,
    userOwnReviewRatingHelper,
  );
}
