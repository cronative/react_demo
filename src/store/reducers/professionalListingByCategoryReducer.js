import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  data: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PROFESSIONAL_LISTING_BY_CATEGORY_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.PROFESSIONAL_LISTING_BY_CATEGORY_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        data: action.professionalListingByCategoryData,
      });
    case actionType.PROFESSIONAL_LISTING_BY_CATEGORY_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFESSIONAL_LISTING_BY_CATEGORY_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        data: null,
      });

      case actionType.PROFESSIONAL_LIST_BY_CAT_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          status: null,
          data: null,
        });
        
    default:
      return state;
  }
};

export default reducer;
