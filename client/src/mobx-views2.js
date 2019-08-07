import {observer} from 'mobx-react'
import React from 'react';

@observer
class TodoView extends React.Component {
  constructor(props){
    super(props)
    const todo = this.props.todo;
    todo.assignee = assignee;
    this.changeInput = this.changeInput.bind(this)
  }
  
  changeInput = (evt) => {
    console.log(assignee)
    assignee = evt.target.value
  }

  onToggleCompleted = () => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  }

  onRename = () => {
    const todo = this.props.todo;
    todo.task = prompt('Task name', todo.task) || todo.task;
  }
  render() {
    const todo = this.props.todo;
    return (
      <div>

        <li onDoubleClick={ this.onRename }>
        <input
          type='checkbox'
          checked={ todo.report }
          onChange={ this.onToggleCompleted }
        />
        { todo.task }
        { todo.assignee
          ? <small>{ todo.assignee.name }</small>
          : null
        }
        
        </li>
        <input type="text" defaultValue={assignee} onChange={this.changeInput}></input>
      </div>
      
    );
  }

}

var assignee = 'anybody'

export default TodoView