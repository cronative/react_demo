import * as actionTypes from '../actionTypes';

// ORGANIC CLIENT PROFILE DETAILS
export const clientProfileDetailsRequest = (value) => {
  return {
    type: actionTypes.CLIENT_PROFILE_DETAILS_REQUEST,
    value
  };
};
export const clientProfileDetailsClear = () => {
  return {
    type: actionTypes.CLIENT_PROFILE_DETAILS_CLEAR,
  };
};

// ORGANIC CLIENT BOOKING DETAILS LOAD MORE
export const clientProfileLoadMoreRequest = (value) => {
  return {
    type: actionTypes.CLIENT_PROFILE_LOADMORE_REQUEST,
    value
  };
};
export const clientProfileLoadMoreClear = () => {
  return {
    type: actionTypes.CLIENT_PROFILE_LOADMORE_CLEAR,
  };
};

// WALKIN CLIENT PROFILE DETAILS
export const walkinClientProfileDetailsRequest = (value) => {
  return {
    type: actionTypes.WALKIN_CLIENT_PROFILE_DETAILS_REQUEST,
    value
  };
};
export const walkinClientProfileDetailsClear = () => {
  return {
    type: actionTypes.WALKIN_CLIENT_PROFILE_DETAILS_CLEAR,
  };
};

// CLIENT REVIEWS - SELF
export const clientReviewsSelfRequest = (value) => {
  return {
    type: actionTypes.CLIENT_REVIEWS_SELF_REQUEST,
    value
  };
};
export const clientReviewsSelfClear = () => {
  return {
    type: actionTypes.CLIENT_REVIEWS_SELF_CLEAR,
  };
};
// CLIENT REVIEWS - OTHERS
export const clientReviewsOthersRequest = (value) => {
  return {
    type: actionTypes.CLIENT_REVIEWS_OTHERS_REQUEST,
    value
  };
};
export const clientReviewsOthersClear = () => {
  return {
    type: actionTypes.CLIENT_REVIEWS_OTHERS_CLEAR,
  };
};


