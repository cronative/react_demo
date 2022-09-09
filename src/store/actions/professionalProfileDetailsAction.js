import * as actionTypes from '../actionTypes';

export const professionalProfileDetailsRequest = (value) => {
  return {
    type: actionTypes.PROFESSIONAL_PROFILE_DETAILS_REQUEST,
    value
  };
};
export const professionalProfileDetailsClear = () => {
  return {
    type: actionTypes.PROFESSIONAL_PROFILE_DETAILS_CLEAR,
  };
};


