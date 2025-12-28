"use client";

import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2,
  UploadCloud,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/* ================= TYPES ================= */
interface Comment {
  id: number;
  text: string;
  
}

export interface Post {
  id: number;
  title: string;
  category: string;
 
  status: "Published" | "Draft";
  date: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

/* ================= STATIC POSTS ================= */
export const staticPosts: Post[] = [
  {
    id: 1,
    title: "Building a Facebook-Style App with Next.js",
    category: "Frontend",
    status: "Published",
    date: "2025-01-05",
    content:
      "This guide explains how to build a Facebook-style social media app using Next.js, Tailwind CSS, and Spring Boot. You will learn how to create posts, likes, comments, authentication, and media uploads with best practices used in real-world applications.",
    image: "https://source.unsplash.com/800x400/?technology,code",
    likes: 12,
    liked: false,
    comments: [
      { id: 1, text: "Very helpful post!" },
      { id: 2, text: "Can't wait to try this myself." },
    ],
  },
  {
    id: 2,
    title: "Spring Boot REST API Best Practices",
    category: "Backend",
    status: "Published",
    date: "2025-01-03",
    content:
      "Best practices for clean REST APIs including DTOs, validation, exception handling, pagination, filtering, JWT security, and proper API versioning for scalable applications.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 8,
    liked: false,
    comments: [],
  },
];

/* ================= COMPONENT ================= */
export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  // Edit states
  const [editPostId, setEditPostId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedImage, setEditedImage] = useState<string | undefined>();
  const [editedVideo, setEditedVideo] = useState<string | undefined>();

  const router = useRouter();
  const categories = ["Frontend", "Backend", "Fullstack", "DevOps"];

  useEffect(() => {
    setPosts(staticPosts);
  }, []);

  /* ================= ACTIONS ================= */
  const toggleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p
      )
    );
  };

  const deletePost = (id: number) => {
    if (!confirm("Delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Post deleted");
    setMenuOpenId(null);
  };

  const startEditing = (post: Post) => {
    setEditPostId(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
    setEditedCategory(post.category);
    setEditedImage(post.image);
    setEditedVideo(post.video);
    setMenuOpenId(null);
  };

  const saveEdit = (postId: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              title: editedTitle,
              content: editedContent,
              category: editedCategory,
              image: editedImage,
              video: editedVideo,
            }
          : p
      )
    );
    setEditPostId(null);
    toast.success("Post updated");
  };

  const cancelEdit = () => setEditPostId(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditedImage(URL.createObjectURL(file));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditedVideo(URL.createObjectURL(file));
  };

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
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full border rounded px-2 py-1 mb-1 text-lg font-bold"
                  />
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    rows={3}
                  />

                  {/* CATEGORY BUTTONS */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setEditedCategory(cat)}
                        className={`px-3 py-1 rounded ${
                          editedCategory === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* IMAGE */}
                  <div className="flex items-center gap-2 mt-2 relative">
                    <label className="flex items-center gap-1 cursor-pointer text-sm bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600">
                      <UploadCloud size={16} />
                      Select Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {editedImage && (
                      <div className="relative">
                        <img
                          src={editedImage}
                          className="max-h-40 rounded"
                          alt="preview"
                        />
                        <button
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => setEditedImage(undefined)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  {/* VIDEO */}
                  <div className="flex items-center gap-2 mt-2 relative">
                    <label className="flex items-center gap-1 cursor-pointer text-sm bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded hover:bg-gray-300 dark:hover:bg-slate-600">
                      <UploadCloud size={16} />
                      Select Video
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                    {editedVideo && (
                      <div className="relative">
                        <video controls className="max-h-40 rounded">
                          <source src={editedVideo} />
                        </video>
                        <button
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          onClick={() => setEditedVideo(undefined)}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => saveEdit(post.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <span className="text-xs text-slate-500">
                    {post.category} • {post.date}
                  </span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                    {post.content.length > 180
                      ? post.content.slice(0, 180) + "..."
                      : post.content}
                  </p>
                </>
              )}
            </div>

            {/* Three-dot menu */}
            {editPostId !== post.id && (
              <div className="relative">
                <MoreHorizontal
                  size={18}
                  className="cursor-pointer"
                  onClick={() =>
                    setMenuOpenId(menuOpenId === post.id ? null : post.id)
                  }
                />
                {menuOpenId === post.id && (
                  <div className="absolute right-0 top-6 bg-white dark:bg-slate-700 border rounded shadow-md w-32 z-10">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm cursor-pointer"
                      onClick={() => deletePost(post.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm cursor-pointer"
                      onClick={() => startEditing(post)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* MEDIA */}
          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="w-full max-h-[400px] object-cover rounded-lg"
            />
          )}
          {post.video && (
            <video controls className="w-full max-h-[400px] rounded-lg mt-2">
              <source src={post.video} />
            </video>
          )}

          {/* ACTIONS */}
          <div className="flex justify-around mt-3 border-t pt-2">
            <button
              className={`flex items-center gap-1 text-sm ${
                post.liked
                  ? "text-blue-600"
                  : "text-slate-600 dark:text-slate-300"
              }`}
              onClick={() => toggleLike(post.id)}
            >
              <Heart size={16} fill={post.liked ? "blue" : "none"} /> Like
            </button>

            <button
              className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              <MessageCircle size={16} /> Comment ({post.comments.length})
            </button>

            <button className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
