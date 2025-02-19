document.addEventListener("DOMContentLoaded", function () {
    const todoInput = document.getElementById("new-todo");
    const todoList = document.getElementById("todo-list");
    const filterButtons = document.querySelectorAll(".filters span");

    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let completedTodos = JSON.parse(localStorage.getItem("completedTodos")) || [];
    let currentFilter = "ALL"; // Default filter

    // Returns an array of objects that include the todo, its source, and its original index.
    function getFilteredTodos() {
        if (currentFilter === "ACTIVE") {
            return todos.map((todo, i) => ({ todo, source: "active", index: i }));
        } else if (currentFilter === "COMPLETED") {
            return completedTodos.map((todo, i) => ({ todo, source: "completed", index: i }));
        }
        // For ALL, combine both arrays.
        let activeTodos = todos.map((todo, i) => ({ todo, source: "active", index: i }));
        let completedTodosMapped = completedTodos.map((todo, i) => ({ todo, source: "completed", index: i }));
        return [...activeTodos, ...completedTodosMapped];
    }

    function renderTodos() {
        todoList.innerHTML = "";
        let filteredTodos = getFilteredTodos();

        filteredTodos.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${item.todo.completed ? "checked" : ""} onclick="toggleComplete('${item.source}', ${item.index})">
                <span>${item.todo.text}</span>
                <button onclick="removeTodo('${item.source}', ${item.index} )">x</button>
            `;
            todoList.appendChild(li);
        });

        localStorage.setItem("todos", JSON.stringify(todos));
        localStorage.setItem("completedTodos", JSON.stringify(completedTodos));
    }

    window.addTodo = function () {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = "";
            renderTodos();
        }
    };

    // Toggle the completion status and move the item between arrays.
    window.toggleComplete = function (source, index) {
        if (source === "active") {
            let todo = todos[index];
            todo.completed = true;
            completedTodos.push(todo);
            todos.splice(index, 1); // Remove from active tasks
        } else if (source === "completed") {
            let todo = completedTodos[index];
            todo.completed = false;
            todos.push(todo);
            completedTodos.splice(index, 1); // Remove from completed tasks
        }
        renderTodos();
    };

    // Remove the task from the appropriate array.
    window.removeTodo = function (source, index) {
        if (source === "active") {
            todos.splice(index, 1);
        } else if (source === "completed") {
            completedTodos.splice(index, 1);
        }
        renderTodos();
    };

    window.handleKeyPress = function (event) {
        if (event.key === "Enter") {
            addTodo();
        }
    };

    window.clearCompleted = function () {
        completedTodos = []; // Clear all completed tasks
        renderTodos();
    };

    // Set the current filter and update the active class on buttons.
    window.setFilter = function (filter) {
        currentFilter = filter;
        filterButtons.forEach(button => button.classList.remove("active"));
        document.getElementById(filter).classList.add("active");
        renderTodos();
    };

    renderTodos();
});
