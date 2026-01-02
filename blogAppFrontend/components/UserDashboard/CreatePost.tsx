"use client";

import  {axiosInstance} from "@/lib/api";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, X, FileText, ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import { AxiosInstance } from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { createPost, fetchCategories } from "@/lib/api";
import type { Category, CreatePostData } from "@/lib/api";

type FileType = "text" | "image" | "video";

export default function CreatePost() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileType, setFileType] = useState<FileType>("text");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    categoryId: 0,
  });

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch {
        toast.error("Failed to load categories");
      }
    };
    load();
  }, []);

  /* ================= FILE HANDLER ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const maxSize = fileType === "video" ? 50 * 1024 * 1024 : 2 * 1024 * 1024;

    if (selected.size > maxSize) {
      toast.error(
        fileType === "video"
          ? "Video too large (50MB max)"
          : "Image too large (2MB max)"
      );
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const resetMedia = () => {
    setFile(null);
    setPreview(null);
  };

  /* ================= SUBMIT ================= */
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.title.trim()) return toast.error("Title is required");
  if (!form.content.trim()) return toast.error("Content is required");
  if (!form.categoryId) return toast.error("Category is required");

  setLoading(true);

  try {
    const formData = new FormData();

    // Payload for post
    const payload: CreatePostData = {
      title: form.title,
      content: form.content,
      categoryId: form.categoryId,
    };

    // Append JSON post
    formData.append(
      "post",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );

    // Append media file ONLY if image/video
    if (fileType !== "text" && file) {
      formData.append("file", file);
    }else{
      const emptyFile = new File([], "empty.txt", { type: "text/plain" });
      formData.append("file", emptyFile);
    }

    // Choose correct endpoint based on type
    // if (fileType === "text") {
    //   // Text-only post endpoint (no file)
    //   await axiosInstance.post(`/api/posts/createPost/${form.categoryId}`, formData, {
    //     headers: { "Content-Type": "multipart/form-data" },
    //   });
    // } else {
      // Image/video post endpoint
      await createPost(formData, form.categoryId);
    // }

    toast.success("Post published successfully");

    // Reset form
    setForm({
      title: "",
      content: "",
      categoryId: categories[0]?.id ?? 0,
    });
    setFileType("text");
    resetMedia();
  } catch (err: any) {
    console.error("Failed to create post:", err.response?.data || err.message);
    if (err.response?.data?.message) {
      toast.error(`Failed to create post: ${err.response.data.message}`);
    } else {
      toast.error("Failed to create post");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-2">
        <FileText className="text-blue-600" />
        <CardTitle>Create Post</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* TITLE */}
          <div>
            <label className="font-semibold">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Post title"
            />
          </div>

          {/* CATEGORY + TYPE */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold">Category</label>
              <Select
                value={form.categoryId.toString()}
                onValueChange={(v) => setForm({ ...form, categoryId: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold">Post Type</label>
              <Select
                value={fileType}
                onValueChange={(v: FileType) => {
                  setFileType(v);
                  resetMedia();
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* MEDIA */}
          {fileType !== "text" && (
            <div>
              <label className="font-semibold">Media</label>
              <label className="border-2 border-dashed rounded-lg p-6 flex justify-center cursor-pointer">
                {preview ? (
                  <div className="relative">
                    {fileType === "image" ? (
                      <Image
                        src={preview}
                        alt="preview"
                        width={400}
                        height={300}
                        className="rounded"
                      />
                    ) : (
                      <video src={preview} controls className="rounded" />
                    )}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        resetMedia();
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    {fileType === "image" ? <ImageIcon /> : <VideoIcon />}
                    <p>Click to upload</p>
                  </div>
                )}
                <Input
                  type="file"
                  hidden
                  accept={fileType === "image" ? "image/*" : "video/*"}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}

          {/* CONTENT */}
          <div>
            <label className="font-semibold">Content</label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="min-h-[150px]"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" /> Publishing
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
