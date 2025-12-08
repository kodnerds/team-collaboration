import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { validateLoginFields } from '../../utils/validation';

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
  };

  // perfoming client side validation
  const validateSignUp = () => validateLoginFields(formData.email, formData.password);
  const clientSideValidation = () => {
    let isFormValid = true;

    if (!formData.name.trim()) {
      isFormValid = false;
      setErrors((prev) => ({ ...prev, name: 'Please input a valid name' }));
    }

    const validationErrors = validateSignUp();
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
      return;
    }

    if (!isValidUrl(formData.avatar)) {
      isFormValid = false;
      setErrors((prev) => ({ ...prev, avatar: 'Please, input a valid URL' }));
    }

    return isFormValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ email: '', name: '', password: '', avatar: '' });
    if (!clientSideValidation()) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/v1/auth/signup', {
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
        setTimeout(() => {
          setIsLoading(false);
          navigate('/dashboard');
        }, 500);
      } else if (response.status === 400 || response.status === 409) {
        setApiError(data.message || `API Error: Status ${response.status}`);
      } else {
        setApiError('An unexpected server error occurred. Please try again.');
      }
    } catch (error) {
      setApiError(`A critical network error occurred. Check your connection. ${error}`);
    } finally {
      setIsLoading(false);
    }

    // reset form
    setFormData({ ...formData, email: '', name: '', password: '', avatar: '' });
  };

  return (
    <section className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      <main className="bg-white rounded-lg shadow-xl w-full px-10 py-5  max-w-[450px] relative z-10">
        <Toast message={apiError} duration={3000} />
        <form onSubmit={handleSubmit} className="form-container">
          <h2 className="text-3xl text-center font-semibold text-gray-700 mb-2">Sign up</h2>
          <h3 className="text-center font-semibold text-gray-700 mb-6">
            Please enter you details to create a new account
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
            type="text"
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
            type="textnpm run dev"
            value={formData.avatar}
            name="Avatar-URL"
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
      </main>
    </section>
  );
};

export default SignupPage;

const Toast = ({ message, duration }: { message: string; duration: number }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, duration]);

  if (!isVisible) {
    return null;
  }

  return <p className={message && 'toast'}>{message}</p>;
};
