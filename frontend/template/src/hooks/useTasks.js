import { useState, useEffect, useCallback } from "react";
import { taskApi } from "../api/taskApi";

// Shared task state + CRUD logic reused across DashboardPage and TasksPage
export function useTasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskApi.getAll();
      setTasks(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (data) => {
    const task = await taskApi.create(data);
    setTasks(prev => [task, ...prev]);
    return task;
  };

  const updateTask = async (id, data) => {
    const task = await taskApi.update(id, data);
    setTasks(prev => prev.map(t => t._id === id ? task : t));
    return task;
  };

  const deleteTask = async (id) => {
    await taskApi.remove(id);
    setTasks(prev => prev.filter(t => t._id !== id));
  };

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask };
}

