'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Post {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  author: {
    username: string;
    profilePicture?: string;
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); 

  const categories = ['all', 'reactjs', 'nextjs', 'javascript'];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        params.set('sort', sortOrder);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts?${params}`);
        const data: Post[] = await res.json();

        const mappedPosts: Post[] = data.map((p) => {
          const categoryValue =
            typeof p.category === 'object' && p.category !== null && 'name' in p.category
              ? (p.category as { name?: string }).name ?? String(p.category)
              : String(p.category);

          return {
            _id: p._id,
            title: p.title,
            content: p.content,
            category: categoryValue,
            createdAt: p.createdAt,
            author: p.author,
          };
        });

        setPosts(mappedPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [category, sortOrder]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen  transition-colors duration-300 bg-gray-50 dark:bg-neutral-900
     py-20 px-4 sm:px-6 lg:px-8 mb-20">
      <div className="max-w-5xl mx-auto">
        <div className='flex justify-between items-center gap-10'>
        <h1 className="text-3xl font-bold  mb-6 mr-0 text-gray-900 dark:text-white">
          Blog Posts
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <Select value={category} onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="w-48 border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
            <SelectTrigger className="w-48 border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={{
                  _id: post._id,
                  title: post.title,
                  content: post.content.slice(0, 150) + '...',
                  author: post.author,
                  category: post.category,
                  createdAt: post.createdAt,
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
