import * as actionTypes from '../actionTypes';

export const professionalListingByCategoryRequest = (value) => {
  console.log(" TESTING VALUE: ", value)
  return {
    type: actionTypes.PROFESSIONAL_LISTING_BY_CATEGORY_REQUEST,
    value
  };
};
export const professionalListingByCategoryClear = () => {
  return {
    type: actionTypes.PROFESSIONAL_LISTING_BY_CATEGORY_CLEAR,
  };
};


