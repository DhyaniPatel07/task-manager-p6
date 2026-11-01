import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function TaskListPage() {
  const [tasks, setTasks] = useState([]);

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

  // Delete task
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Task deleted");
        getTasks();
      } else {
        alert(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete task failed:", error);
      alert("Could not connect to the server. Make sure the backend is running on port 5000.");
    }
  };

  // Update task
  const updateTask = async (id) => {
    const newStatus = prompt(
      "Enter status: Pending / Completed",
      "Completed"
    );

    if (!newStatus) return;

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        alert("Task updated");
        getTasks();
      } else {
        alert(`Server error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Update task failed:", error);
      alert("Could not connect to the server. Make sure the backend is running on port 5000.");
    }
  };

  return (
    <div>
      <h2>Tasks</h2>

      {tasks.length === 0 && <p>No tasks found. Add one!</p>}

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            Status: <b>{task.status}</b>
          </p>
          <button onClick={() => updateTask(task._id)}>Update</button>
          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default TaskListPage;

