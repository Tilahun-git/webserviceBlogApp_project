"use client";

import React, { useState } from 'react';
import { UploadCloud, Loader2, X, FileText } from 'lucide-react';
import { toast } from "sonner"; 
import Image from  'next/image'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    category: 'uncategorized', 
    content: '', 
    imagePath: '' 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        toast.error("File too large. Max size is 2MB");
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }
    
    setUploading(true);

    try {
      let uploadedImagePath = formData.imagePath;

      // 1. Upload Image to Spring Boot
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append("file", file);
        const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, {
          method: "POST",
          body: imageFormData, 
        });
        if (!imgRes.ok) throw new Error("Image upload failed");
        uploadedImagePath = await imgRes.text();
      }

      // 2. Submit Post JSON
      const postRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imagePath: uploadedImagePath }),
      });

      if (!postRes.ok) throw new Error("Failed to save post");

      toast.success("Post published successfully!");
      
      // Reset form
      setFormData({ title: '', category: 'uncategorized', content: '', imagePath: '' });
      setFile(null);
      setPreview(null);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto border shadow-md bg-white dark:bg-slate-950">
      <CardHeader className="flex flex-row items-center gap-3">
        <FileText className="w-6 h-6 text-blue-600" />
        <CardTitle className="text-2xl font-bold tracking-tight">Create New Post</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handlePublish} className="space-y-6">
          
          {/* Title and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Post Title</label>
              <Input 
                placeholder="Give your story a name..." 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Category</label>
              <Select 
                value={formData.category}
                onValueChange={(val) => setFormData({...formData, category: val})}
              >
                <SelectTrigger className="bg-transparent">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nextjs">Next.js</SelectItem>
                  <SelectItem value="spring-boot">Spring Boot</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image Upload Zone */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Cover Image</label>
            <div className="relative group border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8
             hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex flex-col items-center 
             justify-center min-h-55">
              {preview ? (
                <div className="relative w-full overflow-hidden rounded-lg">
                  <Image src={preview} alt="Preview" className="max-h-75 w-auto mx-auto object-contain rounded-md" />
                  <Button 
                    type="button"
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 rounded-full h-8 w-8"
                    onClick={() => {setFile(null); setPreview(null)}}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center pointer-events-none">
                  <UploadCloud size={44} className="text-slate-400 mb-3 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Click to browse or drag and drop</p>
                  <p className="text-xs text-slate-400 mt-2">PNG, JPG or WEBP (Max 2MB)</p>
                </div>
              )}
              <Input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          {/* Plain Textarea Content */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Content Body</label>
            <Textarea 
              placeholder="What's on your mind? Write your post content here..."
              className="min-h-87.5 resize-y text-base leading-relaxed p-4"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 dark:text-white transition-all shadow-lg shadow-blue-500/20"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : "Publish Story"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}