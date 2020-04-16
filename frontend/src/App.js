import React from 'react';
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

async function seeCookies() {
  const pingApiUrl = "http://localhost:7001/see-cookie";
  const response = await fetch(pingApiUrl, {
    method: "POST",
    credentials: "include"
  }).then((res) => res.text());

  console.log(response)
}

async function setCookies() {
  const pingApiUrl = "http://localhost:7001/set-cookie";
  const response = await fetch(pingApiUrl, {
    method: "POST",
    credentials: "include"
  }).then((res) => res.text());

  console.log(response)
}

function App() {
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
          <button onClick={seeCookies}>See cookie</button><br/>
          <button onClick={setCookies}>Set cookie</button>
        </Route>
        <Route path={"/"}>
          <Index/>
        </Route>
      </Switch>

    </BrowserRouter>
  );
}

export default App;
