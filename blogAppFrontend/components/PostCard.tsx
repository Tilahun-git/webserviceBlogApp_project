'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Calendar, User } from 'lucide-react';
import { Post, toggleLikePost } from '@/lib/api';

interface PostCardProps {
  post: Post;
  userId?: number;
  category?: string;
}

export default function PostCard({ post, userId, category }: PostCardProps) {
  const router = useRouter();
  const [likes, setLikes] = useState(post.likeCount);
  const [liked, setLiked] = useState(false);
  const [isCommentHovered, setIsCommentHovered] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation
    
    if (!userId) {
      router.push('/auth/sign-in');
      return;
    }

    try {
      const { post: updatedPost, likedByCurrentUser } =
        await toggleLikePost(post.id, userId);

      setLikes(updatedPost.likeCount);
      setLiked(likedByCurrentUser);
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!userId) {
      router.push('/auth/sign-in');
      return;
    }
    
    // Navigate to post detail page and scroll to comments
    router.push(`/blog/${post.id}#comments`);
  };

  // Format date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link
      href={`/blog/${post.id}`}
      className="block mb-6 hover:opacity-90 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex flex-col bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:border-teal-200 dark:group-hover:border-teal-800 h-full">

        {/* Image Preview */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden">
          <Image
            src={post.imageUrl || '/placeholder.png'}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Category Badge - Overlay */}
          {category && (
            <div className="absolute top-4 left-4">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-white/20">
                <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {category}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {post.title}
          </h3>

          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4 mt-auto">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full"></div>
              <Image
                src={post.author.profilePicture || '/avatar.png'}
                alt={post.author.username}
                fill
                className="rounded-full object-cover border-2 border-white dark:border-gray-900 p-0.5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center gap-1">
                <User size={12} className="text-gray-500" />
                @{post.author.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <Calendar size={12} />
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                liked
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={liked ? 'Unlike this post' : 'Like this post'}
            >
              <Heart 
                size={18} 
                fill={liked ? 'currentColor' : 'none'} 
                className={liked ? 'animate-pulse-once' : ''}
              />
              <span className="text-sm font-semibold">{likes}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={handleComment}
              onMouseEnter={() => setIsCommentHovered(true)}
              onMouseLeave={() => setIsCommentHovered(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                isCommentHovered
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
              }`}
              aria-label="Comment on this post"
            >
              <MessageCircle 
                size={18} 
                fill={isCommentHovered ? 'currentColor' : 'none'}
              />
              <span className="text-sm font-semibold">Comment</span>
            </button>
          </div>

          {/* Read More Indicator */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                Read more
              </span>
              <span className="text-teal-600 dark:text-teal-400 font-medium group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        .animate-pulse-once {
          animation: pulse-once 0.3s ease-in-out;
        }
      `}</style>
    </Link>
  );
}