import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  addEditDeleteStatus: null,
  // editStatus: null,
  // deleteStatus: null,
  data: null,
  proFaqData: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.FAQ_LISTING_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.FAQ_LISTING_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        data: action.data,
      });
    case actionType.FAQ_LISTING_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.FAQ_LISTING_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        data: null,
      });

    case actionType.PROFESSIONAL_FAQ_LISTING_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
      });
    case actionType.PROFESSIONAL_FAQ_LISTING_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        proFaqData: action.data,
      });
    case actionType.PROFESSIONAL_FAQ_LISTING_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFESSIONAL_FAQ_LISTING_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        proFaqData: null,
      });

    case actionType.PROFESSIONAL_FAQ_ADD_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.PROFESSIONAL_FAQ_ADD_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        addEditDeleteStatus: action.status,
      });
    case actionType.PROFESSIONAL_FAQ_ADD_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFESSIONAL_FAQ_ADD_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        addEditDeleteStatus: null,
      });

    case actionType.PROFESSIONAL_FAQ_EDIT_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.PROFESSIONAL_FAQ_EDIT_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        addEditDeleteStatus: action.status,
      });
    case actionType.PROFESSIONAL_FAQ_EDIT_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFESSIONAL_FAQ_EDIT_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        addEditDeleteStatus: null,
      });

    case actionType.PROFESSIONAL_FAQ_DELETE_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.PROFESSIONAL_FAQ_DELETE_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        addEditDeleteStatus: action.status,
      });
    case actionType.PROFESSIONAL_FAQ_DELETE_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PROFESSIONAL_FAQ_DELETE_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        addEditDeleteStatus: null,
      });

      case actionType.FAQ_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          status: null,
          addEditDeleteStatus: null,
          // editStatus: null,
          // deleteStatus: null,
          data: null,
          proFaqData: null,
        });
        
    default:
      return state;
  }
};

export default reducer;
