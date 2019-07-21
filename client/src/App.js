import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';

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
