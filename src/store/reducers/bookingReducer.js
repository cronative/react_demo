import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  cartError: null,
  addCartLoader: null,
  message: null,
  slots: [],
  bookingEdit: false,
  upcomingBookingListDetails: null,
  previousBookingListDetails: null,
  profUpcomingBookingListDetails: null,
  profBookingInnerDetails: null,
  proBookingCalcelDetails: null,
  proBookingNoShowDetails: null,
  proBookingAddNotesDetails: null,
  proBookingCompleteDetails: null,
  bookingPaymentDetails: null,
  userBookingDetails: null,
  userBookingCancelDetails: null,
  userBookingRescheduleDetails: null,
  bookingSuccess: false,
  cartCreation: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Upcoming booking list functionality
    case actionType.UPCOMING_BOOKING_LIST_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.UPCOMING_BOOKING_LIST_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        upcomingBookingListDetails: action.upcomingBookingListDetails,
      });
    case actionType.UPCOMING_BOOKING_LIST_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.UPCOMING_BOOKING_LIST_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
      });

    // Previous booking list functionality
    case actionType.PREVIOUS_BOOKING_LIST_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
      });
    case actionType.PREVIOUS_BOOKING_LIST_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        previousBookingListDetails: action.previousBookingListDetails,
      });
    case actionType.PREVIOUS_BOOKING_LIST_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.PREVIOUS_BOOKING_LIST_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
      });

    // Professional upcoming booking list functionality
    case actionType.PROF_UPCOMING_BOOKING_REQUEST:
      return updateObject(state, {
        loader: true,
        profUpcomingBookingListDetails: null,
      });
    case actionType.PROF_UPCOMING_BOOKING_SUCCESS:
      return updateObject(state, {
        loader: false,
        profUpcomingBookingListDetails: action.profBookingListData,
      });
    case actionType.PROF_UPCOMING_BOOKING_FAILED:
      return updateObject(state, {
        loader: false,
        profUpcomingBookingListDetails: action.profBookingListData,
      });
    case actionType.PROF_UPCOMING_BOOKING_CLEAR:
      return updateObject(state, {
        loader: false,
      });

    // Professional upcoming booking inner page functionality
    case actionType.PRO_BOOKING_INNER_REQUEST:
      return updateObject(state, {
        loader: true,
        profBookingInnerDetails: null,
      });
    case actionType.PRO_BOOKING_INNER_SUCCESS:
      return updateObject(state, {
        loader: false,
        profBookingInnerDetails: action.profBookingInnerData,
      });
    case actionType.PRO_BOOKING_INNER_FAILED:
      return updateObject(state, {
        loader: false,
        profBookingInnerDetails: action.profBookingInnerData,
      });
    case actionType.PRO_BOOKING_INNER_CLEAR:
      return updateObject(state, {
        loader: false,
      });

    // Professional cencel booking inner page functionality
    case actionType.PRO_BOOKING_CANCEL_REQUEST:
      return updateObject(state, {
        loader: true,
        proBookingCalcelDetails: null,
      });
    case actionType.PRO_BOOKING_CANCEL_SUCCESS:
      return updateObject(state, {
        loader: false,
        proBookingCalcelDetails: action.proBookingCalcelData,
      });
    case actionType.PRO_BOOKING_CANCEL_FAILED:
      return updateObject(state, {
        loader: false,
        proBookingCalcelDetails: action.proBookingCalcelData,
      });
    case actionType.PRO_BOOKING_CANCEL_CLEAR:
      return updateObject(state, {
        loader: false,
        proBookingCalcelDetails: null,
      });

    // Professional re-schedule booking inner page functionality
    case actionType.PRO_BOOKING_NOSHOW_REQUEST:
      return updateObject(state, {
        loader: true,
        proBookingNoShowDetails: null,
      });
    case actionType.PRO_BOOKING_NOSHOW_SUCCESS:
      return updateObject(state, {
        loader: false,
        proBookingNoShowDetails: action.proBookingNoShowData,
      });
    case actionType.PRO_BOOKING_NOSHOW_FAILED:
      return updateObject(state, {
        loader: false,
        proBookingNoShowDetails: action.proBookingNoShowData,
      });
    case actionType.PRO_BOOKING_NOSHOW_CLEAR:
      return updateObject(state, {
        loader: false,
        proBookingNoShowDetails: null,
      });

    // Professional add notes to booking inner page functionality
    case actionType.PRO_BOOKING_NOTES_Add_REQUEST:
      return updateObject(state, {
        loader: true,
        proBookingAddNotesDetails: null,
      });
    case actionType.PRO_BOOKING_NOTES_Add_SUCCESS:
      return updateObject(state, {
        loader: false,
        proBookingAddNotesDetails: action.proBookingAddNotesData,
      });
    case actionType.PRO_BOOKING_NOTES_Add_FAILED:
      return updateObject(state, {
        loader: false,
        proBookingAddNotesDetails: action.proBookingAddNotesData,
      });
    case actionType.PRO_BOOKING_NOTES_Add_CLEAR:
      return updateObject(state, {
        loader: false,
        proBookingAddNotesDetails: null,
      });

    // Professional complete booking inner page functionality
    case actionType.PRO_BOOKING_COMPLETE_REQUEST:
      return updateObject(state, {
        loader: true,
        proBookingCompleteDetails: null,
      });
    case actionType.PRO_BOOKING_COMPLETE_SUCCESS:
      return updateObject(state, {
        loader: false,
        proBookingCompleteDetails: action.proBookingCompleteData,
      });
    case actionType.PRO_BOOKING_COMPLETE_FAILED:
      console.log('action', action);
      return updateObject(state, {
        loader: false,
        proBookingCompleteDetails: action.proBookingCompleteData,
      });
    case actionType.PRO_BOOKING_COMPLETE_CLEAR:
      return updateObject(state, {
        loader: false,
        proBookingCompleteDetails: null,
      });

    // User booking inner page details functionality
    case actionType.USER_BOOKING_DETAILS_REQUEST:
      return updateObject(state, {
        loader: true,
        userBookingDetails: null,
      });
    case actionType.USER_BOOKING_DETAILS_SUCCESS:
      return updateObject(state, {
        loader: false,
        userBookingDetails: action.userBookingData,
      });
    case actionType.USER_BOOKING_DETAILS_FAILED:
      return updateObject(state, {
        loader: false,
        userBookingDetails: action.userBookingData,
      });
    case actionType.USER_BOOKING_DETAILS_CLEAR:
      return updateObject(state, {
        loader: false,
        userBookingDetails: null,
      });

    // User cancel booking inner page functionality
    case actionType.USER_BOOKING_CANCEL_REQUEST:
      return updateObject(state, {
        loader: true,
        userBookingCancelDetails: null,
      });
    case actionType.USER_BOOKING_CANCEL_SUCCESS:
      return updateObject(state, {
        loader: false,
        userBookingCancelDetails: action.userBookingCencelData,
      });
    case actionType.USER_BOOKING_CANCEL_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
      });
    case actionType.USER_BOOKING_CANCEL_CLEAR:
      return updateObject(state, {
        loader: false,
        userBookingCancelDetails: null,
      });

    // Professional complete booking inner page functionality
    case actionType.USER_BOOKING_RESCHEDULE_REQUEST:
      return updateObject(state, {
        loader: true,
        userBookingRescheduleDetails: null,
      });
    case actionType.USER_BOOKING_RESCHEDULE_SUCCESS:
      return updateObject(state, {
        loader: false,
        userBookingRescheduleDetails: action.userBookingRescheduleData,
      });
    case actionType.USER_BOOKING_RESCHEDULE_FAILED:
      return updateObject(state, {
        loader: false,
        userBookingRescheduleDetails: action.userBookingRescheduleData,
      });
    case actionType.USER_BOOKING_RESCHEDULE_CLEAR:
      return updateObject(state, {
        loader: false,
        userBookingRescheduleDetails: null,
      });
    case actionType.GET_BOOKING_SLOTS_REQUEST:
      return updateObject(state, {
        loader: true,
      });
    case actionType.GET_BOOKING_SLOTS_SUCCESS:
      return updateObject(state, {
        slots: action.payload.data,
        loader: false,
        error: null,
      });
    case actionType.GET_BOOKING_SLOTS_FAILED:
      return updateObject(state, {
        error: action.error,
        loader: false,
      });
    case actionType.ADD_TO_CART_REQUEST:
      return updateObject(state, {
        cartError: null,
        addCartLoader: true,
      });

    //ADD and UPDATE Cart

    case actionType.ADD_TO_CART_SUCCESS:
      return updateObject(state, {
        cartError: null,
        addCartLoader: false,
        cartCreation: action.payload.data.createdAt,
      });
    case actionType.ADD_TO_CART_FAILED:
      return updateObject(state, {
        addCartLoader: false,
        cartError: action.error,
      });
    case actionType.UPDATE_CART_REQUEST:
      return updateObject(state, {
        cartError: null,
        addCartLoader: true,
      });
    case actionType.UPDATE_CART_SUCCESS:
      return updateObject(state, {
        cartError: null,
        addCartLoader: false,
        cartCreation: action.payload.data.createdAt,
      });
    case actionType.UPDATE_CART_FAILED:
      return updateObject(state, {
        addCartLoader: false,
        cartError: action.error,
      });

    //ADD and UPDATE Cart

    case actionType.BOOK_SERVICE_REQUEST:
      return updateObject(state, {
        error: null,
        loader: true,
        bookingPaymentDetails: null,
      });
    case actionType.BOOK_SERVICE_SUCCESS:
      return updateObject(state, {
        error: null,
        loader: false,
        bookingPaymentDetails: action.payload.booking,
        bookingSuccess: true,
      });
    case actionType.BOOK_SERVICE_FAILED:
      console.log(action);
      return updateObject(state, {
        error: action.error,
        loader: false,
      });
    case actionType.BOOK_SERVICE_CLEAR:
      return updateObject(state, {
        error: null,
        loader: false,
        bookingSuccess: false,
      });

    case actionType.SET_BOOKING_EDIT:
      return updateObject(state, {
        bookingEdit: action.payload,
      });

    case actionType.BOOKING_REDUCER_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        cartError: null,
        addCartLoader: null,
        message: null,
        slots: [],
        bookingEdit: false,
        upcomingBookingListDetails: null,
        previousBookingListDetails: null,
        profUpcomingBookingListDetails: null,
        profBookingInnerDetails: null,
        proBookingCalcelDetails: null,
        proBookingNoShowDetails: null,
        proBookingAddNotesDetails: null,
        proBookingCompleteDetails: null,
        bookingPaymentDetails: null,
        userBookingDetails: null,
        userBookingCancelDetails: null,
        userBookingRescheduleDetails: null,
        bookingSuccess: false,
        cartCreation: null,
      });

    default:
      return state;
  }
};

export default reducer;
