'use client';

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCategories, fetchPostsByCategory, Post, Category } from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<number>(0); // 0 = all categories
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch categories on mount
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories([{ id: 0, title: "All Categories" }, ...data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    getCategories();
  }, []);

  // Fetch posts whenever category or sortOrder changes
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        const data = await fetchPostsByCategory(category, sortOrder);
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [category, sortOrder]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors duration-300 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Our Blog
          </h1>

          <div className="flex flex-wrap gap-4">
            <Select value={category.toString()} onValueChange={(value) => setCategory(Number(value))}>
              <SelectTrigger className="w-48 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
              <SelectTrigger className="w-48 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-sm">
                <SelectValue placeholder="Sort order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
              No posts found.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={{ ...post, content: post.content.slice(0, 150) + "..." }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
