'use client';

import { ReactNode, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, FileText, Users, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import AdminHeader from "./AdminHeader";

interface AdminLayoutProps {
  children: ReactNode;
}

// Sidebar navigation items
const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Posts", icon: FileText, href: "/admin/posts" },
  { label: "Users", icon: Users, href: "/admin/users" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-64'
        } 
        bg-gray-900 text-white flex flex-col
      `}>
        <div className="flex items-center justify-between p-6 text-2xl font-bold border-b border-gray-800">
          <span>Blog Admin</span>
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="text-white hover:bg-gray-800">
              <X size={20} />
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeSidebar}
                  className={`flex items-center gap-2 p-2 rounded transition-colors ${
                    isActive
                      ? "bg-gray-800 text-blue-400"
                      : "hover:bg-gray-800 text-gray-300"
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      <div className="flex flex-1 flex-col">
        <AdminHeader 
          onMenuClick={() => setSidebarOpen(true)} 
          showMenuButton={isMobile}
        />

        <main className="flex-1 p-3 sm:p-6 overflow-auto bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  );
}
