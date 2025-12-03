export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * @param email The email string to validate.
 * @param password The password string to validate.
 * @returns An object containing validation errors, or an empty object if valid.
 */
export const validateLoginFields = (
  email: string,
  password: string
): { email?: string; password?: string } => {
  const newErrors: { email?: string; password?: string } = {};

  if (!email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!emailRegex.test(email)) {
    newErrors.email = 'Enter a valid email address';
  }

  if (!password || !password.trim()) {
    newErrors.password = 'Password is required';
  } else if (password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  } else if (!passwordRegex.test(password)) {
    newErrors.password =
      'Password must contain uppercase, lowercase, number, and special character';
  }

  return newErrors;
};
