"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { Search, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const HISTORY_KEY = "blog_search_history";

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
}

interface SearchHistoryProps {
  history: string[];
  onClickTerm: (term: string) => void;
  onRemoveTerm: (term: string) => void;
  onClearAll: () => void;
}

function SearchHistory({
  history,
  onClickTerm,
  onRemoveTerm,
  onClearAll,
}: SearchHistoryProps) {
  return (
    <AnimatePresence>
      {history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          className="mt-4 bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg shadow relative max-h-52 overflow-y-auto"
        >
          <div className="text-sm text-gray-500 mb-2 font-semibold">
            Recent Searches
          </div>
          <ul className="space-y-2">
            {history.map((term, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 text-gray-700 dark:text-gray-300 cursor-pointer 
            rounded px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <div
                  onClick={() => onClickTerm(term)}
                  className="flex items-center gap-2 flex-1 select-none"
                >
                  <Clock className="w-4 h-4" />
                  <span>{term}</span>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTerm(term);
                  }}
                  className="p-1 hover:text-red-500 text-red-400" >
                  <X className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
          <button
            onClick={onClearAll}
            className="absolute bottom-2 right-2 text-xs text-blue-500 hover:text-red-500 transition" >
            Clear All
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const inputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState<Post[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || "desc"
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const categories = ["all", "reactjs", "nextjs", "javascript"];

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) setHistory(JSON.parse(saved));
    inputRef.current?.focus();
  }, []);

  const saveToHistory = useCallback(
    (term: string) => {
      const updated = [term, ...history.filter((h) => h !== term)].slice(0, 5);
      setHistory(updated);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    },
    [history]
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  // Fetch posts
  const fetchPosts = useCallback(
    async (q: string, pg = 1, append = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          searchTerm: q,
          category: filterCategory,
          sort: sortOrder,
          startIndex: ((pg - 1) * 10).toString(),
        });
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/post/getposts?${params}`
        );
        const data = await res.json();
        setTotalPages(Math.ceil(data.totalCount / 10));

        if (append) setResults((prev) => [...prev, ...data.posts]);
        else setResults(data.posts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filterCategory, sortOrder]
  );

  // Update URL whenever filters or query change
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filterCategory) params.set("category", filterCategory);
    if (sortOrder) params.set("sort", sortOrder);
    router.replace(`/search?${params.toString()}`);
  }, [query, filterCategory, sortOrder, router]);

  // Search input effect
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setPage(1);
      return;
    }

    const delay = setTimeout(async () => {
      await fetchPosts(query, 1);
      setPage(1);
      saveToHistory(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query, filterCategory, sortOrder, fetchPosts, saveToHistory]);

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (!query || page >= totalPages) return;
    const nextPage = page + 1;
    await fetchPosts(query, nextPage, true);
    setPage(nextPage);
  }, [query, page, totalPages, fetchPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1 }
    );
    const current = loadMoreRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadMore]);

  const handlePrev = async () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    await fetchPosts(query, prevPage);
    setPage(prevPage);
  };

  const handleNext = async () => {
    if (page >= totalPages) return;
    const nextPage = page + 1;
    await fetchPosts(query, nextPage);
    setPage(nextPage);
  };

  const highlight = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-400 text-black px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen  bg-gray-50 dark:bg-gray-900  py-20 rounded">
      <div className="max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="flex items-center px-2 py-3 rounded shadow-md ring-1 ring-neutral-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts..."
            className="flex-1 bg-transparent outline-none px-3 text-sm transparent-colors placeholder-gray-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && results[0] &&
              router.push(`/post/${results[0]._id}`)
            }/>
          {query && (
            <Button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mt-4 items-center">
          <label htmlFor="category-select" className="sr-only">
            Filter by Category
          </label>
          <Select
            defaultValue="category-select"
            value={filterCategory}
            onValueChange={(value: string) => setFilterCategory(value)}>
            <SelectTrigger className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all"
                    ? "All Categories"
                    : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <label htmlFor="sort-select" className="sr-only">
            Sort Posts
          </label>
          <Select
            defaultValue="sort-select"
            value={sortOrder}
            onValueChange={(value: string) => setSortOrder(value)}>
            <SelectTrigger className="px-3 py-1 rounded border border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Latest First</SelectItem>
              <SelectItem value="asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search History */}
        {query.length < 2 && history.length > 0 && (
          <SearchHistory
            history={history}
            onClickTerm={(term) => setQuery(term)}
            onRemoveTerm={(term) => {
              const filtered = history.filter((h) => h !== term);
              setHistory(filtered);
              localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
            }}
            onClearAll={clearHistory}
          />
        )}

        {/* Search Results */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          {results.length === 0 && !loading && query.length >= 2 && (
            <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M5 11a7 7 0 1114 0 7 7 0 01-14 0z"
                />
              </svg>
              <p className="text-lg font-medium">No results found</p>
            </div>
          )}

          {results.map((post) => (
            <PostCard
              key={post._id}
              post={{
                ...post,
                title: highlight(post.title) as string,
                content: highlight(post.content) as string,
              }}
            />
          ))}
        </div>

        {/* Infinite Scroll Loader */}
        {loading && (
          <div className="flex justify-center py-6">
            <Spinner className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
        )}
        <div ref={loadMoreRef}></div>

        {/* Manual Pagination */}
        {results.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              onClick={handlePrev}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={handleNext}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
