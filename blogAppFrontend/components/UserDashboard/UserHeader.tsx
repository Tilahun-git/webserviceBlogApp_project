'use client';

import ThemeToggle from '../ThemeToggle';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';

export function UserHeader() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex justify-end items-center gap-2 sm:gap-3 h-14 px-3 sm:px-6 border-b bg-white dark:bg-slate-900 sticky top-0 z-40">
      <Toaster position='top-center'/>
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Sign Out */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSignOut}
        className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <LogOut size={16} />
        <span className="hidden sm:inline">Sign Out</span>
      </Button>
    </div>
  );
}
