"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import PostCard from "@/components/PostCard";

interface SidebarData {
  searchTerm: string;
  sort: "asc" | "desc";
  category: string;
}

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

interface ApiResponse {
  posts: Post[];
  page: number;
  totalPages: number;
  totalElements: number;
}

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sidebarData, setSidebarData] = useState<SidebarData>({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Sync URL params to state
  useEffect(() => {
    const searchTerm = searchParams.get("searchTerm") || "";
    const sort = (searchParams.get("sort") as "asc" | "desc") || "desc";
    const category = searchParams.get("category") || "uncategorized";
    const pageNum = parseInt(searchParams.get("page") || "1", 10);

    setSidebarData({ searchTerm, sort, category });
    setPage(pageNum);
    fetchPosts({ searchTerm, sort, category, page: pageNum });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // Fetch posts
  const fetchPosts = async ({
    searchTerm,
    sort,
    category,
    page = 1,
  }: {
    searchTerm: string;
    sort: "asc" | "desc";
    category: string;
    page?: number;
  }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        searchTerm,
        sort,
        category,
        page: page.toString(),
      }).toString();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/post/getposts?${query}`
      );
      if (!res.ok) return;

      const data: ApiResponse = await res.json();
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setSidebarData((prev) => ({ ...prev, [id]: value }));
  };

  // Apply filters
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({ ...sidebarData, page: "1" }).toString();
    router.push(`/search?${query}`);
  };

  // Navigate to page
  const goToPage = (newPage: number) => {
    const query = new URLSearchParams({
      ...sidebarData,
      page: newPage.toString(),
    }).toString();
    router.push(`/search?${query}`);
  };

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxButtons = 5;
    let start = Math.max(2, page - Math.floor(maxButtons / 2));
    const end = Math.min(totalPages - 1, start + maxButtons - 1);

    start = Math.max(2, Math.min(start, totalPages - maxButtons));

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <Input
              placeholder="Search..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <Select value={sidebarData.sort} onValueChange={(value) => setSidebarData(prev => ({ ...prev, sort: value as "asc" | "desc" }))}>
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <Select
              value={sidebarData.category}
              onValueChange={(value) => setSidebarData(prev => ({ ...prev, category: value }))}
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>

          <Button type="submit">Apply Filters</Button>
        </form>
      </div>

      {/* Posts List */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>

        <div className="p-7 flex flex-wrap gap-4">
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>

        {/* Full Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-6 overflow-x-auto py-2">
            <div className="flex gap-2 min-w-max items-center">
              {/* First */}
              <Button
                disabled={page === 1}
                onClick={() => goToPage(1)}
                variant="outline"
              >
                &laquo; First
              </Button>

              {/* Previous */}
              <Button
                disabled={page === 1}
                onClick={() => goToPage(page - 1)}
                variant="outline"
              >
                Previous
              </Button>

              {/* Page Numbers with Ellipsis */}
              {getPageNumbers().map((p, index, arr) => {
                // Start ellipsis
                if (index === 0 && p > 2) {
                  return (
                    <div key={p} className="flex gap-2">
                      <Button
                        onClick={() => goToPage(2)}
                        variant={page === 2 ? "default" : "outline"}
                      >
                        2
                      </Button>
                      <span className="px-2 py-1">…</span>
                    </div>
                  );
                }

                // End ellipsis
                if (index === arr.length - 1 && p < totalPages - 1) {
                  return (
                    <div key={p} className="flex gap-2">
                      <span className="px-2 py-1">…</span>
                      <Button
                        onClick={() => goToPage(totalPages - 1)}
                        variant={
                          page === totalPages - 1 ? "default" : "outline"
                        }
                      >
                        {totalPages - 1}
                      </Button>
                    </div>
                  );
                }

                return (
                  <Button
                    key={p}
                    onClick={() => goToPage(p)}
                    variant={p === page ? "default" : "outline"}
                  >
                    {p}
                  </Button>
                );
              })}

              {/* Next */}
              <Button
                disabled={page === totalPages}
                onClick={() => goToPage(page + 1)}
                variant="outline"
              >
                Next
              </Button>

              {/* Last */}
              <Button
                disabled={page === totalPages}
                onClick={() => goToPage(totalPages)}
                variant="outline"
              >
                Last &raquo;
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
