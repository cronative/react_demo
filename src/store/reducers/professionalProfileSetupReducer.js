import * as actionType from '../actionTypes';
import { updateObject } from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  contectSetupDetails: null,
  termOfPaymentDetails: null,
  aditionalInfoDetails: null,
  contectFormData: null,
  progression: [
    { name: 'dateOfBirth', stepNo: 1, isCompleted: 0, routeName: 'SetupDOB' },
    { name: 'primaryCategory', stepNo: 2, isCompleted: 0, routeName: 'SetupMainCategories' },
    { name: 'additionalCategories', stepNo: 3, isCompleted: 0, routeName: 'SetupAdditionalCategories' },
    { name: 'businessDetails', stepNo: 4, isCompleted: 0, routeName: 'SetupBusiness' },
    { name: 'services', stepNo: 5, isCompleted: 0, routeName: 'SetupService' },
    { name: 'availability', stepNo: 6, isCompleted: 0, routeName: 'SetupAvailability' },
    { name: 'contact', stepNo: 7, isCompleted: 0, routeName: 'SetupContacts' },
    { name: 'paymentTerms', stepNo: 8, isCompleted: 0, routeName: 'SetupTermsOfPayment' },
    { name: 'additionalInfo', stepNo: 9, isCompleted: 0, routeName: 'SetupAdditionalInfo' },
    { name: 'proFaqs', stepNo: 10, isCompleted: 0, routeName: 'SetupFaq' },
  ],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CONTECT_SETUP_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        contectFormData: action.value,
      });
    case actionType.CONTECT_SETUP_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        message: action.message,
        contectSetupDetails: action.contectSetupDetails,
      });
    case actionType.CONTECT_SETUP_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        message: action.error,
        // contectSetupDetails:action.error
      });
    case actionType.CONTECT_SETUP_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        contectSetupDetails: null,
      });
    // Payment term setup step eight
    case actionType.TERM_OF_PAYMENT_SETUP_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.TERM_OF_PAYMENT_SETUP_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        message: action.message,
        termOfPaymentDetails: action.termOfPaymentDetails,
      });
    case actionType.TERM_OF_PAYMENT_SETUP_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        message: action.message,
        //termOfPaymentDetails:action.termOfPaymentDetails
      });
    case actionType.TERM_OF_PAYMENT_SETUP_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        termOfPaymentDetails: null,
      });
    //addintional info request step nine
    case actionType.ADDITIONAL_INFO_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.ADDITIONAL_INFO_SUCCESS:
      return updateObject(state, {
        loader: false,
        error: null,
        message: action.message,
        aditionalInfoDetails: action.aditionalInfoDetails,
      });
    case actionType.ADDITIONAL_INFO_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.message,
        message: action.message,
        aditionalInfoDetails: action.aditionalInfoDetails,
      });
    case actionType.ADDITIONAL_INFO_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        aditionalInfoDetails: null,
      });
    case actionType.PROFESSIONAL_PROFILE_SETUP_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        contectSetupDetails: null,
        termOfPaymentDetails: null,
        aditionalInfoDetails: null,
        contectFormData: null,
      });

    case actionType.PROFESSIONAL_PROFILE_SETUP_PROGRESSION_UPDATE:
      return updateObject(state, {
        progression: action.value,
      });

    default:
      return state;
  }
};
export default reducer;
