import React from 'react';
import Nav from './components/nav'
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from './components/dropdown'
import Review from './Review';
import ObservableTodoStore from './state-mgmt-tests/mobx-class'
import TodoList from './state-mgmt-tests/mobx-views'
import {observable} from 'mobx'
import { observer } from 'mobx-react';

var peopleStore = observable([
  { name: "Michel" },
  { name: "Me" },
  { name: "Yout" },
  { name: "asdkjasldkj lksdaj" }
]);

const observableTodoStore = new ObservableTodoStore();
observableTodoStore.addTodo('www');
observableTodoStore.addTodo('zzz');
observableTodoStore.todos[0].assignee = peopleStore[0];
observableTodoStore.todos[1].assignee = peopleStore[1];
peopleStore[0].name = "Michel Weststrate";

@observer
class App extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div className="App">
        <Nav />
        <Dropdown />
        <Review />
        <TodoList store={observableTodoStore} peopleStore={peopleStore} />
        {observableTodoStore.todos[0].assignee.name}
        <input value={peopleStore[1].name} onChange={(event) => {
          console.log(peopleStore[1].name)
          peopleStore[1].name = event.target.value
        }} />
      </div>
    );
  }
}

export default App;