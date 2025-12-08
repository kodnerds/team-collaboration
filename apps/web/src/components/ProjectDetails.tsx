import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProjectById } from "../utils/api";

interface Project {
  id: number;
  title: string;
  description: string;
}

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchOne = async () => {
      if (!id) return;
      const data = await getProjectById(Number(id));
      setProject(data);
    };
    fetchOne();
  }, [id]);

  if (!project) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="px-6 py-10 max-w-2xl mx-auto">
      <h1 className="text-4xl font-semibold mb-3">{project.title}</h1>
      <p className="text-gray-700">{project.description}</p>

      <button
        onClick={() => globalThis.history.back()}
        className="mt-8 px-5 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition"
      >
        Back
      </button>
    </div>
  );
};

export default ProjectDetails;