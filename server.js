const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Read tasks from JSON file
function loadTasks() {
    return JSON.parse(fs.readFileSync("tasks.json", "utf8"));
}

// Write tasks to JSON file
function saveTasks(tasks) {
    fs.writeFileSync("tasks.json", JSON.stringify(tasks, null, 2));
}

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(loadTasks());
});

// Add a task
app.post("/tasks", (req, res) => {
    let tasks = loadTasks();
    const newTask = { id: Date.now(), text: req.body.text, completed: false };
    tasks.push(newTask);
    saveTasks(tasks);
    res.status(201).json(newTask);
});

// Toggle task completion
app.patch("/tasks/:id", (req, res) => {
    let tasks = loadTasks();
    tasks = tasks.map(task => task.id == req.params.id ? { ...task, completed: !task.completed } : task);
    saveTasks(tasks);
    res.sendStatus(200);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    let tasks = loadTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Add a new task
async function addTask() {
    const taskInput = document.getElementById("taskInput");
    const text = taskInput.value.trim();
    if (text === "") return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    taskInput.value = "";
    fetchTasks();
}

// Toggle task completion
async function toggleTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "PATCH" });
    fetchTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
}

// Load tasks on page load
fetchTasks();
