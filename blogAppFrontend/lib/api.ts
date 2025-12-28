import axios, { AxiosResponse } from "axios";
import { mapPostDtoToPost } from "@/lib/adapters/postAdapter";

<<<<<<< HEAD
const API_BASE_URL = 'http://localhost:8080';
=======
// ---------------- BASE URL ----------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";
>>>>>>> main

// ---------------- AUTH TYPES ----------------
export interface SignupData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface SigninData {
  username: string;
  password: string;
}

<<<<<<< HEAD
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
=======
// ---------------- POST & CATEGORY TYPES ----------------
export interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  imageUrl?: string;
  category: string;
  createdAt: string;
  author: {
    username: string;
    profilePicture?: string | null;
  };
}

export interface Category {
  id: number;
  title: string;
}

// ---------------- AXIOS INSTANCE ----------------
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ---------------- AUTH API ----------------
export const signupApi = (data: SignupData): Promise<AxiosResponse<any>> =>
  axiosInstance.post("/api/user/register", data);

export const signInApi = (data: SigninData): Promise<AxiosResponse<any>> =>
  axiosInstance.post("/api/auth/login", data);

// ---------------- CATEGORY API ----------------
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get<Category[]>("/api/categories/list");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return [];
  }
};

// ---------------- POSTS API ----------------
// Fetch all posts from all categories (for refresh functionality)
export const fetchAllPosts = async (
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 100 // Use larger page size to get all posts
): Promise<Post[]> => {
  try {
    const response = await axiosInstance.get("/api/posts/public", {
      params: {
        pageNumber,
        pageSize,
        sortBy: "createdAt",
        sortDir: sortOrder,
      },
    });

    const postsDto: any[] = response.data?.posts ?? response.data?.content ?? [];
    return postsDto.map(mapPostDtoToPost);
  } catch (err) {
    console.error("Failed to fetch all posts", err);
    return [];
  }
};

export const fetchPostsByCategory = async (
  categoryId: number = 0,
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<Post[]> => {
  let url = "/api/posts/public";

  if (categoryId !== 0) {
    url = `/api/posts/public/category/${categoryId}/posts`;
  }

  const response = await axiosInstance.get(url, {
    params: {
      pageNumber,
      pageSize,
      sortBy: "createdAt",
      sortDir: sortOrder,
    },
  });

  const postsDto: any[] = response.data?.posts ?? [];
  return postsDto.map(mapPostDtoToPost);
};

// ---------------- SEARCH API ----------------
export const searchPosts = async (
  keyword: string,
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<Post[]> => {
  const response = await axiosInstance.get("/api/posts/public/search", {
    params: {
      keyword,
      pageNumber,
      pageSize,
      sortBy: "createdAt",
      sortDir: sortOrder,
    },
  });

  const postsDto: any[] = response.data?.content ?? [];
  return postsDto.map(mapPostDtoToPost);
};

// ---------------- TOGGLE LIKE API ----------------
export const toggleLikePost = async (postId: number, userId?: number) => {
  const response = await axiosInstance.put(`/api/posts/public/${postId}/like`, null, {
    params: { userId }, // optional, for demo purposes
  });

  const post: Post = mapPostDtoToPost(response.data.post);
  const likedByCurrentUser: boolean = response.data.likedByCurrentUser;

  return { post, likedByCurrentUser };
>>>>>>> main
};