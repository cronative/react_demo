import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  reviews_data: [],
  ratings_data: null,
  canFetchMoreReviews: true,
  userOwnRatingReviewData: null,
  PAGE_OFFSET: 2,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.REVIEWS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.REVIEWS_SUCCESS:
      console.log(
        'REVIEWS_SUCCESS data',
        state.reviews_data,
        action.data,
        state.reviews_data.length + action.data.length,
        action.rows,
      );
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        reviews_data: reviews_data.length ? [...state.reviews_data, ...action.data] : action.data,
        canFetchMoreReviews:
          state.reviews_data.length + action.data.length < action.rows
            ? true
            : false,
      });
    // case actionType.REVIEWS_SUCCESS:
    //   return updateObject(state, {
    //     loader: false,
    //     message: action.message,
    //     status: action.status,
    //     reviews_data: action.data,
    //   });
    case actionType.REVIEWS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.REVIEWS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        reviews_data: null,
      });

    //   RATINGS
    case actionType.RATINGS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.RATINGS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        ratings_data: action.data,
      });
    case actionType.RATINGS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.RATINGS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        ratings_data: null,
      });

    case actionType.REVIEW_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        reviews_data: null,
        ratings_data: null,
        canFetchMoreReviews: true,
        PAGE_OFFSET: 2,
      });

    // User rating & review reducer
    case actionType.USER_OWN_REVIEW_RATING_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        userOwnRatingReviewData: null,
      });
    case actionType.USER_OWN_REVIEW_RATING_SUCCESS:
      return updateObject(state, {
        loader: false,
        userOwnRatingReviewData: action.userOwnRatingRevieData,
      });
    case actionType.USER_OWN_REVIEW_RATING_FAILED:
      return updateObject(state, {
        loader: false,
        userOwnRatingReviewData: action.userOwnRatingRevieData,
      });
    case actionType.USER_OWN_REVIEW_RATING_CLEAR:
      return updateObject(state, {
        loader: false,
      });

    default:
      return state;
  }
};

export default reducer;
