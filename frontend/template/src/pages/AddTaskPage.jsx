import { useState } from "react";

const API_URL = "http://localhost:5000";

function AddTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  // Create task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter title");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          status,
        }),
      });

      if (response.ok) {
        alert("Task added");
        setTitle("");
        setDescription("");
        setStatus("Pending");
      } else {
        alert(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Add task failed:", error);
      alert("Could not connect to the server. Make sure the backend is running on port 5000.");
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>

      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>Completed</option>
        </select>

        <button type="submit">Add Task</button>
      </form>
    </div>
  );
}

export default AddTaskPage;

