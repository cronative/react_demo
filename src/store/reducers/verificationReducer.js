import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  verifyIdentity: null,
  pendingVerification : null,
  trialExpireCheckDetails : null,
  trialPlanCheckingStatus : false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Verify my identity reducer
    case actionType.VERIFY_IDENTITY_REQUEST:
      return updateObject(state, {
        loader: true,
        verifyIdentity : null,
      });
    case actionType.VERIFY_IDENTITY_SUCCESS:
      return updateObject(state, {
        loader: false,
        verifyIdentity : action.verifyIdentityData,
      });
    case actionType.VERIFY_IDENTITY_FAILED:
      return updateObject(state, {
        loader: false,
        verifyIdentity : action.verifyIdentityData,
      });
    case actionType.VERIFY_IDENTITY_CLEAR:
      return updateObject(state, {
        loader: false,
        verifyIdentity: null,
      });

    // Pending verification reducer
    case actionType.PENDING_VERIFICATION_REQUEST:
      return updateObject(state, {
        loader: true,
        pendingVerification : null,
      });
    case actionType.PENDING_VERIFICATION_SUCCESS:
      return updateObject(state, {
        loader: false,
        pendingVerification : action.pendingVerificationData,
      });
    case actionType.PENDING_VERIFICATION_FAILED:
      return updateObject(state, {
        loader: false,
        pendingVerification : action.pendingVerificationData,
      });
    case actionType.PENDING_VERIFICATION_CLEAR:
      return updateObject(state, {
        loader: false,
        pendingVerification: null,
      });
    
    // Pro trial expire check reducer
    case actionType.PRO_TRIAL_EXPIRE_CHECK_REQUEST:
      return updateObject(state, {
        loader: true,
        trialExpireCheckDetails : null,
      });
    case actionType.PRO_TRIAL_EXPIRE_CHECK_SUCCESS:
      return updateObject(state, {
        loader: false,
        trialExpireCheckDetails : action.trialExpireCheckData,
      });
    case actionType.PRO_TRIAL_EXPIRE_CHECK_FAILED:
      return updateObject(state, {
        loader: false,
        trialExpireCheckDetails : action.trialExpireCheckData,
      });
    case actionType.PRO_TRIAL_EXPIRE_CHECK_CLEAR:
      return updateObject(state, {
        loader: false,
        trialExpireCheckDetails: null,
      });

    case actionType.TRIAL_PLAN_CHANGE_STATUS:
        return updateObject(state, {
          trialPlanCheckingStatus: true,
      });

      case actionType.VERIFICATION_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          verifyIdentity: null,
          pendingVerification : null,
          trialExpireCheckDetails : null,
          trialPlanCheckingStatus : false,
      });

    default:
      return state;
  }
};

export default reducer;
