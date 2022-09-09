import * as actionTypes from '../actionTypes';

export const similarProsRequest = (value) => {
  return {
    type: actionTypes.SIMILAR_PROS_REQUEST,
    value
  };
};
export const similarProsClear = () => {
  return {
    type: actionTypes.SIMILAR_PROS_CLEAR,
  };
};
