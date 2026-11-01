const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const NodeCache = require("node-cache");
require("dotenv").config();

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
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

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
        default: "Pending"
    }
});

const Task = mongoose.model("Task", taskSchema);


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

        // Invalidate cache so next GET fetches fresh data
        cache.del(CACHE_KEY);
        console.log("[CACHE INVALIDATED] POST /tasks — cache cleared");

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


// ─── Start server ─────────────────────────────────────────────────────────────
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
