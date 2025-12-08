// Temporary dummy data
export const dummyProjects = [
  { id: 1, title: "Project Alpha", description: "This is project alpha." },
  { id: 2, title: "Project Beta", description: "This is project beta." },
];

// API function that will later call the backend
export const getProjects = async () => {
  return dummyProjects;
};

export const getProjectById = async (id: number) => {
  return dummyProjects.find((p) => p.id === id) || null;
};
