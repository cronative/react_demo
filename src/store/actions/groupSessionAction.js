import * as actions from '../actionTypes';

export function addGroupSessionRequest(payload) {
  return {
    type: actions.ADD_GROUP_SESSION_REQUEST,
    payload,
  };
}

export function addGroupSessionClear() {
  return {
    type: actions.ADD_GROUP_SESSION_CLEAR,
  };
}

export function editGroupSessionRequest(payload) {
  return {
    type: actions.EDIT_GROUP_SESSION_REQUEST,
    payload,
  };
}

export function editGroupSessionClear() {
  return {
    type: actions.EDIT_GROUP_SESSION_CLEAR,
  };
}
