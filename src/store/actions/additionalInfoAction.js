import * as actionTypes from '../actionTypes';

export const additionalInfoRequest = (value) => {
  return {
    type: actionTypes.ADDITIONAL_INFO_REQUEST,
    value,
  };
};
