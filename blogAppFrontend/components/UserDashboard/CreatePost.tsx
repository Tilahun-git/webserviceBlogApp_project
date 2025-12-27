"use client";

import React, { useState } from "react";
import { Loader2, X, FileText, ImageIcon, VideoIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type FileType = "text" | "image" | "video";

export default function CreatePost() {
  const [fileType, setFileType] = useState<FileType>("text");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "uncategorized",
    content: "",
    mediaPath: "",
    mediaType: "TEXT",
  });

  /* ================= FILE PICK ================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const maxSize = fileType === "video" ? 50 * 1024 * 1024 : 2 * 1024 * 1024;

    if (selectedFile.size > maxSize) {
      toast.error(
        fileType === "video"
          ? "Video too large (max 50MB)"
          : "Image too large (max 2MB)"
      );
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  /* ================= RESET FILE ================= */
  const resetFile = () => {
    setFile(null);
    setPreview(null);
  };

  /* ================= SUBMIT ================= */
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    setUploading(true);

    try {
      let uploadedPath = "";

   

     

      /* Reset */
      setFormData({
        title: "",
        category: "uncategorized",
        content: "",
        mediaPath: "",
        mediaType: "TEXT",
      });
      setFileType("text");
      resetFile();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-md">
      <CardHeader className="flex items-center gap-3 flex-row">
        <FileText className="w-6 h-6 text-blue-600" />
        <CardTitle className="text-2xl font-bold">Create New Post:</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handlePublish} className="space-y-6">
          {/* ================= TITLE ================= */}
          <div>
            <label className="text-sm font-semibold">Title:</label>
            <Input
              required
              placeholder="Post title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              } />
          </div>

          {/* ================= CATEGORY + FILE TYPE ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-semibold">Category:</label>
              <Select
                value={formData.category}
                onValueChange={(val) =>
                  setFormData({ ...formData, category: val })
                }>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="spring-boot">Spring Boot</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-semibold">Post Type</label>
              <Select
                value={fileType}
                onValueChange={(val: FileType) => {
                  setFileType(val);
                  resetFile();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose type:" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">📝 Text</SelectItem>
                  <SelectItem value="image">🖼️ Photo</SelectItem>
                  <SelectItem value="video">🎥 Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ================= MEDIA PICKER ================= */}
          {fileType !== "text" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">
                {fileType === "image" ? "Photo" : "Video"}
              </label>
              <label
                htmlFor="media-upload"
                className="border-2 border-dashed rounded-xl p-8 min-h-55
                flex items-center justify-center cursor-pointer hover:border-blue-500">
                {preview ? (
                  <div className="relative w-full">
                    {fileType === "image" ? (
                      <Image
                        src={preview}
                        alt="Preview"
                        width={600}
                        height={400}
                        className="mx-auto rounded-md max-h-75 object-contain"/>
                    ) : (
                      <video
                        src={preview}
                        controls
                        className="mx-auto max-h-75 rounded-md"/>
                    )}

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.preventDefault();
                        resetFile();
                      }}>
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    {fileType === "image" ? (
                      <ImageIcon className="w-12 h-12 text-slate-400 mb-2" />
                    ) : (
                      <VideoIcon className="w-12 h-12 text-slate-400 mb-2" />
                    )}
                    <p>Click to browse</p>
                  </div>
                )}
              </label>
              <Input
                id="media-upload"
                type="file"
                accept={fileType === "image" ? "image/*" : "video/*"}
                onChange={handleFileChange}
                className="hidden"
              />
              </div>
          )}

          {/* ================= CONTENT ================= */}
          <div>
            <label className="text-sm font-semibold">Content:</label>
            <Textarea
              required
              placeholder="Write your post..."
              className="min-h-50"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
            />
          </div>

          {/* ================= SUBMIT ================= */}
          <Button
            type="submit"
            disabled={uploading}
            className="w-full py-6 text-lg font-bold"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Post"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}