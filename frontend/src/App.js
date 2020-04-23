import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import LoginPage from './components/pages/LoginPage';
import AuthTest from './components/AuthTest';
import TestHome from './components/TestHome';
import RegisterPage from './components/pages/RegisterPage';
import DebugNav from './components/DebugNav';

import { CSSReset, theme, ThemeProvider } from '@chakra-ui/core';

function App() {
  return (
    <ThemeProvider theme={theme}>
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
            <TestHome />
          </Route>
        </Switch>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
