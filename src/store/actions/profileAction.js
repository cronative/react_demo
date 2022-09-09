import * as actionTypes from '../actionTypes';

export const profileViewRequest = () => {
  return {
    type: actionTypes.PROFILE_VIEW_REQUEST,
  };
};

export const profileViewRequestClear = () => {
  return {
    type: actionTypes.PROFILE_VIEW_CLEAR,
  };
};

export const profileImgUpdateRequest = (value) => {
  return {
    type: actionTypes.PROFIL_IMG_UPDATE_REQUEST,
    value
  };
};

export const profileImgUpdateRequestClear = () => {
  return {
    type: actionTypes.PROFIL_IMG_UPDATE_CLEAR,
  };
};

export const changeNameUpdateRequest = (value) => {
  return {
    type: actionTypes.CHANGE_NAME_REQUEST,
    value
  };
};

export const changeNameUpdateRequestClear = () => {
  return {
    type: actionTypes.CHANGE_NAME_CLEAR,
  };
};

export const changeEmailUpdateRequest = (value) => {
  return {
    type: actionTypes.CHANGE_EMAIL_REQUEST,
    value
  };
};

export const changeEmailUpdateRequestClear = () => {
  return {
    type: actionTypes.CHANGE_EMAIL_CLEAR,
  };
};

export const changePasswordUpdateRequest = (value) => {
  return {
    type: actionTypes.CHANGE_PASSWORD_REQUEST,
    value
  };
};

export const changePasswordUpdateRequestClear = () => {
  return {
    type: actionTypes.CHANGE_PASSWORD_CLEAR,
  };
};

export const changePhonenumberUpdateRequest = (value) => {
  return {
    type: actionTypes.CHANGE_PHONE_NUMBER_REQUEST,
    value
  };
};

export const changePhonenumberUpdateRequestClear = () => {
  return {
    type: actionTypes.CHANGE_PHONE_NUMBER_CLEAR,
  };
};

export const sendOtpRequest = (value) => {
  return {
    type: actionTypes.SEND_OTP_REQUEST,
    value
  };
};

export const sendOtpRequestClear = () => {
  return {
    type: actionTypes.SEND_OTP_CLEAR,
  };
};

export const customerLogoutRequest = (value) => {
  return {
    type: actionTypes.CUSTOMER_LOGOUT_REQUEST,
    value
  };
};

export const customerLogoutRequestClear = () => {
  return {
    type: actionTypes.CUSTOMER_LOGOUT_CLEAR,
  };
};

export const listCardRequest = () => {
  return {
    type: actionTypes.LIST_CARD_REQUEST
  };
};

export const listCardRequestClear = () => {
  return {
    type: actionTypes.LIST_CARD_CLEAR,
  };
};

export const addcardRequest = (value) => {
  return {
    type: actionTypes.ADD_CARD_REQUEST,
    value
  };
};

export const addcardRequestClear = () => {
  return {
    type: actionTypes.ADD_CARD_CLEAR,
  };
};

export const updateCardRequest = (value) => {
  return {
    type: actionTypes.UPDATE_CARD_REQUEST,
    value
  };
};

export const updateCardRequestClear = () => {
  return {
    type: actionTypes.UPDATE_CARD_CLEAR,
  };
};

export const deleteCardRequest = (value) => {
  return {
    type: actionTypes.DELETE_CARD_REQUEST,
    value
  };
};

export const deleteCardRequestClear = () => {
  return {
    type: actionTypes.DELETE_CARD_CLEAR,
  };
};

export const promoNotifyRequesr = () => {
  return {
    type: actionTypes.PROMO_NOTIFICATION_REQUEST
  };
};

export const promoNotifyRequesrClear = () => {
  return {
    type: actionTypes.PROMO_NOTIFICATION_CLEAR,
  };
};
export const allNotifRequest = () => {
  return {
    type: actionTypes.ALL_NOTIFICATION_REQUEST
  };
};

export const allNotifClear = () => {
  return {
    type: actionTypes.ALL_NOTIFICATION_CLEAR,
  };
};

export const prosNotifyRequest = () => {
  return {
    type: actionTypes.PROS_NOTIFICATION_REQUEST
  };
};

export const prosNotifyRequestClear = () => {
  return {
    type: actionTypes.PROS_NOTIFICATION_CLEAR,
  };
};

export const bookingRemindNotifyRequest = () => {
  return {
    type: actionTypes.BOOKING_REMINDER_REQUEST,
  };
};

export const bookingRemindNotifyRequestClear = () => {
  return {
    type: actionTypes.BOOKING_REMINDER_CLEAR,
  };
};

export const maincategoryviewRequest = () => {
  return {
    type: actionTypes.MAIN_CATEGORY_VIEW_REQUEST,
  };
};

export const maincategoryviewRequestClear = () => {
  return {
    type: actionTypes.MAIN_CATEGORY_VIEW_CLEAR,
  };
};

export const mainCategoryEditRequest = (value) => {
  return {
    type: actionTypes.MAIN_CATEGORY_EDIT_REQUEST,
    value
  };
};

export const mainCategoryEditRequestClear = () => {
  return {
    type: actionTypes.MAIN_CATEGORY_EDIT_CLEAR,
  };
};

export const additionalCategoryViewRequest = () => {
  return {
    type: actionTypes.ADDITIONAL_CATEGORY_VIEW_REQUEST,
  };
};

export const additionalCategoryViewRequestClear = () => {
  return {
    type: actionTypes.ADDITIONAL_CATEGORY_VIEW_CLEAR,
  };
};

export const additionalCategoryEditRequest = (value) => {
  return {
    type: actionTypes.ADDITIONAL_CATEGORY_EDIT_REQUEST,
    value
  };
};

export const additionalCategoryEditRequestClear = () => {
  return {
    type: actionTypes.ADDITIONAL_CATEGORY_EDIT_CLEAR,
  };
};

export const userRatingReviewRequest = (value) => {
  return {
    type: actionTypes.USER_RATING_REVIEW_REQUEST,
    value
  };
};

export const userRatingReviewRequestClear = () => {
  return {
    type: actionTypes.USER_RATING_REVIEW_CLEAR,
  };
};