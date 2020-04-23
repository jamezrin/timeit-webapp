import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import AuthTest from './components/AuthTest';
import TestHome from './components/TestHome';
import DebugNav from './components/DebugNav';
import esES from "antd/es/locale/es_ES";
import {ConfigProvider} from "antd";

function App() {
  return (
    <ConfigProvider locale={esES}>
      <BrowserRouter>
        <DebugNav />

        <Switch>
          <Route path={'/login'}>
            <LoginForm />
          </Route>
          <Route path={'/register'}>
            <RegisterForm />
          </Route>
          <Route path={'/test1'}>
            <AuthTest />
          </Route>
          <Route path={'/home'}>
            <TestHome />
          </Route>
        </Switch>
      </BrowserRouter>
    </ConfigProvider>

  );
}

export default App;
