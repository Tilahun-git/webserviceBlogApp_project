'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from './ui/badge';
import * as motion from 'motion/react-client';

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
    likes?: number;
    comments?: number;
  };
  currentUser?: { id: string; username: string } | null;
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);

  const handleLikeClick = () => {
    if (!currentUser) return router.push('/auth/sign-in');
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));

    // Optional: send to backend
    // fetch(`/api/posts/${post._id}/like`, { method: 'POST' });
  };

  const handleCommentClick = () => {
    if (!currentUser) {
     return router.push(`/auth/sign-in?callbackUrl=/posts/${post._id}`);
  }
  router.push(`/posts/${post._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-card/50 backdrop-blur-xs py-0">
        <CardHeader className="p-0 relative">
          {/* Card Image */}
          <div className="w-full h-48 relative">
            <Image
              fill
              src={post.author.profilePicture || '/default-user.png'}
              alt={post.author.username}
              className="object-cover"
            />
          </div>

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-background/80 backdrop-blur-xs"
            >
              {post.category}
            </Badge>
          </div>

          {/* Author Info */}
          <div className="absolute bottom-2 left-4 flex items-center gap-2 bg-background/70 backdrop-blur-xs p-1 rounded">
            <Image
              src={post.author.profilePicture || '/default-user.png'}
              alt={post.author.username}
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="text-sm font-medium">{post.author.username}</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-4">
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>

          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
            {post.title}
          </h3>

          <p className="text-muted-foreground mb-4 line-clamp-3">
            {post.content}
          </p>

          <div className="flex items-center justify-between mt-2">
            {/* Like & Comment */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleLikeClick}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    liked ? 'text-red-500' : 'text-gray-400'
                  }`}
                />
                <span>{likesCount}</span>
              </div>

              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={handleCommentClick}
              >
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <span>{post.comments || 0}</span>
              </div>
            </div>

            {/* Read More */}
            <div className="flex items-center text-primary font-medium group-hover:underline">
              Read more <ArrowRight className="ml-1 w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
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
