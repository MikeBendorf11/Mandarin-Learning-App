import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'

class Roulette{
  constructor(pron, char, singleDef){
    this.pron = pron;
    this.char = char;
    this.singleDef = singleDef;
  }
  
}

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
    </div>
  );
}

export default App;
