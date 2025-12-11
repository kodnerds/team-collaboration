// src/api/tasksApi.ts
import type { Task, ColumnId } from '@/types/kanban';

const base = import.meta.env.VITE_API_URL;


// GET ALL TASKS

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${base}/tasks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
}

// CREATE TASK

export async function createTaskApi(title: string, columnId: ColumnId) {
  const newTask = {
    title,
    columnId,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(`${base}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return response.json();
}


// UPDATE TASK

export async function updateTaskApi(taskId: string, updates: Partial<Task>) {
  const response = await fetch(`${base}/tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return response.json();
}


// DELETE TASK

export async function deleteTaskApi(taskId: string) {
  const response = await fetch(`${base}/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }

  return true;
}
