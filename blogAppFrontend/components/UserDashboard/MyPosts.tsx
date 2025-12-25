
"use client";

import { Edit3, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '../ui/button';

interface Post {
  id: number;
  title: string;
  category: string;
  status: 'Published' | 'Pending' | 'Draft';
  date: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch only this user's posts from Spring Boot
  useEffect(() => {
    const fetchUserPosts = async () => {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/posts`);
      // const data = await res.json();
      // setPosts(data);
      
      // Mock Data for UI demonstration
      setPosts([
        { id: 1, title: 'Mastering TypeScript in 2024', category: 'Coding', status: 'Published', date: '2024-12-20' },
        { id: 2, title: 'Spring Boot Security with JWT', category: 'Backend', status: 'Pending', date: '2024-12-24' },
      ]);
    };
    fetchUserPosts();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 uppercase text-xs font-bold">
              <th className="px-6 py-4">Title</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <td className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">{post.title}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{post.category}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    post.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{post.date}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition"><Edit3 size={18} /></Button>
                    <Button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition"><Trash2 size={18} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}