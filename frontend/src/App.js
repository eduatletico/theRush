import React from 'react';
import './App.css';

import Routes from './Routes'

import logo from './assets/logo.jpeg'

function App() {
  return (
    <div className="container">
      <img src={logo} alt="theScore" width="75"/>
      <span className="title">theScore - The Rush</span>

      <div className="content">
        <Routes />
      </div>
    </div>
  );
}

export default App;
