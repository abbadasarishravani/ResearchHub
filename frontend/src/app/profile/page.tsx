'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Camera, Trash2, Save, LogOut } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, updateProfile, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    avatar: '',
  });

  useEffect(() => {
    setMounted(true);
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || '',
      });
    }
  }, [user, isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
  };

  const handleSave = () => {
    updateProfile({
      name: formData.name,
      avatar: formData.avatar,
    });
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your profile and account preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-accent/20 transition-opacity group-hover:opacity-75"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-accent/10 flex items-center justify-center border-4 border-dashed border-accent/20 group-hover:bg-accent/20 transition-colors">
                      <User className="w-12 h-12 text-accent" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="mt-6 flex flex-col gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                    Change Photo
                  </Button>
                  {formData.avatar && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleRemoveAvatar}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Info */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <CardDescription>Update your name and basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-accent" /> Full Name
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 opacity-70">
                      <Mail className="w-4 h-4 text-accent" /> Email Address
                    </label>
                    <Input
                      value={formData.email}
                      disabled
                      className="bg-secondary/50 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-muted-foreground">Email cannot be changed for security reasons.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 opacity-70">
                      <Shield className="w-4 h-4 text-accent" /> Account Role
                    </label>
                    <div className="px-3 py-2 bg-secondary/50 rounded-md text-sm border border-border">
                      {formData.role}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <Button variant="ghost" className="text-destructive" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Save className="w-4 h-4" /> Save Changes
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
