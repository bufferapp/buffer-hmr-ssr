import {createStore, applyMiddleware} from 'redux';
import makeReducer from './makeReducer';
import {Map as iMap} from 'immutable';

export default ( ) => {
  const store = createStore(makeReducer(), iMap());
  return store;
}
