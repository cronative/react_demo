import {call, takeLatest} from 'redux-saga/effects';
import {mainAPI} from '../../api/apiAgent';
import {cashflowDataFailed} from '../actions/cashflowActions';
import {GET_CASHFLOW_REQUEST} from '../actionTypes';

export function* getCashflowData(action) {
  console.log('action getCashflowData', action);
  try {
    const data = yield call(mainAPI, {url: '/pro/cashflow', methodType: 'get'});
    console.log('getCashflowData', data);
    yield call(cashflowDataSuccess, data);
  } catch (error) {
    yield call(cashflowDataFailed, error);
  }
}

export default function* analyticsSaga() {
  yield takeLatest(GET_CASHFLOW_REQUEST, getCashflowData);
}
