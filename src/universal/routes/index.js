import MainContainer from 'universal/containers/Main/MainContainer';

// Public Routes
import HomeRoute from './home';

export default (store) => {
  return {
    component: MainContainer,
    childRoutes: [
      HomeRoute
    ]
  };
}
