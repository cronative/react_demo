import {
  GET_CASHFLOW_FAILED,
  GET_CASHFLOW_REQUEST,
  GET_CASHFLOW_SUCCESS,
} from '../actionTypes';

export const cashflowDataRequest = (payload = {}) => ({
  type: GET_CASHFLOW_REQUEST,
  payload,
});

export const cashflowDataSuccess = (payload) => ({
  type: GET_CASHFLOW_SUCCESS,
  payload,
});

export const cashflowDataFailed = (payload) => ({
  type: GET_CASHFLOW_FAILED,
  payload,
});
