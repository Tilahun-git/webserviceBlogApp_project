"use client";

import { useSearchParams } from "next/navigation";
import UserSidebar from "@/components/UserDashboard/UserSidebar";
import CreatePost from "@/components/UserDashboard/CreatePost";
import UserProfile from "@/components/UserDashboard/UserProfile";
import MyPosts from "@/components/UserDashboard/MyPosts";

export default function UserDashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "posts"; // default to "posts" instead of "dash"

  return (
    <div className="flex mt-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:block sticky top-16 h-[calc(100vh-64px)]">
        <UserSidebar activeTab={tab} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 uppercase tracking-widest text-xs font-bold text-slate-500">
            User Dashboard / {tab.replace("-", " ")}
          </div>

          {/* Render content based on tab */}
          {tab === "create-post" && <CreatePost />}
          {tab === "posts" && <MyPosts />}
          {tab === "profile" && <UserProfile />}
        </div>
      </main>
    </div>
  );
}
