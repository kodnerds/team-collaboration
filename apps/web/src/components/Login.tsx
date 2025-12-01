import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { validateLoginFields } from '../utils/validation';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => validateLoginFields(email, password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/dashboard');
    }, 700);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '5px', boxSizing: 'border-box' }}
        />
        {errors.email && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.email}</div>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '5px', boxSizing: 'border-box' }}
        />
        {errors.password && (
          <div style={{ color: 'red', marginBottom: '10px' }}>{errors.password}</div>
        )}

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '10px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link
          to="/forgot-password"
          style={{ marginRight: '10px', color: '#007bff', textDecoration: 'none' }}
        >
          Forgot Password?
        </Link>
        <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
