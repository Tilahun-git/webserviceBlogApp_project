"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { useSearchParams} from "next/navigation";
import CreatePost from "@/components/UserDashboard/CreatePost";
import MyPosts from "@/components/UserDashboard/MyPosts";
import UserProfile from "@/components/UserDashboard/UserProfile";
import type { RootState } from "@/redux/store";
import { loadToken } from "@/redux/auth/authSlice";


export default function UserDashboard() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "create-post";

  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) return null; // prevent UI flicker




  return (
    <div className="flex mt-20 bg-slate-50 dark:bg-slate-950">

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 uppercase tracking-widest text-xs font-bold text-slate-500">
            {tab.replace('-', ' ')}
          </div>
          {tab === "create-post" && <CreatePost />}
          {tab === "posts" && <MyPosts />}
          {tab === "profile" && <UserProfile />}
        </div>
      </main>
    </div>
  );
}