'use client';

import { UserHeader } from '@/components/UserDashboard/UserHeader';
import UserSidebar from '@/components/UserDashboard/UserSidebar';
import { ReactNode } from 'react';


export default function UserLayout({ children, activeTab }: { children: ReactNode; activeTab: string }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 overflow-hidden">
      
      {/* Sidebar */}
      <UserSidebar activeTab={activeTab} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <UserHeader />

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
