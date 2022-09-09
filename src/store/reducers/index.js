import {combineReducers} from 'redux';
import analyticsReducer from './analyticsReducer';
import auth from './authReducer';
import bookingReducer from './bookingReducer';
import {
  default as additionalInfo,
  default as categoryList,
} from './categoryListReducer';
import clientProfileDetailsReducer from './clientProfileDetailsReducer';
import clientsListReducer from './clientsListReducer';
import cmsPageDetails from './cmsPageReducer';
import faqDetails from './faqReducer';
import groupSessions from './groupSessionReducer';
import messageDetails from './messageReducer';
import navigationValueDetails from './navigationReducer';
import professionalListingByCategoryReducer from './professionalListingByCategoryReducer';
import professionalDetails from './professionalProfileDetailsReducer';
import professionalProfileSetupReducer from './professionalProfileSetupReducer';
import professionSettingStepData from './professionSettingStepReducer.js';
import profileReducer from './profileReducer';
import reviewsReducer from './reviewsReducer';
import similarPros from './similarProsReducer';
import VerificationReducer from './verificationReducer';

const rootReducer = combineReducers({
  auth,
  categoryList,
  additionalInfo,
  bookingReducer,
  professionalProfileSetupReducer,
  navigationValueDetails,
  cmsPageDetails,
  profileReducer,
  VerificationReducer,
  faqDetails,
  professionSettingStepData,
  professionalDetails,
  professionalListingByCategoryReducer,
  reviewsReducer,
  similarPros,
  clientsListReducer,
  clientProfileDetailsReducer,
  analyticsReducer,
  messageDetails,
  groupSessions,
});

export default rootReducer;
