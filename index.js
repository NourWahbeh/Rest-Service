const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// 1. Our "Database" (In-memory array)
let tasks = [
    { id: 1, title: "Set up GitHub repo", completed: true },
    { id: 2, title: "Build CRUD endpoints", completed: false }
];

// 2. Standardized Response Helper Function
const sendResponse = (res, statusCode, success, message, data = null) => {
    res.status(statusCode).json({
        success: success,
        message: message,
        data: data
    });
};
// --- READ (GET All Tasks) ---
app.get('/api/tasks', (req, res) => {
    sendResponse(res, 200, true, "Tasks retrieved successfully", tasks);
});

// --- READ (GET Single Task by ID) ---
app.get('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const task = tasks.find(t => t.id === taskId);

    if (!task) {
        return sendResponse(res, 404, false, "Task not found");
    }
    sendResponse(res, 200, true, "Task retrieved successfully", task);
});

// --- CREATE (POST New Task) ---
app.post('/api/tasks', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return sendResponse(res, 400, false, "Title is required");
    }

    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: title,
        completed: false
    };

    tasks.push(newTask);
    sendResponse(res, 201, true, "Task created successfully", newTask);
});

// --- UPDATE (PUT Modify Existing Task) ---
app.put('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return sendResponse(res, 404, false, "Task not found");
    }

    // Update the task data
    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed
    };

    sendResponse(res, 200, true, "Task updated successfully", tasks[taskIndex]);
});

// --- DELETE (Remove a Task) ---
app.delete('/api/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) {
        return sendResponse(res, 404, false, "Task not found");
    }

    // Remove the task from the array
    const deletedTask = tasks.splice(taskIndex, 1);
    sendResponse(res, 200, true, "Task deleted successfully", deletedTask[0]);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});
