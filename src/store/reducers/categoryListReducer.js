import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  categoryListDetails: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CATEGORY_LIST_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.CATEGORY_LIST_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        categoryListDetails: action.categoryListDetails,
      });
    case actionType.CATEGORY_LIST_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.CATEGORY_LIST_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        categoryListDetails: null,
      });

      case actionType.CAT_LIST_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          categoryListDetails: null,
        });

    default:
      return state;
  }
};

export default reducer;
