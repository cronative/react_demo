import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  data: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CMS_PAGE_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.CMS_PAGE_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        data: action.data,
      });
    case actionType.CMS_PAGE_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.CMS_PAGE_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        data: null,
      });

    case actionType.ACCEPT_TERMS_CONDITION_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.ACCEPT_TERMS_CONDITION_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        data: action.data,
      });
    case actionType.ACCEPT_TERMS_CONDITION_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.ACCEPT_TERMS_CONDITION_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        data: null,
      });

      case actionType.CMS_PAGE_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          data: null,
        });

    default:
      return state;
  }
};

export default reducer;
