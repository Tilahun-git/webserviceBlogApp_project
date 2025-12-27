import axios, { AxiosResponse } from "axios";
import { mapPostDtoToPost } from "@/lib/adapters/postAdapter";

// ---------------- BASE URL ----------------
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

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
};