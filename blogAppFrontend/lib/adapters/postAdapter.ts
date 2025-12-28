import { Post } from "@/lib/api";

export function mapPostDtoToPost(dto: any): Post {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    likeCount:dto.likeCount,
    imageUrl: dto.imageUrl,
    category: dto.categoryTitle,
    createdAt: new Date().toISOString(), // fallback
    author: {
      username: dto.author,
      profilePicture: null,
    },
  };
}
