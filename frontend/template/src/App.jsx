import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");

  // Get tasks
  const getTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Load tasks when page opens
  useEffect(() => {
    getTasks();
  }, []);

  // Create task
  const addTask = async (e) => {
    e.preventDefault();

    if (!title) {
      alert("Please enter title");
      return;
    }

    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        status
      })
    });

    if (response.ok) {
      alert("Task added");

      setTitle("");
      setDescription("");
      setStatus("Pending");

      getTasks();
    }
  };

  // Delete task
  const deleteTask = async (id) => {

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      alert("Task deleted");
      getTasks();
    }
  };

  // Update task
  const updateTask = async (id) => {

    const newStatus = prompt(
      "Enter status: Pending / Completed",
      "Completed"
    );

    if (!newStatus) return;

    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    });

    if (response.ok) {
      alert("Task updated");
      getTasks();
    }
  };


  return (
    <div className="container">

      <h1>Task Management System</h1>

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

        <button type="submit">
          Add Task
        </button>

      </form>


      <h2>Tasks</h2>

      {tasks.map((task) => (

        <div className="task" key={task._id}>

          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>
            Status: <b>{task.status}</b>
          </p>

          <button onClick={() => updateTask(task._id)}>
            Update
          </button>

          <button onClick={() => deleteTask(task._id)}>
            Delete
          </button>

        </div>

      ))}

    </div>
  );
}

export default App;