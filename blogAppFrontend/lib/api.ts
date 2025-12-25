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