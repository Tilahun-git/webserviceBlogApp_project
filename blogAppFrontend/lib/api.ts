import axios, { AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8080";

// ---------------- AUTH TYPES ----------------
export interface SignupData {
  firstname: string;
  lastname: string;
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
  imageUrl: string;
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
});

// ---------------- AUTH API ----------------
export const signupApi = (data: SignupData): Promise<AxiosResponse<any>> =>
  axiosInstance.post("/api/user/register", data);

export const signInApi = (data: SigninData): Promise<AxiosResponse<any>> =>
  axiosInstance.post("/api/auth/login", data);

// ---------------- CATEGORY API ----------------
export const fetchCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get<Category[]>("/api/categories/list");
  return response.data;
};

// ---------------- POSTS API ----------------
export const fetchPostsByCategory = async (
  categoryId: number = 0,   // 0 = all posts
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<Post[]> => {
  let url = "/api/posts/public";
  if (categoryId !== 0) {
    url = `/api/posts/public/category/${categoryId}/posts`;
  }

  const response = await axiosInstance.get(url, {
    params: { pageNumber, pageSize, sortDir: sortOrder },
  });

  // Now response.data.posts is always an array
  const postsData: any[] = Array.isArray(response.data.posts) ? response.data.posts : [];

  return postsData.map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    imageUrl: p.imageUrl,
    category: typeof p.category === "object" ? p.category.title : p.category,
    createdAt: p.createdAt,
    author: {
      username: p.author.username,
      profilePicture: p.author.profilePicture ?? "/avatar.png",
    },
  }));
};


//Api for searching
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
      sortDir: sortOrder,
    },
  });

  const postsData = response.data?.content ?? [];

  return postsData.map((p: any) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    category: p.category,
    createdAt: p.createdAt,
    author: {
      username: p.author.username,
      profilePicture: p.author.profilePicture ?? null,
    },
  }));
};

