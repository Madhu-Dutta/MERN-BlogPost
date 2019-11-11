import React, {Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import { Navbar } from './component/Layout/Navbar';
import Landing from './component/Layout/Landing';
import Login from './component/Auth/Login';
import Register from './component/Auth/Register';

//Redux
//Provider comes from react-redux package. It combines both the react and redux apps
import {Provider} from 'react-redux';
import store from './store';
import Alert from './component/Layout/Alert';

const App = () => {
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
          </Switch>
        </section>
      </Fragment>
      </Router>
    </Provider>
  );
}

export default App;
