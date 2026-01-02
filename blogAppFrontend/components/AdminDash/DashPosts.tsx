'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/api'; // header-based JWT

interface Post {
  id: number;
  title: string;
  content: string;
  categoryTitle: string;
  status: 'Draft' | 'Published' | 'Pending Review' | 'Rejected';
  likes: number;
  comments: number;
  shares: number;
  deleting: boolean; // always default to false
}

export default function PostManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 10;

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async (
        page = 0,
        pageSize = 10,
        sortBy = 'createdAt',
        sortDir = 'asc'
      ) => {
        try {
          const url = `/api/posts/public?pageNumber=${page}&pageSize=${pageSize}&sortBy=${sortBy}&sortDir=${sortDir}`;
          const res = await axiosInstance.get(url);

      if (res.data?.data) {
        // Ensure deleting is always defined
        const fixedPosts: Post[] = res.data.data.map((p: any) => ({
          ...p,
          deleting: false,
        }));
        setPosts(fixedPosts);
        setTotalPages(res.data.data.totalPages ?? 1);
      } else {
        toast.error('Failed to fetch posts');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error fetching posts');
    }
  };

  useEffect(() => {
    fetchPosts(currentPage - 1);
  }, [currentPage]);

 

  const deletePost = async (id: number) => {
    if (!confirm('Delete this post permanently?')) return;

    setPosts(prev => prev.map(p => p.id === id ? { ...p, deleting: true } : p));

    try {
      await axiosInstance.delete(`/api/posts/post/${id}`);
      setPosts(prev => prev.filter(p => p.id !== id));
      toast.success('Post deleted successfully');
    } catch (err: any) {
      console.error(err);
      setPosts(prev => prev.map(p => p.id === id ? { ...p, deleting: false } : p));
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  return (
    <div className="p-3 sm:p-6 w-full">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Post Management</h1>

      <div className="overflow-x-auto">
        <ScrollArea className="h-150 w-full border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-50">Title</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Engagement</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-30">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {posts.length > 0 ? posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-2 sm:px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <div className="min-w-0">
                        <span className="font-medium block truncate">{post.title}</span>
                        <p className="text-sm text-gray-500 truncate">{post.content.slice(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 hidden sm:table-cell">{post.categoryTitle}</td>
                  <td className="px-2 sm:px-4 py-2 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1 text-sm">
                      <span className="mr-2">👍 {post.likes}</span>
                      <span className="mr-2">💬 {post.comments}</span>
                      <span>🔄 {post.shares}</span>
                    </div>
                  </td>
                  <td className="px-2 sm:px-4 py-2 flex flex-col sm:flex-row gap-1 sm:gap-2">
                   
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePost(post.id)}
                      disabled={post.deleting}
                      className="text-xs"
                    >
                      <Trash size={14} className="sm:mr-1" />
                      <span className="hidden sm:inline">{post.deleting ? 'Deleting...' : 'Delete'}</span>
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
        <Button
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
