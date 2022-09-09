import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  isAuthenticated: false,
  mailSentForForgotPassword: false,
  loader: false,
  error: null,
  message: null,
  isCreateNewPassword: false,
  referralCode: null,
  referralCodeUserType: null,
  userType: null,
  profileLink: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // forgot passwod
    case actionType.FORGOT_PASSWORD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        mailSentForForgotPassword: false,
      });

    case actionType.FORGOT_PASSWORD_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        mailSentForForgotPassword: true,
      });

    case actionType.FORGOT_PASSWORD_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        mailSentForForgotPassword: false,
      });
    case actionType.FORGOT_PASSWORD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        mailSentForForgotPassword: false,
      });

    // create passwod
    case actionType.CREATE_PASSWORD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        isCreateNewPassword: false,
      });

    case actionType.CREATE_PASSWORD_SUCCESS:
      return updateObject(state, {
        loader: false,
        isCreateNewPassword: true,
      });

    case actionType.CREATE_PASSWORD_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        isCreateNewPassword: false,
      });

    case actionType.CREATE_PASSWORD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        isCreateNewPassword: false,
      });

    // Logout
    case actionType.LOGOUT_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });

    case actionType.LOGOUT_SUCCESS:
      return updateObject(state, {
        isAuthenticated: false,
        loader: false,
        message: action.message,
      });

    case actionType.LOGOUT_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });

    case actionType.REFERRAL_CODE_SUCCESS:
      return updateObject(state, {
        referralCode: action.refflcode,
        referralCodeUserType: action.refflcodeType,
      });

    case actionType.REFERRAL_CODE_CLEAR:
      return updateObject(state, {
        referralCode: null,
        referralCodeUserType: null,
      });

    case actionType.USER_TYPE_STATUS:
      return updateObject(state, {
        userType: action.status,
      });

    case actionType.AUTH_REDUCER_CLEAR:
      return updateObject(state, {
        isAuthenticated: false,
        mailSentForForgotPassword: false,
        loader: false,
        error: null,
        message: null,
        isCreateNewPassword: false,
        referralCode: null,
        referralCodeUserType: null,
        userType: null,
      });

    case actionType.PROFILE_LINK_SUCCESS:
      return updateObject(state, {
        profileLink: action.payload,
      });

    case actionType.PROFILE_LINK_CLEAR:
      return updateObject(state, {
        profileLink: null,
      });

    default:
      return state;
  }
};

export default reducer;
