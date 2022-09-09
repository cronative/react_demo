import {call, put} from '@redux-saga/core/effects';
import {takeLatest} from 'redux-saga/effects';
import {mainAPI} from '../../api/apiAgent';
import * as actions from '../actionTypes';

export function* addGroupSessionHelper(action) {
  console.log('addGroupSessionHelper', action);
  try {
    const data = yield call(mainAPI, {
      url: 'pro/group-session',
      methodType: 'post',
      data: action.payload,
    });

    yield put({type: actions.ADD_GROUP_SESSION_SUCCESS, data});
  } catch (error) {
    console.log('error', error.response.data);

    yield put({
      type: actions.ADD_GROUP_SESSION_FAILED,
      error: error.response.data,
    });
  }
}

export function* editGroupSessionHelper(action) {
  console.log('editGroupSessionHelper', action);
  try {
    const data = yield call(mainAPI, {
      url: `pro/group-session`,
      methodType: 'put',
      data: action.payload,
    });

    yield put({type: actions.EDIT_GROUP_SESSION_SUCCESS, data});
  } catch (error) {
    console.log('error', error.response.data);

    yield put({
      type: actions.EDIT_GROUP_SESSION_FAILED,
      error: error.response.data,
    });
  }
}

export function* groupSessionSaga() {
  yield takeLatest(actions.ADD_GROUP_SESSION_REQUEST, addGroupSessionHelper);
  yield takeLatest(actions.EDIT_GROUP_SESSION_REQUEST, editGroupSessionHelper);
}
