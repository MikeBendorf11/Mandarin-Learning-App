import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import ObservableTodoStore from './mobx-class'
import TodoList from './mobx-views'
import {observable, computed, autorun} from 'mobx'

// const observableTodoStore = new ObservableTodoStore();
// observableTodoStore.addTodo('Task 1');
// observableTodoStore.addTodo('Task 2');

function App() {
  return (
    <div className="App">
      <Nav/>
      <Dropdown/>
      <Review/>
      {/* <TodoList store={ observableTodoStore } /> */}
      
    </div>
  );
}

export default App;

class Person {
  @observable age = 30
  @observable firstName = "Foo"
  @observable lastName = "Bar"
  
  

  constructor(){
    console.log('constructor()')
  }

  @computed get displayName() {
    console.log("displayName()")
    return this.firstName + ' ' + this.lastName
  }
  @computed get yearOfBirth() {
    console.log("yearOfBirth()")
    return new Date().getFullYear() - this.age
  } 
}

var p = new Person();

autorun(() => {
  
  console.dir(p.age + ' ' + p.displayName + ' ' + p.yearOfBirth)
})

console.log('------------')
//calls get displayName() only
p.firstName =  "John"
console.log('------------')
//calls get uearofBirth() only
p.age = 31;