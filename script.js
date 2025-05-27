const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const priority = document.getElementById('priority');
const category = document.getElementById('category');
const dueDate = document.getElementById('dueDate');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const toggleTheme = document.getElementById('toggleTheme');
const progressPercent = document.getElementById('progressPercent');
const tipText = document.getElementById('tipText');

// Productivity Tips
const tips = [
  "Break big tasks into small steps.",
  "Stay consistent, not perfect.",
  "Review your day each evening.",
  "Use deadlines even for small tasks.",
  "Focus on one task at a time.",
  "Avoid multitasking for deep work."
];

// Set random tip
tipText.textContent = tips[Math.floor(Math.random() * tips.length)];

// Theme toggle
toggleTheme.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// Load theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

window.onload = loadTasks;

function addTask() {
  const text = taskInput.value.trim();
  const prio = priority.value;
  const cat = category.value;
  const date = dueDate.value;

  if (!text) return;

  const task = { text, prio, cat, date, completed: false };
  createTaskElement(task);
  saveTask(task);

  taskInput.value = '';
  dueDate.value = '';
  updateProgress();
}

function createTaskElement(task) {
  const li = document.createElement('li');
  if (task.completed) li.classList.add("completed");

  const content = document.createElement('span');
  content.textContent = task.text;

  const badge = document.createElement('span');
  badge.className = `badge ${task.prio}`;
  badge.textContent = task.prio;

  const delBtn = document.createElement('button');
  delBtn.textContent = 'X';
  delBtn.onclick = () => {
    li.remove();
    updateStorage();
    updateProgress();
  };

  li.onclick = (e) => {
    if (e.target === delBtn) return;
    li.classList.toggle("completed");
    updateStorage();
    updateProgress();
  };

  li.appendChild(content);
  li.appendChild(badge);
  li.appendChild(delBtn);
  li.dataset.category = task.cat;
  li.dataset.text = task.text.toLowerCase();

  taskList.appendChild(li);
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStorage() {
  const tasks = [];
  taskList.querySelectorAll("li").forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent,
      prio: li.querySelector(".badge").textContent,
      cat: li.dataset.category,
      date: "",
      completed: li.classList.contains("completed")
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => createTaskElement(task));
  updateProgress();
}

// Search Filter
searchInput.addEventListener("input", () => {
  const keyword = searchInput.value.toLowerCase();
  document.querySelectorAll("#taskList li").forEach(li => {
    li.style.display = li.dataset.text.includes(keyword) ? "flex" : "none";
  });
});

// Category Filter
categorySelect.addEventListener("change", () => {
  const cat = categorySelect.value;
  document.querySelectorAll("#taskList li").forEach(li => {
    li.style.display = (cat === "All" || li.dataset.category === cat) ? "flex" : "none";
  });
});

// Progress Tracker
function updateProgress() {
  const all = taskList.querySelectorAll("li").length;
  const done = taskList.querySelectorAll("li.completed").length;
  const percent = all ? Math.round((done / all) * 100) : 0;
  progressPercent.textContent = percent + "%";
}
