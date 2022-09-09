import * as actionTypes from '../actionTypes';

export const upcomingBookingListRequest = () => {
  return {
    type: actionTypes.UPCOMING_BOOKING_LIST_REQUEST,
  };
};

export const clearUpcomingBookingListRequest = () => {
  return {
    type: actionTypes.UPCOMING_BOOKING_LIST_CLEAR,
  };
};

export const previousBookingListRequest = () => {
  return {
    type: actionTypes.PREVIOUS_BOOKING_LIST_REQUEST,
  };
};

export const clearPreviousBookingListRequest = () => {
  return {
    type: actionTypes.PREVIOUS_BOOKING_LIST_CLEAR,
  };
};

export const professionalBookingListRequest = (value) => {
  return {
    type: actionTypes.PROF_UPCOMING_BOOKING_REQUEST,
    value,
  };
};

export const professionalBookingListRequestClear = () => {
  return {
    type: actionTypes.PROF_UPCOMING_BOOKING_CLEAR,
  };
};

export const proBookingInnerRequest = (value) => {
  return {
    type: actionTypes.PRO_BOOKING_INNER_REQUEST,
    value,
  };
};

export const proBookingInnerRequestClear = () => {
  return {
    type: actionTypes.PRO_BOOKING_INNER_CLEAR,
  };
};

export const proBookingCancelRequest = (value) => {
  return {
    type: actionTypes.PRO_BOOKING_CANCEL_REQUEST,
    value,
  };
};

export const proBookingCancelRequestClear = () => {
  return {
    type: actionTypes.PRO_BOOKING_CANCEL_CLEAR,
  };
};

export const proBookingNoShowRequest = (value) => {
  return {
    type: actionTypes.PRO_BOOKING_NOSHOW_REQUEST,
    value,
  };
};

export const proBookingNoShowRequestClear = () => {
  return {
    type: actionTypes.PRO_BOOKING_NOSHOW_CLEAR,
  };
};

export const proBookingAddnotesRequest = (value) => {
  return {
    type: actionTypes.PRO_BOOKING_NOTES_Add_REQUEST,
    value,
  };
};

export const proBookingAddnotesRequestClear = () => {
  return {
    type: actionTypes.PRO_BOOKING_NOTES_Add_CLEAR,
  };
};

export const proBookingCompleteRequest = (value) => {
  return {
    type: actionTypes.PRO_BOOKING_COMPLETE_REQUEST,
    value,
  };
};

export const proBookingCompleteRequestClear = () => {
  return {
    type: actionTypes.PRO_BOOKING_COMPLETE_CLEAR,
  };
};

export const getSlotsRequest = (payload) => {
  return {
    type: actionTypes.GET_BOOKING_SLOTS_REQUEST,
    payload,
  };
};

export const getSlotsSuccess = () => {
  return {
    type: actionTypes.GET_BOOKING_SLOTS_SUCCESS,
  };
};

export const getSlotsFailure = (error) => {
  return {
    type: actionTypes.GET_BOOKING_SLOTS_FAILED,
    error,
  };
};

export const getSlotsClear = () => {
  return {
    type: actionTypes.GET_BOOKING_SLOTS_CLEAR,
  };
};

export const addToCartRequest = (payload) => {
  return {
    type: actionTypes.ADD_TO_CART_REQUEST,
    payload,
  };
};

export const addToCartSuccess = (payload) => {
  return {
    type: actionTypes.ADD_TO_CART_SUCCESS,
  };
};

export const addToCartFailure = (error) => {
  return {
    type: actionTypes.ADD_TO_CART_FAILED,
    error,
  };
};

export const removeCartItemRequest = (payload) => {
  return {
    type: actionTypes.DELETE_CART_ITEM_REQUEST,
    payload,
  };
};

export const removeCartItemSuccess = () => {
  return {
    type: actionTypes.DELETE_CART_ITEM_SUCCESS,
  };
};

export const removeCartItemFailure = (error) => {
  return {
    type: actionTypes.DELETE_CART_ITEM_FAILED,
    error,
  };
};

export const updateCartRequest = (payload) => {
  return {
    type: actionTypes.UPDATE_CART_REQUEST,
    payload,
  };
};

export const updateCartSuccess = () => {
  return {
    type: actionTypes.UPDATE_CART_SUCCESS,
  };
};

export const updateCartFailure = (error) => {
  return {
    type: actionTypes.UPDATE_CART_FAILED,
    error,
  };
};

export const listCartRequest = (payload) => {
  return {
    type: actionTypes.GET_CART_REQUEST,
    payload,
  };
};

export const listCartSuccess = () => {
  return {
    type: actionTypes.GET_CART_SUCCESS,
  };
};

export const listCartFailure = (error) => {
  return {
    type: actionTypes.GET_CART_FAILED,
    error,
  };
};

export const bookServiceRequest = (payload, cardData = undefined) => {
  return {
    type: actionTypes.BOOK_SERVICE_REQUEST,
    payload,
    cardData,
  };
};

export const bookServiceSuccess = (payload) => {
  return {
    type: actionTypes.payload,
  };
};

export const bookServiceFailure = (error) => {
  return {
    type: actionTypes.BOOK_SERVICE_FAILED,
    error,
  };
};

export const bookServiceClear = () => {
  return {
    type: actionTypes.BOOK_SERVICE_CLEAR,
  };
};

export const userBookingDetailsRequest = (value) => {
  return {
    type: actionTypes.USER_BOOKING_DETAILS_REQUEST,
    value,
  };
};

export const userBookingDetailsRequestClear = () => {
  return {
    type: actionTypes.USER_BOOKING_DETAILS_CLEAR,
  };
};

export const userBookingCancelRequest = (value) => {
  return {
    type: actionTypes.USER_BOOKING_CANCEL_REQUEST,
    value,
  };
};

export const userBookingCancelRequestClear = () => {
  return {
    type: actionTypes.USER_BOOKING_CANCEL_CLEAR,
  };
};

export const userbookingRescheduleRequest = (value) => {
  return {
    type: actionTypes.USER_BOOKING_RESCHEDULE_REQUEST,
    value,
  };
};

export const userbookingRescheduleRequestClear = () => {
  return {
    type: actionTypes.USER_BOOKING_RESCHEDULE_CLEAR,
  };
};
