
import {observable, computed, autorun} from 'mobx'
//https://mobx.js.org/getting-started.html#demo

export default class ObservableTodoStore {
	@observable todos = [];
    @observable pendingRequests = 0;

    constructor() {
			autorun(() => console.log(this.report));
    }

		@computed get completedTodosCount() {
    	return this.todos.filter(
			todo => todo.completed === true
		).length;
    }

		@computed get report() {
		if (this.todos.length === 0)
			return "<none>";
		return `Next todo: "${this.todos[0].task}". ` + '\n'+
			`Progress: ${this.completedTodosCount}/${this.todos.length}` + '\n'+
			`Assigne: ${this.todos[0].assignee}`;
	}

	addTodo(task) {
		this.todos.push({
			task: task,
			completed: false,
			assignee: null
		});
	}
}


