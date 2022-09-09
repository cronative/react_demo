import {GET_CASHFLOW_FAILED, GET_CASHFLOW_SUCCESS} from '../actionTypes';

const INITIAL_STATE = {};
export default function analyticSaga(state = INITIAL_STATE, action) {
  switch (action.payload) {
    case GET_CASHFLOW_SUCCESS:
      return {
        ...state,
      };
    case GET_CASHFLOW_FAILED:
      return {
        ...state,
      };
    default:
      return state;
  }
}
