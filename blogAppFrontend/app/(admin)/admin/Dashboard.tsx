import { ReactNode } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminLogoutButton from "@/app/admin/AdminLogoutButton";
import { LayoutDashboard, FileText, Users, MessageSquare, Settings } from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, href: "/admin" },
  { label: "Posts", icon: <FileText />, href: "/admin/posts" },
  { label: "Users", icon: <Users />, href: "/admin/users" },
  { label: "Comments", icon: <MessageSquare />, href: "/admin/comments" },
  { label: "Settings", icon: <Settings />, href: "/admin/settings" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-800">
          Blog Admin
        </div>

        <ScrollArea className="flex-1 p-4">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-800 transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-gray-800 flex items-center justify-between">
          <div>Admin</div>
          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
