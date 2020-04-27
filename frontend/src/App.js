import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import AuthTest from './components/AuthTest';
import RegisterPage from './components/pages/RegisterPage';
import DebugNav from './components/DebugNav';

import { ColorModeProvider, CSSReset, theme, ThemeProvider } from '@chakra-ui/core';
import HomePage from './components/pages/HomePage';

const RecoverPasswordPage = () => 'Not yet implemented';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ColorModeProvider>
        <CSSReset />
        <BrowserRouter>
          <DebugNav />
          <Switch>
            <Route path={'/login'}>
              <LoginPage />
            </Route>
            <Route path={'/register'}>
              <RegisterPage />
            </Route>
            <Route path={'/test1'}>
              <AuthTest />
            </Route>
            <Route path={'/home'}>
              <HomePage />
            </Route>
            <Route path={'/recover_password'}>
              <RecoverPasswordPage />
            </Route>
          </Switch>
        </BrowserRouter>
      </ColorModeProvider>
    </ThemeProvider>
  );
}

export default App;
