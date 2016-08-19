import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

export default class HomeContainer extends Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
      </div>
    );
  }
}
