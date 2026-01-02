import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import InputField from './SignUp/inputField';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiBaseUrl}/projects/${id}`)
      .then((response) => response.json())
      .then((data) =>
        setProjectDetails({ ...projectDetails, name: data.name, description: data.description })
      );
  }, [id, projectDetails, apiBaseUrl]);

  const clientSideValidation = () => {
    let isFormValid = true;
    // checking name field
    if (!projectDetails.name.trim()) {
      isFormValid = false;
      setError('Please input a valid name');
    }
    // checking for name length
    if (projectDetails.name.trim().length < 3) {
      isFormValid = false;
      setError('Project name must be at least 3 characters');
    }

    return isFormValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');
    setSuccessMessage('');
    if (!clientSideValidation()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectDetails)
      });
      const data = await response.json();
      if (response.status === 200) {
        const { id, name } = data.data;
        localStorage.setItem('userSession', JSON.stringify({ id, name }));
        setProjectDetails({ ...projectDetails, name: '', description: '' });
        setSuccessMessage('Project created successfully!');

        setTimeout(() => {
          navigate('/projects');
        }, 500);
      } else if (response.status === 400 || response.status === 409) {
        setError(data.message || `API Error: Status ${response.status}`);
      } else {
        setError('An unexpected server error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full px-10 py-5  max-w-[450px] relative z-10">
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
        <form onSubmit={handleSubmit}>
          <InputField
            error=""
            htmlFor="project-name"
            placeholder="Project Name"
            text="Project Name"
            type="text"
            value={projectDetails.name}
            onChange={handleChange}
            name="name"
          />
          <div>
            {error && <p className="text-red-500 text-sm">{error} </p>}
            <label
              htmlFor="description"
              className="input-label block text-sm font-semibold text-gray-700  mb-1"
            >
              Description
            </label>
            <textarea
              name="description"
              value={projectDetails.description}
              id="description"
              placeholder="Project Description"
              rows={5}
              cols={30}
              maxLength={500}
              className="w-full px-3 py-2.5 mb-1 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none bg-white text-black"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="w-20 py-3 bg-white border  border-gray-300 text-blue-600 rounded-lg hover:bg-blue-600 transition font-medium   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              onClick={() => {
                navigate('/projects');
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-20 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={isSubmitting || !!successMessage}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProject;
