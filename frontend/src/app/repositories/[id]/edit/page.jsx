'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText, ArrowLeft, FolderOpen, Link as LinkIcon, Code, Save, X } from 'lucide-react';
export default function EditRepositoryPage() {
    const router = useRouter();
    const params = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        url: '',
        language: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchRepository();
    }, [router, params.id]);
    const fetchRepository = async () => {
        try {
            const data = await api.repositories.getOne(params.id);
            setFormData({
                name: data.name,
                description: data.description || '',
                url: data.url,
                language: data.language || '',
            });
        }
        catch (error) {
            console.error('Failed to fetch paper:', error);
            router.push('/papers');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.repositories.update(params.id, formData);
            router.push(`/papers/${params.id}`);
        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading repository...</p>
        </div>
      </div>);
    }
    return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Dashboard Navbar */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white"/>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResearchHub AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/papers">
              <Button variant="ghost" className="font-medium">
                <FolderOpen className="h-4 w-4 mr-2"/>
                Papers
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href={`/papers/${params.id}`} className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium">
            <ArrowLeft className="h-4 w-4"/>
            Back to Paper
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Edit Paper</h1>
            <p className="text-gray-600 dark:text-gray-300">Update paper information and settings</p>
          </div>

          <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paper Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <Input id="name" placeholder="Research Paper Title" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="pl-10 h-12"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Abstract
                  </label>
                  <Textarea id="description" placeholder="A brief abstract of your research paper" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-32"/>
                </div>

                <div className="space-y-2">
                  <label htmlFor="url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Repository URL <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <Input id="url" type="url" placeholder="https://github.com/username/repo" value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required className="pl-10 h-12"/>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="language" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Primary Language
                  </label>
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
                    <Input id="language" placeholder="TypeScript, JavaScript, Python, etc." value={formData.language} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="pl-10 h-12"/>
                  </div>
                </div>

                {error && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800">
                    {error}
                  </motion.div>)}

                <div className="flex gap-4 pt-4">
                  <Link href={`/repositories/${params.id}`} className="flex-1">
                    <Button variant="outline" className="w-full h-12 font-medium">
                      <X className="h-4 w-4 mr-2"/>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg shadow-blue-500/25" disabled={saving}>
                    {saving ? 'Saving...' : (<>
                        <Save className="h-4 w-4 mr-2"/>
                        Save Changes
                      </>)}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>);
}
