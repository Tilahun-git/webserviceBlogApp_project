'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Users, FileText, ArrowUp, ArrowDown } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { axiosInstance } from '@/lib/api';

// ======= Types =======
interface RecentUser {
  id: number;
  username: string;
  email: string;
  avatar?: string | null;
  joined: string;
}

interface RecentPost {
  id: number;
  title: string;
  category: string;
  image?: string | null;
  createdAt: string;
}

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalActiveUsers:number;
  totalComments: number;
  monthlyUsersChange: number;
  monthlyPostsChange: number;
  monthlyCommentsChange: number;
  recentUsers: RecentUser[];
  recentPosts: RecentPost[];
}

// ======= Component =======
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/api/admin/counts'); // your backend endpoint
        setStats(res.data.data);
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard...</p>;
  if (!stats) return <p className="p-6 text-red-600">No dashboard data available.</p>;

  const renderChange = (value: number) => (
    <p className={`flex items-center text-sm mt-2 ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
      {Math.abs(value)}% from last month
    </p>
  );

  return (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8 bg-background text-foreground">
      <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>

      {/* ======= Top Cards ======= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Card className="bg-indigo-800">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base">Total Users</CardTitle>
            <Users className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalActiveUsers}/{stats.totalUsers}</p>
            {/* {renderChange(stats.monthlyUsersChange)} */}
          </CardContent>
        </Card>

        <Card className="bg-muted-foreground">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm sm:text-base">Total Posts</CardTitle>
            <FileText className="w-4 h-4 sm:w-6 sm:h-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl sm:text-3xl font-bold">{stats.totalPosts}</p>
            {/* {renderChange(stats.monthlyPostsChange)} */}
          </CardContent>
        </Card>
      </div>

      {/* ======= Recent Users Table ======= */}
      {/* <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-base sm:text-lg">Recent Users</CardTitle>
          <Link href="/admin/users" className="text-blue-500 hover:underline text-sm">
            See All
          </Link>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-30">User</TableHead>
                  <TableHead className="hidden sm:table-cell">Username</TableHead>
                  <TableHead className="min-w-50">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.username} width={30} height={30} className="rounded-full" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <span className="truncate">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{user.username}</TableCell>
                    <TableCell className="truncate">{user.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{user.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card> */}

      {/* ======= Recent Posts Table ======= */}
      {/* <Card>
        <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-base sm:text-lg">Recent Posts</CardTitle>
          <Link href="/admin/posts" className="text-blue-500 hover:underline text-sm">
            See All
          </Link>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <ScrollArea className="h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden sm:table-cell w-16">Image</TableHead>
                  <TableHead className="min-w-37.5">Title</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden lg:table-cell">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="hidden sm:table-cell">
                      {post.image ? (
                        <Image src={post.image} alt={post.title} width={40} height={40} className="rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          No Img
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="truncate">{post.title}</TableCell>
                    <TableCell className="hidden md:table-cell">{post.category}</TableCell>
                    <TableCell className="hidden lg:table-cell">{post.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card> */}
    </div>
  );
}
