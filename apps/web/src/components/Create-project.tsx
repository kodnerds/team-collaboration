import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ projectName?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!projectName.trim()) {
      setErrors({ projectName: 'Project name is required' });
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Add API call to create project
      
      // Redirect to projects/dashboard after creation
      navigate('/dashboard');
    } catch {
      setErrors({ projectName: 'Failed to create project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full p-10 max-w-[450px] relative z-10">
        <h2 className="text-3xl text-center font-semibold text-gray-700 mb-6">Create Project</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-2">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            className="w-full px-3 py-2.5 mb-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
          />
          {errors.projectName && <div className="text-red-500 mb-2.5">{errors.projectName}</div>}

          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mt-4 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description (optional)"
            rows={4}
            className="w-full px-3 py-2.5 mb-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
          />

          <button
            type="submit"
            className="w-full py-2.5 mt-6 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </form>

        <button
          onClick={() => navigate(-1)}
          className="w-full py-2.5 mt-3 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default CreateProject;