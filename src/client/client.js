import {render} from 'react-dom';
import React from 'react';
import {AppContainer} from 'react-hot-loader';
import {fromJS, Map as iMap} from 'immutable';
import makeStore from './makeStore';
import Root from './Root';

const {
  routing
} = window.__INITIAL_STATE__;

const initialState = iMap([
  ['routing', routing],
]);

const rootEl = document.getElementById('root');

const store = makeStore(initialState);

const renderApp = () => {
  render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>
  , rootEl);
}

renderApp();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./Root', renderApp);
}
