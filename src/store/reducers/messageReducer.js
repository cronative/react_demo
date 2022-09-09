import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  messageDetailsList: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_MESSAGE_DETAILS: {
      return updateObject(state, {
        messageDetailsList: action.value,
      });
    }
    case actionType.CLEAR_MESSAGE_DETAILS:
      return updateObject(state, {
        messageDetailsList: null,
      });
    default:
      return state;
  }
};

export default reducer;
