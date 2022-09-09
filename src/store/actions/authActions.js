import * as actionTypes from '../actionTypes';

export const forgotPasswordRequest = (value) => {
  return {
    type: actionTypes.FORGOT_PASSWORD_REQUEST,
    value,
  };
};

export const clearForgotPassword = () => {
  return {
    type: actionTypes.FORGOT_PASSWORD_CLEAR,
  };
};

export const createPasswordRequest = (value) => {
  return {
    type: actionTypes.CREATE_PASSWORD_REQUEST,
    value,
  };
};

export const logoutRequest = () => {
  return {
    type: actionTypes.LOGOUT_REQUEST,
  };
};

export const profileLinkSuccess = (proId) => {
  return {
    type: actionTypes.PROFILE_LINK_SUCCESS,
    payload: proId,
  };
};

export const profileLinkClear = () => {
  return {
    type: actionTypes.PROFILE_LINK_CLEAR,
  };
};
