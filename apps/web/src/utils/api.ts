// Re-export project API functions from the dedicated module
export { getProjects, createProject, type Project, type ProjectsResponse } from '../api/projects';

// Legacy function for backwards compatibility (used by ProjectDetails)
export const getProjectById = async (id: number) => {
  const { getProjects } = await import('../api/projects');
  try {
    const response = await getProjects();
    return response.data.items.find((p) => p.id === id) || null;
  } catch {
    return null;
  }
};
