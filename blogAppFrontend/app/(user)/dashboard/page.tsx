"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux"; // Import useSelector
import { RootState } from "@/redux/store"; // Import your RootState type
import UserSidebar from "@/components/UserDashboard/UserSidebar";
import CreatePost from "@/components/UserDashboard/CreatePost";
import UserOverview from "@/components/UserDashboard/UserOverview";
import MyPosts from "@/components/UserDashboard/MyPosts";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") ?? "dash";

  // 1. Get auth state from Redux
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // 2. Redirect if not authenticated
  useEffect(() => {
    // Only redirect if loading is finished and user is not logged in
    if (!loading && !isAuthenticated) {
      router.push("/auth/sign-up");
    }
  }, [isAuthenticated, loading, router]);

  // 3. Show a loading screen while checking auth
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-slate-500 font-medium">Verifying session...</p>
      </div>
    );
  }

  // 4. Don't render anything if not authenticated (prevents UI flicker)
  if (!isAuthenticated) return null;

  return (
    <div className="flex mt-20 bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="hidden md:block sticky top-16 h-[calc(100vh-64px)]">
        <UserSidebar activeTab={tab} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 uppercase tracking-widest text-xs font-bold text-slate-500">
            User Dashboard / {tab.replace('-', ' ')}
          </div>

          {tab === "dash" && <UserOverview />}
          {tab === "create-post" && <CreatePost />}
          {tab === "posts" && <MyPosts />}
        </div>
      </main>
    </div>
  );
}