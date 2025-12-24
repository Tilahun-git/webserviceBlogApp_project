"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { Table, Button } from "flowbite-react";
import { Users } from "lucide-react";

/* ================= TYPES ================= */

interface User {
  _id: string;
  username: string;
  profilePicture: string;
}

interface RootState {
  user: {
    currentUser: {
      isAdmin: boolean;
    } | null;
  };
}

/* ================= COMPONENT ================= */

export default function DashboardComp() {
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUser
  );

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/getusers?limit=5`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch(console.error);
  }, [currentUser]);

  if (!currentUser?.isAdmin) {
    return <p className="text-center mt-10">Access denied</p>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="shadow-md rounded-lg p-4 dark:bg-gray-800">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold flex items-center gap-2">
            <Users size={18} /> Recent Users
          </h2>

          <Button size="xs" outline>
            <Link href="/dashboard?tab=users">See all</Link>
          </Button>
        </div>

        <Table hoverable>
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <Image
                    src={user.profilePicture}
                    alt={user.username}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                </td>
                <td>{user.username}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
