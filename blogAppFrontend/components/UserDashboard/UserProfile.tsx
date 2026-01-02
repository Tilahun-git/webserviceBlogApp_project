"use client";

import { FormEvent, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";
import { getUserProfile, updateUserProfile, uploadProfilePicture } from "@/lib/api";
import type { User } from "@/lib/api";

export default function UserProfile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userData = await getUserProfile();
        setUser(userData);
        setFormData({
          username: userData.username,
          email: userData.email,
          bio: userData.bio || "",
        });
        setPreview(userData.mediaUrl || null);
      } catch (error: any) {
        console.error('Failed to load user profile:', error);
        
        if (error.message === 'SSL_CERTIFICATE_ERROR') {
          toast.error('SSL Certificate Error: Please accept the certificate in your browser');
        } else if (error.response?.status === 401) {
          toast.error('Authentication required. Please sign in again.');
          router.push('/auth/sign-in');
        }else if (!error.response) {

          toast.error('Network error. Please check your connection.');
  }  else {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Avatar must be smaller than 2MB");
      return;
    }

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));

    // // Upload avatar immediately
    // try {
    //   setUploadingAvatar(true);
    //   const profilePictureUrl = await uploadProfilePicture(file);
      
    //   // Update user profile with new avatar
    //   const updatedUser = await updateUserProfile({ profilePicture: profilePictureUrl });
    //   setUser(updatedUser);
    //   setPreview(profilePictureUrl);
      
    //   toast.success("Profile picture updated successfully");
    // } catch (error: any) {
    //   console.error('Failed to upload avatar:', error);
      
    //   if (error.message === 'SSL_CERTIFICATE_ERROR') {
    //     toast.error('SSL Certificate Error: Please accept the certificate in your browser');
    //   } else if (error.response?.status === 401) {
    //     toast.error('Authentication required. Please sign in again.');
    //   } else {
    //     toast.error(error.response?.data?.message || 'Failed to upload avatar');
    //   }
      
    //   // Reset preview on error
    //   setPreview(user?.profilePicture || null);
    // } finally {
    //   setUploadingAvatar(false);
    //   setAvatarFile(null);
    // }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      const profileFormData = new FormData();
      setUpdating(true);
      
      
      setFormData({
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
      });

      profileFormData.append(
      "data",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );


     // Append media file ONLY if image/video
    if (avatarFile) {
      profileFormData.append("file", avatarFile);
    }else{
      const emptyFile = new File([], "empty.txt", { type: "text/plain" });
      profileFormData.append("file", emptyFile);
    }
      const res = await updateUserProfile(profileFormData);

      setUser(res);
      setPreview(res.mediaUrl||null)

      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      
      if (error.message === 'SSL_CERTIFICATE_ERROR') {
        toast.error('SSL Certificate Error: Please accept the certificate in your browser');
      } else if (error.response?.status === 401) {
        toast.error('Authentication required. Please sign in again.');
        router.push('/auth/sign-in');
      } else if (error.response?.status === 409) {
        toast.error('Username or email already exists');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setUpdating(false);
    }
  };

 

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
          Failed to load profile
        </h3>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div className="relative max-w-3xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md">

      {/* Top-right: Avatar + Sign Out */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200
         dark:border-slate-700 hover:ring-2 hover:ring-blue-500 transition-all">
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
            disabled={uploadingAvatar}
            className="absolute inset-0 opacity-0 cursor-pointer rounded-full"
          />

          {/* Camera icon overlay */}
          <div className="absolute bottom-0 right-0 bg-blue-600 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer border-2 border-white dark:border-slate-900">
            {uploadingAvatar ? (
              <Loader2 size={12} className="text-white animate-spin" />
            ) : (
              <Camera size={12} className="text-white" />
            )}
          </div>
        </div>
        
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
            disabled={updating}
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
            disabled={updating}
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
            disabled={updating}
            placeholder="Tell us about yourself..."
          />
        </div>

        {/* User Info Display */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Account Information</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>User ID:</strong> {user.id}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Account Type:</strong> {user.isAdmin ? 'Admin' : 'User'}
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full py-4 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:text-white"
          disabled={updating}
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Profile"
          )}
        </Button>
      </form>
    </div>
  );
}
