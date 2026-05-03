'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ThemeToggle } from '@/components/theme-toggle';
import { FileText, ArrowLeft, Trash2, MessageSquare, CheckCircle, AlertCircle, Brain, Sparkles, FolderOpen, Calendar, Send, Code } from 'lucide-react';
export default function CodeReviewDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [codeReview, setCodeReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchData();
    }, [router, params.id]);
    const fetchData = async () => {
        try {
            const [reviewData, commentsData, suggestionsData] = await Promise.all([
                api.codeReviews.getOne(params.id),
                api.comments.getAll(params.id),
                api.suggestions.getAll(params.id),
            ]);
            setCodeReview(reviewData);
            setComments(commentsData);
            setSuggestions(suggestionsData);
        }
        catch (error) {
            console.error('Failed to fetch review:', error);
            router.push('/papers');
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim())
            return;
        try {
            const comment = await api.comments.create({
                codeReviewId: params.id,
                content: newComment,
            });
            setComments([...comments, comment]);
            setNewComment('');
        }
        catch (error) {
            console.error('Failed to add comment:', error);
        }
    };
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this paper review?'))
            return;
        try {
            await api.codeReviews.delete(params.id);
            router.push('/papers');
        }
        catch (error) {
            console.error('Failed to delete paper review:', error);
        }
    };
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading paper review...</p>
        </div>
      </div>);
    }
    if (!codeReview) {
        return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Review not found</p>
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/papers" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 font-medium">
            <ArrowLeft className="h-4 w-4"/>
            Back to Papers
          </Link>

          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">{codeReview.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">{codeReview.description}</p>
              </div>
              <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
                <Trash2 className="h-4 w-4 mr-2"/>
                Delete
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Badge variant={codeReview.status === 'COMPLETED' ? 'default' :
            codeReview.status === 'IN_PROGRESS' ? 'secondary' : 'outline'} className="font-medium">
                {codeReview.status}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <FolderOpen className="h-4 w-4"/>
                {codeReview.repository?.name || 'Unknown'}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4"/>
                {new Date(codeReview.createdAt).toLocaleDateString()}
              </div>
              {codeReview.aiAnalysis && (<div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Brain className="h-4 w-4"/>
                  AI Analyzed
                </div>)}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Code Snippet */}
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-500"/>
                  Code Snippet
                </h2>
                <pre className="bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
                  <code>{codeReview.codeSnippet}</code>
                </pre>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-500"/>
                  AI Analysis
                </h2>
                {codeReview.aiAnalysis ? (<div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Summary</h3>
                      <p className="text-gray-600 dark:text-gray-300">{codeReview.aiAnalysis.summary}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Issues Found</h3>
                      <ul className="space-y-2">
                        {codeReview.aiAnalysis.issues?.map((issue, i) => (<li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                            <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0"/>
                            <span>{issue}</span>
                          </li>))}
                      </ul>
                    </div>
                  </div>) : (<div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                    <p className="text-gray-500 dark:text-gray-400">No AI analysis available</p>
                  </div>)}
              </CardContent>
            </Card>
          </div>

          {/* Suggestions */}
          <div className="mt-6">
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500"/>
                  AI Suggestions
                </h2>
                {suggestions.length === 0 ? (<div className="text-center py-8">
                    <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                    <p className="text-gray-500 dark:text-gray-400">No suggestions yet</p>
                  </div>) : (<div className="space-y-3">
                    {suggestions.map((suggestion, index) => (<motion.div key={suggestion.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0"/>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{suggestion.title}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{suggestion.description}</p>
                          </div>
                        </div>
                      </motion.div>))}
                  </div>)}
              </CardContent>
            </Card>
          </div>

          {/* Comments */}
          <div className="mt-6">
            <Card className="border-2 border-gray-100 dark:border-gray-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-purple-500"/>
                  Comments ({comments.length})
                </h2>
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="relative">
                    <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="min-h-24 pr-12"/>
                    <Button type="submit" size="icon" className="absolute right-2 bottom-2" disabled={!newComment.trim()}>
                      <Send className="h-4 w-4"/>
                    </Button>
                  </div>
                </form>
                {comments.length === 0 ? (<div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4"/>
                    <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                  </div>) : (<div className="space-y-4">
                    {comments.map((comment, index) => (<motion.div key={comment.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {comment.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 dark:text-white">{comment.user?.name || 'Unknown'}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">{comment.content}</p>
                          </div>
                        </div>
                      </motion.div>))}
                  </div>)}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>);
}
