'use client';
import ThemeToggle from "../ThemeToggle";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface AdminHeaderProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export default function AdminHeader({ onMenuClick, showMenuButton }: AdminHeaderProps) {
    const router = useRouter();

    const logout = () => {
    document.cookie = "authToken=; max-age=0; path=/";
    document.cookie = "userRole=; max-age=0; path=/";
    toast.success('User logout successful');
    router.push("/");
  };

  return (
    <div className="flex h-14 items-center justify-between gap-2 border-b bg-background px-3 sm:px-6">
      <div className="flex items-center gap-2">
        {showMenuButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Toaster position="top-center" />
        <ThemeToggle />
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={16} className="mr-2 rounded-xl" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
