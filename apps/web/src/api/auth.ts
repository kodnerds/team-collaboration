export const loginUser = async (email: string, password: string) => {
  const base = import.meta.env.VITE_API_URL;
  const response = await fetch(`${base}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // If response is not ok, throw error for catch block
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorData?.message || "Something went wrong",
    };
  }

  return response.json();
};
