import React, { useContext } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { ToastProvider } from 'react-toast-notifications';
import { ChakraProvider, Flex } from '@chakra-ui/react';
import UnauthenticatedUserRoute from './components/routes/UnauthenticatedUserRoute';
import AuthContext, {
  AuthContextProvider,
} from './state/authenticationContext';

import LoginPage from './components/pages/LoginPage/LoginPage';
import ProjectListPage from './components/pages/ProjectListPage/ProjectListPage';
import RegisterPage from './components/pages/RegisterPage/RegisterPage';
import AuthenticatedUserRoute from './components/routes/AuthenticatedUserRoute';
import ProjectPage from './components/pages/ProjectPage/ProjectPage';
import FullPageLoadSpinner from './components/base/FullPageLoadSpinner';
import ProjectSettingsPage from './components/pages/ProjectSettingsPage/ProjectSettingsPage';
import ProjectSessionPage from './components/pages/ProjectSessionPage/ProjectSessionPage';
import RequestPasswordResetPage from './components/pages/RequestPasswordResetPage/RequestPasswordResetPage';
import ConfirmAccountPage from './components/pages/ConfirmAccountPage/ConfirmAccountPage';
import AcceptProjectInvitePage from './components/pages/AcceptProjectInvitePage/AcceptProjectInvitePage';
import RecoverPasswordPage from './components/pages/RecoverPasswordPage/RecoverPasswordPage';
import { ColorModeScript } from '@chakra-ui/color-mode';

const ProviderWrappedComponent = ({ children }) => {
  return (
    <ChakraProvider>
      <ToastProvider>
        <AuthContextProvider>{children}</AuthContextProvider>
      </ToastProvider>
    </ChakraProvider>
  );
};

const RouterWrappedComponent = () => {
  const { authStatus } = useContext(AuthContext);

  return authStatus ? (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {authStatus.isAuthenticated ? (
            <ProjectListPage />
          ) : (
            <Redirect to="/login" />
          )}
        </Route>

        <UnauthenticatedUserRoute path="/login" component={LoginPage} />
        <UnauthenticatedUserRoute path="/register" component={RegisterPage} />
        <UnauthenticatedUserRoute
          path="/recover_password"
          component={RequestPasswordResetPage}
        />

        <AuthenticatedUserRoute
          path="/project/:projectId"
          component={ProjectPage}
          exact
        />
        <AuthenticatedUserRoute
          path="/project/:projectId/settings"
          component={ProjectSettingsPage}
          exact
        />
        <AuthenticatedUserRoute
          path="/project/:projectId/session/:sessionId"
          component={ProjectSessionPage}
          exact
        />
        <AuthenticatedUserRoute
          path="/project/:projectId/accept-invite/:token"
          component={AcceptProjectInvitePage}
          exact
        />
        <Route
          path="/confirm-account/:token"
          component={ConfirmAccountPage}
          exact
        />
        <Route
          path="/recover-password/:token"
          component={RecoverPasswordPage}
          exact
        />

        {/* Fallback route that redirects to the root */}
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  ) : (
    <Flex
      height="100vh"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <FullPageLoadSpinner />
    </Flex>
  );
};

function App() {
  return (
    <ProviderWrappedComponent>
      <ColorModeScript initialColorMode="light" />
      <RouterWrappedComponent />
    </ProviderWrappedComponent>
  );
}

export default App;
