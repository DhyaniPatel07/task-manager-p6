const EventEmitter = require("events");

/**
 * TaskEventEmitter
 * Handles asynchronous application events for the Task Manager (Practical 10).
 */
class TaskEventEmitter extends EventEmitter {}

const taskEvents = new TaskEventEmitter();

// ─── 1. Error Listener ───────────────────────────────────────────────────────
// In Node.js, an unhandled 'error' event throws and crashes the process.
// This listener catches all emitted errors safely, ensuring the server stays running.
taskEvents.on("error", (err) => {
    console.error("\n[EVENT ERROR CAUGHT SAFELY]");
    console.error("  Error Message:", err && err.message ? err.message : err);
    console.error("  Server remains healthy and responsive.\n");
});

// ─── 2. task-created Listener ────────────────────────────────────────────────
// Simulates an asynchronous background job (e.g., audit log, notification, analytics)
// with a 2-second delay using setTimeout.
// The HTTP POST response is returned immediately and is NOT blocked by this delay.
taskEvents.on("task-created", (task) => {
    try {
        console.log(`[EVENT DISPATCHED] 'task-created' event triggered for "${task.title}".`);
        console.log("[BACKGROUND JOB] Simulating 2-second asynchronous logging/notification...");

        setTimeout(() => {
            try {
                const assignedUser = task.assignedUser || "student-user (ID: usr_24IT_demo)";
                const timestamp = task.createdAt
                    ? new Date(task.createdAt).toLocaleString()
                    : new Date().toLocaleString();

                console.log("\n========================================================");
                console.log("🔔 [EVENT LISTENER: task-created] (Async execution complete)");
                console.log(`  📌 Task Title   : ${task.title}`);
                console.log(`  ⏰ Created At   : ${timestamp}`);
                console.log(`  👤 Assigned User: ${assignedUser}`);
                console.log(`  🆔 Task ID      : ${task._id}`);
                console.log(`  📊 Priority     : ${task.priority || "Medium"}`);
                console.log(`  🏷️  Status       : ${task.status || "Pending"}`);
                console.log("========================================================\n");
            } catch (asyncErr) {
                // Catch any unexpected runtime errors in the async timer callback
                console.error("[ASYNC LISTENER ERROR]:", asyncErr.message);
                taskEvents.emit("error", asyncErr);
            }
        }, 2000); // 2000ms = 2-second simulated background delay
    } catch (syncErr) {
        console.error("[SYNC LISTENER ERROR]:", syncErr.message);
        taskEvents.emit("error", syncErr);
    }
});

// ─── 3. task-deleted Listener ────────────────────────────────────────────────
// Triggered immediately after a task is removed from MongoDB
taskEvents.on("task-deleted", (task) => {
    try {
        const timestamp = new Date().toLocaleString();

        console.log("\n========================================================");
        console.log("🗑️  [EVENT LISTENER: task-deleted] (Immediate execution)");
        console.log(`  📌 Deleted Task : ${task.title || "Untitled"}`);
        console.log(`  🆔 Task ID      : ${task._id}`);
        console.log(`  ⏰ Deleted At   : ${timestamp}`);
        console.log("========================================================\n");
    } catch (err) {
        console.error("[LISTENER ERROR on task-deleted]:", err.message);
        taskEvents.emit("error", err);
    }
});

module.exports = taskEvents;

