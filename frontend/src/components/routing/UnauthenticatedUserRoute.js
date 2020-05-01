import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import authenticationBackend from '../../utils/authenticationBackend';

const UnauthenticatedUserRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (!authenticationBackend.isAuthenticated) {
        return <Component {...props} />;
      }

      return (
        <Redirect
          to={{
            pathname: props.location.from,
          }}
        />
      );
    }}
  />
);

export default UnauthenticatedUserRoute;
