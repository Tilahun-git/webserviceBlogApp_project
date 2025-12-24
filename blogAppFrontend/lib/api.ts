
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface SignupData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  username: string; // must match backend LoginRequestDto
  password: string;
}

// SignUp API
export const signupApi = async (data: SignupData) => {
  const res = await axios.post("http://localhost:8080/api/users/user/register", data);
  return res.data;
};

// SignIn API
export const signInApi = async (data: SigninData) => {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data, );
  return res.data; // { token: string }
};
