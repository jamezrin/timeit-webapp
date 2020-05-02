import axios from 'axios';
import React, { useEffect, useState } from 'react';

const currentUserEndpoint = process.env.REACT_APP_BACKEND_URL + '/current-user';
const authenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/authenticate';
const deauthenticateEndpoint = process.env.REACT_APP_BACKEND_URL + '/deauthenticate';

export const requestCurrentUser = () => axios.get(currentUserEndpoint, { withCredentials: true });
export const requestAuthentication = (values) => axios.post(authenticateEndpoint, values, { withCredentials: true });
export const requestDeauthentication = () => axios.post(deauthenticateEndpoint, {}, { withCredentials: true });

export const fetchAuthStatus = () =>
  requestCurrentUser()
    .then((response) => ({
      currentUser: response.data,
      isAuthenticated: true,
    }))
    .catch(
      (err) =>
        err.response && {
          currentUser: null,
          isAuthenticated: false,
        },
    );

const AuthContext = React.createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  const refreshStatus = () => {
    fetchAuthStatus().then((status) => {
      setAuthStatus(status);
    });
  };

  useEffect(() => {
    refreshStatus();
  }, []);

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
