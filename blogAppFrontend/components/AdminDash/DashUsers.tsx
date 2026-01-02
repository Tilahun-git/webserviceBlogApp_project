'use client';

import React, { useEffect, useState } from 'react';
import { axiosInstance } from '@/lib/api'; // use axiosInstance that adds JWT header automatically
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash, Ban, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Role {
  id: number;
  name: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  status: 'ACTIVE' | 'DEACTIVATED';
  avatar?: string;
}

export default function DashUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const usersPerPage = 5;

  /* ================= FETCH USERS ================= */
  const fetchUsers = async (
  page = 0,
  keyword = '',
  sortBy = 'username',
  sortDir = 'asc'
) => {
  try {
    // Use filter endpoint if keyword exists, otherwise default endpoint
    const url = keyword
      ? `/api/admin/users/filter?keyword=${encodeURIComponent(keyword)}&pageNumber=${page}&pageSize=${usersPerPage}&sortBy=${sortBy}&sortDir=${sortDir}`
      : `/api/admin/users?pageNumber=${page}&pageSize=${usersPerPage}&sortBy=${sortBy}&sortDir=${sortDir}`;

    const res = await axiosInstance.get(url); // JWT headers included

    if (res.data.success) {
      const mappedUsers: User[] = res.data.data.content.map((u: any) => ({
        id: u.id,
        username: u.username,
        email: u.email,
        roles: u.roles || [],
        status: u.status,
        avatar: u.avatar || '',
      }));
      setUsers(mappedUsers);
      setTotalPages(res.data.data.totalPages);
    } else {
      toast.error(res.data.message || 'Failed to fetch users');
    }
  } catch (err: any) {
    console.error(err);
    toast.error(err.response?.data?.message || 'Error fetching users');
  }
};


  useEffect(() => {
    fetchUsers(currentPage, search);
  }, [currentPage, search]);

  /* ================= ACTIONS ================= */
  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      const res = await axiosInstance.delete(`/api/admin/users/${id}`);
      if (res.data.success) {
        toast.success('User deleted successfully');
        fetchUsers(currentPage, search);
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const grantUser = async (id: number) => {
    try {
      const res = await axiosInstance.put(`/api/admin/${id}/activate`);
      if (res.data.success) {
        toast.success('User activated');
        fetchUsers(currentPage, search);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to activate user');
    }
  };

  const revokeUser = async (id: number) => {
    try {
      const res = await axiosInstance.put(`/api/admin/${id}/deactivate`);
      if (res.data.success) {
        toast.success('User deactivated');
        fetchUsers(currentPage, search);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to deactivate user');
    }
  };

  const changeRole = async (id: number, roleName: string) => {
    try {
      const res = await axiosInstance.put(`/api/admin/${id}/role/grant?roleName=${roleName}`);
      if (res.data.success) {
        toast.success(`Role changed to ${roleName}`);
        fetchUsers(currentPage, search);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to change role');
    }
  };

  /* ================= PAGINATION ================= */
  const handlePrevPage = () => setCurrentPage(p => Math.max(p - 1, 0));
  const handleNextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages - 1));

  return (
    <div className="p-3 sm:p-6 w-full bg-background text-foreground">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">User Management</h1>

      {/* SEARCH */}
      <div className="mb-4 w-full sm:w-72">
        <Input
          placeholder="Search by username or email"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <ScrollArea className="h-125 w-full rounded-lg border border-border">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground">Profile</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground min-w-25">Username</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground hidden sm:table-cell min-w-37.5">Email</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground hidden md:table-cell">Role</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="px-2 sm:px-4 py-2 text-xs font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {users.length > 0 ? users.map(user => (
                <tr key={user.id} className="hover:bg-muted/50 transition">
                  <td className="px-2 sm:px-4 py-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{user.username[0]}</AvatarFallback>
                    </Avatar>
                  </td>

                  <td className="px-2 sm:px-4 py-2">{user.username}</td>
                  <td className="px-2 sm:px-4 py-2 hidden sm:table-cell truncate">{user.email}</td>

                  <td className="px-2 sm:px-4 py-2 hidden md:table-cell">
                    {user.roles[0]?.name|| 'No role'}
                  </td>

                  <td className="px-2 sm:px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  <td className="px-2 sm:px-4 py-2 flex gap-1">
                    <Button size="sm" variant="outline" disabled={user.status !== 'ACTIVE'} onClick={() => revokeUser(user.id)}>
                      <Ban size={12} />
                    </Button>
                    <Button size="sm" variant="outline" disabled={user.status === 'ACTIVE'} onClick={() => grantUser(user.id)}>
                      <RotateCcw size={12} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteUser(user.id)}>
                      <Trash size={12} />
                    </Button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
        <Button size="sm" disabled={currentPage === 0} onClick={handlePrevPage}>Previous</Button>
        <span className="text-sm text-muted-foreground">Page {currentPage + 1} of {totalPages}</span>
        <Button size="sm" disabled={currentPage + 1 === totalPages} onClick={handleNextPage}>Next</Button>
      </div>
    </div>
  );
}
