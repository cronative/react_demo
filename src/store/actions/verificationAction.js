import * as actionTypes from '../actionTypes';

export const verifyIdentityRequest = (value) => {
    return {
      type: actionTypes.VERIFY_IDENTITY_REQUEST,
      value
    };
  };
  
  export const verifyIdentityRequestClear = () => {
    return {
      type: actionTypes.VERIFY_IDENTITY_CLEAR,
    };
  };
  
  export const pendingVerificationRequest = () => {
    return {
      type: actionTypes.PENDING_VERIFICATION_REQUEST,
    };
  };
  
  export const pendingVerificationRequestClear = () => {
    return {
      type: actionTypes.PENDING_VERIFICATION_CLEAR,
    };
  };

  export const trialExpireCheckRequest = () => {
    return {
      type: actionTypes.PRO_TRIAL_EXPIRE_CHECK_REQUEST,
    };
  };
  
  export const trialExpireCheckRequestClear = () => {
    return {
      type: actionTypes.PRO_TRIAL_EXPIRE_CHECK_CLEAR,
    };
  };