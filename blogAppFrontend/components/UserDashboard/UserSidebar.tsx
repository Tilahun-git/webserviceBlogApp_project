// components/dashboard/UserSidebar.tsx
import { LayoutDashboard, FilePlus, FileText, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function UserSidebar({ activeTab }: { activeTab: string }) {
  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, tab: 'dash' },
    { name: 'Create Post', icon: FilePlus, tab: 'create-post' },
    { name: 'My Posts', icon: FileText, tab: 'posts' },
    { name: 'Profile', icon: User, tab: 'profile' },
  ];
const router = useRouter();

const handleSignOut = () => {
  // 1. Clear the token
  localStorage.removeItem("token"); 
  // If using cookies: document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // 2. Show feedback
  toast.success("Signed out successfully");

  // 3. Redirect to login or home
  router.push("/auth/sign-in");
  router.refresh(); // Forces a refresh to clear any cached auth states
};
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          UserPanel
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.tab}
            href={`/dashboard?tab=${item.tab}`}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === item.tab 
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <Button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 dark:text-slate-400
         hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}