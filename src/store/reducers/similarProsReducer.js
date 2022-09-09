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
    case actionType.SIMILAR_PROS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.SIMILAR_PROS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        data: action.data,
      });
    case actionType.SIMILAR_PROS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        data: null,
      });
    case actionType.SIMILAR_PROS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        data: null,
      });

      case actionType.SIMILER_REDUCER_CLEAR:
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
