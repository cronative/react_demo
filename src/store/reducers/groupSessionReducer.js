import * as actions from '../actionTypes';

const INITIAL_STATE = {
  loading: false,
  data: null,
};

const groupSesssionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.ADD_GROUP_SESSION_SUCCESS:
    case actions.EDIT_GROUP_SESSION_SUCCESS:
      console.log('action', action);
      return {
        ...state,
        loading: false,
        data: action.data,
      };
    case actions.ADD_GROUP_SESSION_FAILED:
    case actions.EDIT_GROUP_SESSION_FAILED:
      return {
        ...state,
        loading: false,
        data: action.error,
      };
    case actions.ADD_GROUP_SESSION_REQUEST:
    case actions.EDIT_GROUP_SESSION_REQUEST:
      return {
        loading: true,
        data: null,
        ...state,
      };
    case actions.ADD_GROUP_SESSION_CLEAR:
    case actions.EDIT_GROUP_SESSION_CLEAR:
      return {
        loading: false,
        data: null,
        ...state,
      };
    default:
      return state;
  }
};

export default groupSesssionReducer;
