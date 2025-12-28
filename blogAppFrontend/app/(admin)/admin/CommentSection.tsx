// components/CommentSection.tsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
<<<<<<< HEAD:blogAppFrontend/app/admin/CommentSection.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { AlertTriangle } from "lucide-react";
import Comment from "../../components/Comment";
=======
import Comment from "./Comment";
import { Loader2, Send } from "lucide-react";
>>>>>>> main:blogAppFrontend/components/CommentSection.tsx

type CommentData = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  createdAt: string;
  likes: number[];
};

type CurrentUser = {
  id: number;
  isAdmin?: boolean;
};

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUser: CurrentUser | null = useSelector(
    (state: { user: { currentUser: CurrentUser | null } }) =>
      state.user.currentUser
  );

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comments/post/${postId}`
        );
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  // Handle submit new comment
  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: newComment,
            postId: postId,
            userId: currentUser.id,
          }),
        }
      );

      if (res.ok) {
        const newCommentData: CommentData = await res.json();
        setComments([newCommentData, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle comment like
  const handleLike = async (commentId: number) => {
    if (!currentUser) return;

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              likes: comment.likes.includes(currentUser.id)
                ? comment.likes.filter(id => id !== currentUser.id)
                : [...comment.likes, currentUser.id]
            }
          : comment
      )
    );
  };

  // Handle comment edit
  const handleEdit = (comment: CommentData, editedContent: string) => {
    setComments(prev =>
      prev.map(c =>
        c.id === comment.id ? { ...c, content: editedContent } : c
      )
    );
  };

  // Handle comment delete
  const handleDelete = (commentId: number) => {
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div className="space-y-6">
      {/* Add Comment Form */}
      {currentUser ? (
        <div className="space-y-4">
          <Textarea
            id="comment-input"
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleSubmit();
              }
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Press Ctrl+Enter to submit
            </p>
            <Button
              onClick={handleSubmit}
              disabled={!newComment.trim() || submitting}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={postId}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}