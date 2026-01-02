"use client";

import { Sheet, SheetContent, SheetTitle, SheetTrigger,} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Menu, Search, LogIn, LogOut, User } from "lucide-react";
import { navItems } from "@/lib/constants";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { toast } from "sonner";

export default function MobileNavigtaion() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to get cookie value
  const getCookie = useCallback((name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      // Check for token in localStorage or cookies
      const token = localStorage.getItem("token") || getCookie("authToken");
      const role = getCookie("userRole");
      
      setIsAuthenticated(!!token);
      setUserRole(role);
    };

    checkAuth();
    
    // Listen for storage changes (when user signs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [getCookie]);

  const handleSearchClick = () => {
    setIsOpen(false);
    router.push('/search');
  };

  const handleSignIn = () => {
    setIsOpen(false);
    router.push('/auth/sign-in');
  };

  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    document.cookie = "authToken=; max-age=0; path=/";
    document.cookie = "userRole=; max-age=0; path=/";
    
    setIsAuthenticated(false);
    setUserRole(null);
    setIsOpen(false);
    
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  const handleDashboard = () => {
    setIsOpen(false);
    if (userRole === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="md:hidden flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearchClick}
        className="text-white hover:text-blue-400">
        <Search className="w-5 h-5" />
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle></SheetTitle>
          
          <div className="flex flex-col h-full">
            {/* Theme Toggle */}
            <div className="mb-6">
              <ThemeToggle />
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-col space-y-4 px-7 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-200 py-2"
                  onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              ))}
              
              {/* Dashboard Link for Authenticated Users */}
              {isAuthenticated && (
                <Button
                  variant="ghost"
                  onClick={handleDashboard}
                  className="justify-start text-lg font-medium text-foreground hover:text-primary 
                  transition-colors duration-200 py-2 px-0 h-auto">
                  <User className="w-5 h-5 mr-2" />
                  {userRole === 'ADMIN' ? 'Admin Panel' : 'Dashboard'}
                </Button>
              )}
            </div>
            
            {/* Authentication Buttons */}
            <div className="border-t pt-4 mt-4">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-start text-red-600 hover:text-red-700
                   hover:bg-red-50 dark:hover:bg-red-950">
                  <LogOut className="w-5 h-5 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={handleSignIn}
                  className="w-full justify-start">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
