"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import Comment from "./Comment";

/* ================= TYPES ================= */

interface CommentSectionProps {
  postId: string;
}

interface CommentType {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  createdAt: string;
}

interface CurrentUser {
  _id: string;
  username: string;
  profilePicture: string;
}

/* ================= COMPONENT ================= */

export default function CommentSection({ postId }: CommentSectionProps) {
  const router = useRouter();

  const currentUser: CurrentUser | null = useSelector(
    (state: { user: { currentUser: CurrentUser | null } }) =>
      state.user.currentUser
  );

  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  /* ================= FETCH COMMENTS ================= */

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/comment/getPostComments/${postId}`
        );
        if (!res.ok) return;
        const data: CommentType[] = await res.json();
        setComments(data);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      }
    }

    fetchComments();
  }, [postId]);

  /* ================= CREATE COMMENT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!commentText.trim()) return;
    if (!currentUser) return router.push("/sign-in");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: commentText,
            postId,
            userId: currentUser._id,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setComments((prev) => [data, ...prev]);
      setCommentText("");
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  /* ================= LIKE COMMENT ================= */

  const handleLike = async (commentId: string) => {
    if (!currentUser) return router.push("/sign-in");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/likeComment/${commentId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!res.ok) return;

      const data = await res.json();

      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, likes: data.likes } : c))
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  /* ================= EDIT COMMENT (OPTIMISTIC) ================= */

  const handleEdit = (comment: CommentType, editedContent: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };

  /* ================= DELETE COMMENT ================= */

  const handleDelete = async () => {
    if (!commentToDelete || !currentUser) return;

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/deleteComment/${commentToDelete}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setComments((prev) => prev.filter((c) => c._id !== commentToDelete));
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteDialogOpen(false);
      setCommentToDelete(null);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="max-w-2xl mx-auto w-full p-4">
      {/* User Info */}
      {currentUser ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <span>Signed in as</span>
          <Image
            src={currentUser.profilePicture}
            alt={currentUser.username}
            width={20}
            height={20}
            className="rounded-full"
          />
          <Link
            href="/dashboard?tab=profile"
            className="text-primary hover:underline text-xs"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground mb-5">
          You must be signed in to comment.{" "}
          <Link href="/sign-in" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      )}

      {/* Comment Form */}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border rounded-lg p-4 space-y-3"
        >
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            maxLength={200}
            onChange={(e) => setCommentText(e.target.value)}
          />

          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {200 - commentText.length} characters remaining
            </p>
            <Button type="submit">Submit</Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="text-sm mt-5">No comments yet.</p>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm mt-6 mb-3">
            <span>Comments</span>
            <span className="border rounded px-2 py-0.5">
              {comments.length}
            </span>
          </div>

          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(id: string) => {
                setCommentToDelete(id);
                setDeleteDialogOpen(true);
              }}
            />
          ))}
        </>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete comment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
