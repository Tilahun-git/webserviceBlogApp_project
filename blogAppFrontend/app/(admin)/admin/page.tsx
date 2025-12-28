"use client";

<<<<<<< HEAD:blogAppFrontend/app/admin/page.tsx
import DashboardComp from "@/app/admin/DashboardComp";
=======
import { useSearchParams } from "next/navigation";
import DashSidebar from "@/components/AdminDash/DashSidebar";
import DashPosts from "@/components/AdminDash/DashPosts";
import DashUsers from "@/components/AdminDash/DashUsers";
import DashComments from "@/components/AdminDash/DashComments";
import DashboardComp from "@/components/AdminDash/DashboardComp";
>>>>>>> main:blogAppFrontend/app/(admin)/admin/page.tsx

export default function AdminDashboardPage() {
  return <DashboardComp />;
}
