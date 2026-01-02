
import { FilePlus, FileText, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

interface UserSidebarProps {
  activeTab: string;
}

export default function UserSidebar({ activeTab }: UserSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const menuItems = [
    { name: 'Create Post', icon: FilePlus, tab: 'create-post' },
    { name: 'My Posts', icon: FileText, tab: 'posts' },
    { name: 'Profile', icon: User, tab: 'profile' },
  ];

  const closeSidebar = () => setSidebarOpen(false);

  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="bg-white dark:bg-slate-900 shadow-md"
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Mobile Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between p-6">
            <h2 className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UserPanel
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="text-slate-600 dark:text-slate-400"
            >
              <X size={20} />
            </Button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.tab}
                href={`/dashboard?tab=${item.tab}`}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === item.tab 
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}>
                <item.icon size={20} />
                {item.name}
              </Link>
            ))}
          </nav>
        </aside>
      </>
    );
  }

  // Desktop Sidebar
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
            }`}>
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}