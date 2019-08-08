import {observer} from 'mobx-react'
import React from 'react';
import TodoView from './mobx-views2'

@observer
class TodoList extends React.Component {
  
  onNewTodo = () => {
    this.props.store.addTodo(prompt('Enter a new todo:','coffee plz'));
  }
  render() {
    const store = this.props.store;
    return (
      <div>
        { store.report }
        <ul>
        { store.todos.map(
          (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { store.pendingRequests > 0 ? <marquee>Loading...</marquee> : null }
        <button onClick={ this.onNewTodo }>New Todo</button>
        <small> (double-click a todo to edit)</small>
        
      </div>
    );
  }
}

export default TodoList