import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  step2Data: null,
  step3Data: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PRO_SETTING_STEP2:
      return updateObject(state, {
        step2Data: action.value,
      });

    case actionType.PRO_SETTING_STEP3:
      return updateObject(state, {
        step3Data: action.value,
      });

    case actionType.PRO_SETTING_DATA_CLEAR:
      return updateObject(state, {
        step2Data: null,
        step3Data: null,
      });

      case actionType.PROFESSIONAL_SETTING_STEP_REDUCER_CLEAR:
        return updateObject(state, {
          step2Data: null,
          step3Data: null,
        });
        
    default:
      return state;
  }
};

export default reducer;
