import type { Task, TaskStatus, CreatedBy } from '@/types/kanban';

import { getAuthHeaders } from '@/api/projects.ts';

const base = import.meta.env.VITE_API_URL;

export interface ProjectsResponse {
  message: string;
  data: Task[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProjectResponse {
  message: string;
  data: {
    id: number;
    title: string;
    project: {
      id: string;
      name: string;
    };
    status: TaskStatus;
    createdBy: CreatedBy;
  };
}

export const fetchTasksByProject = async (projectId: string): Promise<ProjectsResponse> => {
  const response = await fetch(`${base}/projects/${projectId}/tasks`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }

  return response.json();
};

export const createTask = async (
  projectId: string,
  title: string,
  status: TaskStatus
): Promise<CreateProjectResponse> => {
  const newTask = {
    title,
    status,
    createdAt: new Date().toISOString()
  };

  const response = await fetch(`${base}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(newTask)
  });

  if (!response.ok) {
    throw new Error(`Failed to create task: ${response.statusText}`);
  }

  return response.json();
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<{ data: Task }> => {
  const response = await fetch(`${base}/tasks/${taskId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.statusText}`);
  }

  return response.json();
};

export const deleteTask = async (taskId: string): Promise<boolean> => {
  const response = await fetch(`${base}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }

  return true;
};

export const assignUserToTask = async (
  taskId: string,
  assignedUserId: string | null
): Promise<{ data: Task }> => {
  const response = await fetch(`${base}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ assignedUserId })
  });

  if (!response.ok) {
    throw new Error('Failed to assign user');
  }

  return response.json();
};

