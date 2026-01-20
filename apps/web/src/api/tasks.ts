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
    throw new Error(`Failed to create task: ${response.statusText}`);
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
    throw new Error(`Failed to update task: ${response.statusText}`);
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
    throw new Error(`Failed to delete task: ${response.statusText}`);
  }

  return true;
};
