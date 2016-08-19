import {LOCATION_CHANGE} from 'react-router-redux';

const initialState = {locationBeforeTransitions: null};

export const routing = (state = initialState, {type, payload}) => {
  if (type === LOCATION_CHANGE) {
    return {...state, locationBeforeTransitions: payload};
  }
  return state;
};

export default routing;
