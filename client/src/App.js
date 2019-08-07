import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import MobxTest from './mobxTest'
import {observable, computed, autorun, reaction} from 'mobx'

const appState = observable({
  count: 0,
  incCount: () => {
    appState.count += 1
  },
  decCount: ()=>{
    appState.count -= 1
  }
  
})

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>
      <MobxTest appState={appState}/>
    </div>
  );
}

export default App;
