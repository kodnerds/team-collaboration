export const loginUser = async (email: string, password: string) => {
  const response = await fetch("/api/v1/auth/login", {
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
