import axios from "axios";

export const getProjectById = async (projectId: string | number) => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`/api/v1/projects/${projectId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createTask = async (payload: {
  name: string;
  description?: string;
  stage: string;
  projectId: string | number;
}) => {
  const token = localStorage.getItem("token");

  const res = await axios.post("/api/v1/tasks", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
