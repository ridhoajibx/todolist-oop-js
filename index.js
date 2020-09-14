const BtnAdd = document.querySelector('#btn-add'),
    BtnSort = document.querySelector('#btn-sort'),
    todoInput = document.querySelector('#input-todo'),
    todoList = document.querySelector('#todo-list');


class task {
    constructor(text) {
        this.text = text;
        this.date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`;
        this.isCompleted = false;
    }
}

class todos {
    constructor() {
        this.task = this.storageTodo('todo');
        this.data = this.task ? this.task : [];
        this.mode = "add";
        this.todoId = "";

        if (this.data.length == "") {
            todoList.innerHTML = `<div style="text-align: center;">
                                    There's no todo in your list  
                                  </div>`
        } else {
            this.showTodo();
        }
    }

    showTodo() {
        todoList.innerHTML = "";
        for (let i = 0; i < this.data.length; i++) {
            const { text, date, isCompleted } = this.data[i];
            todoList.innerHTML += `<li class="item">
                                ${isCompleted ? '<span class="checked">' : ''}${text}, ${date} ${isCompleted ? '</span>' : ''}
                                <a class="btn-edit" onclick="todo.editTodo(${i})">Edit</a>
                                <a class="btn-delete" onclick="todo.deleteTodo(${i})">Delete</a>
                                <a class="btn-edit" onclick="todo.completeTodo(${i})">Complete</a>
                             </li>`
        }
    }

    // add data
    addTodo(e) {
        e.preventDefault();
        let val = todoInput.value;
        let todo = this.data;
        if (val === "") {
            alert(`cannot input blank todo!`)
        } else if (this.mode == "add") {
            todo.push(new task(val));
        } else if (this.mode == "edit") {
            this.editedTodo(this.todoId, val);
        }
        todoInput.value = "";
        BtnAdd.innerHTML = "add";
        this.mode = "add";
        this.todoId = "";
        this.storageTodo('todo', todo, true);
        this.showTodo();
        // console.log(val);
    }

    // find index todo berfore execute
    editTodo(i) {
        let todo = this.data;
        if (todo[i].isCompleted === true) {
            alert(`todo has been completed!, todo ${todo[i].text} cannot be edited`);
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
        let todo = this.data;
        todo.splice(i, 1, {
            ...todo[i],
            text: newTodo
        });
    }

    // function to completed todo
    completeTodo(i) {
        let todo = this.data;
        if (todo[i].isCompleted === false) {
            if (confirm(`click okay if you've been completed todo ${todo[i].text} !`)) {
                todo[i].isCompleted = true;
                this.storageTodo('todo', todo, true);
            }
        } else {
            alert(`todo ${todo[i].text} has been completed !`)
        }
        this.showTodo();
    }

    // sort data isCompleted to be true
    sortByCompleted() {
        let todo = this.data;
        if (todo == "") {
            alert("you do not have any todo to sort !")
        } else {
            todo.sort(function(a, b) {
                return (a.isCompleted - b.isCompleted);
            });
        }
        console.log(todo);
        this.storageTodo('todo', todo, true);
        this.showTodo();
    }

    // delete todo
    deleteTodo(i) {
        let todo = this.data;
        if (confirm(`Are you sure to delete todo ${todo[i].text}?`)) {
            todo.splice(i, 1);
            this.storageTodo('todo', todo, true);
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

let todo = new todos;

BtnAdd.addEventListener("click", () => todo.addTodo(event));
BtnSort.addEventListener("click", () => todo.sortByCompleted());