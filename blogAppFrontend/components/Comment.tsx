// components/Comment.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ================= TYPES ================= */

// Align with your Post interface structure
type CommentData = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt: string;
  likes: number[];
};

type UserData = {
  id: number;
  username: string;
  profilePicture?: string;
};

type CurrentUser = {
  id: number;
  isAdmin?: boolean;
};

type CommentProps = {
  comment: CommentData;
  postId: number;
  onLike: (commentId: number) => void;
  onEdit: (comment: CommentData, editedContent: string) => void;
  onDelete: (commentId: number) => void;
};

/* ================= COMPONENT ================= */

export default function Comment({
  comment,
  postId,
  onLike,
  onEdit,
  onDelete,
}: CommentProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const currentUser: CurrentUser | null = useSelector(
    (state: { user: { currentUser: CurrentUser | null } }) =>
      state.user.currentUser
  );

  /* ================= FETCH USER ================= */

  useEffect(() => {
    let isMounted = true;

    async function fetchUser() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${comment.userId}`
        );
        if (!res.ok) return;
        const data: UserData = await res.json();
        if (isMounted) setUser(data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    }

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, [comment.userId]);

  /* ================= HANDLERS ================= */

  const handleSave = async () => {
    if (!editedContent.trim() || !postId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            content: editedContent,
            postId: postId
          }),
        }
      );

      if (res.ok) {
        onEdit(comment, editedContent);
        setIsEditing(false);
      } else {
        const error = await res.json();
        console.error("Edit failed:", error);
      }
    } catch (err) {
      console.error("Edit failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !postId || isLiking) return;
    
    setIsLiking(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment.id}/like`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            postId: postId,
            userId: currentUser.id
          }),
        }
      );

      if (res.ok) {
        onLike(comment.id);
      } else {
        const error = await res.json();
        console.error("Like failed:", error);
      }
    } catch (err) {
      console.error("Like failed", err);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments/${comment.id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: postId }),
        }
      );

      if (res.ok) {
        onDelete(comment.id);
      } else {
        const error = await res.json();
        console.error("Delete failed:", error);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const isLiked = currentUser?.id && comment.likes.includes(currentUser.id);

  const canEditOrDelete =
    currentUser &&
    (currentUser.id === comment.userId || currentUser.isAdmin);

  /* ================= UI ================= */

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="relative w-10 h-10">
          <Image
            src={user?.profilePicture || "/avatar.png"}
            alt={user?.username || "user"}
            fill
            className="rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
            sizes="40px"
          />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            @{user?.username || "anonymous"}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
          {comment.userId === currentUser?.id && (
            <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              You
            </span>
          )}
          {currentUser?.isAdmin && (
            <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
              Admin
            </span>
          )}
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              className="w-full min-h-[80px]"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Edit your comment..."
              disabled={isSubmitting}
            />
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSubmitting || !editedContent.trim()}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap break-words">
              {comment.content}
            </p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={!currentUser || isLiking}
                className={`flex items-center gap-1.5 px-2 py-1 h-8 min-w-[70px] transition-all ${
                  isLiked
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                } ${isLiking ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <ThumbsUp 
                  className={`w-4 h-4 ${isLiking ? "animate-pulse" : ""}`} 
                  fill={isLiked ? "currentColor" : "none"} 
                />
                <span className="text-sm font-medium">
                  {comment.likes.length}
                </span>
              </Button>

              {canEditOrDelete && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="px-2 py-1 h-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="px-2 py-1 h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}