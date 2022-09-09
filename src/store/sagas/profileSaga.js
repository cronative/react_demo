import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { call, put, takeEvery } from 'redux-saga/effects';
import { DeleteBodyParameter, Get, Post, Put } from '../../api/apiAgent';
import global from '../../components/commonservices/toast';
import * as actions from '../actionTypes';

async function mainAPI(requestedData) {
  if (requestedData.methodType === 'get') {
    try {
      const response = await Get(requestedData.url);
      return response;
    } catch (error) {
      throw error;
    }
  } else if (requestedData.methodType === 'post') {
    try {
      const response_1 = await Post(requestedData.url, requestedData.data);
      return response_1;
    } catch (error_1) {
      throw error_1;
    }
  } else if (requestedData.methodType === 'media-post') {
    try {
      const response_2 = await Post(
        requestedData.url,
        requestedData.data,
        null,
        requestedData.contentType,
      );
      return response_2;
    } catch (error_2) {
      throw error_2;
    }
  } else if (requestedData.methodType === 'put') {
    try {
      const response_3 = await Put(
        requestedData.url,
        requestedData.data,
        requestedData.contentType,
      );
      return response_3;
    } catch (error_3) {
      throw error_3;
    }
  } else if (requestedData.methodType === 'delete') {
    try {
      const response_4 = await DeleteBodyParameter(
        requestedData.url,
        requestedData.data,
      );
      return response_4;
    } catch (error_4) {
      throw error_4;
    }
  }
}

// User profile details helper
function* profileDetailsHelper(action) {
  const getData = {
    url: '/user/profile',
    methodType: 'get',
  };
  try {
    // This response will return data of profile details, once received we will send it to profile reducer
    const profileData = yield call(mainAPI, getData);
    yield put({
      type: actions.PROFILE_VIEW_SUCCESS,
      message: profileData.message,
      profileDetails: profileData,
    });
  } catch (e) {
    yield put({
      type: actions.PROFILE_VIEW_FAILED,
      error:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e?.response?.data?.message,
      profileDetails: null,
    });
  }
}

// User profile image update helper
function* profileImgUpdateHelper(action) {
  const getData = {
    url: '/user/upload-profile-picture',
    methodType: 'put',
    data: action.value,
    contentType: 'multipart/form-data',
  };
  try {
    // This response will return the message of update profile image, once received we will send it to profile reducer
    const profileData = yield call(mainAPI, getData);
    yield put({
      type: actions.PROFIL_IMG_UPDATE_SUCCESS,
      message: profileData.message,
      updateImgData: profileData,
    });
  } catch (e) {
    yield put({
      type: actions.PROFIL_IMG_UPDATE_FAILED,
      updateImgData: e?.response?.data?.status == 500 ? null : e,
    });
  }
}

// User change name helper
function* changeNameHelper(action) {
  const getData = {
    url: '/user/change-name',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return the message of update name, once received we will send it to profile reducer
    const updateNameData = yield call(mainAPI, getData);
    yield put({
      type: actions.CHANGE_NAME_SUCCESS,
      nameData: updateNameData,
    });
  } catch (e) {
    yield put({
      type: actions.CHANGE_NAME_FAILED,
      nameData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// User change email helper
function* changeEmailHelper(action) {
  const getData = {
    url: '/common/request-change-email',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return the message of update email, once received we will send it to profile reducer
    const updateEmailData = yield call(mainAPI, getData);
    yield put({
      type: actions.CHANGE_EMAIL_SUCCESS,
      emailData: updateEmailData,
    });
  } catch (e) {
    yield put({
      type: actions.CHANGE_EMAIL_FAILED,
      emailData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// User change password helper
function* changePasswordHelper(action) {
  const getData = {
    url: '/user/change-password',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return the message of update password, once received we will send it to profile reducer
    const updatePassword = yield call(mainAPI, getData);
    console.log('Success Res : ', updatePassword);
    yield put({
      type: actions.CHANGE_PASSWORD_SUCCESS,
      paswordData: updatePassword,
    });
  } catch (e) {
    console.log('Error Res : ', e?.response?.data?.message);
    yield put({
      type: actions.CHANGE_PASSWORD_FAILED,
      paswordData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// User change phone number helper
function* changePhoneNumberHelper(action) {
  const getData = {
    url: '/user/change-phone',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return the message of update phone number, once received we will send it to profile reducer
    const updatePhoneData = yield call(mainAPI, getData);
    yield put({
      type: actions.CHANGE_PHONE_NUMBER_SUCCESS,
      phoneData: updatePhoneData,
    });
  } catch (e) {
    yield put({
      type: actions.CHANGE_PHONE_NUMBER_FAILED,
      phoneData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Customer send otp helper
function* sendOtpRequestHelper(action) {
  const getData = {
    url: '/common/send-otp',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the message of logged out customer, once received we will send it to profile reducer
    const getOtpRes = yield call(mainAPI, getData);
    yield put({
      type: actions.SEND_OTP_SUCCESS,
      otpData: getOtpRes,
    });
  } catch (e) {
    yield put({
      type: actions.SEND_OTP_FAILED,
      otpData: e,
    });
  }
}

// Customer logout helper
function* customerLogoutRequestHelper(action) {
  const getData = {
    url: '/user/logout',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the message of logged out customer, once received we will send it to profile reducer
    const updateLogoutData = yield call(mainAPI, getData);
    if (GoogleSignin.isSignedIn()) {
      GoogleSignin.signOut();
    }

    LoginManager.logOut();
    yield put({
      type: actions.CUSTOMER_LOGOUT_SUCCESS,
      logoutData: updateLogoutData,
    });
  } catch (e) {
    yield put({
      type: actions.CUSTOMER_LOGOUT_FAILED,
      logoutData: e,
    });
  }
}

// List card logout helper
function* listCardRequestHelper(action) {
  const getData = {
    url: '/user/list-cards',
    methodType: 'get',
  };
  try {
    // This response will return the list card details, once received we will send it to profile reducer
    const listCardData = yield call(mainAPI, getData);
    yield put({
      type: actions.LIST_CARD_SUCCESS,
      cardData: listCardData,
    });
  } catch (e) {
    yield put({
      type: actions.LIST_CARD_FAILED,
      cardData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Add card helper
function* addCardRequestHelper(action) {
  const getData = {
    url: '/user/add-card',
    methodType: 'post',
    data: action.value,
  };
  try {
    // This response will return the add card details, once received we will send it to profile reducer
    const addCardData = yield call(mainAPI, getData);
    yield put({
      type: actions.ADD_CARD_SUCCESS,
      cardData: addCardData,
    });
  } catch (e) {
    yield put({
      type: actions.ADD_CARD_FAILED,
      cardData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? 'Something went wrong'
          : e,
    });
    const message =
      e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
        ? 'Card cannot be added'
        : e?.response?.data?.message;
    global.showToast(message, 'error');
  }
}

// Update Card helper
function* updateCardRequestHelper(action) {
  const getData = {
    url: '/user/update-card',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return the update card details, once received we will send it to profile reducer
    const updateCardData = yield call(mainAPI, getData);
    yield put({
      type: actions.UPDATE_CARD_SUCCESS,
      cardData: updateCardData,
    });
  } catch (e) {
    yield put({
      type: actions.UPDATE_CARD_FAILED,
      cardData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? 'Something went wrong'
          : e,
    });
  }
}

// Delete card helper
function* deleteCardRequestHelper(action) {
  const getData = {
    url: `/user/remove-card/${action.value.id}`,
    methodType: 'delete',
  };
  try {
    // This response will return the delete card details, once received we will send it to profile reducer
    const deleteCardData = yield call(mainAPI, getData);
    yield put({
      type: actions.DELETE_CARD_SUCCESS,
      cardData: deleteCardData,
    });
  } catch (e) {
    yield put({
      type: actions.DELETE_CARD_FAILED,
      cardData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// ALL notification helper
function* allNotiftRequestHelper(action) {
  const getData = {
    url: '/user/allow-notification',
    methodType: 'put',
    contentType: 'application/json',
  };
  try {
    // This response will return all notify on/off, once received we will send it to profile reducer
    const allNotifData = yield call(mainAPI, getData);
    yield put({
      type: actions.ALL_NOTIFICATION_SUCCESS,
      notificationData: allNotifData,
    });
  } catch (e) {
    yield put({
      type: actions.ALL_NOTIFICATION_FAILED,
      notificationData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// promotion notification helper
function* promoNotiftRequestHelper(action) {
  const getData = {
    url: '/user/promo-notification',
    methodType: 'put',
    contentType: 'application/json',
  };
  try {
    // This response will return promotion notify on/off, once received we will send it to profile reducer
    const promoNotify = yield call(mainAPI, getData);
    yield put({
      type: actions.PROMO_NOTIFICATION_SUCCESS,
      notificationData: promoNotify,
    });
  } catch (e) {
    yield put({
      type: actions.PROMO_NOTIFICATION_FAILED,
      notificationData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Pros notification helper
function* prosnotifyRequestHelper(action) {
  const getData = {
    url: '/user/pro-notification',
    methodType: 'put',
    contentType: 'application/json',
  };
  try {
    // This response will return pros notify on/off, once received we will send it to profile reducer
    const prosNotify = yield call(mainAPI, getData);
    yield put({
      type: actions.PROS_NOTIFICATION_SUCCESS,
      notificationData: prosNotify,
    });
  } catch (e) {
    yield put({
      type: actions.PROS_NOTIFICATION_FAILED,
      notificationData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Booking reminder helper
function* bookingRemindNotifyHelper(action) {
  const getData = {
    url: '/user/booking-reminder',
    methodType: 'put',
    contentType: 'application/json',
  };
  try {
    // This response will return booking reminder notify on/off, once received we will send it to profile reducer
    const bookingRemindNotify = yield call(mainAPI, getData);
    yield put({
      type: actions.BOOKING_REMINDER_SUCCESS,
      notificationData: bookingRemindNotify,
    });
  } catch (e) {
    yield put({
      type: actions.BOOKING_REMINDER_FAILED,
      notificationData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Main category view helper
function* mainCatgoryViewHelper(action) {
  const getData = {
    url: '/user/list-categories',
    methodType: 'get',
  };
  try {
    // This response will return main category view, once received we will send it to profile reducer
    const mainCatViwResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.MAIN_CATEGORY_VIEW_SUCCESS,
      mainCatData: mainCatViwResponse,
    });
  } catch (e) {
    yield put({
      type: actions.MAIN_CATEGORY_VIEW_FAILED,
      mainCatData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Main category update helper
function* mainCategoryUpdateHelper(action) {
  const getData = {
    url: '/pro/add-categories',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return main category update data, once received we will send it to profile reducer
    const updateMainCatResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.MAIN_CATEGORY_EDIT_SUCCESS,
      mainCatData: updateMainCatResponse,
    });
  } catch (e) {
    console.log('Errorrrrr : ', e?.response?.data?.status);
    console.log('Errorrrrr message : ', { e });
    yield put({
      type: actions.MAIN_CATEGORY_EDIT_FAILED,
      mainCatData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Additional category view helper
function* additionalCategoryViewHelper(action) {
  const getData = {
    url: '/user/list-categories',
    methodType: 'get',
  };
  try {
    // This response will return additional category view data, once received we will send it to profile reducer
    const additionalViewResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.ADDITIONAL_CATEGORY_VIEW_SUCCESS,
      additionaCatData: additionalViewResponse,
    });
  } catch (e) {
    yield put({
      type: actions.ADDITIONAL_CATEGORY_VIEW_FAILED,
      additionaCatData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// Additional edit category helper
function* additionalCategoryEditHelper(action) {
  const getData = {
    url: '/pro/add-categories',
    methodType: 'put',
    data: action.value,
    contentType: 'application/json',
  };
  try {
    // This response will return additional category edit data, once received we will send it to profile reducer
    const additionalEditResponse = yield call(mainAPI, getData);
    yield put({
      type: actions.ADDITIONAL_CATEGORY_EDIT_SUCCESS,
      additionaCatData: additionalEditResponse,
    });
  } catch (e) {
    yield put({
      type: actions.ADDITIONAL_CATEGORY_EDIT_FAILED,
      additionaCatData:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

// User review and rating media upload helper
function* userReviewRatingMediaUpload(action) {
  const getData = {
    url: 'user/reviewResource',
    methodType: 'media-post',
    data: action.value,
    contentType: 'multipart/form-data',
  };
  try {
    // This response will return the response data of review and rating, once received we will send it to profile reducer
    const reviewRatingRes = yield call(mainAPI, getData);
    yield put({
      type: actions.USER_RATING_REVIEW_SUCCESS,
      userRatingReviewDetails: reviewRatingRes,
    });
  } catch (e) {
    yield put({
      type: actions.USER_RATING_REVIEW_FAILED,
      userRatingReviewDetails:
        e?.response?.data?.status === 500 || e?.response?.data?.status === '500'
          ? null
          : e,
    });
  }
}

export function* profileSaga() {
  yield takeEvery(actions.PROFILE_VIEW_REQUEST, profileDetailsHelper);
  yield takeEvery(actions.PROFIL_IMG_UPDATE_REQUEST, profileImgUpdateHelper);
  yield takeEvery(actions.CHANGE_NAME_REQUEST, changeNameHelper);
  yield takeEvery(actions.CHANGE_EMAIL_REQUEST, changeEmailHelper);
  yield takeEvery(actions.CHANGE_PASSWORD_REQUEST, changePasswordHelper);
  yield takeEvery(actions.CHANGE_PHONE_NUMBER_REQUEST, changePhoneNumberHelper);
  yield takeEvery(actions.SEND_OTP_REQUEST, sendOtpRequestHelper);
  yield takeEvery(actions.CUSTOMER_LOGOUT_REQUEST, customerLogoutRequestHelper);
  yield takeEvery(actions.LIST_CARD_REQUEST, listCardRequestHelper);
  yield takeEvery(actions.ADD_CARD_REQUEST, addCardRequestHelper);
  yield takeEvery(actions.UPDATE_CARD_REQUEST, updateCardRequestHelper);
  yield takeEvery(actions.DELETE_CARD_REQUEST, deleteCardRequestHelper);
  yield takeEvery(actions.ALL_NOTIFICATION_REQUEST, allNotiftRequestHelper);
  yield takeEvery(actions.PROMO_NOTIFICATION_REQUEST, promoNotiftRequestHelper);
  yield takeEvery(actions.PROS_NOTIFICATION_REQUEST, prosnotifyRequestHelper);
  yield takeEvery(actions.BOOKING_REMINDER_REQUEST, bookingRemindNotifyHelper);
  yield takeEvery(actions.MAIN_CATEGORY_VIEW_REQUEST, mainCatgoryViewHelper);
  yield takeEvery(actions.MAIN_CATEGORY_EDIT_REQUEST, mainCategoryUpdateHelper);
  yield takeEvery(
    actions.ADDITIONAL_CATEGORY_VIEW_REQUEST,
    additionalCategoryViewHelper,
  );
  yield takeEvery(
    actions.ADDITIONAL_CATEGORY_EDIT_REQUEST,
    additionalCategoryEditHelper,
  );
  yield takeEvery(
    actions.USER_RATING_REVIEW_REQUEST,
    userReviewRatingMediaUpload,
  );
}
