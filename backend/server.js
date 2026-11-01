const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

// P10: EventEmitter for Event-Driven Task Management
const taskEvents = require("./events/taskEvents");

const app = express();

// Expose X-Cache-Status so browsers and Postman can read it as a response header
app.use(cors({
    exposedHeaders: ["X-Cache-Status"]
}));
app.use(express.json());

// ─── In-Memory Cache (TTL = 60 seconds) ──────────────────────────────────────
// stdTTL  : every key expires after 60 s automatically
// checkperiod : NodeCache checks for expired keys every 10 s
const cache = new NodeCache({ stdTTL: 60, checkperiod: 10 });

const CACHE_KEY = "all_tasks";   // single key for the full task list

// Manual counters for the /cache-stats endpoint
let cacheHits   = 0;
let cacheMisses = 0;

// ─── MongoDB connection ───────────────────────────────────────────────────────
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log(err));
}

// ─── Task Schema ──────────────────────────────────────────────────────────────
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
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    dueDate: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);


// ─── GET /tasks/stats — Real-time dashboard statistics ───────────────────────
app.get("/tasks/stats", async (req, res) => {
    try {
        const [total, completed, pending, inProgress] = await Promise.all([
            Task.countDocuments(),
            Task.countDocuments({ status: "Completed" }),
            Task.countDocuments({ status: "Pending" }),
            Task.countDocuments({ status: "In Progress" })
        ]);

        const completionRate = total > 0
            ? Math.round((completed / total) * 100)
            : 0;

        // Recent 5 tasks for activity feed
        const recent = await Task.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select("title status priority createdAt");

        res.status(200).json({
            total,
            completed,
            pending,
            inProgress,
            completionRate,
            recent
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ─── GET - View all tasks (with caching) ─────────────────────────────────────
app.get("/tasks", async (req, res) => {
    try {
        const cached = cache.get(CACHE_KEY);

        if (cached !== undefined) {
            // ── CACHE HIT ──
            cacheHits++;
            console.log(`[CACHE HIT]  GET /tasks  — served from cache (hits: ${cacheHits})`);

            res.status(200);
            res.setHeader("X-Cache-Status", "HIT");
            return res.json(cached);
        }

        // ── CACHE MISS — fetch from MongoDB ──
        cacheMisses++;
        console.log(`[CACHE MISS] GET /tasks  — querying MongoDB  (misses: ${cacheMisses})`);

        const tasks = await Task.find();
        cache.set(CACHE_KEY, tasks);          // store in cache for next 60 s

        res.status(200);
        res.setHeader("X-Cache-Status", "MISS");
        return res.json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ─── POST - Create task ───────────────────────────────────────────────────────
app.post("/tasks", async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null
        });

        // Invalidate cache so next GET fetches fresh data
        cache.del(CACHE_KEY);
        console.log("[CACHE INVALIDATED] POST /tasks — cache cleared");

        // P10: Emit task-created event (non-blocking)
        taskEvents.emit("task-created", task);

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ─── PUT - Update task ────────────────────────────────────────────────────────
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

        // Invalidate cache so next GET fetches fresh data
        cache.del(CACHE_KEY);
        console.log(`[CACHE INVALIDATED] PUT /tasks/${req.params.id} — cache cleared`);

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ─── DELETE - Delete task ─────────────────────────────────────────────────────
app.delete("/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        // Invalidate cache so next GET fetches fresh data
        cache.del(CACHE_KEY);
        console.log(`[CACHE INVALIDATED] DELETE /tasks/${req.params.id} — cache cleared`);

        // P10: Emit task-deleted event
        taskEvents.emit("task-deleted", task);

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// ─── GET /cache-stats — Cache statistics endpoint ─────────────────────────────
app.get("/cache-stats", (req, res) => {
    const nodeStats  = cache.getStats();          // built-in NodeCache stats
    const total      = cacheHits + cacheMisses;
    const hitRate    = total > 0
        ? ((cacheHits / total) * 100).toFixed(1) + "%"
        : "N/A";

    res.status(200).json({
        hits        : cacheHits,
        misses      : cacheMisses,
        total       : total,
        hit_rate    : hitRate,
        keys_cached : nodeStats.keys,
        ksize       : nodeStats.ksize,
        vsize       : nodeStats.vsize,
        ttl_seconds : 60
    });
});


// ─── GET /tasks/test-event-error — P10 Error handling test endpoint ────────
app.get("/tasks/test-event-error", (req, res) => {
    taskEvents.emit("error", new Error("Simulated test event error (Practical 10 proof)"));
    res.status(200).json({
        message: "EventEmitter error emitted and safely handled by listener without server crash."
    });
});


// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
