const BtnAdd = document.querySelector('#btn-add'),
    BtnSort = document.querySelector('#btn-sort'),
    todoInput = document.querySelector('#input-todo'),
    todoList = document.querySelector('#todo-list');


class task {
    constructor(text) {
        this.text = text;
        this.date = `${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
        this.isCompleted = false;
    }
}

class todo {
    constructor() {
        this.task = this.storageTodo('todo');
        this.data = this.task ? this.task : [];
        this.mode = "add";
        this.todoId = "";

        if (this.data.length) {
            this.showTodo();
        }
    }

    showTodo() {
        todoList.innerHTML = "";
        for (let i = 0; i < this.data.length; i++) {
            const { text, date, isCompleted } = this.data[i];
            todoList.innerHTML += `<li class="item">
                                ${isCompleted ? '<span class="checked">' : ''}${text}, ${date} ${isCompleted ? '</span>' : ''}
                                <a class="btn-edit" onclick="query.editTodo(${i})">Edit</a>
                                <a class="btn-delete" onclick="query.deleteTodo(${i})">Delete</a>
                                <a class="btn-edit" onclick="query.completeTodo(${i})">Complete</a>
                             </li>`
        }
    }

    // add data
    addTodo(event) {
        event.preventDefault();
        let val = todoInput.value;
        if (val === "") {
            alert(`cannot input blank todo!`)
        } else if (this.mode == "add") {
            this.data.push(new task(val));
        } else if (this.mode == "edit") {
            this.editedTodo(this.todoId, val);
        }
        todoInput.value = "";
        BtnAdd.innerHTML = "add";
        this.mode = "add";
        this.todoId = "";
        this.storageTodo('todo', this.data, true);
        this.showTodo();
        // console.log(val);
    }

    // find index todo berfore execute
    editTodo(i) {
        let todo = this.data;
        if (todo.isCompleted === true) {
            alert("todo has been completed!");
        } else {
            this.mode = "edit";
            BtnAdd.innerHTML = "edit";
            this.todoId = i;
            todoInput.value = todo[i].text;
            // console.log(this.data[i]);
        }
    }

    // execute edit todo
    editedTodo(i, newTodo) {
        let data = this.data;
        data.splice(i, 1, {
            ...data[i],
            text: newTodo
        });
    }

    // function to completed todo
    completeTodo(i) {
        let data = this.data;
        if (data[i].isCompleted === false) {
            if (confirm(`click okay if you've been completed todo ${data[i].text} !`)) {
                data[i].isCompleted = true;
                this.storageTodo('todo', data, true);
            }
        } else {
            alert(`todo ${data.text} has been completed !`)
        }
        this.showTodo();
    }

    // sort data setelah completed data nya true
    sortByCompleted() {
        let data = this.data;
        if (data == "") {
            alert("you do not have any todo to sort !")
        } else {
            data.sort(function(a, b) {
                return (a.isCompleted - b.isCompleted);
            });
        }
        console.log(data);
        this.storageTodo('todo', data, true);
        this.showTodo();
    }

    // delete todo
    deleteTodo(i) {
        let data = this.data;
        if (confirm(`Are you sure to delete todo ${data[i].text}?`)) {
            data.splice(i, 1);
            this.storageTodo('todo', data, true);
        }
        this.showTodo();
    }

    // get and set todo
    storageTodo(name, data = null, set = false) {
        if (set) {
            localStorage.setItem(name, JSON.stringify(data));
            return true;
        } else {
            return JSON.parse(localStorage.getItem(name));
        }
    }
}

let query = new todo;

BtnAdd.addEventListener("click", () => query.addTodo(event));
BtnSort.addEventListener("click", () => query.sortByCompleted());