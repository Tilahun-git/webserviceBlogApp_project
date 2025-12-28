import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export interface SignupData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export const signupApi = async (data: SignupData) => {
  const res = await axios.post(`${API_BASE_URL}/user/sign-up`, data);
  return res.data;
};
export const signInApi = async (data: SigninData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
};
export interface User { _id: string; username: string; email: string; profilePicture?: string; isAdmin: boolean; createdAt: string; }
export const getUsers = async (page: number, limit: number): Promise<{ users: User[]; total: number }> => {
  const res = await fetch(`/api/users?page=${page}&limit=${limit}`, { credentials: "include" });
  const data = await res.json();
  return data;
};
export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const res = await fetch(`/api/users/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), credentials: "include" });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Update failed");
  }
  return json.user as User;
};
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`/api/users/${id}`, { method: "DELETE", credentials: "include" });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Delete failed");
  }
};