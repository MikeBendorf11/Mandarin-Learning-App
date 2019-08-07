import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import ObservableTodoStore from './mobx-class'
import TodoList from './mobx-views'
const observableTodoStore = new ObservableTodoStore();

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>
      <TodoList store={ observableTodoStore } />
    </div>
  );
}

export default App;
