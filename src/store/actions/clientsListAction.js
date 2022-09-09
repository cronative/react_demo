import * as actionTypes from '../actionTypes';

export const clientsListRequest = (value) => {
  return {
    type: actionTypes.CLIENTS_LIST_REQUEST,
    value
  };
};
export const clientsListClear = () => {
  return {
    type: actionTypes.CLIENTS_LIST_CLEAR,
  };
};


export const topClientsRequest = () => {
  return {
    type: actionTypes.TOP_CLIENTS_REQUEST,
  };
};
export const topClientsClear = () => {
  return {
    type: actionTypes.TOP_CLIENTS_CLEAR,
  };
};

// ANALYTICS DATA
export const professionalAnalyticsRequest = () => {
  return {
    type: actionTypes.PROFESSIONAL_ANALYTICS_REQUEST,
  };
};
export const professionalAnalyticsClear = () => {
  return {
    type: actionTypes.PROFESSIONAL_ANALYTICS_CLEAR,
  };
};

// GRAPHS DATA
export const professionalGraphsRequest = () => {
  return {
    type: actionTypes.PROFESSIONAL_ANALYTICS_GRAPHS_REQUEST,
  };
};
export const professionalGraphsClear = () => {
  return {
    type: actionTypes.PROFESSIONAL_ANALYTICS_GRAPHS_CLEAR,
  };
};

// Manual add client contacts
export const manualClientContactsRequest = (value) => {
  return {
    type: actionTypes.MANUAL_CLIENT_CONTACTS_REQUEST,
    value
  };
};
export const manualClientContactsClear = () => {
  return {
    type: actionTypes.MANUAL_CLIENT_CONTACTS_CLEAR,
  };
};

// Import add client contacts
export const importClientContactsRequest = (value) => {
  return {
    type: actionTypes.IMPORT_CLIENT_CONTACTS_REQUEST,
    value
  };
};
export const importClientContactsRequestClear = () => {
  return {
    type: actionTypes.IMPORT_CLIENT_CONTACTS_CLEAR,
  };
};

