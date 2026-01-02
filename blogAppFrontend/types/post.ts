export type PostType = "TEXT" | "IMAGE" | "VIDEO";

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  thumbnail?: string;
  postType: PostType;
}

export interface PostPayload {
  title: string;
  content: string;
  category: string;
  postType: PostType;
  mediaUrl?: string;
}
