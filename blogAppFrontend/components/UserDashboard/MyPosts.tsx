"use client";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  UploadCloud,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { useSelector } from "react-redux";

import type { RootState } from "@/redux/store";
import {
  getUserPosts,
  fetchAllPosts,
  updatePost,
  deletePost as deletePostApi,
  uploadMedia,
  fetchCategories,
} from "@/lib/api";
import type { Post, Category } from "@/lib/api";

import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface MyPostsProps {
  onlyUserPosts?: boolean; // If true, show only logged-in user's posts
}

export default function MyPosts({ onlyUserPosts = false }: MyPostsProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategoryId, setEditedCategoryId] = useState<number>(0);
  const [editedMediaUrl, setEditedMediaUrl] = useState<string | undefined>();
  const [editedMediaType, setEditedMediaType] =
    useState<"TEXT" | "IMAGE" | "VIDEO">("TEXT");
  const [updating, setUpdating] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) return null;

  /* ---------- LOAD DATA ---------- */
  useEffect(() => {
    const loadData = async () => {
      try {
        setPageLoading(true);

        const [postsResponse, categoriesData] = await Promise.all([
          onlyUserPosts ? getUserPosts() : fetchAllPosts(),
          fetchCategories(),
        ]);

        // If onlyUserPosts, postsResponse might be { posts: Post[] }
        const postsData: Post[] =
          onlyUserPosts && "posts" in postsResponse
            ? postsResponse.posts || []
            : (postsResponse as Post[]);

        // Sort by createdAt descending
        postsData.sort(
          (a, b) =>
            new Date(b.createdAt || "").getTime() -
            new Date(a.createdAt || "").getTime()
        );

        setPosts(postsData);
        setCategories(categoriesData || []);
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to load posts");
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [onlyUserPosts]);

  /* ---------- ACTIONS ---------- */
  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p
      )
    );
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm("Delete this post?")) return;

    try {
      await deletePostApi(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const startEditing = (post: Post) => {
    setEditPostId(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);

    const category = categories.find((cat) => cat.title === post.categoryTitle);
    setEditedCategoryId(category?.id || 0);

    setEditedMediaUrl(post.mediaUrl);
    setEditedMediaType(
      post.mediaType === "image/jpeg"
        ? "IMAGE"
        : post.mediaType === "video/mp4"
        ? "VIDEO"
        : "TEXT"
    );

    setMenuOpenId(null);
  };

  const saveEdit = async (postId: number) => {
    try {
      setUpdating(true);

      const updatedPost = await updatePost(postId, {
        title: editedTitle,
        content: editedContent,
        categoryId: editedCategoryId,
        mediaType: editedMediaType,
        mediaUrl: editedMediaUrl,
      });

      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));

      setEditPostId(null);
      toast.success("Post updated");
    } catch {
      toast.error("Failed to update post");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaUrl = await uploadMedia(file, "IMAGE");
    setEditedMediaUrl(mediaUrl);
    setEditedMediaType("IMAGE");
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mediaUrl = await uploadMedia(file, "VIDEO");
    setEditedMediaUrl(mediaUrl);
    setEditedMediaType("VIDEO");
  };

  /* ---------- LOADING ---------- */
  if (pageLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  /* ---------- EMPTY ---------- */
  if (posts.length === 0) {
    return (
      <p className="text-center py-20 text-gray-500">
        {onlyUserPosts
          ? "You haven’t created any posts yet."
          : "No posts available."}
      </p>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-6">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white dark:bg-slate-900 border rounded-xl shadow-sm"
        >
          {/* HEADER */}
          <div className="p-4 flex justify-between items-start">
            <div className="flex-1">
              {editPostId === post.id ? (
                <>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                  />
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="mt-2"
                  />

                  {/* CATEGORIES */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {categories.map((cat) => (
                      <Button
                        key={cat.id}
                        size="sm"
                        variant={editedCategoryId === cat.id ? "default" : "secondary"}
                        onClick={() => setEditedCategoryId(cat.id)}
                      >
                        {cat.title}
                      </Button>
                    ))}
                  </div>

                  {/* MEDIA UPLOAD */}
                  <div className="flex gap-2 mt-2">
                    <label className="cursor-pointer flex items-center gap-1">
                      <UploadCloud size={16} />
                      Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>

                    <label className="cursor-pointer flex items-center gap-1">
                      <UploadCloud size={16} />
                      Video
                      <input
                        type="file"
                        hidden
                        accept="video/*"
                        onChange={handleVideoChange}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button onClick={() => saveEdit(post.id)} disabled={updating}>
                      {updating ? <Loader2 className="h-4 w-4" /> : "Save"}
                    </Button>
                    <Button variant="secondary" onClick={() => setEditPostId(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.categoryTitle}</p>
                  <p className="mt-1 text-sm">{post.content}</p>
                </>
              )}
            </div>

            {/* MENU */}
            {editPostId !== post.id && (
              <div className="relative">
                <MoreHorizontal
                  className="cursor-pointer"
                  onClick={() =>
                    setMenuOpenId(menuOpenId === post.id ? null : post.id)
                  }
                />
                {menuOpenId === post.id && (
                  <div className="absolute right-0 bg-white dark:bg-slate-800 border rounded">
                    <Button onClick={() => startEditing(post)}>Edit</Button>
                    <Button onClick={() => handleDeletePost(post.id)}>Delete</Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MEDIA */}
          {post.mediaUrl && post.mediaType?.startsWith("image") && (
            <Image
              src={post.mediaUrl}
              alt="post"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          )}

          {post.mediaUrl && post.mediaType?.startsWith("video") && (
            <video controls className="w-full">
              <source src={post.mediaUrl} />
            </video>
          )}

          {/* ACTIONS */}
          <div className="flex justify-around border-t py-2">
            <Button variant="ghost" onClick={() => toggleLike(post.id)}>
              <Heart size={16} /> {post.likeCount || 0}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <MessageCircle size={16} />
            </Button>
            <Button variant="ghost">
              <Share2 size={16} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
