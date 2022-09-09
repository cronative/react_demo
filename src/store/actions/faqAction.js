import * as actionTypes from '../actionTypes';

export const faqListingRequest = (searchValue) => {
  return {
    type: actionTypes.FAQ_LISTING_REQUEST,
    searchValue: searchValue,
  };
};

export const professionalFaqListingRequest = () => {
  return {
    type: actionTypes.PROFESSIONAL_FAQ_LISTING_REQUEST,
  };
};

export const professionalFaqAddRequest = (data) => {
  return {
    type: actionTypes.PROFESSIONAL_FAQ_ADD_REQUEST,
    data: data,
  };
};

export const professionalFaqEditRequest = (data) => {
  return {
    type: actionTypes.PROFESSIONAL_FAQ_EDIT_REQUEST,
    data: data,
  };
};

export const professionalFaqDeleteRequest = (data) => {
  return {
    type: actionTypes.PROFESSIONAL_FAQ_DELETE_REQUEST,
    data: data,
  };
};
