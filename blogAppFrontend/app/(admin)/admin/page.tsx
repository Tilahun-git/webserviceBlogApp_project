"use client";

import { useEffect } from "react";
import { useSearchParams} from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loadToken } from "@/redux/auth/authSlice";

// import { RootState } from "@/redux/store"; 
import DashPosts from "@/components/AdminDash/DashPosts";
import DashUsers from "@/components/AdminDash/DashUsers";
import Dashboard from "@/components/AdminDash/Dashboard";
import type { RootState } from "@/redux/store";




export default function UserDashboard() {
  const searchParams = useSearchParams();
  
  const router = useRouter();
    const dispatch = useDispatch();


  const tab = searchParams.get("tab") ?? "dash";
//   useEffect(() => {
//   const role = localStorage.getItem("userRole");
//   if (role?.toUpperCase() !== "ADMIN") {
//     router.push("/auth/sign-in");
//   }
// }, [router]);

const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(loadToken());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, loading, router]);

    if (loading || !isAuthenticated) return null;

  // // 1. Get auth state from Redux
  // const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  // // 2. Redirect if not authenticated
  // useEffect(() => {
  //   // Only redirect if loading is finished and user is not logged in
  //   if (!loading && !isAuthenticated) {
  //     router.push("/auth/sign-up");
  //   }
  // }, [isAuthenticated, loading, router]);

  // // 3. Show a loading screen while checking auth
  // if (loading) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen">
  //       <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
  //       <p className="mt-4 text-slate-500 font-medium">Verifying session...</p>
  //     </div>
  //   );
  // }

  // // 4. Don't render anything if not authenticated (prevents UI flicker)
  // if (!isAuthenticated) return null;

  return (
    <div className="flex mt-20 bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 min-h-[calc(100vh-64px)]">
        <div className="max-w-5xl mx-auto">  
          {tab === "dash" && <Dashboard />}
          {tab === "posts" && <DashPosts />}
          {tab === "users" && <DashUsers />}          
        </div>
      </main>
    </div>
  );
}