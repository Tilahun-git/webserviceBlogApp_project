import axios, { AxiosResponse } from "axios";

// ---------------- BASE URL ----------------
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "https://localhost:8080";

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
  mediaType?: string;
  mediaUrl?: string;
  likeCount?: number;
  author: string;
  categoryTitle: string;
  createdAt?: string;
}

export interface Category {
  id: number;
  title: string;
}

// ---------------- USER TYPES ----------------
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  mediaUrl?: string;
  isAdmin: boolean;
  createdAt: string;
}

// // ---------------- AXIOS INSTANCE ----------------
// export const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 
//     "Content-Type": "application/json",
//     "Accept": "application/json"
//   },
//   withCredentials: false,
//   timeout: 10000,
// });

// // Add token to requests if available
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// ---------------- AXIOS INSTANCE ----------------
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  timeout: 10000,
});

// Attach JWT token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Handle SSL certificate errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_CERT_AUTHORITY_INVALID' || error.message.includes('certificate')) {
      const sslError = new Error(
        'SSL Certificate Error: Please visit https://localhost:8080 in your browser and accept the security certificate, then try again.'
      );
      sslError.name = 'SSLCertificateError';
      return Promise.reject(sslError);
    }
    return Promise.reject(error);
  }
);

// ---------------- SSL CERTIFICATE HELPER ----------------
export const openSSLCertificatePage = () => {
  if (typeof window !== 'undefined') {
    window.open(`${API_BASE_URL}/api/categories/list`, '_blank');
  }
};

export const testSSLConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/list`);
    return response.ok;
  } catch (error: any) {
    if (error.message?.includes('certificate') || error.name === 'TypeError') {
      return false;
    }
    return true; 
  }
};

// ---------------- AUTH API ----------------
export const signupApi = async (data: SignupData): Promise<AxiosResponse<any>> => {
  try {
    const response = await axiosInstance.post("/api/auth/register", data);
    return response.data;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') {
      throw new Error('SSL_CERTIFICATE_ERROR');
    }
    throw error;
  }
};

export const signInApi = async (data: SigninData): Promise<AxiosResponse<any>> => {
  try {
    return await axiosInstance.post("/api/auth/login", data);
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') {
      throw new Error('SSL_CERTIFICATE_ERROR');
    }
    throw error;
  }
};

// ---------------- CATEGORY API ----------------
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await axiosInstance.get("/api/categories/list");
    return response.data?.data ?? [];
  } catch (err: any) {
    if (err.name === 'SSLCertificateError') {
      console.error("SSL Certificate Error - Please accept the certificate");
    } else {
      console.error("Failed to fetch categories", err);
    }
    return [];
  }
};

// ---------------- POSTS API ----------------
export interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
}

// Create a new post (supports text, image, or video)
export const createPost = async (formData: FormData, categoryId: number): Promise<Post> => {
  try {
    const response = await axiosInstance.post(`/api/posts/createPost/${categoryId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (err: any) {
    console.error("Failed to create post:", err.response?.data || err.message);
    if (err.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw err;
  }
};


// Upload media file (image or video)
export const uploadMedia = async (file: File, _mediaType: "IMAGE" | "VIDEO"): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/api/media/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.url;
};

// Fetch all posts
export const fetchAllPosts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/posts/public`, {
      params: {
        pageNumber: 0,
        pageSize: 100,
        sortBy: 'createdAt',
        sortDir: 'desc'
      }
    });
    return response.data?.data ?? [];
  } catch (err: any) {
    console.error("Failed to fetch all posts:", err);
    return [];
  }
};

export const fetchPostsByCategory = async (
  categoryId: number = 0,
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<Post[]> => {
  try {
    const response = await axiosInstance.get(`/api/posts/${categoryId}/posts`, {
      params: {
        pageNumber,
        pageSize,
        sortBy: "createdAt",
        sortDir: sortOrder
      }
    });
    return response.data.data; 
  } catch (err: any) {
    if (err.name === 'SSLCertificateError') {
      console.error("SSL Certificate Error - Please accept the certificate");
    } else {
      console.error("Failed to fetch posts by category", err);
    }
    return [];
  }
};

export const fetchPostById = async (postId: string): Promise<Post | null> => {
  try {
    const response = await axiosInstance.get(`/api/posts/${postId}`);
    return response.data.data;
  } catch (err: any) {
    if (err.name === 'SSLCertificateError') {
      console.error("SSL Certificate Error - Please accept the certificate");
    } else {
      console.error("Failed to fetch post by ID", err);
    }
    return null;
  }
};

// ---------------- SEARCH API ----------------
export const searchPosts = async (
  keyword: string,
  sortOrder: "asc" | "desc" = "desc",
  pageNumber: number = 0,
  pageSize: number = 10
): Promise<Post[]> => {
  try {
    const response = await axiosInstance.get(`/api/posts/search`, {
      params: { keyword, pageNumber, pageSize, sortBy: "createdAt", sortDir: sortOrder }
    });
    return response.data.data || [];
  } catch (err: any) {
    if (err.name === 'SSLCertificateError') {
      console.error("SSL Certificate Error - Please accept the certificate");
    } else {
      console.error("Failed to search posts", err);
    }
    return [];
  }
};

// ---------------- LIKE API ----------------
export const toggleLikePost = async (postId: string, userId: string) => {
  try {
    const response = await axiosInstance.put(`/api/posts/public/${postId}/like`, null, {
      params: { userId }
    });
    return response.data;
  } catch (err: any) {
    if (err.name === 'SSLCertificateError') {
      console.error("SSL Certificate Error - Please accept the certificate");
      throw new Error('SSL_CERTIFICATE_ERROR');
    } else {
      console.error("Failed to toggle like", err);
    }
    throw err;
  }
};

// ---------------- USER DASHBOARD API ----------------
export const getUserPosts = async (
  sortBy: string = 'createdAt',
  sortDir: 'asc' | 'desc' = 'desc'
): Promise<{ posts: Post[] }> => {
  try {
    const response = await axiosInstance.get('api/posts/user/posts', {
      params: { sortBy, sortDir }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};

export const updatePost = async (postId: number, postData: Partial<CreatePostData>): Promise<Post> => {
  try {
    const response = await axiosInstance.put(`/api/posts/${postId}/update`, postData);
    return response.data;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};

export const deletePost = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/posts/post/${postId}`);
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};

// ---------------- USER PROFILE ----------------
export const getUserProfile = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get('/api/user/profile');
    return response.data.data;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};

export interface UpdateProfileData {
  username?: string;
  email?: string;
  bio?: string;
  mediaUrl?:string;
}

export const updateUserProfile = async (formData: FormData,): Promise<User> => {
  try {
    const response = await axiosInstance.put('/api/user/profile/update', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axiosInstance.post('/api/user/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.profilePictureUrl;
  } catch (error: any) {
    if (error.name === 'SSLCertificateError') throw new Error('SSL_CERTIFICATE_ERROR');
    throw error;
  }
};
