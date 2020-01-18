import React from 'react';
import './App.css';
import TableData from './TableData'

import logo from './assets/logo.jpeg'

function App() {
  return (
    <div className="container">
      <img src={logo} alt="theScore"/>

      <div className="content">
        <TableData />
      </div>
    </div>
  );
}

export default App;
