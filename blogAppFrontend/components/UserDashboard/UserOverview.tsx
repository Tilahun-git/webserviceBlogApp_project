// components/dashboard/UserOverview.tsx
"use client";

import { Eye, ThumbsUp, MessageSquare} from 'lucide-react';

export default function UserOverview() {
  // In a real app, you would fetch these from: /api/v1/user/stats
  const stats = [
    { name: 'Total Post Views', value: '12,450', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Likes', value: '3,120', icon: ThumbsUp, color: 'text-pink-600', bg: 'bg-pink-100' },
    { name: 'Total Comments', value: '840', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100' },

  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <h3 className="text-lg font-bold mb-4">Quick Insights</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Your post <span className="text-blue-600 font-semibold">Next.js vs Spring Boot</span> is trending! 
          It gained <span className="font-bold">240 views</span> in the last 24 hours.
        </p>
      </div>
    </div>
  );
}