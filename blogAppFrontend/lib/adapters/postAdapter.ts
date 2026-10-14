import { Post } from "@/lib/api";

export interface PostDTO {
  id: number;
  title: string;
  content: string;
  likeCount?: number;
  mediaType?: string;
  mediaUrl?: string;
  imageUrl?: string;         // legacy field name, if backend still uses it
  categoryTitle?: string;
  author?: string;
  authorUsername?: string;
  createdAt?: string;
}

export function mapPostDtoToPost(dto: PostDTO): Post {
  // Normalize mediaType to the uppercase enum used by the frontend
  const normalizedMediaType: "TEXT" | "IMAGE" | "VIDEO" | undefined =
      dto.mediaType === "IMAGE"
          ? "IMAGE"
          : dto.mediaType === "VIDEO"
              ? "VIDEO"
              : dto.mediaType === "TEXT"
                  ? "TEXT"
                  : undefined;

  return {
    id: dto.id,
    title: dto.title,
    content: dto.content,
    likeCount: dto.likeCount ?? 0,
    mediaType: normalizedMediaType,
    // Prefer mediaUrl; fall back to legacy imageUrl if the backend still sends it
    mediaUrl: dto.mediaUrl ?? dto.imageUrl,
    categoryTitle: dto.categoryTitle ?? "Uncategorized",
    createdAt: dto.createdAt ?? new Date().toISOString(),
    author: {
      username: dto.author ?? dto.authorUsername ?? "Unknown",
      profilePicture: null,
    },
  };
}