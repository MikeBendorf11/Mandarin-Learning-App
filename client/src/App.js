import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import TestContext from './TestContext'

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>
      <TestContext/>
    </div>
  );
}

export default App;
