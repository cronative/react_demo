import * as actionTypes from '../actionTypes';

export const setupProgressionUpdate = (value) => {
    return {
        type: actionTypes.PROFESSIONAL_PROFILE_SETUP_PROGRESSION_UPDATE,
        value
    };
};