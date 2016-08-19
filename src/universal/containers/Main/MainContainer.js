import React, {PropTypes, Component} from 'react';

class MainContainer extends Component {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return (
      <div>
        <h1>Shes Alive!!!</h1>
        {this.props.children}
      </div>
    );
  }
}

export default MainContainer;
