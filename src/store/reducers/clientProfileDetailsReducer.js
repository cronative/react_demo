import * as actionType from '../actionTypes';
import { updateObject } from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  details: null,
  // details: {
  //   bookingDetails: {
  //     data: []
  //   }
  // },
  self_reviews: null,
  others_reviews: null
};

// ORGANIC CLIENT PROFILE DETAILS
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CLIENT_PROFILE_DETAILS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        details: null
        // details: {
        //   bookingDetails: {
        //     data: []
        //   }
        // }
      });
    case actionType.CLIENT_PROFILE_DETAILS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        details: action.details,
        // details: [...state?.details?.bookingDetails?.data, ...action?.details?.bookingDetails?.data],
        // details: {
        //   ...state?.details,
        //   ...action.details,
        //   bookingDetails: {
        //     ...state.details.bookingDetails,
        //     ...action.details.bookingDetails,
        //     data: [
        //       ...state?.details.bookingDetails.data, ...action.details.bookingDetails.data
        //     ]
        //   }
        // },
      });
    case actionType.CLIENT_PROFILE_DETAILS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.CLIENT_PROFILE_DETAILS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
        // details: {
        //   bookingDetails: {
        //     data: []
        //   }
        // },
      });

    case actionType.CLIENT_PROFILE_LOADMORE_REQUEST:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        // details: null,
      });
    case actionType.CLIENT_PROFILE_LOADMORE_SUCCESS:
      console.log('Older State: ', state.details.bookingDetails.data)
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        details: action.nextPageBookings,
        details: {
          ...state.details,
          bookingDetails: {
            ...state.details.bookingDetails,
            data: [
              ...state.details.bookingDetails.data, ...action.nextPageBookings
            ]
          }
        },
      });
    case actionType.CLIENT_PROFILE_LOADMORE_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.CLIENT_PROFILE_LOADMORE_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
      });

    // WALKIN CLIENT PROFILE DETAILS
    case actionType.WALKIN_CLIENT_PROFILE_DETAILS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        details: null,
      });
    case actionType.WALKIN_CLIENT_PROFILE_DETAILS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        details: action.details,
      });
    case actionType.WALKIN_CLIENT_PROFILE_DETAILS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.WALKIN_CLIENT_PROFILE_DETAILS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
      });



    //   CLIENT REVIEWS _ SELF
    case actionType.CLIENT_REVIEWS_SELF_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        self_reviews: null,
      });
    case actionType.CLIENT_REVIEWS_SELF_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        self_reviews: action.self_reviews,
      });
    case actionType.CLIENT_REVIEWS_SELF_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.CLIENT_REVIEWS_SELF_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        self_reviews: null,
      });

    //   CLIENT REVIEWS _ OTHERS
    case actionType.CLIENT_REVIEWS_OTHERS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        others_reviews: null,
      });
    case actionType.CLIENT_REVIEWS_OTHERS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        others_reviews: action.others_reviews,
      });
    case actionType.CLIENT_REVIEWS_OTHERS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.CLIENT_REVIEWS_OTHERS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        others_reviews: null,
      });

    case actionType.CLIENT_PROFILE_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
        self_reviews: null,
        others_reviews: null
      });

    default:
      return state;
  }
};

export default reducer;
