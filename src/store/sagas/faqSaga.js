import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';

import {Delete, DeleteBodyParameter, Get, Post, Put} from '../../api/apiAgent';

function getApi(postData) {
  console.log('postData==   ', postData);
  return Get(
    postData.url,
    (postData.searchValue && {search: postData.searchValue}) || '',
  )
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

function postApi(postData) {
  return Post(postData.url, postData.data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

function putApi(postData) {
  return Put(postData.url, postData.data)
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

async function deleteApi(postData) {
  try {
    const response = await Delete(postData.url, postData.data);
    return response;
  } catch (error) {
    throw error;
  }
}

function* faqListHelper(action) {
  console.log('action', action);
  const postData = {
    url: 'user/admin-faqs',
    searchValue: action.searchValue,
  };
  try {
    const faqDetails = yield call(getApi, postData);
    yield put({
      type: actions.FAQ_LISTING_SUCCESS,
      message: faqDetails && faqDetails.message,
      status: faqDetails && faqDetails.status,
      data: faqDetails && faqDetails.data,
    });
  } catch (e) {
    console.log('error', e.response);
    yield put({
      type: actions.FAQ_LISTING_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* professionalFaqListHelper(action) {
  const postData = {
    url: 'pro/faq',
  };
  try {
    const faqDetails = yield call(getApi, postData);
    console.log('faqDetails', faqDetails);
    yield put({
      type: actions.PROFESSIONAL_FAQ_LISTING_SUCCESS,
      message: faqDetails && faqDetails.message,
      status: faqDetails && faqDetails.status,
      data: faqDetails && faqDetails.data && faqDetails.data.rows,
    });
  } catch (e) {
    console.log('error', e.response);
    yield put({
      type: actions.PROFESSIONAL_FAQ_LISTING_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* professionalFaqAddHelper(action) {
  const postData = {
    url: 'pro/add-faq',
    data: {quesAnswers: [action.data]},
  };
  console.log('postData= ', postData);
  try {
    const faqDetails = yield call(postApi, postData);
    console.log('faqDetails add ', faqDetails);
    yield put({
      type: actions.PROFESSIONAL_FAQ_ADD_SUCCESS,
      message: faqDetails && faqDetails.message,
      status: faqDetails && faqDetails.status,
      data: faqDetails && faqDetails.data,
    });
  } catch (e) {
    console.log('error', e.response);
    yield put({
      type: actions.PROFESSIONAL_FAQ_ADD_FAILED,
      addError:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* professionalFaqEditHelper(action) {
  const postData = {
    url: 'pro/edit-faq',
    data: action.data,
  };
  try {
    const faqDetails = yield call(putApi, postData);
    yield put({
      type: actions.PROFESSIONAL_FAQ_EDIT_SUCCESS,
      message: faqDetails && faqDetails.message,
      status: faqDetails && faqDetails.status,
      data: faqDetails && faqDetails.data,
    });
  } catch (e) {
    console.log('error', e.response);
    yield put({
      type: actions.PROFESSIONAL_FAQ_EDIT_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

function* professionalFaqDeleteHelper(action) {
  const postData = {
    url: 'pro/remove-faq',
    data: action.data,
  };
  try {
    const faqDetails = yield call(deleteApi, postData);
    console.log('faqDetails delete', faqDetails);
    yield put({
      type: actions.PROFESSIONAL_FAQ_DELETE_SUCCESS,
      message: faqDetails && faqDetails.message,
      status: faqDetails && faqDetails.status,
      data: faqDetails && faqDetails.data,
    });
  } catch (e) {
    console.log('error', e.response);
    yield put({
      type: actions.PROFESSIONAL_FAQ_DELETE_FAILED,
      error:
        (e?.response && e?.response?.data?.message) || 'Something went wrong',
    });
  }
}

export function* faqListSaga() {
  yield takeEvery(actions.FAQ_LISTING_REQUEST, faqListHelper);
  yield takeEvery(
    actions.PROFESSIONAL_FAQ_LISTING_REQUEST,
    professionalFaqListHelper,
  );
  yield takeEvery(
    actions.PROFESSIONAL_FAQ_ADD_REQUEST,
    professionalFaqAddHelper,
  );
  yield takeEvery(
    actions.PROFESSIONAL_FAQ_EDIT_REQUEST,
    professionalFaqEditHelper,
  );
  yield takeEvery(
    actions.PROFESSIONAL_FAQ_DELETE_REQUEST,
    professionalFaqDeleteHelper,
  );
}
