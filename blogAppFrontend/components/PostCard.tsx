'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from './ui/badge';

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: string;
    imageUrl: string;
    category: string;
    createdAt: string;
    author: {
      username: string;
      profilePicture?: string | null;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="w-full sm:w-[48%] lg:w-[30%] p-5 hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800 rounded-xl">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <Image
        src={post.imageUrl}
          alt="Not found"
          width={40}
          height={40}
          className="rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            @{post.author.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Title & Content */}
      <Link href={`/post/${post.id}`} className="block">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-teal-500 transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
          {post.content}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex justify-start gap-2 items-center">
        <Badge variant="secondary" className="bg-teal-100 dark:bg-teal-800 text-teal-800 dark:text-teal-100 px-2 py-1 rounded-md text-xs font-medium">
          {post.category}
        </Badge>
      </div>
    </Card>
  );
}
