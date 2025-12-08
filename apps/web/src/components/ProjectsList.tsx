import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects } from "../utils/api";

interface Project {
  id: number;
  title: string;
  description: string;
}

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjects();
      setProjects(data);
    };
    fetchData();
  }, []);

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Your Projects</h1>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="p-5 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer transition hover:bg-gray-100"
          >
            <h2 className="text-xl font-medium mb-1">{project.title}</h2>
            <p className="text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;
