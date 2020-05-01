import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authenticationBackend from '../../utils/authenticationBackend';

const AuthenticatedUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (authenticationBackend.isAuthenticated) {
        return <Component {...props} />;
      }

      return (
        <Redirect
          to={{
            pathname: '/login',
            state: {
              previousLocation: props.location,
            },
          }}
        />
      );
    }}
  />
);

export default AuthenticatedUserRoute;
