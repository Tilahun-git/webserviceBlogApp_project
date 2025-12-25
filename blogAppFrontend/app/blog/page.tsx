'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Select } from 'flowbite-react';

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
  likes?: number;
  comments?: number;
}

interface BlogPageProps {
  currentUser?: { id: string; username: string } | null;
}

export default function BlogPage({ currentUser }: BlogPageProps) {
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
            likes: p.likes,
            comments: p.comments,
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
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-neutral-900 py-20 px-4 sm:px-6 lg:px-8 mb-20">
      <div className="max-w-5xl mx-auto">
        {/* Header + Sort */}
        <div className="flex justify-between items-center gap-10 mb-6 flex-wrap">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>

          <Select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="border border-gray-400 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded px-3 py-1"
          >
            <option value="desc">Newest</option>
            <option value="asc">Oldest</option>
          </Select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <Button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No posts found.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} currentUser={currentUser} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
