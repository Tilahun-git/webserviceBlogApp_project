"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface SettingsData {
  siteTitle: string;
  maintenanceMode: boolean;
  postsPerPage: number;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    siteTitle: "",
    maintenanceMode: false,
    postsPerPage: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings({
          siteTitle: data.siteTitle ?? "My Blog",
          maintenanceMode: Boolean(data.maintenanceMode),
          postsPerPage: Number(data.postsPerPage ?? 10),
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error loading settings");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data && data.message) || "Failed to save settings");
      setSuccess("Settings saved successfully");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin Settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage site-wide configuration for your blog.</p>

      {loading ? (
        <div className="text-sm">Loading settings...</div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="siteTitle">Site Title</Label>
            <Input
              id="siteTitle"
              placeholder="Enter site title"
              value={settings.siteTitle}
              onChange={(e) => setSettings((s) => ({ ...s, siteTitle: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance">Maintenance Mode</Label>
              <p className="text-xs text-muted-foreground">Temporarily take the site offline for updates.</p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => setSettings((s) => ({ ...s, maintenanceMode: checked }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postsPerPage">Posts Per Page</Label>
            <Input
              id="postsPerPage"
              type="number"
              min={1}
              max={100}
              value={settings.postsPerPage}
              onChange={(e) => setSettings((s) => ({ ...s, postsPerPage: Number(e.target.value) }))}
            />
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
            {error && <span className="text-sm text-red-500">{error}</span>}
            {success && <span className="text-sm text-green-600">{success}</span>}
          </div>
        </div>
      )}
    </div>
  );
}