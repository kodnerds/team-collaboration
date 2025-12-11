// hooks/useTasks.ts
import { useState, useEffect } from 'react';
import type { Task, ColumnId } from '@/types/kanban';
import {
  getTasks,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
} from '../api/tasksApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

// Fetch tasks on mount
  useEffect(() => {
    fetchAllTasks();
  }, []);

 
  // GET tasks
  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // CREATE TASK
 
  const createTask = async (title: string, columnId: ColumnId) => {
    try {
      const created = await createTaskApi(title, columnId);

      // Optimistic update
      setTasks((prev) => [...prev, created]);

      return created;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  
  // UPDATE TASK
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const updated = await updateTaskApi(taskId, updates);

      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updated : task))
      );

      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  
  // DELETE TASK
  const deleteTask = async (taskId: string) => {
    try {
      await deleteTaskApi(taskId);

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchAllTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}