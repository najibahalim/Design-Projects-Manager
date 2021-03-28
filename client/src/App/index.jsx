import React, { useState , Fragment } from 'react';

import NormalizeStyles from './NormalizeStyles';
import BaseStyles from './BaseStyles';
import Toast from './Toast';
import Routes from './Routes';
import Login from '../Login';

// We're importing .css because @font-face in styled-components causes font files
// to be constantly re-requested from the server (which causes screen flicker)
// https://github.com/styled-components/styled-components/issues/1593
import './fontStyles.css';

function setToken(userToken) {
  sessionStorage.setItem('token', JSON.stringify(userToken));
}

function getToken() {
  const tokenString = sessionStorage.getItem('token');
  const userToken = JSON.parse(tokenString);
  return userToken? userToken.token : undefined
}

const App = () => {
  const token = getToken();
  if (!token) {
    return <Login setToken={setToken} />
  }
  return < Fragment >
    <NormalizeStyles />
    <BaseStyles />
    <Toast />
    <Routes />
  </Fragment >
};

export default App;
