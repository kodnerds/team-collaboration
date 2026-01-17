import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { type Project } from '../api/projects';
import { getProjectById } from '../utils/api';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOne = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProjectById(id);
        if (!data) {
          setError('Project not found');
        }
        setProject(data);
      } catch {
        setError('Failed to load project');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50">
        <div className="px-6 py-10 max-w-2xl mx-auto">
          <div className="h-10 w-3/4 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || 'Project not found'}
          </h2>
          <Link
            to="/projects"
            className="inline-block mt-4 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50">
      <div className="px-6 py-10 max-w-2xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </Link>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="h-1 w-16 bg-blue-500 rounded-full mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{project.name}</h1>
          {project.description && (
            <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
          )}

          {project.createdBy && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                {project.createdBy.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium text-gray-800">{project.createdBy.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
