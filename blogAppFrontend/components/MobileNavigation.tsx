"use client";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import ThemeToggle from "./ThemeToggle";
import {Menu, Search, LayoutDashboard, User as UserIcon, LogOut} from "lucide-react";

import { navItems } from "@/lib/constants";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { signOut } from "@/redux/auth/authSlice";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const handleSearchClick = () => {
    router.push("/search");
  };
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const handleLogout = () => {
    dispatch(signOut());
    setIsOpen(false);
    router.push("/");
  };
  return (
    <div className="md:hidden flex items-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleSearchClick}
        className="text-white hover:text-blue-400"
      >
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
          <ThemeToggle />
          <div className="flex flex-col space-y-4  h-full py-6">
            {/* USER INFO SECTION (Only if Logged In) */}
            {isAuthenticated && user && (
              <div className="flex items-center space-x-3 mb-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  <UserIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">
                    {user.firstName}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-lg font-medium text-foreground hover:text-primary transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* 4. DASHBOARD LINK (Only if Logged In) */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="flex items-center text-lg font-medium text-blue-600"
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                My Dashboard
              </Link>
            )}
            {/* 5. AUTH BUTTONS (Login vs Logout) */}
            {!isAuthenticated ? (
              <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-20">Sign Up</Button>
              </Link>
            ) : (
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
