'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText, ArrowLeft, Brain, Sparkles, FolderOpen, Calendar, User, Send, X } from 'lucide-react';

function NewPaperReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    repositoryId: searchParams.get('repositoryId') || '',
  });
  const [repositories, setRepositories] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingRepos, setLoadingRepos] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchRepositories();
  }, [router]);

  const fetchRepositories = async () => {
    try {
      const data = await api.repositories.getAll();
      setRepositories(data);
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.codeReviews.create(formData);
      router.push('/reviews');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Dashboard Navbar */}
      <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ResearchHub AI
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/papers">
              <Button variant="ghost" className="font-medium">
                <FolderOpen className="h-4 w-4 mr-2" />
                Papers
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/papers" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium">
            <ArrowLeft className="h-4 w-4" />
            Back to Papers
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">New Paper Review</h1>
            <p className="text-gray-600 dark:text-gray-300">Submit paper for AI-powered analysis and review</p>
          </div>

          <Card className="border-2 border-gray-100 dark:border-gray-800 shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Review Title <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="title"
                      placeholder="Review for paper"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="repository" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paper <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      id="repository"
                      value={formData.repositoryId}
                      onChange={(e) => setFormData({ ...formData, repositoryId: e.target.value })}
                      required
                      className="w-full h-12 px-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a paper</option>
                      {repositories.map((repo) => (
                        <option key={repo.id} value={repo.id}>
                          {repo.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you want to review, specific areas of concern, or goals for this review"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Paper Content <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    id="code"
                    placeholder="Paste your paper content here for analysis..."
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                    className="min-h-48 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Our AI will analyze your paper for suggestions and improvements
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-800"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-4 pt-4">
                  <Link href="/code-reviews" className="flex-1">
                    <Button variant="outline" className="w-full h-12 font-medium">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg shadow-blue-500/25"
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create & Analyze
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}

export default function NewPaperReviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPaperReviewContent />
    </Suspense>
  );
}
