'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import CommentSection from '@/components/CommentSection';
import { Badge } from '@/components/ui/badge';

interface Author {
  username: string;
  profilePicture?: string;
}

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: Author;
}

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  category: { name: string };
  author: Author;
  comments: Comment[];
}

export default function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);

        // Optional: increment view count
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/view`,
          { method: 'PUT' }
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`
        );

        if (!res.ok) throw new Error('Post not found');

        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 dark:text-gray-400">
        Post not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        
        {/* Author */}
        <div className="flex items-center gap-4 mb-4">
          <Image
            src={post.author.profilePicture || '/avatar.png'}
            alt={post.author.username}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              @{post.author.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <Badge variant="secondary">{post.category.name}</Badge>
          <span>👁 {post.viewCount}</span>
        </div>

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none mb-10 whitespace-pre-line">
          {post.content}
        </article>

        {/* Comments */}
        <CommentSection postId={post.id.toString()} />
      </div>
    </div>
  );
}
