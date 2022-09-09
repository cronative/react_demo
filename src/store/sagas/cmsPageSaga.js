import { call, put, takeEvery } from 'redux-saga/effects';
import * as actions from '../actionTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Get } from '../../api/apiAgent';

async function getApi(postData) {
  let userType = await AsyncStorage.getItem('userType');

  console.log('userType *************************** ', userType);

  let url = "user/cms-list/termOfService"
  if (userType == "1") {
    url = "user/cms-list/2VZse"
  }

  console.log("URL LLLLL == ", url)

  return Get(url, '')
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}

async function getPPApi(postData) {




  console.log("URL LLLLL == ", postData.url)

  return Get(postData.url, '')
    .then((response) => response)
    .catch((error) => {
      throw error;
    });
}
function* cmsPageHelper(action) {
  const postData = {
    url: action.url,
  };
  try {
    const cmsPageDetails = yield call(getPPApi, postData);
    console.log("postDatapostDatapostDatapostDatapostData >>>", postData);
    yield put({
      type: actions.CMS_PAGE_SUCCESS,
      message: cmsPageDetails.message,
      data: cmsPageDetails && cmsPageDetails.data,
    });
  } catch (e) {
    yield put({
      type: actions.CMS_PAGE_FAILED,
      error: e?.response?.data?.message,
    });
  }
}

function* termsConditionHelper(action) {


  console.log('action', action);
  const postData = {
    url: 'user/cms-list/termOfService',
  };
  try {
    const termsConditionDetails = yield call(getApi, postData);
    yield put({
      type: actions.ACCEPT_TERMS_CONDITION_SUCCESS,
      message: termsConditionDetails.message,
      data: termsConditionDetails && termsConditionDetails.data,
    });
  } catch (e) {
    yield put({
      type: actions.ACCEPT_TERMS_CONDITION_FAILED,
      error: e?.response?.data?.message,
    });
  }
}

export function* cmsSaga() {
  yield takeEvery(actions.CMS_PAGE_REQUEST, cmsPageHelper);
  yield takeEvery(actions.ACCEPT_TERMS_CONDITION_REQUEST, termsConditionHelper);
}
