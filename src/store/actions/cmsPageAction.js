import * as actionTypes from '../actionTypes';

export const acceptTermsConditionRequest = () => {
  return {
    type: actionTypes.ACCEPT_TERMS_CONDITION_REQUEST,
  };
};

export const acceptTermsConditionRequestPro = () => {
  return {
    type: actionTypes.ACCEPT_TERMS_CONDITION_REQUEST,
  };
};

export const cmsPageRequestBySlug = (url) => {
  return {
    type: actionTypes.CMS_PAGE_REQUEST,
    url: url,
  };
};
