export const loginUser = async (email: string, password: string) => {
  // Validate inputs
  if (!email || !password) {
    const error = new Error('Email and password are required');
    (error as any).status = 400;
    throw error;
  }

  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  // If response is not ok, throw error for catch block
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData?.message || 'Something went wrong');
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
};
