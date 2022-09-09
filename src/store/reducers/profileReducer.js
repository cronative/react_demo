import * as actionType from '../actionTypes';
import { updateObject } from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  profileDetails: null,
  updateImgDetails: null,
  updateName: null,
  updateEmail: null,
  updatePassword: null,
  updatePhone: null,
  updateLogout: null,
  otpInfo: null,
  listCardData: null,
  addCardData: null,
  updateCardData: null,
  deleteCardData: null,
  allNotifData: null,
  promoNotifyData: null,
  prosNofifyData: null,
  bookingRemindNotifyData: null,
  mainCatViewData: null,
  mainCatUpdateData: null,
  additionalCatViewData: null,
  additionalCatUpdateData: null,
  referralCode: null,
  userRatingReviewData: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // View profile reducer
    case actionType.PROFILE_VIEW_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        referralCode: null,
      });
    case actionType.PROFILE_VIEW_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        profileDetails: action.profileDetails,
        referralCode: action.profileDetails.data,
      });
    case actionType.PROFILE_VIEW_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFILE_VIEW_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
      });

    // Update profile reducer
    case actionType.PROFIL_IMG_UPDATE_REQUEST:
      return updateObject(state, {
        loader: true,
        updateImgDetails: null,
      });
    case actionType.PROFIL_IMG_UPDATE_SUCCESS:
      return updateObject(state, {
        loader: false,
        updateImgDetails: action.updateImgData,
      });
    case actionType.PROFIL_IMG_UPDATE_FAILED:
      return updateObject(state, {
        loader: false,
        updateImgDetails: action.updateImgData,
      });
    case actionType.PROFIL_IMG_UPDATE_CLEAR:
      return updateObject(state, {
        loader: false,
        updateImgDetails: null,
      });

    // Update name reducer
    case actionType.CHANGE_NAME_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updateName: null,
      });
    case actionType.CHANGE_NAME_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updateName: action.nameData,
      });
    case actionType.CHANGE_NAME_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        updateName: action.nameData,
      });
    case actionType.CHANGE_NAME_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updateName: null
      });

    // Update email reducer
    case actionType.CHANGE_EMAIL_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updateEmail: null,
      });
    case actionType.CHANGE_EMAIL_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updateEmail: action.emailData,
      });
    case actionType.CHANGE_EMAIL_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        updateEmail: action.emailData,
      });
    case actionType.CHANGE_EMAIL_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updateEmail: null,
      });

    // Update password reducer
    case actionType.CHANGE_PASSWORD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updatePassword: null,
      });
    case actionType.CHANGE_PASSWORD_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePassword: action.paswordData,
      });
    case actionType.CHANGE_PASSWORD_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePassword: action.paswordData,
      });
    case actionType.CHANGE_PASSWORD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePassword: null,
      });

    // Send OTP reducer
    case actionType.SEND_OTP_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        otpInfo: null,
      });
    case actionType.SEND_OTP_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        otpInfo: action.otpData,
      });
    case actionType.SEND_OTP_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        otpInfo: action.otpData,
      });
    case actionType.SEND_OTP_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        otpInfo: null,
      });

    // Update phone number reducer
    case actionType.CHANGE_PHONE_NUMBER_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updatePhone: null,
      });
    case actionType.CHANGE_PHONE_NUMBER_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePhone: action.phoneData,
      });
    case actionType.CHANGE_PHONE_NUMBER_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePhone: action.phoneData,
      });
    case actionType.CHANGE_PHONE_NUMBER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updatePhone: null,
      });

    // Customer logout request reducer
    case actionType.CUSTOMER_LOGOUT_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updateLogout: null,
      });
    case actionType.CUSTOMER_LOGOUT_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updateLogout: action.logoutData,
      });
    case actionType.CUSTOMER_LOGOUT_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        updateLogout: action.logoutData,
      });
    case actionType.CUSTOMER_LOGOUT_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updateLogout: null,
      });

    // List card request reducer
    case actionType.LIST_CARD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        listCardData: null,
      });
    case actionType.LIST_CARD_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        listCardData: action.cardData,
      });
    case actionType.LIST_CARD_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        listCardData: action.cardData,
      });
    case actionType.LIST_CARD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
      });

    // Add card request reducer
    case actionType.ADD_CARD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        addCardData: null,
      });
    case actionType.ADD_CARD_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        addCardData: action.cardData,
      });
    case actionType.ADD_CARD_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        addCardData: action.cardData,
      });
    case actionType.ADD_CARD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        addCardData: null,
      });

    // Update card request reducer
    case actionType.UPDATE_CARD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        updateCardData: null,
      });
    case actionType.UPDATE_CARD_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        updateCardData: action.cardData,
      });
    case actionType.UPDATE_CARD_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        updateCardData: action.cardData,
      });
    case actionType.UPDATE_CARD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        updateCardData: null,
      });

    // Customer logout request reducer
    case actionType.DELETE_CARD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        deleteCardData: null,
      });
    case actionType.DELETE_CARD_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        deleteCardData: action.cardData,
      });
    case actionType.DELETE_CARD_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        deleteCardData: action.cardData,
      });
    case actionType.DELETE_CARD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        deleteCardData: null,
      });

    // All notification reducer
    case actionType.ALL_NOTIFICATION_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        allNotifData: null,
      });
    case actionType.ALL_NOTIFICATION_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        allNotifData: action.notificationData,
      });
    case actionType.ALL_NOTIFICATION_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        allNotifData: action.notificationData,
      });
    case actionType.ALL_NOTIFICATION_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        allNotifData: null,
      });

    // Promotion notification reducer
    case actionType.PROMO_NOTIFICATION_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        promoNotifyData: null,
      });
    case actionType.PROMO_NOTIFICATION_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        promoNotifyData: action.notificationData,
      });
    case actionType.PROMO_NOTIFICATION_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        promoNotifyData: action.notificationData,
      });
    case actionType.PROMO_NOTIFICATION_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        promoNotifyData: null,
      });

    // Pros notifications reducer
    case actionType.PROS_NOTIFICATION_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        prosNofifyData: null,
      });
    case actionType.PROS_NOTIFICATION_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        prosNofifyData: action.notificationData,
      });
    case actionType.PROS_NOTIFICATION_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        prosNofifyData: action.notificationData,
      });
    case actionType.PROS_NOTIFICATION_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        prosNofifyData: null,
      });

    // Booking reminder notification reducer
    case actionType.BOOKING_REMINDER_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        bookingRemindNotifyData: null,
      });
    case actionType.BOOKING_REMINDER_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        bookingRemindNotifyData: action.notificationData,
      });
    case actionType.BOOKING_REMINDER_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        bookingRemindNotifyData: action.notificationData,
      });
    case actionType.BOOKING_REMINDER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        bookingRemindNotifyData: null,
      });

    // Main category view reducer
    case actionType.MAIN_CATEGORY_VIEW_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        mainCatViewData: null,
      });
    case actionType.MAIN_CATEGORY_VIEW_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        mainCatViewData: action.mainCatData,
      });
    case actionType.MAIN_CATEGORY_VIEW_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        mainCatViewData: action.mainCatData,
      });
    case actionType.MAIN_CATEGORY_VIEW_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
      });

    // Main category update reducer
    case actionType.MAIN_CATEGORY_EDIT_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        mainCatUpdateData: null,
      });
    case actionType.MAIN_CATEGORY_EDIT_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        mainCatUpdateData: action.mainCatData,
      });
    case actionType.MAIN_CATEGORY_EDIT_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        mainCatUpdateData: action.mainCatData,
      });
    case actionType.MAIN_CATEGORY_EDIT_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        mainCatUpdateData: null,
      });

    // Additional category view reducer
    case actionType.ADDITIONAL_CATEGORY_VIEW_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        additionalCatViewData: null,
      });
    case actionType.ADDITIONAL_CATEGORY_VIEW_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatViewData: action.additionaCatData,
      });
    case actionType.ADDITIONAL_CATEGORY_VIEW_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatViewData: action.additionaCatData,
      });
    case actionType.ADDITIONAL_CATEGORY_VIEW_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatViewData: null,
      });

    // Additional category update reducer
    case actionType.ADDITIONAL_CATEGORY_EDIT_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        additionalCatUpdateData: null,
      });
    case actionType.ADDITIONAL_CATEGORY_EDIT_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatUpdateData: action.additionaCatData,
      });
    case actionType.ADDITIONAL_CATEGORY_EDIT_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatUpdateData: action.additionaCatData,
      });
    case actionType.ADDITIONAL_CATEGORY_EDIT_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        additionalCatUpdateData: null,
      });

    // User rating & review reducer
    case actionType.USER_RATING_REVIEW_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        userRatingReviewData: null,
      });
    case actionType.USER_RATING_REVIEW_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        userRatingReviewData: action.userRatingReviewDetails,
      });
    case actionType.USER_RATING_REVIEW_FAILED:
      return updateObject(state, {
        loader: false,
        error: null,
        userRatingReviewData: action.userRatingReviewDetails,
      });
    case actionType.USER_RATING_REVIEW_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        userRatingReviewData: null,
      });

    case actionType.PROFILE_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        profileDetails: null,
        updateName: null,
        updateEmail: null,
        updatePassword: null,
        updatePhone: null,
        updateLogout: null,
        otpInfo: null,
        listCardData: null,
        addCardData: null,
        updateCardData: null,
        deleteCardData: null,
        allNotifData: null,
        promoNotifyData: null,
        prosNofifyData: null,
        bookingRemindNotifyData: null,
        mainCatViewData: null,
        mainCatUpdateData: null,
        additionalCatViewData: null,
        additionalCatUpdateData: null,
        referralCode: null,
        userRatingReviewData: null,
      });

    default:
      return state;
  }
};

export default reducer;
