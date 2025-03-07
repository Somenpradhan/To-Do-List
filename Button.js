const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category');
const prioritySelect = document.getElementById('priority');
const dueDateInput = document.getElementById('due-date');
const addBtn = document.getElementById('add-btn');
const clearBtn = document.getElementById('clear-btn');
const todoList = document.getElementById('todo-list');
const taskCounter = document.getElementById('task-counter');
const searchBar = document.getElementById('search-bar');
const sortTasks = document.getElementById('sort-tasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const updateTaskCounter = () => {
  taskCounter.textContent = `Total Tasks: ${tasks.length}`;
};

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const renderTasks = (filter = '') => {
  todoList.innerHTML = '';
  const filteredTasks = tasks
    .filter(task => task.text.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortTasks.value === 'priority') {
        const priorities = { high: 1, medium: 2, low: 3 };
        return priorities[a.priority] - priorities[b.priority];
      } else if (sortTasks.value === 'due-date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  filteredTasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'todo-item';
    listItem.innerHTML = `
      <span>${task.text}</span>
      <span class="category">${task.category}</span>
      <span class="priority ${task.priority}">${task.priority.toUpperCase()}</span>
      <span class="due-date">${task.dueDate}</span>
      <div class="todo-actions">
        <button class="edit-btn">&#9998;</button>
        <button class="complete-btn">&#10003;</button>
        <button class="delete-btn">&#10005;</button>
      </div>
    `;

    listItem.querySelector('.edit-btn').addEventListener('click', () => {
      const newTask = prompt('Edit your task:', task.text);
      if (newTask) {
        tasks[index].text = newTask.trim();
        saveTasks();
        renderTasks(filter);
      }
    });

    listItem.querySelector('.complete-btn').addEventListener('click', () => {
      listItem.classList.toggle('completed');
    });

    listItem.querySelector('.delete-btn').addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks(filter);
    });

    todoList.appendChild(listItem);
  });

  updateTaskCounter();
};

const addTask = () => {
  const taskText = todoInput.value.trim();
  const category = categorySelect.value;
  const priority = prioritySelect.value;
  const dueDate = dueDateInput.value;

  if (!taskText) return;

  tasks.push({ text: taskText, category, priority, dueDate });
  saveTasks();
  renderTasks();
  todoInput.value = '';
  dueDateInput.value = '';
};

addBtn.addEventListener('click', addTask);

clearBtn.addEventListener('click', () => {
  tasks = [];
  saveTasks();
  renderTasks();
});

searchBar.addEventListener('input', (e) => renderTasks(e.target.value));
sortTasks.addEventListener('change', () => renderTasks(searchBar.value));

renderTasks();
