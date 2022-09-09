import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADDITIONAL_INFO_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        status: null,
      });
    case actionType.ADDITIONAL_INFO_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
      });
    case actionType.ADDITIONAL_INFO_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.ADDITIONAL_INFO_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
    });
    case actionType.ADDITIONAL_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
    });
    
    default:
      return state;
  }
};

export default reducer;
