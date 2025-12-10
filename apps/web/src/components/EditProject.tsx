import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import InputField from './SignUp/inputField';

const EditProject = () => {
  const { id } = useParams();

  useEffect(() => {
    const apiBaseUrl = 'http://localhost:3000';

    fetch(`${apiBaseUrl}/api/v1/projects/${id}`)
      .then((response) => response.json())
      .then((data) =>
        setProjectDetails({ ...projectDetails, name: data.name, description: data.description })
      );
  }, []);

  const [projectDetails, setProjectDetails] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  //   const handleSubmit=(){
  //   }
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
        <form action="">
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
          {/* <InputField
            error="error"
            htmlFor="project-description"

            text="Description"
            type="text"

            onChange={handleChange}

          /> */}
          <div>
            <button
              type="submit"
              className="w-20 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium  mx-auto disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            //   disabled={isSubmitting || !!successMessage}
            >
              Save
            </button>
            <button></button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditProject;
