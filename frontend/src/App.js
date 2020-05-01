import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import DebugNav from './components/DebugNav';

import { ToastProvider } from 'react-toast-notifications';
import { ColorModeProvider, CSSReset, theme, Spinner, Flex, Heading, Text, ThemeProvider } from '@chakra-ui/core';
import HomePage from './components/pages/HomePage';
import AuthenticatedUserRoute from './components/routing/AuthenticatedUserRoute';
import authenticationBackend, { refreshAuthStatus } from './utils/authenticationBackend';
import UnauthenticatedUserRoute from './components/routing/UnauthenticatedUserRoute';
import AuthenticationContext from './utils/authenticationBackend';

const RecoverPasswordPage = () => 'Not yet implemented';

const ProviderWrappedComponent = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <ToastProvider>
          <CSSReset />
          {children}
        </ToastProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const RouterWrappedComponent = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null);

  useEffect(() => {
    refreshAuthStatus().then((authStatus) => {
      // Intencionalmente hacer lenta la carga de la app
      setTimeout(() => {
        setAuthStatus(authStatus);
      }, 500);
    });
  }, []);

  return (
    <>
      {authStatus ? (
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              {authStatus.isAuthenticated ? <HomePage /> : <Redirect to="/login" />}
            </Route>

            <UnauthenticatedUserRoute path="/login" component={LoginPage} />
            <UnauthenticatedUserRoute path="/register" component={RegisterPage} />
            <UnauthenticatedUserRoute path="/recover_password" component={RecoverPasswordPage} />
          </Switch>

          {children}
        </BrowserRouter>
      ) : (
        <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center" direction="column">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
          <Text mt={4}>Cargando la aplicación</Text>
        </Flex>
      )}
    </>
  );
};

function App() {
  return (
    <ProviderWrappedComponent>
      <RouterWrappedComponent />
    </ProviderWrappedComponent>
  );
}

export default App;
