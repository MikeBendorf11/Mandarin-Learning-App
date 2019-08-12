import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import {observable, computed, autorun} from 'mobx'

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>      
    </div>
  );
}

export default App;

