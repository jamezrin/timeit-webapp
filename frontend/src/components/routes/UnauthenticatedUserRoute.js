import React, { Component, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../../state/authenticationContext';

const UnauthenticatedUserRoute = ({ component: Component, ...rest }) => {
  const { authStatus } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authStatus.isAuthenticated) {
          return <Component {...props} />;
        }

        return (
          <Redirect
            to={{
              pathname: props.location.from || '/',
            }}
          />
        );
      }}
    />
  );
};

export default UnauthenticatedUserRoute;
