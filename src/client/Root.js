import React, {Component} from 'react';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'react-redux';
import routes from '../universal/routes/index';
import {syncHistoryWithStore} from 'react-router-redux';


class Root extends Component {
  static propTypes = {
    store: React.PropTypes.object
  }

  render() {
    const {store} = this.props;

    const history = syncHistoryWithStore(browserHistory, store, {
      selectLocationState: (state) => {
        return state.get('routing');
      }
    });

    return (
      <Provider store={store}>
        <Router history={history} routes={routes(store)}/>
      </Provider>
    );
  }
}

export default Root;
