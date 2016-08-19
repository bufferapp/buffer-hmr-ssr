import {compose} from 'redux';
import {combineReducers} from 'redux-immutablejs';

// Reducers
import {routing} from './routing';

const currentReducers = {
  routing
};

export default (newReducers, reducerEnhancers) => {

  Object.assign(currentReducers, newReducers);

  const reducer = combineReducers({...currentReducers});

  if (reducerEnhancers) {
    return Array.isArray(reducerEnhancers) ? compose(...reducerEnhancers)(reducer) : reducerEnhancers(reducer);
  }

  return reducer;
}
