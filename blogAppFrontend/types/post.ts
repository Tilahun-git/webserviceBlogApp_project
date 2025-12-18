export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  createdAt: string;
  views: number;
  thumbnail?: string;
}
