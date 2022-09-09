import * as actionType from '../actionTypes';
import { updateObject } from '../utiity';

const initialState = {
  navigationValue: null,
  onBoardingValue: null,
  onClientLandingPage: null,
  locationDetails: null,
  tempRoutes: null, // { currentNavType: 'tab', routeName: 'Explore', child: {currentNavType: 'stack', routeName: 'BookService', params: { serviceId: 37, proId: 108 }}}
  refreshBottomTab: false,
  initialNav: null,
  proId: null,
  showClientSignupCategoryBackButton: false,
  isLastStep: false,
  initialStep: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.SET_NAVIGATION_VALUE: {
      console.log("SET_NAVIGATION_VALUE >>>> ", action.value);
      return updateObject(state, {
        navigationValue: action.value,
      });
    }
    case actionType.SET_ONBOARDING_VALUE:
      return updateObject(state, {
        onBoardingValue: action.value,
      });
    case actionType.SET_CLIENT_LANDING_PAGE:
      return updateObject(state, {
        onClientLandingPage: action.value,
      });

    case actionType.SET_LOCATION_DETAILS:
      return updateObject(state, {
        locationDetails: action.value,
      });

    case actionType.STORE_NAVIGATION_ROUTE:
      return updateObject(state, {
        tempRoutes: action.payload,
      });
    case actionType.CLEAR_NAVIGATION_ROUTE:
      return updateObject(state, {
        tempRoutes: null,
      });
    case actionType.REFRESH_BOTTOM_TAB:
      return updateObject(state, {
        refreshBottomTab: action.value,
      });

    case actionType.SET_INITIAL_NAVIGATION_ROUTE:
      return updateObject(state, {
        initialNav: action.value,
      });
    case actionType.CLEAR_INITIAL_NAVIGATION_ROUTE:
      return updateObject(state, {
        initialNav: null,
      });

    case actionType.STORE_CUSTOM_NAV_FROM_LOGIN:
      return updateObject(state, {
        ...action.payload,
      });

    case actionType.CLEAR_CUSTOM_NAV_FROM_LOGIN:
      return updateObject(state, {
        proId: null,
      });
    case actionType.TOGGLE_CLIENT_SIGNUP_BACK_BUTTON:
      // return updateObject(state, {
      //   showClientSignupCategoryBackButton: null,
      // });
      return {
        ...state,
        showClientSignupCategoryBackButton: action.value,
      };
    case actionType.IS_LAST_STEP:
      // return updateObject(state, {
      //   showClientSignupCategoryBackButton: null,
      // });
      return {
        ...state,
        isLastStep: action.value,
      };
    case actionType.INITIAL_STEP:
      console.log("INITIAL_STEP >>>>>> ", action.value)
      // return updateObject(state, {
      //   showClientSignupCategoryBackButton: null,
      // });
      return {
        ...state,
        initialStep: action.value,
      };

    default:
      return state;
  }
};

export default reducer;
