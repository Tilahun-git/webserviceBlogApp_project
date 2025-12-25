"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Check, X } from "lucide-react";
import { Modal } from "flowbite-react";

interface User {
  _id: string;
  username: string;
  email: string;
  profilePicture?: string;
  isAdmin: boolean;
  createdAt: string;
}

const PAGE_SIZE = 10;

export default function DashUsers() {
  const currentUser = useSelector((state: RootState) => state.user.currentUser) as User | null;
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  // Fetch users
  const fetchUsers = async (page: number) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getusers?page=${page}&limit=${PAGE_SIZE}`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.total || 0);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error) || "Error fetching users");
      }
    }
  };

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    (async () => {
      await fetchUsers(page);
    })();
  }, [currentUser?.isAdmin, page]);

  // Delete user
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/delete/${userIdToDelete}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userIdToDelete));
        setShowModal(false);
      } else {
        console.error(data.message);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error) || "Error deleting user");
      }
    }
  };

  // Filtered users based on search
  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);

  if (!currentUser?.isAdmin) return <p>You are not authorized to view this page.</p>;

  return (
    <div className="p-3 overflow-x-auto">
      {/* Search + Pagination */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <Input
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            color="gray"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <Button
            color="gray"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <Table className="shadow-md">
        <thead>
          <tr>
            <th>Date Created</th>
            <th>User</th>
            <th>Username</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {filteredUsers.map((user) => (
            <tr key={user._id} className="bg-white dark:bg-gray-800 dark:border-gray-700">
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <Avatar>
                  {user.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                  ) : (
                    <AvatarFallback>{user.username[0]}</AvatarFallback>
                  )}
                </Avatar>
              </td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.isAdmin ? <Check className="text-green-500" /> : <X className="text-red-500" />}
              </td>
              <td>
                <span
                  onClick={() => {
                    setShowModal(true);
                    setUserIdToDelete(user._id);
                  }}
                  className="font-medium text-red-500 hover:underline cursor-pointer"
                >
                  Delete
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="md">
        <div className="text-center p-6">
          <AlertCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this user?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteUser}>
              Yes, I&apos;m sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
