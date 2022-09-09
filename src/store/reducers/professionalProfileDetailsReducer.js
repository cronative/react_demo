import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  details: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PROFESSIONAL_PROFILE_DETAILS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        details: null,
      });
    case actionType.PROFESSIONAL_PROFILE_DETAILS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        details: action.details,
      });
    case actionType.PROFESSIONAL_PROFILE_DETAILS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.PROFESSIONAL_PROFILE_DETAILS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
      });

      case actionType.PROFESSIONAL_PROFILE_DETAILS_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          status: null,
          details: null,
        });
        
    default:
      return state;
  }
};

export default reducer;
