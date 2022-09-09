import {call, put, takeEvery} from 'redux-saga/effects';
import * as actions from '../actionTypes';
import {Get, Post, Put} from '../../api/apiAgent';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// Professional Profile details helper
function* professionalListingByCategoryHelper(action) {
  // let url = `/user/global-search?categories=${action.value.categoryId}`;
  let url;
  let updatedUrl;

  // checking logIn or not
  const token = yield call(getToken);

  async function getToken() {
    try {
      return await AsyncStorage.getItem('userId');
    } catch (error) {
      console.log(error);
    }
  }

  if (token) {
    url = '/user/list-professionals?';
  } else {
    console.log(token);
    url = '/user/list-professionals-no-login?';
  }

  //checking if quert ssrring seaarch or not
  if (action.value.searchString) {
    url = url + `search=${encodeURIComponent(action.value.searchString)}`;
    // if(action.value.location && action.value.location.latitude && action.value.location.longitude){
    //     url = `/user/list-professionals?&search=${action.value.searchString}&latitude=${action.value.location.latitude}&longitude=${action.value.location.longitude}`
    //     // url = `/user/list-professionals?&search=${action.value.searchString}&latitude=40.742188&longitude=-73.988062`
    // }
  } else {
    url = url + `categories=${action.value.categoryId ?? ''}`;
  }

  if (
    action.value.location &&
    action.value.location.latitude &&
    action.value.location.longitude
  ) {
    // url = `/user/list-professionals?categories=${action.value.categoryId}&latitude=40.742188&longitude=-73.988062`;
    // url = `/user/list-professionals?categories=${action.value.categoryId}&latitude=${action.value.location.latitude}&longitude=${action.value.location.longitude}`;
    url =
      url +
      `&latitude=${action.value.location.latitude}&longitude=${action.value.location.longitude}`;
  }
  // else {
  //     url = `/user/list-professionals?categories=${action.value.categoryId}`;
  // }
  if (action.value.sort) {
    updatedUrl = url + `&sort=${action.value.sort}`;
    url = updatedUrl;
  }
  if (action.value.topRatedFilter) {
    updatedUrl = url + `&topRated=1`;
    url = updatedUrl;
  }
  if (
    action.value.typeOfService &&
    (action.value.typeOfService.isAll === true ||
      action.value.typeOfService.isInPerson === true ||
      action.value.typeOfService.isMobile === true ||
      action.value.typeOfService.isVirtual === true)
  ) {
    let params;
    if (action.value.typeOfService.isAll === true) {
      params = `&inPersonType=1&mobileType=1&virtualType=1`;
      updatedUrl = url + params;
      url = updatedUrl;
    } else {
      if (action.value.typeOfService.isInPerson === true) {
        params = `&inPersonType=1`;
        updatedUrl = url + params;
        url = updatedUrl;
      }
      if (action.value.typeOfService.isMobile === true) {
        params = `&mobileType=1`;
        updatedUrl = url + params;
        url = updatedUrl;
      }
      if (action.value.typeOfService.isVirtual === true) {
        params = `&virtualType=1`;
        updatedUrl = url + params;
        url = updatedUrl;
      }
    }
  }
  if (action.value.priceRange) {
    //
    console.log('RECEIVED PRICE RANGE: ', action.value.priceRange);
    updatedUrl =
      url +
      `&minPrice=${action.value.priceRange[0]}&maxPrice=${action.value.priceRange[1]}`;
    url = updatedUrl;
    //
  }
  if (action.value.date) {
    console.log('RECEIVED DATES: ', action.value.date);
    updatedUrl =
      url + `&fromDate=${action.value.date[0]}&toDate=${action.value.date[1]}`;
    url = updatedUrl;
  }
  if (action.value.nearest) {
    //   url = `/user/search-by-current-location?latitude=${action.value.location.latitude}&longitude=${action.value.location.longitude}`
    updatedUrl = url;
    url = updatedUrl;
  }
  if (action.value.openNow) {
    updatedUrl = url + `&open=1`;
    url = updatedUrl;
  }

  console.log('URL TO BE FETCHED: ', url);
  const getData = {
    url: url,
    methodType: 'get',
  };
  try {
    console.log('SUCCESS', getData);
    const professionalListingByCategoryResponse = yield call(mainAPI, getData);
    console.log(
      'Professional Listing By Category Success',
      professionalListingByCategoryResponse,
    );
    yield put({
      type: actions.PROFESSIONAL_LISTING_BY_CATEGORY_SUCCESS,
      message: professionalListingByCategoryResponse.message,
      professionalListingByCategoryData: professionalListingByCategoryResponse,
    });
  } catch (e) {
    console.log('ERROR');
    console.log('Professional listing by category Error', e.response);
    yield put({
      type: actions.PROFESSIONAL_LISTING_BY_CATEGORY_FAILED,
      error: e.response,
      professionalListingByCategoryData: null,
    });
  }
}

export function* professionalListingByCategorySaga() {
  yield takeEvery(
    actions.PROFESSIONAL_LISTING_BY_CATEGORY_REQUEST,
    professionalListingByCategoryHelper,
  );
}
