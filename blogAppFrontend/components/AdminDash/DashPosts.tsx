"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Table } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Modal } from "flowbite-react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import PostFormModal from "@/components/PostFormModal";

interface Post {
  _id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  updatedAt: string;
}

interface User {
  _id: string;
  isAdmin?: boolean;
}

const PAGE_SIZE = 10;

export default function DashPosts() {
  const currentUser = useSelector((state: { user?: { currentUser?: User } }) => state.user?.currentUser);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Fetch posts
  // fetchPosts moved into useEffect to avoid changing dependencies

  useEffect(() => {
    const fetchPosts = async (page: number) => {
      try {
        const url = currentUser?.isAdmin
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/getposts?page=${page}&limit=${PAGE_SIZE}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/getposts?userId=${currentUser?._id}&page=${page}&limit=${PAGE_SIZE}`;
        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.total || 0);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Error fetching posts", error);
        }
      }
    };

    if (currentUser?.isAdmin) {
      fetchPosts(page);
    }
  }, [currentUser?._id, currentUser?.isAdmin, page]);

  const openEdit = (post: Post) => {
    setSelectedPost(post);
    setEditOpen(true);
  };

  const handleSaveEdit = async (data: Partial<Post>) => {
    if (!selectedPost) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/updatepost/${selectedPost._id}/${currentUser?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      const updatedPost = await res.json();
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
        );
        setEditOpen(false);
        setSelectedPost(null);
      } else {
        console.error(updatedPost.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error) || "Error updating post");
      }
    }
  };

  // Delete post
  const handleDeletePost = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/deletepost/${postIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setShowModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Error deleting post");
      }
    }
  };

  // Filter posts by search
  const filteredPosts = useMemo(
    () =>
      posts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [posts, searchTerm]
  );

  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);

  if (!currentUser?.isAdmin) return <p>You are not authorized to view this page.</p>;

  return (
    <div className="p-3 overflow-x-auto">
      {/* Search + Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered max-w-sm"
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

      {/* Posts Table */}
      <Table className="shadow-md">
        <thead>
          <tr>
            <th>Date Updated</th>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Delete</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredPosts.map((post) => (
            <tr key={post._id} className="bg-white dark:bg-gray-800 dark:border-gray-700">
              <td>{new Date(post.updatedAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/post/${post.slug}`}>
                  {/* <Image
                    src={post.image}
                    alt={post.title}
                    className="w-20 h-10 object-cover bg-gray-500"
                  /> */}
                </Link>
              </td>
              <td>
                <Link
                  className="font-medium text-gray-900 dark:text-white hover:underline"
                  href={`/post/${post.slug}`}
                >
                  {post.title}
                </Link>
              </td>
              <td>{post.category}</td>
              <td>
                <span
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                  onClick={() => {
                    setShowModal(true);
                    setPostIdToDelete(post._id);
                  }}
                >
                  Delete
                </span>
              </td>
              <td>
                <span
                  onClick={() => openEdit(post)}
                  className="font-medium text-blue-500 hover:underline cursor-pointer"
                >
                  Edit
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Post Modal */}
      <PostFormModal
        post={selectedPost}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedPost(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this post?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeletePost}>
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
