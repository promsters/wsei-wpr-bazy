import {TaskStates, TaskStatesChangeText, TodoListTask} from "./TodoListTask.js";

class TodoList {
    #tasks = [];
    #lastTaskIndetifier = 0;

    constructor() {
        this.taskContainer = document.querySelector(".task-list");

        this.init();
    }

    init() {
        this.registerEvents();
        this.loadData();
    }

    loadData() {
        this.addTask(new TodoListTask(this.getFreeTaskIdentifier(), "Respond to all emails", TaskStates.COMPLETED), false);
        this.addTask(new TodoListTask(this.getFreeTaskIdentifier(), "Check ovh subscriptions", TaskStates.IN_PROGRESS), false);
        this.addTask(new TodoListTask(this.getFreeTaskIdentifier(), "Buy new vps", TaskStates.PENDING), false);

        this.draw();
    }

    registerEvents() {
        this.taskContainer.addEventListener("click", (e) => {
            if( !e.target ) {
                return;
            }

            if( e.target.matches(".add-task") ) {
                this.onAddButtonClick();
            } else {
                this.onListElementClick(e.target);
            }
        });

        document.addEventListener('todo:request-task-redraw', (e) => {
            this.redrawTask(e.detail.task);
        });
    }

    getFreeTaskIdentifier() {
        return ++this.#lastTaskIndetifier;
    }

    /**
     * @param {TodoListTask} task
     * @param {boolean} draw
     */
    addTask(task, draw = true) {
        this.#tasks.push(task);
        if(draw) {
            this.draw();
        }
    }

    draw() {
        let body = this.taskContainer.querySelector(".task-body");
        body.innerHTML = null;

        for(let task of this.#tasks) {
            body.append(task.draw());
        }
    }

    /**
     * @param {TodoListTask} task
     */
    redrawTask(task) {
        let taskElement = this.findTaskElement(task)

        if( taskElement !== null ) {
            taskElement.replaceWith(task.draw());
        }
    }

    /**
     * @param {TodoListTask} task
     */
    removeTask(task) {
        this.#tasks = this.#tasks.filter(function (value, index, arr){
            return value !== task;
        });
    }

    /**
     * @param {Node} element
     * @return {null|TodoListTask}
     */
    findTaskByNode(element) {
        for(let task of this.#tasks) {
            if(task.identifier === parseInt(element.dataset.identifier)) {
                return task;
            }
        }

        return null;
    }

    /**
     * @param {TodoListTask} task
     * @return {Node}
     */
    findTaskElement(task) {
        return this.taskContainer.querySelector(".task-body").querySelector(`.task[data-identifier="${task.identifier}"]`);
    }

    onListElementClick(element) {
        let parent = element.closest('.task');

        if( parent === null ) {
            return;
        }

        let task = this.findTaskByNode(parent);

        if( task === null ) {
            return;
        }

        if( element.matches(".change-state") ) {
            task.advanceState();
        } else if ( element.matches(".remove") || element.parentElement.matches(".remove") || element.parentElement.parentElement.matches(".remove") ) {
            this.removeTask(task);
            parent.remove();
        } else if( element.matches(".title") ) {
            this.enableNameEditOnTask(task);
        }
    }

    onAddButtonClick() {
        let task = new TodoListTask(this.getFreeTaskIdentifier(), "", TaskStates.PENDING);
        this.addTask(task);
        this.enableNameEditOnTask(task);
    }

    /**
     * @param {TodoListTask} task
     * @return {Node}
     */
    enableNameEditOnTask(task) {
        task.enableNameEdit();

        let taskElement = this.findTaskElement(task);
        let input = taskElement.querySelector("input[type=text]");
        input.focus();

        input.addEventListener('focusout', (e) => {
            task.name = input.value;
            task.disableNameEdit();
        });

        input.addEventListener('keypress', (e) => {
            if( e.key === 'Enter' ) {
                input.blur();
            }
        });
    }
}

export default TodoList;