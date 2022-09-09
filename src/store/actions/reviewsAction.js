import * as actionTypes from '../actionTypes';

export const reviewsRequest = (value) => {
  return {
    type: actionTypes.REVIEWS_REQUEST,
    value
  };
};
export const reviewsClear = () => {
  return {
    type: actionTypes.REVIEWS_CLEAR,
  };
};
export const ratingsRequest = (value) => {
  return {
    type: actionTypes.RATINGS_REQUEST,
    value
  };
};
export const ratingsClear = () => {
  return {
    type: actionTypes.RATINGS_CLEAR,
  };
};

export const userOwnReviewRatingRequest = (value) => {
  return {
    type: actionTypes.USER_OWN_REVIEW_RATING_REQUEST,
    value
  };
};
export const userOwnReviewRatingRequestClear = () => {
  return {
    type: actionTypes.USER_OWN_REVIEW_RATING_CLEAR,
  };
};

