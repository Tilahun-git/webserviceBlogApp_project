"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Search, User as UserIcon, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { signOut } from "@/redux/auth/authSlice";

export default function Navigation() {
  const [isScroll, setIsScroll] = useState(false);
  const router = useRouter();
  // 2. Access Auth State from Redux
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const handleLogout = () => {
    dispatch(signOut());
    router.push("/");
  };
  const handleSearchClick = () => {
    router.push("/search");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={
        "fixed w-full bg-background border-t border-border/50 top-0 z-50 transition-all duration-300 " +
        (isScroll
          ? "backdrop-blur bg-white/75 dark:bg-gray-900/75 shadow-md"
          : "bg-transparent")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex shrink-0">
            <h1 className="text-xl font-serif font-bold text-foreground">
              Blog
            </h1>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            {/* 3. PROTECTED: Only show 'Create Post' if authenticated */}
            {isAuthenticated && (
              <Link href="/dashboard?tab=create-post">
                <Button size="sm" variant="outline">
                  Create Post
                </Button>
              </Link>
            )}
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchClick}
                className="text-white hover:text-blue-400"
              >
                <Search className="w-5 h-5" />
              </Button>
            </div>
            <ThemeToggle />
            <div className="flex items-center h-16 gap-4">
              {/* 4. AUTH UI: Logic for Guest vs Logged In */}
              {!isAuthenticated ? (
                <Link href="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              ) : (
                <div className="flex items-center gap-4 border-l pl-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600">
                      <UserIcon size={16} />
                    </div>
                    <span>{user?.firstName || user?.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
          {/* mobile navigation */}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
}
