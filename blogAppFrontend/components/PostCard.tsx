'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card'; 
import { Badge } from './ui/badge';

interface PostCardProps {
  post: {
    _id: string;
    title: string;
    content: string;
    category: string;
    createdAt: string;
    author: {
      username: string;
      profilePicture?: string;
    };
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card className="w-full sm:w-[48%] lg:w-[30%] hover:shadow-lg transition-shadow duration-200">
      {/* Author */}
      <div className="flex items-center gap-2 mb-3">
        <Image
          src={post.author.profilePicture || '/avatar.png'}
          alt={post.author.username}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <span className="text-sm font-semibold">@{post.author.username}</span>
      </div>

      {/* Post Title */}
      <Link href={`/post/${post._id}`} className="block">
        <h2 className="text-lg font-semibold hover:text-teal-500 mb-2">{post.title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
      </Link>

      {/* Footer */}
      <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-xs">
        <span className="capitalize">{post.category}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </Badge>
      </div>
    </Card>
  );
}
