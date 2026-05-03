'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Plus, MessageSquare, Trash2, FileText, LogOut, Search, Filter, FolderOpen, Edit } from 'lucide-react';
import { Input } from '@/components/ui/input';
export default function PapersPage() {
    const router = useRouter();
    const [papers, setPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }
        fetchPapers();
    }, [router]);
    const fetchPapers = async () => {
        try {
            const data = await api.repositories.getAll();
            setPapers(data);
        }
        catch (error) {
            console.error('Failed to fetch papers:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this paper?'))
            return;
        try {
            await api.repositories.delete(id);
            setPapers(papers.filter((paper) => paper.id !== id));
        }
        catch (error) {
            console.error('Failed to delete paper:', error);
        }
    };
    const filteredPapers = papers.filter((paper) => paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract?.toLowerCase().includes(searchQuery.toLowerCase()));
    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    };
    if (loading) {
        return (<div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-purple-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading papers...</p>
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
            <Link href="/dashboard">
              <Button variant="ghost" className="font-medium">Dashboard</Button>
            </Link>
            <Link href="/papers">
              <Button variant="ghost" className="font-medium">
                <FolderOpen className="h-4 w-4 mr-2"/>
                Papers
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="outline" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }} className="font-medium">
              <LogOut className="h-4 w-4 mr-2"/>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">Research Papers</h1>
              <p className="text-gray-600 dark:text-gray-300">Track and manage your research papers</p>
            </div>
            <Link href="/papers/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
                <Plus className="h-4 w-4 mr-2"/>
                New Paper
              </Button>
            </Link>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
              <Input placeholder="Search papers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12"/>
            </div>
            <Button variant="outline" className="h-12">
              <Filter className="h-4 w-4 mr-2"/>
              Filter
            </Button>
          </div>
        </motion.div>

        {filteredPapers.length === 0 ? (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-20">
            <FolderOpen className="h-20 w-20 text-gray-400 mx-auto mb-6"/>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {searchQuery ? 'No papers found' : 'No papers yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms or filters'
                : 'Start by creating your first research paper to get AI-powered analysis'}
            </p>
            {!searchQuery && (<Link href="/papers/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25">
                  <Plus className="h-4 w-4 mr-2"/>
                  Create Your First Paper
                </Button>
              </Link>)}
          </motion.div>) : (<motion.div variants={fadeInUp} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper, index) => (<motion.div key={paper.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="border-2 border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 hover:shadow-xl h-full">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{paper.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{paper.description || 'No description'}</p>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="font-medium">{paper.language || 'Unknown'}</Badge>
                      <Badge variant="outline" className="font-medium">
                        <MessageSquare className="h-3 w-3 mr-1"/>
                        {paper.codeReviews?.length || 0} reviews
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/repositories/${paper.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full font-medium">
                          View Details
                        </Button>
                      </Link>
                      <Link href={`/repositories/${paper.id}/edit`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full font-medium">
                          <Edit className="h-4 w-4 mr-1"/>
                          Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(paper.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>))}
          </motion.div>)}
      </main>
    </div>);
}
