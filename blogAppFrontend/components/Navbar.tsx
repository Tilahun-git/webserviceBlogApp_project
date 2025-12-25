'use client';

import { navItems } from "@/lib/constants";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import MobileNavigation from "./MobileNavigation";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

type User = {
  email: string;
  firstName?: string;
};

export default function Navigation() {
  const [isScroll, setIsScroll] = useState(false);
  const [user] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={
        "fixed w-full top-0 z-50 transition-all duration-300 border-b border-border/50 " +
        (isScroll
          ? "backdrop-blur bg-white/75 dark:bg-gray-900/75 shadow-md"
          : "bg-transparent")
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="text-xl font-serif font-bold text-foreground">
            Blog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}

            <Link href="/admin">
              <Button size="sm" variant="outline">
                Dashboard
              </Button>
            </Link>

            <ThemeToggle />

            {/* Auth */}
            {!user ? (
              <Link href="/auth/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Hi, {user.firstName || user.email}
                </span>
                <Button size="sm" variant="outline">
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNavigation />
        </div>
      </div>
    </nav>
  );
}
