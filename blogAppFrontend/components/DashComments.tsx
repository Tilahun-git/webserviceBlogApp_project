"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "flowbite-react";
import { AlertCircle } from "lucide-react";

interface Comment {
  _id: string;
  content: string;
  numberOfLikes: number;
  postId: string;
  userId: string;
  updatedAt: string;
}

const PAGE_SIZE = 10;

export default function DashComments() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser) as { isAdmin?: boolean; [key: string]: unknown };
  const [comments, setComments] = useState<Comment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalComments, setTotalComments] = useState<number>(0);

  // Fetch comments
  const fetchComments = async (page: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comment/getcomments?page=${page}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments);
        setTotalComments(data.total || 0);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message || "Error fetching comments");
    }
  };

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    const t = setTimeout(() => {
      fetchComments(page);
    }, 0);
    return () => clearTimeout(t);
  }, [currentUser?.isAdmin, page]);

  // Delete comment
  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comment/deleteComment/${commentIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentIdToDelete));
        setShowModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(message || "Error deleting comment");
    }
  };

  // Filter comments by search
  const filteredComments = useMemo(
    () =>
      comments.filter(
        (c) =>
          c.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.postId.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [comments, searchTerm]
  );

  const totalPages = Math.ceil(totalComments / PAGE_SIZE);

  if (!currentUser?.isAdmin) return <p>You are not authorized to view this page.</p>;

  return (
    <div className="p-3 overflow-x-auto">
      {/* Search + Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <Input
          placeholder="Search by content, userId, or postId..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            color="gray"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            color="gray"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Comments Table */}
      <Table className="shadow-md">
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Content</th>
            <th>Likes</th>
            <th>Post ID</th>
            <th>User ID</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredComments.map((comment) => (
            <tr key={comment._id} className="bg-white dark:bg-gray-800 dark:border-gray-700">
              <td>{new Date(comment.updatedAt).toLocaleDateString()}</td>
              <td>{comment.content}</td>
              <td>{comment.numberOfLikes}</td>
              <td>{comment.postId}</td>
              <td>{comment.userId}</td>
              <td>
                <span
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setCommentIdToDelete(comment._id);
                  }}
                >
                  Delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this comment?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteComment}>
              Yes, I&apos;m sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
