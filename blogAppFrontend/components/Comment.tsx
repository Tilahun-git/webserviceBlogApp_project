"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ThumbsUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

/* ================= TYPES ================= */

type CommentData = {
  _id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  likes: string[];
};

type UserData = {
  username: string;
  profilePicture?: string;
};

type CurrentUser = {
  _id: string;
  isAdmin?: boolean;
};

type CommentProps = {
  comment: CommentData;
  onLike: (commentId: string) => void;
  onEdit: (comment: CommentData, editedContent: string) => void;
  onDelete: (commentId: string) => void;
};

/* ================= COMPONENT ================= */

export default function Comment({
  comment,
  onLike,
  onEdit,
  onDelete,
}: CommentProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

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
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${comment.userId}`
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
    if (!editedContent.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/comment/editComment/${comment._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
        }
      );

      if (res.ok) {
        onEdit(comment, editedContent);
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const isLiked = !!currentUser && comment.likes.includes(currentUser._id);

  const canEditOrDelete =
    !!currentUser &&
    (currentUser._id === comment.userId || currentUser.isAdmin);

  /* ================= UI ================= */

  return (
    <div className="flex gap-4 p-4 border-b text-sm">
      {/* Avatar */}
      <Image
        src={user?.profilePicture || "/avatar.png"}
        alt={user?.username || "user"}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            @{user?.username || "anonymous"}
          </span>
          <span>
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Content */}
        {isEditing ? (
          <>
            <Textarea
              className="mt-2"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />

            <div className="flex justify-end gap-2 mt-2">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(comment.content);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-muted-foreground">{comment.content}</p>

            <div className="flex items-center gap-4 mt-3 text-xs">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLike(comment._id)}
                className={isLiked ? "text-blue-500" : ""}
              >
                <ThumbsUp className="w-4 h-4 mr-1" />
                {comment.likes.length}
              </Button>

              {canEditOrDelete && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(comment._id)}
                    className="text-red-500"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
