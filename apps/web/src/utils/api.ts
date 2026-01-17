// Re-export project API functions from the dedicated module
export { getProjects, createProject, type Project, type ProjectsResponse } from '../api/projects';

// Legacy function for backwards compatibility (used by ProjectDetails)
export const getProjectById = async (id: string) => {
  const { getProjects } = await import('../api/projects');
  try {
    const response = await getProjects();
    return response.data.items.find((p) => p.id.toString() === id) || null;
  } catch {
    return null;
  }
};
