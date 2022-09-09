import * as actionTypes from '../actionTypes';

export const contectSetUpStepSeven = (value) => {
     
  return {
    type: actionTypes.CONTECT_SETUP_REQUEST,
    value
  };
};
//step eight
export const termOfPaymentSetup = (value) => {
     
  return {
    type: actionTypes.TERM_OF_PAYMENT_SETUP_REQUEST,
    value
  };
};
//step nine addintional info
export const addintionalInfo = (value) => {
     console.log('ADDITIONAL_INFO_REQUEST',value)
  return {
    type: actionTypes.ADDITIONAL_INFO_REQUEST,
    value
  };
};


