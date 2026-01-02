'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { UploadCloud } from 'lucide-react';



const SettingsPanel = () => {
  const [appName, setAppName] = useState('My Blog App');
  const [logo, setLogo] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [privacyRules, setPrivacyRules] = useState('Default privacy rules...');
  const [contentRules, setContentRules] = useState('Default content moderation rules...');
  const [seoTitle, setSeoTitle] = useState('My Blog App');
  const [seoDescription, setSeoDescription] = useState('Best blog app for developers');
 
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) setLogo(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const saveSettings = () => {
    // Here you would call your API to save settings
    console.log({
      appName,
      logo,
      maintenanceMode,
      privacyRules,
      contentRules,
      seoTitle,
      seoDescription,
      
    });
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-6 w-full space-y-6">
      <h1 className="text-2xl font-bold mb-4">Settings Panel</h1>

      {/* App Settings */}
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">App Name</label>
              <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">App Logo</label>
              <div className="flex items-center space-x-4">
    
                <label className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer">
                  <UploadCloud className="mr-2" /> Upload
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            <span>Maintenance Mode</span>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Content Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy & Content Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Privacy Rules</label>
            <Textarea value={privacyRules} onChange={(e) => setPrivacyRules(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content Moderation Rules</label>
            <Textarea value={contentRules} onChange={(e) => setContentRules(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">SEO Title</label>
            <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SEO Description</label>
            <Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          </div>
        </CardContent>
      </Card>

    

      {/* Save Button */}
      <div className="flex justify-end mt-4">
        <Button onClick={saveSettings}>Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
