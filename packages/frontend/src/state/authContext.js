import React, { useCallback, useEffect, useState } from 'react';
import { requestCurrentUser } from '../api';

export const fetchAuthStatus = () =>
  requestCurrentUser()
    .then((response) => ({
      currentUser: response.data,
      isAuthenticated: true,
      authenticationError: null,
    }))
    .catch((err) => ({
      currentUser: null,
      isAuthenticated: false,
      authenticationError: err,
    }));

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  const refreshStatus = useCallback(() => {
    return fetchAuthStatus().then((status) => {
      setAuthStatus(status);
      return status;
    });
  }, []);

  useEffect(() => {
    refreshStatus().then((status) => {
      console.log('User authentication status:', status);
    });
  }, [refreshStatus]);

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        refreshStatus,
        setAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
