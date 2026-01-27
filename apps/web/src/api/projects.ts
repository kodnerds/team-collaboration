interface HttpError extends Error {
  status: number;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ProjectsResponse {
  message: string;
  data: {
    items: Project[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreateProjectResponse {
  message: string;
  data: {
    id: number;
    name: string;
    createdBy: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface ProjectMember {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const getProjects = async (page = 1, limit = 10): Promise<ProjectsResponse> => {
  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/projects?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.message || 'Failed to fetch projects') as HttpError;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const createProject = async (
  name: string,
  description?: string
): Promise<CreateProjectResponse> => {
  if (!name || name.trim().length < 3) {
    const error = new Error('Project name must be at least 3 characters long') as HttpError;
    error.status = 400;
    throw error;
  }

  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: name.trim(), description: description?.trim() || undefined })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData?.message || errorData?.errors?.[0] || 'Failed to create project'
    ) as HttpError;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const updateProject = async (
  id: string,
  name: string,
  description?: string
): Promise<CreateProjectResponse> => {
  if (!name || name.trim().length < 3) {
    const error = new Error('Project name must be at least 3 characters long') as HttpError;
    error.status = 400;
    throw error;
  }

  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: name.trim(), description: description?.trim() || undefined })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData?.message || errorData?.errors?.[0] || 'Failed to update project'
    ) as HttpError;
    error.status = response.status;
    throw error;
  }

  return response.json();
};

export const fetchProjectMembers = async (): Promise<ProjectMember[]> => {
  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/auth/users`, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.message || 'Failed to fetch project members') as HttpError;
    error.status = response.status;
    throw error;
  }

  const data = await response.json().catch(() => ({}));

  if (Array.isArray(data?.data)) return data.data as ProjectMember[];
  if (Array.isArray(data)) return data as ProjectMember[];
  if (Array.isArray(data)) return data as ProjectMember[];

  return [];
};
