import React, {Fragment, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Navbar from './component/Layout/Navbar';
import Landing from './component/Layout/Landing';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';
import Dashboard from './component/dashboard/Dashboard';

//Redux
//Provider comes from react-redux package. It combines both the react and redux apps
import {Provider} from 'react-redux';
import store from './store';
import Alert from './component/Layout/Alert';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth';
import PrivateRoute from './component/routing/PrivateRoute';


//check localStorage for token
if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {
  //Life cycle hook - useEffect. Used instead of componentDidMount
  //[] as second arg which makes sure useEffect runs once
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
      <Fragment>
        <Navbar />
        <Route exact path='/' component={Landing} />
        <section className="container">
          {/* Include the alert component inside the main app component */}
          <Alert />
          {/* Switch for switching between private and public routes */}
          <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </section>
      </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
