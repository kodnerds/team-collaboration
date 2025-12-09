import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
        <form action="">
          <InputField
            error="error"
            htmlFor="project-name"
            placeholder="project name"
            text="Project Name"
            type="text"
            name={projectDetails.name}
            onChange={handleChange}
            value="name"
          />

          <InputField
            error="error"
            htmlFor="project-description"
            placeholder="Project Description"
            text="Description"
            type="text"
            name={projectDetails.description}
            onChange={handleChange}
            value="description"
          />
        </form>
      </div>
    </main>
  );
};

export default EditProject;
