import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';

import { ToastProvider } from 'react-toast-notifications';
import { ColorModeProvider, CSSReset, Flex, Spinner, Text, theme, ThemeProvider } from '@chakra-ui/core';
import HomePage from './components/pages/HomePage';
import UnauthenticatedUserRoute from './components/routes/UnauthenticatedUserRoute';

import AuthContext, { AuthContextProvider } from './state/authenticationContext';

const RecoverPasswordPage = () => 'Not yet implemented';

const ProviderWrappedComponent = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <ToastProvider>
          <AuthContextProvider>{children}</AuthContextProvider>
        </ToastProvider>
      </ColorModeProvider>
    </ThemeProvider>
  );
};

const FullPageLoadSpinner = () => (
  <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center" direction="column">
    <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" />
    <Text mt={4}>Cargando la aplicación</Text>
  </Flex>
);

const RouterWrappedComponent = () => {
  const { authStatus } = useContext(AuthContext);

  return authStatus ? (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {authStatus.isAuthenticated ? <HomePage /> : <Redirect to="/login" />}
        </Route>

        <UnauthenticatedUserRoute path="/login" component={LoginPage} />
        <UnauthenticatedUserRoute path="/register" component={RegisterPage} />
        <UnauthenticatedUserRoute path="/recover_password" component={RecoverPasswordPage} />
      </Switch>
    </BrowserRouter>
  ) : (
    <FullPageLoadSpinner />
  );
};

function App() {
  return (
    <ProviderWrappedComponent>
      <CSSReset />
      <RouterWrappedComponent />
    </ProviderWrappedComponent>
  );
}

export default App;
