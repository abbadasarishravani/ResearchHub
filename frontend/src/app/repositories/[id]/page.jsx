'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText, ArrowLeft, FolderOpen, MessageSquare, Edit, Trash2, ExternalLink, Calendar, Code } from 'lucide-react';
export default function RepositoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [repository, setRepository] = useState(null);
    const [loading, setLoading] = useState(true);
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
            setRepository(data);
        }
        catch (error) {
            console.error('Failed to fetch paper:', error);
            router.push('/papers');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this repository?'))
            return;
        try {
            await api.repositories.delete(params.id);
            router.push('/papers');
        }
        catch (error) {
            console.error('Failed to delete paper:', error);
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
    if (!repository) {
        return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Paper not found</p>
          <Link href="/papers">
            <Button className="mt-4">Back to Papers</Button>
          </Link>
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

      <main className="max-w-5xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/papers" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium">
            <ArrowLeft className="h-4 w-4"/>
            Back to Papers
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{repository.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">{repository.description || 'No abstract provided'}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/repositories/${repository.id}/edit`} className="flex-1 sm:flex-none">
                  <Button variant="outline" className="font-medium">
                    <Edit className="h-4 w-4 mr-2"/>
                    Edit
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                  <Trash2 className="h-4 w-4"/>
                </Button>
              </div>
            </div>

            {repository.url && (<a href={repository.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline font-medium">
                <ExternalLink className="h-4 w-4"/>
                {repository.url}
              </a>)}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-3">
                    <MessageSquare className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {repository.codeReviews?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Reviews</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                    <Code className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                      {repository.language || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Language</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 p-3">
                    <Calendar className="h-6 w-6 text-white"/>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {new Date(repository.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Reviews Section */}
          <Card className="border-2 border-gray-100 dark:border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h2>
                <Link href={`/reviews/new?paperId=${repository.id}`}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <MessageSquare className="h-4 w-4 mr-2"/>
                    Add Review
                  </Button>
                </Link>
              </div>

              {repository.codeReviews?.length === 0 ? (<div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No reviews yet</p>
                  <Link href={`/reviews/new?paperId=${repository.id}`}>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <MessageSquare className="h-4 w-4 mr-2"/>
                      Create First Review
                    </Button>
                  </Link>
                </div>) : (<div className="space-y-3">
                  {repository.codeReviews.map((review, index) => (<motion.div key={review.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors cursor-pointer">
                      <div className="flex-1">
                        <Link href={`/reviews/${review.id}`}>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{review.title}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      </div>
                      <Badge variant={review.status === 'COMPLETED' ? 'default' :
                    review.status === 'IN_PROGRESS' ? 'secondary' : 'outline'} className="font-medium">
                        {review.status}
                      </Badge>
                    </motion.div>))}
                </div>)}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>);
}
