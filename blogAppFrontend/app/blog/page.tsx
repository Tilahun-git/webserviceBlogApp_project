
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
import {
  fetchCategories,
  fetchPostsByCategory,
  searchPosts,
  Post,
  Category,
} from "@/lib/api";

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState<number>(0); // 0 = all
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 🔑 SEARCH STATES
  const [inputValue, setInputValue] = useState("");   // typing only
  const [searchQuery, setSearchQuery] = useState(""); // confirmed search

  // Fetch categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories([{ id: 0, title: "All Categories" }, ...data]);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    getCategories();
  }, []);

  // Fetch posts (category / sort / confirmed search)
  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        let data: Post[];

        if (searchQuery.trim()) {
          data = await searchPosts(searchQuery, sortOrder);
        } else {
          data = await fetchPostsByCategory(category, sortOrder);
        }

        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [category, sortOrder, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 py-20 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Blog Posts
          </h1>

          {/* SEARCH (controlled + submit) */}
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search posts..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchQuery(inputValue.trim());
                }
              }}
              className="w-full sm:w-72 px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            />

            <button
              onClick={() => setSearchQuery(inputValue.trim())}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Select
            value={category.toString()}
            onValueChange={(v) => setCategory(Number(v))}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id.toString()}>
                  {cat.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sortOrder}
            onValueChange={(v) => setSortOrder(v as "asc" | "desc")}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">
              No posts found.
            </p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  ...post,
                  content: post.content.slice(0, 150) + "...",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
