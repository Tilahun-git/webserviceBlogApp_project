// app/post/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
<<<<<<< HEAD
import { useSelector } from 'react-redux';
import { Spinner } from '@/components/ui/spinner';
import CommentSection from '@/app/admin/CommentSection';
=======
import { Calendar, Heart, MessageCircle, Share2, Bookmark, Clock, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { Spinner } from '@/components/ui/spinner';
>>>>>>> main
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/CommentSection';
import { Post, toggleLikePost } from '@/lib/api';
import { toast } from 'sonner';

<<<<<<< HEAD
interface Author {
  username: string;
  profilePicture?: string;
}

interface Post {
  id: number | string;
  title: string;
  content: string;
  createdAt: string;
  viewCount: number;
  category: { name: string };
  author: Author;
  likes?: number;
  comments?: number;
}

// Define your Redux RootState type
interface CurrentUser {
  _id: string;
  username: string;
  profilePicture: string;
}

interface RootState {
  user: {
    currentUser: CurrentUser | null;
  };
}
=======
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:8080';
>>>>>>> main

export default function PostDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
<<<<<<< HEAD

  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser
  );
=======
>>>>>>> main

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (!id) {
      console.error('No post ID found in URL');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD

        // Increment view count
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/view`, {
          method: 'PUT',
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
        if (!res.ok) throw new Error('Post not found');

        const data: Post = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
=======
        const res = await axios.get<Post>(
          `${API_BASE_URL}/api/posts/public/${id}`,
          { withCredentials: true }
        );

        setPost(res.data);
        setLikes(res.data.likeCount);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        toast.error('Failed to load post');
        
        if (err.response?.status === 404) {
          toast.error('Post not found');
        }
        
>>>>>>> main
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = async () => {
    const userId = undefined; // TODO: get from auth context
    if (!userId) {
      router.push('/auth/sign-in');
      return;
    }

    try {
      const { post: updatedPost, likedByCurrentUser } =
        await toggleLikePost(post!.id, userId);

      setLikes(updatedPost.likeCount);
      setLiked(likedByCurrentUser);
      toast.success(likedByCurrentUser ? 'Liked!' : 'Like removed');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: `Check out this post: ${post?.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      setIsSharing(true);
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsSharing(false), 2000);
    }
  };

  if (loading) {
    return (
<<<<<<< HEAD
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-900">
        <Spinner />
=======
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center">
          <Spinner className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading post...</p>
        </div>
>>>>>>> main
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
        <div className="text-center p-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-4xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            Post Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
            The post you're looking for doesn't exist or may have been removed.
          </p>
          <Button onClick={() => router.push('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const handleCommentClick = () => {
    if (!currentUser) {
      // Redirect to sign-in and return to this post
      router.push(`/sign-in?callbackUrl=/posts/${post.id}`);
    } else {
      // Scroll to comment section
      const el = document.getElementById('comments-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <span
            className="cursor-pointer hover:text-blue-500 flex items-center gap-1"
            onClick={handleCommentClick}
          >
            💬 {post.comments ?? 0}
          </span>
        </div>

        {/* Content */}
        <article className="prose dark:prose-invert max-w-none mb-10 whitespace-pre-line">
          {post.content}
        </article>

        {/* Comment Section */}
        <div id="comments-section">
          <CommentSection postId={post.id.toString()} />
=======
  // Calculate read time (assuming 200 words per minute)
  const wordCount = post.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-teal-600 via-blue-500 to-indigo-600 py-16">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-5xl mx-auto px-4 text-center text-white">
          <Badge className="mb-4 bg-white/20 backdrop-blur-sm text-white border-0 hover:bg-white/30">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white/90">
            <div className="flex items-center gap-3">
              <Image
                src={post.author.profilePicture || '/avatar.png'}
                alt={post.author.username}
                width={40}
                height={40}
                className="rounded-full object-cover border-2 border-white"
              />
              <span className="font-medium">@{post.author.username}</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {readTime} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 -mt-8 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          {post.imageUrl && (
            <div className="relative h-64 md:h-80 lg:h-96">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="p-6 md:p-8 lg:p-10">
            {/* Floating Action Bar */}
            <div className="sticky top-6 mb-8 flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    liked
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                  <span className="font-semibold">{likes}</span>
                </button>

                <button
                  onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <MessageCircle size={20} />
                  <span className="font-semibold">Comment</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmark}
                  className={`rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 ${
                    isBookmarked ? 'text-amber-500' : ''
                  }`}
                >
                  <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className={`rounded-full hover:bg-green-50 dark:hover:bg-green-900/20 ${
                    isSharing ? 'text-green-500' : ''
                  }`}
                >
                  <Share2 size={20} />
                </Button>
              </div>
            </div>

            {/* Article Content */}
            <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
              <div className="whitespace-pre-line leading-relaxed text-gray-700 dark:text-gray-300 text-lg">
                {post.content}
              </div>
            </article>

            {/* Category Badge */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Category
              </h3>
              <Badge variant="secondary" className="px-4 py-2 text-base">
                {post.category}
              </Badge>
            </div>

            {/* Author Card */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mb-12 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Image
                  src={post.author.profilePicture || '/avatar.png'}
                  alt={post.author.username}
                  width={100}
                  height={100}
                  className="rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg flex-shrink-0"
                />
                <div className="text-center sm:text-left">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {post.author.username}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Author & Content Creator
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Passionate about sharing knowledge and experiences through writing.
                    Follow for more insightful content.
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div id="comments" className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Comments
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => document.getElementById('comment-input')?.focus()}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Add Comment
                </Button>
              </div>
              {/* Convert post.id to number for CommentSection */}
              <CommentSection postId={Number(post.id)} />
            </div>
          </div>
        </div>

        {/* Back to Blog Button */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/blog')}
            className="px-8 py-6 text-lg rounded-xl group hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="mr-3 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
        </div>

        {/* Post Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {likes}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Likes</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {readTime}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Min Read</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {wordCount}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Words</div>
          </div>
>>>>>>> main
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
        
=======
}
>>>>>>> main
