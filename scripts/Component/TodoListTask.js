const TaskStates = Object.freeze({
    PENDING: 1,
    IN_PROGRESS: 2,
    COMPLETED: 3
});

const TaskStatesChangeText = Object.freeze({
    1: "none",
    2: "Start progress",
    3: "Complete"
});

class TodoListTask {
    #identifier = null;
    #name = null;
    #state = null;
    #nameEdit = false;

    constructor(identifier, name, state) {
        this.#identifier = identifier;
        this.#name = name;
        this.#state = state;
    }

    get identifier() {
        return this.#identifier;
    }

    get state() {
        return this.#state;
    }

    advanceState() {
        this.#state++;
        this.sendRequestRedrawEvent();
    }

    /**
     * @return {string}
     */
    get name() {
        return this.#name;
    }

    /**
     * @param {string} name
     */
    set name(name) {
        this.#name = name;
        this.sendRequestRedrawEvent();
    }

    enableNameEdit() {
        this.#nameEdit = true;
        this.sendRequestRedrawEvent();
    }

    disableNameEdit() {
        this.#nameEdit = false;
        this.sendRequestRedrawEvent();
    }

    /**
     * @return {Node}
     */
    draw() {
        let node = document.createRange().createContextualFragment(TASK_HTML);
        let task = node.querySelector(".task");

        task.classList.add(`state-${this.#state}`);
        task.dataset.identifier = this.#identifier;

        if( this.#nameEdit ) {
            node.querySelector(".title").innerHTML = `<input type="text" class="name-edit" placeholder="Wprowadź nazwę taska" value="${this.#name}" />`;
        } else {
            node.querySelector(".title").textContent = this.#name;
        }

        let changeStateButton = node.querySelector(".change-state");

        if( this.#state !== TaskStates.COMPLETED ) {
            changeStateButton.textContent = TaskStatesChangeText[this.#state + 1];
            changeStateButton.classList.add(this.#state === TaskStates.PENDING ? "orange" : "green");
        } else {
            changeStateButton.remove();
        }

        return node;
    }

    sendRequestRedrawEvent() {
        document.dispatchEvent(new CustomEvent('todo:request-task-redraw', {detail: {task: this}}));
    }
}

const TASK_HTML = '<div class="task">\n' +
    '                        <div class="title"></div>\n' +
    '                        <div class="actions">\n' +
    '                            <button class="change-state"></button>\n' +
    '                            <button class="red remove" title="Remove"><svg class="svg-icon" viewBox="0 0 20 20">\n' +
    '<path fill="none" d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667\n' +
    'c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14\n' +
    'c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583\n' +
    'C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167\n' +
    'c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083\n' +
    'z"></path>\n' +
    '</svg></button>\n' +
    '                        </div>\n' +
    '                    </div>';

export {TaskStates, TaskStatesChangeText, TodoListTask};