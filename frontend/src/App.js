import React, { useState } from 'react';
import logo from './logo.svg';

import ApiTestComponent from './components/ApiTestComponent';

import { BrowserRouter, Link, Route, Switch } from 'react-router-dom';

import './App.css';
import LoggedOutWrapper from './components/LoggedOutWrapper';

const Index = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
        Learn React
      </a>

      <ApiTestComponent/>
    </header>
  </div>
)

async function verifyAuth() {
  const pingApiUrl = process.env.REACT_APP_BACKEND_URL + "/verify-auth";
  return await fetch(pingApiUrl, {
    method: "POST",
    credentials: "include"
  }).then((res) => res.text());
}

async function tryAuth() {
  const pingApiUrl = process.env.REACT_APP_BACKEND_URL + "/authenticate";
  return await fetch(pingApiUrl, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      emailAddress: "asd@asd.com",
      password: "superpass"
    }),
    headers: {
      "Content-Type": "application/json"
    },
  }).then((res) => res.text());
}

function App() {
  const [verifyRes, setVerifyRes] = useState("Unknown");
  const [authRes, setAuthRes] = useState("Unknown");

  return (
    <BrowserRouter>
      <nav className="absolute bottom-0 py-2 px-4 m-3 z-10 rounded bg-white shadow-xl">
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/test1">Test1</Link></li>
          <li><Link to="/">Home</Link></li>
        </ul>
      </nav>

      <Switch>
        <Route path={"/login"}>
          <LoggedOutWrapper>
            Hola mundo
          </LoggedOutWrapper>
        </Route>
        <Route path={"/register"}>
          <LoggedOutWrapper>
            Adios mundo
          </LoggedOutWrapper>
        </Route>
        <Route path={"/test1"}>
          <p>Verification response: {verifyRes}</p>
          <p>Authentication response: {authRes}</p>

          <button onClick={() => verifyAuth().then(setVerifyRes)}>Verify auth</button>
          <button onClick={() => tryAuth().then(setAuthRes)}>Authenticate</button>
          <button onClick={() => {
            setAuthRes("Unknown");
            setVerifyRes("Unknown");
          }}>Reset</button>
        </Route>
        <Route path={"/"}>
          <Index/>
        </Route>
      </Switch>

    </BrowserRouter>
  );
}

export default App;
