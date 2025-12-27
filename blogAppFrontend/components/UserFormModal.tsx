"use client";

import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/lib/api";

interface Props {
  user: User | null;
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => Promise<void> | void;
}

export default function UserFormModal({ user, open, onClose, onSave }: Props) {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setIsAdmin(!!user.isAdmin);
    } else {
      setUsername("");
      setEmail("");
      setIsAdmin(false);
    }
  }, [user, open]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ username, email, isAdmin });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={open} onClose={onClose} size="md">
      <div className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Edit User</h3>
        <div className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Username</label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="flex items-center gap-2">
            <input id="isAdmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
            <label htmlFor="isAdmin" className="text-sm">Admin</label>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button color="gray" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || !user}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}