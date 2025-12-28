"use client";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useRouter } from 'next/navigation';

type User = {
  email: string;
  firstName?: string;
};

export default function Navigation() {
  const [isScroll, setIsScroll] = useState(false);
  const router = useRouter();
  const [user] = useState<User | null>(null);

  const handleSearchClick = () => {
    router.push('/search');
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
      }>
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
              {!user ? (
                <>
                  <Link href="/auth/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    Hi, {user.firstName || user.email}
                  </span>
                  <Button variant="outline">Logout</Button>
                </>
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
