'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, Grid, List, FileText } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-updated';
import { useAuth } from '@/context/AuthContext';
import { usePapers } from '@/context/PaperContext';
export default function PapersPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const { papers, isLoading: papersLoading } = usePapers();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [sortBy, setSortBy] = useState('latest');
    useEffect(() => {
        setMounted(true);
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);
    if (!mounted || authLoading || papersLoading)
        return null;
    const filtered = papers.filter((paper) => {
        const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
        const matchesStatus = selectedStatus === 'all' || paper.status === selectedStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'latest') {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return b.views - a.views;
    });
    const categories = ['ai', 'ml', 'nlp', 'cv', 'data-science', 'other'];
    const statuses = ['draft', 'submitted', 'under-review', 'accepted', 'rejected'];
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Research Papers</h1>
            <p className="text-muted-foreground">Manage and explore all your research papers</p>
          </div>
          <Button asChild>
            <Link href="/papers/new" className="flex items-center gap-2">
              <Plus className="w-4 h-4"/>
              New Paper
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
            <Input placeholder="Search papers by title or abstract..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10"/>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Category Filter */}
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground">
              <option value="all">All Categories</option>
              {categories.map((cat) => (<option key={cat} value={cat}>
                  {cat.replace('-', ' ').toUpperCase()}
                </option>))}
            </select>

            {/* Status Filter */}
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground">
              <option value="all">All Statuses</option>
              {statuses.map((status) => (<option key={status} value={status}>
                  {status.replace('-', ' ').toUpperCase()}
                </option>))}
            </select>

            {/* Sort */}
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-border rounded-md text-sm bg-background text-foreground">
              <option value="latest">Latest</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-accent text-white' : 'bg-secondary'}`}>
                <Grid className="w-4 h-4"/>
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-accent text-white' : 'bg-secondary'}`}>
                <List className="w-4 h-4"/>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {sorted.length === 0 ? (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card rounded-2xl border border-dashed border-border shadow-sm">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-muted-foreground/50"/>
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-2">No Papers Found</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              We couldn't find any papers matching your search and filter criteria. Try adjusting your filters or clearing them to see all papers.
            </p>
            <Button size="lg" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedStatus('all');
            }} className="gap-2">
              <Filter className="w-4 h-4"/> Clear Filters
            </Button>
          </motion.div>) : (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sorted.map((paper, i) => (<motion.div key={paper.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link href={`/papers/${paper.id}`}>
                  <Card className="hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3 gap-2">
                        <Badge variant="secondary">{paper.category}</Badge>
                        <Badge variant={paper.status === 'accepted'
                    ? 'default'
                    : paper.status === 'rejected'
                        ? 'destructive'
                        : 'secondary'}>
                          {paper.status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground mb-2 line-clamp-2">
                        {paper.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>By {paper.author.name}</span>
                        <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>))}
          </motion.div>)}
      </main>
    </div>);
}
