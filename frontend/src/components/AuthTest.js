import React, { useState } from 'react';

async function verifyAuth() {
  const pingApiUrl = process.env.REACT_APP_BACKEND_URL + '/verify-auth';
  return await fetch(pingApiUrl, {
    method: 'POST',
    credentials: 'include',
  }).then((res) => res.text());
}

async function tryDeauth() {
  const pingApiUrl = process.env.REACT_APP_BACKEND_URL + '/deauthenticate';
  return await fetch(pingApiUrl, {
    method: 'POST',
    credentials: 'include',
  }).then((res) => res.text());
}

async function tryAuth() {
  const pingApiUrl = process.env.REACT_APP_BACKEND_URL + '/authenticate';
  return await fetch(pingApiUrl, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({
      emailAddress: 'asd@asd.com',
      password: 'superpass',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.text());
}

export default function AuthTest() {
  const [verifyRes, setVerifyRes] = useState('Unknown');
  const [authRes, setAuthRes] = useState('Unknown');
  const [deauthRes, setDeauthRes] = useState('Unknown');

  return (
    <div>
      <p>Verification response: {verifyRes}</p>
      <p>Authentication response: {authRes}</p>
      <p>Deauthentication response: {deauthRes}</p>
      <button onClick={() => verifyAuth().then(setVerifyRes)}>Verify auth</button> &nbsp;
      <button onClick={() => tryAuth().then(setAuthRes)}>Authenticate</button>&nbsp;
      <button onClick={() => tryDeauth().then(setDeauthRes)}>Deauthenticate</button>&nbsp;
      <button
        onClick={() => {
          setAuthRes('Unknown');
          setVerifyRes('Unknown');
          setDeauthRes('Unknown');
        }}
      >
        Reset
      </button>
    </div>
  );
}
