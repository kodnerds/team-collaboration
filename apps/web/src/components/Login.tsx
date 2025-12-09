import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { loginUser } from '../api/auth';
import { validateLoginFields } from '../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => validateLoginFields(email, password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // REAL API call
      const res = await loginUser(email, password);

      // Save token
      localStorage.setItem('token', res.accessToken);

      // Redirect to projects
      navigate('/projects');
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status === 400) {
        setErrors({ email: 'Invalid input — check your fields' });
      } else if (error.status === 401) {
        // Attach auth errors to password — common UX practice
        setErrors({ password: error.message || 'Incorrect email or password' });
      } else {
        setErrors({ password: 'Something went wrong. Try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white rounded-lg shadow-xl w-full p-10  max-w-[450px] relative z-10">
        <h2 className="text-3xl text-center font-semibold text-gray-700 mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 mb-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-sm"
          />
          {errors.email && <div className="text-red-500 mb-2.5">{errors.email}</div>}

          <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mt-3 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 mb-3 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none text-gray-900 text-sm"
          />
          {errors.password && <div className="text-red-500 mb-2.5">{errors.password}</div>}

          <button
            type="submit"
            className="w-full py-2.5 mt-5 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link to="/forgot-password" className="mr-4 text-blue-700 no-underline hover:underline">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-blue-700 no-underline hover:underline">
            Create Account
          </Link>
          <Link
            to="/create-project"
            className="block mt-4 text-blue-700 no-underline hover:underline"
          >
            Create Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
