"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { type Post } from "@/lib/api";

interface PostFormModalProps {
  post: Post | null;
  open: boolean;
  onClose: () => void;
  onSave: (post: Partial<Post>) => void;
}

export default function PostFormModal({ post, open, onClose, onSave }: PostFormModalProps) {
  const [formData, setFormData] = useState<Partial<Post>>({});

  useEffect(() => {
    if (post) {
      setFormData(post);
    } else {
      setFormData({});
    }
  }, [post]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked: boolean, id: string) => {
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={open} onClose={onClose} size="md">
      <Modal.Header>{post ? "Edit Post" : "Create Post"}</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" type="text" value={formData.title || ""} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => handleSelectChange(value, "category")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={formData.category || "Select a category"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="nextjs">Next.js</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" value={formData.content || ""} onChange={handleChange} required rows={10} />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={formData.published || false}
              onCheckedChange={(checked) => handleSwitchChange(checked, "published")}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}