import {createStore, applyMiddleware, compose} from 'redux';
import {composeWithDevTools} from 'remote-redux-devtools';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';
// rootSaga;

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = composeWithDevTools({realtime: true});
const store = compose(composeEnhancers(applyMiddleware(sagaMiddleware)))(
  createStore,
)(rootReducer);

sagaMiddleware.run(rootSaga);

export default store;
