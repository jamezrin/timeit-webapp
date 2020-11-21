import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import AuthContext from '../state/authContext';

export default function UnauthenticatedUserRoute({
  component: ChildComponent,
  ...rest
}) {
  const { authStatus } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!authStatus.isAuthenticated) {
          return <ChildComponent {...props} />;
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
}
