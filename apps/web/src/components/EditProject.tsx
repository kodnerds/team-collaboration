import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';

import { updateProject } from '../api/projects';

interface FormErrors {
  projectName?: string;
  general?: string;
}

const EditProject = () => {
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { id } = useParams();
  const projectId = String(id);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    } else if (projectName.trim().length < 3) {
      newErrors.projectName = 'Project name must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderButtonContent = () => {
    if (isSubmitting) {
      return (
        <>
          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Updating Project...
        </>
      );
    }

    if (successMessage) {
      return (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Updated!
        </>
      );
    }

    return (
      <>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        Update Project
      </>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProject(projectId, projectName, description || undefined);
      setSuccessMessage('Project updated successfully!');

      // Brief delay to show success message, then redirect
      setTimeout(() => {
        navigate('/projects');
      }, 1000);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };

      if (error.status === 401) {
        navigate('/login');
        return;
      }

      if (error.status === 400) {
        setErrors({ projectName: error.message || 'Invalid project data' });
      } else {
        setErrors({ general: error.message || 'Failed to update project. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full p-10 max-w-[450px] relative z-10">
        {/* Header with back link */}
        <div className="flex items-center mb-6">
          <Link
            to="/projects"
            className="text-gray-400 hover:text-gray-600 transition mr-3"
            aria-label="Back to projects"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h2 className="text-2xl font-semibold text-gray-700">Edit Project</h2>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <span className="text-green-700 font-medium">{successMessage}</span>
          </div>
        )}

        {/* General error message */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <span className="text-red-700">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Project Name Field */}
          <div className="mb-5">
            <label htmlFor="projectName" className="block text-sm font-semibold text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              id="projectName"
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-sm text-gray-900 ${
                errors.projectName
                  ? 'border-red-300 focus:border-red-500 bg-red-50'
                  : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
              }`}
              disabled={isSubmitting}
              autoFocus
            />
            {errors.projectName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.projectName}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description to help your team understand this project"
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none hover:border-gray-300 transition text-sm text-gray-900 resize-none"
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-gray-400">{description.length}/500 characters</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isSubmitting || !!successMessage}
          >
            {renderButtonContent()}
          </button>
        </form>

        {/* Cancel link */}
        <div className="mt-4 text-center">
          <Link to="/projects" className="text-sm text-gray-500 hover:text-gray-700 transition">
            Cancel and return to projects
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditProject;
