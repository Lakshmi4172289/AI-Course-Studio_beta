// Use environment variable if available, otherwise default to local
// @ts-ignore - Vite env types aren't loaded in tsconfig
const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000/api/auth";

interface AuthResponse {
  message?: string;
  token?: string;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
