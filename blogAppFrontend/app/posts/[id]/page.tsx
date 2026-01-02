"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, MoreHorizontal, Send, ChevronDown, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "flowbite-react/components/Textarea";
import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */
export interface Comment {
  id: number;
  text: string;
  replies: Comment[];
}

export interface Post {
  id: number;
  title: string;
  category: string;
  status?: "Published" | "Draft";
  date: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
}

/* ================= STATIC DATA ================= */
export let postsData: Post[] = [
  {
    id: 1,
    title: "Building a Facebook-Style App with Next.js",
    category: "Frontend",
    status: "Published",
    date: "2025-01-05",
    content:
      "This guide explains how to build a Facebook-style social media app using Next.js, Tailwind CSS, and Spring Boot.",
    image: "https://source.unsplash.com/800x400/?technology,code",
    likes: 12,
    liked: false,
    comments: [
      { id: 1, text: "Very helpful post!", replies: [] },
      { id: 2, text: "Can't wait to try this myself.", replies: [] },
    ],
  },
  {
    id: 2,
    title: "Spring Boot REST API Best Practices",
    category: "Backend",
    status: "Published",
    date: "2025-01-03",
    content:
      "Best practices for clean REST APIs including DTOs, validation, exception handling, pagination, filtering, JWT security.",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    likes: 8,
    liked: false,
    comments: [],
  },
];

/* ================= HELPER FUNCTIONS ================= */
export const updatePostById = (id: number, updatedFields: Partial<Post>) => {
  const index = postsData.findIndex((p) => p.id === id);
  if (index !== -1) {
    postsData[index] = { ...postsData[index], ...updatedFields };
    toast.success("Post updated");
  } else {
    toast.error("Post not found");
  }
};

export const addCommentToPost = (postId: number, comment: Comment) => {
  const index = postsData.findIndex((p) => p.id === postId);
  if (index !== -1) {
    postsData[index].comments.push(comment);
  }
};

export const deleteCommentFromPost = (postId: number, commentId: number) => {
  const index = postsData.findIndex((p) => p.id === postId);
  if (index !== -1) {
    postsData[index].comments = postsData[index].comments.filter(
      (c) => c.id !== commentId
    );
  }
};

/* ================= POST DETAIL COMPONENT ================= */
interface NestedReply {
  id: number;
  text: string;
  replies: NestedReply[];
}

interface CommentWithReplies {
  id: number;
  text: string;
  replies: NestedReply[];
}

export default function PostDetail() {
  const { id } = useParams();
  const router = useRouter();
  const postId = Number(id);

  const [post, setPost] = useState<Post & { comments: CommentWithReplies[] } | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [editedImage, setEditedImage] = useState<string | undefined>();
  const [editedVideo, setEditedVideo] = useState<string | undefined>();

  const [commentText, setCommentText] = useState("");
  const [replyTexts, setReplyTexts] = useState<{ [key: number]: string }>({});
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [replyOpenId, setReplyOpenId] = useState<number | null>(null);
  const [visibleComments, setVisibleComments] = useState(7);

  const categories = ["Frontend", "Backend", "Fullstack", "DevOps"];

  useEffect(() => {
    const foundPost = postsData.find((p) => p.id === postId);
    if (!foundPost) return router.push("/");

    const commentsWithReplies: CommentWithReplies[] = foundPost.comments.map(c => ({ ...c, replies: [] }));
    setPost({ ...foundPost, comments: commentsWithReplies });

    setEditedTitle(foundPost.title);
    setEditedContent(foundPost.content);
    setEditedCategory(foundPost.category);
    setEditedImage(foundPost.image);
    setEditedVideo(foundPost.video);
  }, [postId, router]);

  if (!post) return null;

  const toggleLike = () => {
    const updatedPost = { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 };
    setPost(updatedPost);
    updatePostById(post.id, { liked: updatedPost.liked, likes: updatedPost.likes });
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    const newComment: CommentWithReplies = { id: Date.now(), text: commentText, replies: [] };
    const updatedComments = [...post.comments, newComment];
    setPost({ ...post, comments: updatedComments });
    setCommentText("");
    updatePostById(post.id, { comments: updatedComments });
  };

  const addNestedReply = (parentId: number, text: string) => {
    if (!text.trim()) return;
    const addReplyRecursive = (replies: NestedReply[]): NestedReply[] =>
      replies.map(r => r.id === parentId ? { ...r, replies: [...r.replies, { id: Date.now(), text, replies: [] }] } : { ...r, replies: addReplyRecursive(r.replies) });

    const updatedComments = post.comments.map(c =>
      c.id === parentId ? { ...c, replies: [...c.replies, { id: Date.now(), text, replies: [] }] } : { ...c, replies: addReplyRecursive(c.replies) }
    );

    setPost({ ...post, comments: updatedComments });
    setReplyTexts(prev => ({ ...prev, [parentId]: "" }));
    setReplyOpenId(null);
    updatePostById(post.id, { comments: updatedComments });
  };

  const deleteReplyRecursive = (replies: NestedReply[], replyId: number): NestedReply[] =>
    replies.filter(r => r.id !== replyId).map(r => ({ ...r, replies: deleteReplyRecursive(r.replies, replyId) }));

  const deleteReply = (replyId: number) => {
    const updatedComments = post.comments.map(c => ({ ...c, replies: deleteReplyRecursive(c.replies, replyId) }));
    setPost({ ...post, comments: updatedComments });
    setMenuOpenId(null);
    updatePostById(post.id, { comments: updatedComments });
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Text copied!");
    setMenuOpenId(null);
  };

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

  const saveEdit = () => {
    const updated = {
      title: editedTitle,
      content: editedContent,
      category: editedCategory,
      image: editedImage,
      video: editedVideo,
    };
    setPost({ ...post, ...updated });
    updatePostById(post.id, updated);
    setEditMode(false);
  };

  const renderReplies = (replies: NestedReply[], level = 1) => replies.map(r => (
    <div key={r.id} className="space-y-1">
      <div className="flex justify-between items-center pl-4" >
        <span>{r.text}</span>
        <div className="relative">
          <MoreHorizontal size={16} className="cursor-pointer text-gray-500" onClick={() => setMenuOpenId(menuOpenId === r.id ? null : r.id)} />
          {menuOpenId === r.id && (
            <div className="absolute right-0 top-5 bg-white dark:bg-slate-700 border rounded shadow-md w-32 z-10">
              <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={() => { if(confirm("Delete this reply?")) deleteReply(r.id); }}>Delete</button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={() => { setReplyOpenId(r.id); setMenuOpenId(null); }}>Reply</button>
              <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={() => copyText(r.text)}>Copy</button>
            </div>
          )}
        </div>
      </div>

      {replyOpenId === r.id && (
        <div className="flex gap-2 mt-1 pl-4">
          <Input
            type="text"
            placeholder="Write a reply..."
            value={replyTexts[r.id] || ""}
            onChange={(e) => setReplyTexts(prev => ({ ...prev, [r.id]: e.target.value }))}
            onKeyDown={(e) => { if(e.key === "Enter") addNestedReply(r.id, replyTexts[r.id]); }}
            className="flex-1 p-1 border rounded text-sm"
          />
          <Button className="p-2 bg-blue-600 rounded text-white flex items-center justify-center" onClick={() => addNestedReply(r.id, replyTexts[r.id])}>
            <Send size={16} />
          </Button>
        </div>
      )}

      {r.replies.length > 0 && renderReplies(r.replies, level + 1)}
    </div>
  ));

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 mt-20">
      {editMode ? (
        <div className="space-y-2">
          <Input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} className="w-full border rounded px-2 py-1 text-lg font-bold" />
          <Textarea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} className="w-full border rounded px-2 py-1 text-sm" rows={3} />
          <div className="flex flex-wrap gap-2 mt-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setEditedCategory(cat)} className={`px-3 py-1 rounded ${editedCategory===cat?'bg-blue-600 text-white':'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-slate-300'}`}>{cat}</button>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-1 cursor-pointer text-sm bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
              <UploadCloud size={16} /> Select Image
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
            {editedImage && (
              <div className="relative">
                <img src={editedImage} className="max-h-40 rounded" alt="preview" />
                <Button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setEditedImage(undefined)}><X size={12} /></Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-1 cursor-pointer text-sm bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
              <UploadCloud size={16} /> Select Video
              <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
            </label>
            {editedVideo && (
              <div className="relative">
                <video controls className="max-h-40 rounded"><source src={editedVideo} /></video>
                <Button className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1" onClick={() => setEditedVideo(undefined)}><X size={12} /></Button>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={saveEdit}>Save</button>
            <button className="px-3 py-1 bg-gray-400 text-white rounded" onClick={()=>setEditMode(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-xl font-bold">{post.title}</h1>
          <p className="text-sm text-slate-500">{post.category} • {post.date}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">{post.content}</p>
          {post.image && <img src={post.image} alt="post image" className="w-full max-h-100 object-cover rounded-lg" />}
          {post.video && <video controls className="w-full max-h-100 rounded-lg mt-2"><source src={post.video} /></video>}
          <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded" onClick={()=>setEditMode(true)}>Edit Post</button>
        </>
      )}

      <div className="flex gap-4 items-center mt-2">
        <button className={`flex items-center gap-1 ${post.liked?'text-red-500':'text-slate-600'}`} onClick={toggleLike}>
          <Heart size={18} fill={post.liked?'red':'none'} /> {post.likes}
        </button>
      </div>

      <div className="space-y-2 mt-4">
        <h2 className="font-semibold">Comments</h2>
        {post.comments.slice(0, visibleComments).map(c => (
          <div key={c.id} className="bg-slate-100 dark:bg-slate-800 p-2 rounded text-sm space-y-1 relative">
            <div className="flex justify-between items-center">
              <span>{c.text}</span>
              <div className="relative">
                <MoreHorizontal size={16} className="cursor-pointer text-gray-500" onClick={()=>setMenuOpenId(menuOpenId===c.id?null:c.id)} />
                {menuOpenId===c.id && (
                  <div className="absolute right-0 top-5 bg-white dark:bg-slate-700 border rounded shadow-md w-32 z-10">
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={()=>{ if(confirm("Delete this comment?")) { const updated = post.comments.filter(cm=>cm.id!==c.id); setPost({...post, comments:updated}); updatePostById(post.id,{comments:updated}); } setMenuOpenId(null); }}>Delete</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={()=>{ setReplyOpenId(c.id); setMenuOpenId(null); }}>Reply</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600 text-sm" onClick={()=>copyText(c.text)}>Copy</button>
                  </div>
                )}
              </div>
            </div>

            {replyOpenId===c.id && (
              <div className="flex gap-2 mt-1">
                <input type="text" placeholder="Write a reply..." value={replyTexts[c.id]||""} onChange={e=>setReplyTexts(prev=>({...prev,[c.id]:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter") addNestedReply(c.id, replyTexts[c.id])}} className="flex-1 p-1 border rounded text-sm" />
                <Button className="p-2 bg-blue-600 rounded text-white flex items-center justify-center" onClick={()=>addNestedReply(c.id, replyTexts[c.id])}><Send size={16}/></Button>
              </div>
            )}

            {renderReplies(c.replies)}
          </div>
        ))}

        {visibleComments < post.comments.length && <button className="flex items-center justify-center gap-1 mt-2 text-blue-600" onClick={()=>setVisibleComments(prev=>prev+7)}>Show More Comments <ChevronDown size={16}/></button>}

        <div className="flex gap-2 mt-2">
          <input type="text" placeholder="Write a comment..." value={commentText} onChange={e=>setCommentText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter") addComment()}} className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addComment}>Post</button>
        </div>
      </div>
    </div>
  );
}
