import axios from 'axios';
import { useState } from 'react';

const currentUserEndpoint = process.env.REACT_APP_BACKEND_URL + '/current-user';
export const getCurrentUser = () => axios.get(currentUserEndpoint, { withCredentials: true });

const authenticationBackend = {
  isAuthenticated: false,
  currentUser: null,
};

export const refreshAuthStatus = () =>
  getCurrentUser()
    .then((response) => {
      authenticationBackend.currentUser = response.data;
      authenticationBackend.isAuthenticated = true;
    })
    .catch((err) => {
      authenticationBackend.currentUser = null;
      authenticationBackend.isAuthenticated = false;
    })
    .then(() => {
      return authenticationBackend;
    });

export default authenticationBackend;
