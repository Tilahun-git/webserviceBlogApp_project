"use client";

import { useSearchParams } from "next/navigation";
import DashSidebar from "@/components/AdminDash/DashSidebar";
import DashPosts from "@/components/AdminDash/DashPosts";
import DashUsers from "@/components/AdminDash/DashUsers";
import DashComments from "@/components/AdminDash/DashComments";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "dash";

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-56">
        <DashSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {tab === "posts" && <DashPosts />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComments />}
      </div>
    </div>
  );
}
