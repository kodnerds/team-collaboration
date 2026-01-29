import { SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { getProjects, type Project } from '../api/projects';

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProjects();
        setProjects(response.data.items);
      } catch (err: unknown) {
        const error = err as { status?: number; message?: string };
        if (error.status === 401) {
          navigate('/login');
          return;
        }
        setError(error.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50">
        <div className="px-6 py-10 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-9 w-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-5 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="h-4 w-full bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Projects</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => globalThis.location.reload()}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50">
      <div className="px-6 py-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Projects</h1>
          <Link
            to="/create-project"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Project
          </Link>
        </div>

        {/* Empty state */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No projects yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">
              Get started by creating your first project to organize your tasks and collaborate with
              your team.
            </p>
            <Link
              to="/create-project"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Project
            </Link>
          </div>
        ) : (
          /* Projects grid - Trello-inspired card design */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="group p-5 rounded-lg border border-gray-200 bg-white shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-blue-200 hover:-translate-y-0.5"
              >
                {/* Project color bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="h-1 w-12 bg-blue-500 rounded-full mb-4 group-hover:w-16 transition-all" />

                  <Link to={`/edit-project/${project.id}`}>
                    <SquarePen className="text-blue-500 cursor-pointer" />
                  </Link>
                </div>

                <h2 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h2>

                {project.description && (
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{project.description}</p>
                )}

                {/* Creator info */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                    {project.createdBy?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <span className="text-xs text-gray-400">
                    {project.createdBy?.name || 'Unknown'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
