const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

// Task Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "Pending"
    }
});

const Task = mongoose.model("Task", taskSchema);


// GET - View all tasks
app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST - Create task
app.post("/tasks", async (req, res) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status
        });

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PUT - Update task
app.put("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// DELETE - Delete task
app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});