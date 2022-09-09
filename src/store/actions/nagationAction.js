import * as actionTypes from '../actionTypes';

export const setNavigationValue = (value) => {
  return {
    type: actionTypes.SET_NAVIGATION_VALUE,
    value,
  };
};

export const setOnboardingValue = (value) => {
  return {
    type: actionTypes.SET_ONBOARDING_VALUE,
    value,
  };
};

export const setInitialStepValue = (value) => {
  return {
    type: actionTypes.INITIAL_STEP,
    value,
  };
};
export const refreshBottomTabAction = (value) => {
  return {
    type: actionTypes.REFRESH_BOTTOM_TAB,
    value,
  };
};

export const setInitialNavigationRoute = (value) => {
  return {
    type: actionTypes.SET_INITIAL_NAVIGATION_ROUTE,
    value,
  };
};

export const clearInitialNavigationRoute = () => {
  return {
    type: actionTypes.CLEAR_INITIAL_NAVIGATION_ROUTE,
  };
};

export const storeCustomNavFromLogin = (payload) => {
  return { type: actionTypes.STORE_CUSTOM_NAV_FROM_LOGIN, payload: payload };
};

export const clearCustomNavFromLogin = () => {
  return { type: actionTypes.CLEAR_CUSTOM_NAV_FROM_LOGIN };
};
