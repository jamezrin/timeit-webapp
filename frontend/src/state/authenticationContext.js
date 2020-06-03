import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

const currentUserEndpoint = process.env.REACT_APP_BACKEND_URL + '/current-user'; // prettier-ignore
const authenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/authenticate'; // prettier-ignore
const deauthenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/deauthenticate'; // prettier-ignore

export const requestCurrentUser = () => axios.get(
  currentUserEndpoint,
  { withCredentials: true },
); // prettier-ignore

export const requestAuthentication = (values) => axios.post(
  authenticateEndpoint,
  values,
  { withCredentials: true },
); // prettier-ignore

export const requestDeauthentication = () => axios.post(
  deauthenticateEndpoint,
  {},
  { withCredentials: true },
); // prettier-ignore

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
