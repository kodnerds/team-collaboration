import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { validateLoginFields } from '../../utils/validation';
import Toast from '../ui/Toast';

import InputField from './inputField';

const isValidUrl = (url: string) => {
  if (!url) return true; // Optional field is valid if empty
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    avatar: ''
  });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    password: '',
    avatar: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  // perfoming client side validation
  const validateSignUp = () => validateLoginFields(formData.email, formData.password);
  const clientSideValidation = () => {
    let isFormValid = true;
    // checking name field
    if (!formData.name.trim()) {
      isFormValid = false;
      setErrors((prev) => ({ ...prev, name: 'Please input a valid name' }));
    }
    // checking password and email
    const validationErrors = validateSignUp();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }
    // checking avatar url
    if (!isValidUrl(formData.avatar)) {
      isFormValid = false;
      setErrors((prev) => ({ ...prev, avatar: 'Please, input a valid URL' }));
    }

    return isFormValid;
  };

  // handling submssion and sending POST req
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const base = import.meta.env.VITE_API_URL;

    setErrors({ email: '', name: '', password: '', avatar: '' });
    if (!clientSideValidation()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`${base}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (response.status === 201) {
        const { id, name, authToken } = data.data;
        localStorage.setItem(
          'userSession',
          JSON.stringify({ id, name, authToken, email: formData.email })
        );
        // reset form
        setFormData({ ...formData, email: '', name: '', password: '', avatar: '' });
        setTimeout(() => {
          setIsLoading(false);
          navigate('/login');
        }, 500);
      } else if (response.status === 400 || response.status === 409) {
        setApiError(data.message || `API Error: Status ${response.status}`);
      } else {
        setApiError('An unexpected server error occurred. Please try again.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Network error during signup:', error);
      setApiError('A critical network error occurred. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <main className="bg-white rounded-lg shadow-xl w-full px-10 py-10  max-w-[450px] relative z-10">
        <Toast message={apiError} duration={3000} />
        <form onSubmit={handleSubmit} className="form-container" noValidate>
          <h2 className="text-3xl text-center font-semibold text-gray-700 mb-2">Sign up</h2>
          <h3 className="text-center font-semibold text-gray-700 mb-6">
            Please enter your details to create a new account
          </h3>
          <InputField
            htmlFor="Full Name"
            placeholder="John Doe"
            error={errors.name}
            text="First Name"
            type="text"
            value={formData.name}
            name="name"
            onChange={handleChange}
          />

          <InputField
            htmlFor="email"
            placeholder="abc@example.com"
            error={errors.email}
            text="Email"
            type="email"
            value={formData.email}
            name="email"
            onChange={handleChange}
          />
          <InputField
            htmlFor="password"
            placeholder="********"
            error={errors.password}
            text="Enter Password"
            type="password"
            value={formData.password}
            name="password"
            onChange={handleChange}
          />
          <InputField
            htmlFor="Avatar-URL"
            placeholder="https://example.com/avatar.jpg"
            error={errors.avatar}
            text="Avatar URL"
            type="url"
            value={formData.avatar}
            name="avatar"
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full py-2.5 mt-5 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Create Account
          </button>
        </form>
        <div className="text-center mt-5">
          <Link to="/login" className="text-blue-700 no-underline hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </main>
    </section>
  );
};

export default SignupPage;
