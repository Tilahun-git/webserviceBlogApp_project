"use client";

import { FormEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, LogOut } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "JohnDoe",
    email: "johndoe@example.com",
    bio: "Hello, I love writing blogs!",
    avatar: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(formData.avatar);
  const [updating, setUpdating] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional: validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 2MB");
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdateProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUpdating(true);

    // Simulate saving profile
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setUpdating(false);
    }, 1000);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully");
    router.push("/auth/sign-in");
    router.refresh();
  };

  return (
    <div className="relative max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md">

      {/* Top-right: Avatar + Sign Out */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 hover:ring-2 hover:ring-blue-500 transition-all">
          {preview ? (
            <Image src={preview} alt="Avatar" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
              <Camera size={20} />
            </div>
          )}

          {/* Hidden file input */}
          <Input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
          />

          {/* Camera icon overlay */}
          <div className="absolute bottom-0 right-0 bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-slate-900">
            <Camera size={12} className="text-white" />
          </div>
        </div>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Username */}
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <Input
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            type="email"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold mb-1">Bio</label>
          <Textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200"
            rows={4}
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:text-white"
          disabled={updating}
        >
          {updating ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </div>
  );
}
