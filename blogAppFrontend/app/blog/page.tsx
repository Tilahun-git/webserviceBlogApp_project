"use client";

<<<<<<< HEAD
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
=======
import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Calendar, RefreshCw, X } from "lucide-react";
import { useRouter } from "next/navigation";
import PostCard from "@/components/PostCard";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchCategories,
  fetchPostsByCategory,
  fetchAllPosts, // Added import
  searchPosts,
  Post,
  Category,
} from "@/lib/api";

export default function BlogPage() {
  const router = useRouter();
>>>>>>> main
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD
  const [category, setCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = ['all', 'reactjs', 'nextjs', 'javascript'];
=======
  const [category, setCategory] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
>>>>>>> main

  // Fetch categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
<<<<<<< HEAD
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
=======
        const data = await fetchCategories();
        setCategories([{ id: 0, title: "All Categories" }, ...data]);
>>>>>>> main
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    loadCategories();
  }, []);

  // Fetch posts based on current state
  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      let data: Post[];
      
      if (searchQuery.trim()) {
        // Search mode
        data = await searchPosts(searchQuery, sortOrder);
      } else if (category === 0) {
        // All categories mode
        data = await fetchAllPosts(sortOrder);
      } else {
        // Specific category mode
        data = await fetchPostsByCategory(category, sortOrder);
      }
      
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  }, [category, sortOrder, searchQuery]);

  // Initial load and when dependencies change
  useEffect(() => {
    const timer = setTimeout(() => {
      loadPosts();
    }, 300); // Debounce search
    return () => clearTimeout(timer);
  }, [loadPosts]);

  const handleClearSearch = () => {
    setInputValue("");
    setSearchQuery("");
    setCategory(0);
  };

  // Refresh function - reloads ALL posts from ALL categories
  const handleRefresh = () => {
    setLoading(true);
    // Reset to default state
    setSearchQuery("");
    setInputValue("");
    setCategory(0);
    
    // Force reload all posts
    fetchAllPosts(sortOrder)
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to refresh posts", err);
        setLoading(false);
      });
  };

  // Handle create post button click - redirect to sign in
  const handleCreatePost = () => {
    router.push("/auth/sign-in");
  };

  // Handle category change
  const handleCategoryChange = (newCategory: number) => {
    setCategory(newCategory);
    // Clear search when changing category
    setSearchQuery("");
    setInputValue("");
  };

  // Loading state
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800 flex flex-col items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner className="w-12 h-12 text-teal-600 mx-auto" />
          <p className="text-gray-600 dark:text-gray-300">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-900 dark:to-neutral-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 py-16 md:py-20">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Discover Amazing
              <span className="block text-teal-100">Blog Posts</span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Explore insightful articles, tutorials, and stories from our vibrant community
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
              <Input
                type="search"
                placeholder="Search articles, topics, or authors..."
                className="pl-12 pr-12 py-6 rounded-2xl text-lg border-0 shadow-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchQuery(inputValue.trim());
                    setCategory(0); // Reset category when searching
                  }
                }}
              />
              {inputValue && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => {
                  setSearchQuery(inputValue.trim());
                  setCategory(0); // Reset category when searching
                }}
                className="px-8 py-6 rounded-xl bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 transition-all hover:scale-105"
              >
                <Search className="mr-2" size={18} />
                Search Posts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header with Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Latest Articles"}
              </h2>
              {loading && <Spinner className="w-4 h-4" />}
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery 
                ? `${posts.length} post${posts.length !== 1 ? 's' : ''} found` 
                : category === 0 
                  ? "All posts from all categories"
                  : `Posts in ${categories.find(c => c.id === category)?.title || "selected category"}`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-lg px-4"
              >
                Grid
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-lg px-4"
              >
                List
              </Button>
            </div>

            {/* Sort */}
            <Select
              value={sortOrder}
              onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
            >
              <SelectTrigger className="w-44">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {sortOrder === "desc" ? "Newest First" : "Oldest First"}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="asc">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Oldest First
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="rounded-xl border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
              disabled={loading}
              title="Refresh all posts"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Browse by Category
          </h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Desktop - Select Option */}
            <div className="hidden sm:block w-full max-w-md">
              <Select
                value={category.toString()}
                onValueChange={(v) => handleCategoryChange(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Filter size={16} />
                      {categories.find(c => c.id === category)?.title || "Select Category"}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Mobile - Badges */}
            <div className="sm:hidden">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={category === 0 ? "default" : "outline"}
                  className={`px-3 py-1.5 text-xs cursor-pointer ${
                    category === 0
                      ? "bg-teal-600 text-white"
                      : ""
                  }`}
                  onClick={() => handleCategoryChange(0)}
                >
                  All
                </Badge>
                {categories.slice(0, 3).map((cat) => (
                  <Badge
                    key={cat.id}
                    variant={category === cat.id ? "default" : "outline"}
                    className={`px-3 py-1.5 text-xs cursor-pointer ${
                      category === cat.id
                        ? "bg-teal-600 text-white"
                        : ""
                    }`}
                    onClick={() => handleCategoryChange(cat.id)}
                  >
                    {cat.title.length > 15 ? cat.title.substring(0, 15) + "..." : cat.title}
                  </Badge>
                ))}
                {categories.length > 3 && (
                  <Select
                    value={category.toString()}
                    onValueChange={(v) => handleCategoryChange(Number(v))}
                  >
                    <SelectTrigger className="w-auto">
                      <SelectValue>
                        <Badge variant="outline" className="px-3 py-1.5 text-xs">
                          More...
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(3).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid/List */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {searchQuery ? (
                <Search className="text-4xl text-gray-500 dark:text-gray-400" />
              ) : (
                <div className="text-4xl text-gray-500 dark:text-gray-400">📝</div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
              {searchQuery ? "No results found" : "No posts available"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchQuery
                ? `We couldn't find any posts matching "${searchQuery}". Try a different search term.`
                : "There are no posts available yet. Be the first to create one!"}
            </p>
            <Button
              variant="outline"
              onClick={handleClearSearch}
              className="px-6 py-2 rounded-lg hover:shadow-md transition-shadow mr-2"
            >
              {searchQuery ? "Clear Search" : "Refresh"}
            </Button>
            <Button
              variant="default"
              onClick={handleCreatePost}
              className="px-6 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
            >
              Create First Post
            </Button>
          </div>
        ) : (
          <>
            {/* Posts Display */}
            <div className={`gap-6 ${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col"}`}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                />
              ))}
            </div>

            {/* Load More (if pagination implemented) */}
            {posts.length >= 9 && (
              <div className="text-center mt-16">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-xl text-lg hover:shadow-lg transition-shadow hover:scale-105"
                  onClick={() => {
                    // TODO: Implement pagination
                    console.log('Load more posts');
                  }}
                >
                  Load More Posts
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-2xl p-8 text-center border border-teal-200 dark:border-teal-800">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Want to share your own story?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Join our community of writers and share your knowledge with thousands of readers.
          </p>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg"
            onClick={handleCreatePost}
          >
            Create a Post
          </Button>
>>>>>>> main
        </div>
      </div>
    </div>
  );
}