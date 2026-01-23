import type { Task, TaskStatus, CreatedBy } from '@/types/kanban';

import { getAuthHeaders } from '@/api/projects.ts';

const base = import.meta.env.VITE_API_URL;

interface HttpError extends Error {
  status: number;
}

const extractError = async (response: Response, fallbackMessage: string): Promise<never> => {
  const errorData = await response.json().catch(() => ({}));

  const error = new Error(errorData?.message || errorData?.error || fallbackMessage) as HttpError;

  error.status = response.status;
  throw error;
};

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
    await extractError(response, 'Failed to fetch tasks');
  }

  return response.json();
};

/* eslint-disable max-params */
export const createTask = async (
  projectId: string,
  title: string,
  description: string,
  status: TaskStatus
): Promise<CreateProjectResponse> => {
  const newTask = {
    title,
    description,
    status,
    createdAt: new Date().toISOString()
  };

  const response = await fetch(`${base}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(newTask)
  });

  if (!response.ok) {
    await extractError(response, 'Failed to create task');
  }

  return response.json();
};
/* eslint-enable max-params */

// FIXED: Changed to PATCH and added projectId to URL
export const updateTask = async (
  projectId: string,
  taskId: string,
  updates: Partial<Task>
): Promise<{ data: Task }> => {
  const response = await fetch(`${base}/projects/${projectId}/tasks/${taskId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    await extractError(response, 'Failed to update task');
  }
  return response.json();
};

// FIXED: Added projectId to URL
export const deleteTask = async (projectId: string, taskId: string): Promise<boolean> => {
  const response = await fetch(`${base}/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    await extractError(response, 'Failed to delete task');
  }

  return true;
};

export const assignUserToTask = async (
  projectId: string,
  taskId: string,
  userId: string | null
): Promise<{ data: Task }> => {
  const response = await fetch(`${base}/projects/${projectId}/tasks/${taskId}/assignees`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ userIds: [userId] })
  });

  if (!response.ok) {
    await extractError(response, 'Failed to assign user');
  }

  return response.json();
};
