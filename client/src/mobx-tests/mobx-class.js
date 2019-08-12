
//FOR App.js
//import ObservableTodoStore from './mobx-class'
//import TodoList from './mobx-views'
// const observableTodoStore = new ObservableTodoStore();
// observableTodoStore.addTodo('Task 1');
// observableTodoStore.addTodo('Task 2');
{/* <TodoList store={ observableTodoStore } /> */}

import {observable, computed, autorun} from 'mobx'

export default class ObservableTodoStore {
	@observable todos = [];
    @observable pendingRequests = 0;

    constructor() {
			autorun(() => {
				console.log(this.report)
				//console.log(this.todos[0])
			});
    }

		@computed get completedTodosCount() {
    	return this.todos.filter(
			todo => todo.completed === true
		).length;
    }

		@computed get report() {
		if (this.todos.length === 0)
			return "<none>";
		return `Next todo: ${this.todos[0].task} ` + '\n'+
			`Progress: ${this.completedTodosCount}/${this.todos.length}` + '\n'+
			`Assigne: ${this.todos[0].assignee.name}`;
	}

	addTodo(task) {
		this.todos.push({
			task: task,
			completed: false,
			assignee: {name:null} //set to obj because that's what the new ref/observa has to be
		});
	}
}

