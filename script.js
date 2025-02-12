document.addEventListener("DOMContentLoaded", function() {
    const todoInput = document.getElementById("new-todo");
    const todoList = document.getElementById("todo-list");
    let todos = JSON.parse(localStorage.getItem("todos")) || [];

    function renderTodos() {
        todoList.innerHTML = "";
        todos.forEach((todo, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? "checked" : ""} onclick="toggleComplete(${index})">
                <span>${todo.text}</span>
                <button onclick="removeTodo(${index})">❌</button>
            `;
            todoList.appendChild(li);
        });
        localStorage.setItem("todos", JSON.stringify(todos));
    }

    window.addTodo = function() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = "";
            renderTodos();
        }
    };

    window.toggleComplete = function(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    };

    window.removeTodo = function(index) {
        todos.splice(index, 1);
        renderTodos();
    };

    window.handleKeyPress = function(event) {
        if (event.key === "Enter") {
            addTodo();
        }
    };

    window.clearCompleted = function() {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    };

    renderTodos();
});
