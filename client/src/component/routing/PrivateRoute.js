import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

//...rest operator means allow any other parameter passed on to the components
//This private route :
    //will check if the user is not authenticated and is loading, then redirect them to login page
    //or else if the user is un-authenticated redirect them to login page
const PrivateRoute = ({
    component: Component,
    auth: { isAuthenticated, loading },
    ...rest
  }) => (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
  
  PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth
  });
  
  export default connect(mapStateToProps)(PrivateRoute);
