import * as actionType from '../actionTypes';
import {updateObject} from '../utiity';

const initialState = {
  loader: false,
  error: null,
  message: null,
  status: null,
  details: null,
  top_clients: null,
  analytics_data: null,
  graph_data: null,
  importClientDetails: null,
  manualClientDetails: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.CLIENTS_LIST_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        details: null,
      });
    case actionType.CLIENTS_LIST_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        details: action.details,
      });
    case actionType.CLIENTS_LIST_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // details: null,
      });
    case actionType.CLIENTS_LIST_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        details: null,
      });

      // TOP CLIENTS SECTION
      case actionType.TOP_CLIENTS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        top_clients: null,
      });
      case actionType.TOP_CLIENTS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        top_clients: action.top_clients,
      });
    case actionType.TOP_CLIENTS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // top_clients: null,
      });
    case actionType.TOP_CLIENTS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        top_clients: null,
      });


      // ANALYTICS SECTION
      case actionType.PROFESSIONAL_ANALYTICS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        analytics_data: null,
      });
      case actionType.PROFESSIONAL_ANALYTICS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        analytics_data: action.analytics_data,
      });
    case actionType.PROFESSIONAL_ANALYTICS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // top_clients: null,
      });
    case actionType.PROFESSIONAL_ANALYTICS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        analytics_data: null
      });

      // ANALYTICS - GRAPHS SECTION
      case actionType.PROFESSIONAL_ANALYTICS_GRAPHS_REQUEST:
      return updateObject(state, {
        loader: true,
        error: null,
        message: null,
        graph_data: null,
      });
      case actionType.PROFESSIONAL_ANALYTICS_GRAPHS_SUCCESS:
      return updateObject(state, {
        loader: false,
        message: action.message,
        status: action.status,
        graph_data: action.graph_data,
      });
    case actionType.PROFESSIONAL_ANALYTICS_GRAPHS_FAILED:
      return updateObject(state, {
        loader: false,
        error: action.error,
        // top_clients: null,
      });
    case actionType.PROFESSIONAL_ANALYTICS_GRAPHS_CLEAR:
      return updateObject(state, {
        loader: false,
        error: null,
        message: null,
        status: null,
        graph_data: null
      });

      case actionType.CLIENT_LIST_REDUCER_CLEAR:
        return updateObject(state, {
          loader: false,
          error: null,
          message: null,
          status: null,
          details: null,
          top_clients: null,
          analytics_data: null,
          graph_data: null,
        });

  // Manual client add
  case actionType.MANUAL_CLIENT_CONTACTS_REQUEST:
    return updateObject(state, {
      loader: true,
      manualClientDetails : null,
    });
  case actionType.MANUAL_CLIENT_CONTACTS_SUCCESS:
    return updateObject(state, {
      loader: false,
      manualClientDetails : action.manualClientData,
    });
  case actionType.MANUAL_CLIENT_CONTACTS_FAILED:
    return updateObject(state, {
      loader: false,
      manualClientDetails : action.manualClientData,
    });
  case actionType.MANUAL_CLIENT_CONTACTS_CLEAR:
    return updateObject(state, {
      loader: false,
      manualClientDetails : null,
    });

    // Import client add
  case actionType.IMPORT_CLIENT_CONTACTS_REQUEST:
    return updateObject(state, {
      loader: true,
      importClientDetails : null,
    });
  case actionType.IMPORT_CLIENT_CONTACTS_SUCCESS:
    return updateObject(state, {
      loader: false,
      importClientDetails : action.importClientData,
    });
  case actionType.IMPORT_CLIENT_CONTACTS_FAILED:
    return updateObject(state, {
      loader: false,
      importClientDetails : action.importClientData,
    });
  case actionType.IMPORT_CLIENT_CONTACTS_CLEAR:
    return updateObject(state, {
      loader: false,
      importClientDetails : null,
    });

    default:
      return state;
  }
};

export default reducer;
