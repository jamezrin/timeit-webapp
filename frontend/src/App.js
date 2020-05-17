import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';
import { ColorModeProvider, CSSReset, theme, ThemeProvider, Flex } from '@chakra-ui/core';
import UnauthenticatedUserRoute from './components/routes/UnauthenticatedUserRoute';
import AuthContext, { AuthContextProvider } from './state/authenticationContext';

import LoginPage from './components/pages/LoginPage';
import ProjectListPage from './components/pages/ProjectListPage';
import RegisterPage from './components/pages/RegisterPage';
import AuthenticatedUserRoute from './components/routes/AuthenticatedUserRoute';
import ProjectPage from './components/pages/ProjectPage';
import FullPageLoadSpinner from './components/FullPageLoadSpinner';
import ProjectSettingsPage from './components/pages/ProjectSettingsPage';
import ProjectSessionPage from './components/pages/ProjectSessionPage';

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

const RouterWrappedComponent = () => {
  const { authStatus } = useContext(AuthContext);

  return authStatus ? (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {authStatus.isAuthenticated ? <ProjectListPage /> : <Redirect to="/login" />}
        </Route>

        <UnauthenticatedUserRoute path="/login" component={LoginPage} />
        <UnauthenticatedUserRoute path="/register" component={RegisterPage} />
        <UnauthenticatedUserRoute path="/recover_password" component={RecoverPasswordPage} />

        <AuthenticatedUserRoute path="/project/:projectId" component={ProjectPage} exact />
        <AuthenticatedUserRoute path="/project/:projectId/settings" component={ProjectSettingsPage} exact />
        <AuthenticatedUserRoute path="/project/:projectId/session/:sessionId" component={ProjectSessionPage} exact />

        {/* Fallback route that redirects to the root */}
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  ) : (
    <Flex height="100vh" width="100vw" justifyContent="center" alignItems="center">
      <FullPageLoadSpinner />
    </Flex>
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
