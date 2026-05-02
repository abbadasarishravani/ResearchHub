'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FileText,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-updated';
import { useAuth } from '@/context/AuthContext';
import { usePapers } from '@/context/PaperContext';

// Skeleton Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded-md ${className || ''}`} />
);

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { papers, stats, isLoading: papersLoading } = usePapers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (!mounted || authLoading || papersLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-1 h-64 rounded-xl" />
            <Skeleton className="lg:col-span-2 h-64 rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your research
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {[
            {
              icon: <FileText className="w-6 h-6" />,
              label: 'Total Papers',
              value: stats.total,
              color: 'bg-blue-500/10 text-blue-600',
            },
            {
              icon: <Clock className="w-6 h-6" />,
              label: 'Under Review',
              value: stats.underReview,
              color: 'bg-yellow-500/10 text-yellow-600',
            },
            {
              icon: <BookOpen className="w-6 h-6" />,
              label: 'Published',
              value: stats.published,
              color: 'bg-purple-500/10 text-purple-600',
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              label: 'Acceptance Rate',
              value: stats.total > 0 ? `${Math.round((stats.published / stats.total) * 100)}%` : '0%',
              color: 'bg-green-500/10 text-green-600',
            },
          ].map((stat, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Card className="hover:border-accent transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                    <div className={stat.color.split(' ')[0] === 'bg-blue-500/10' ? 'text-blue-600' : ''}>{stat.icon}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-accent" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/papers/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Paper
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/papers">
                    <FileText className="w-4 h-4 mr-2" />
                    View All Papers
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/reviews">
                    <BookOpen className="w-4 h-4 mr-2" />
                    See Pending Reviews
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/ai-features">
                    <Zap className="w-4 h-4 mr-2" />
                    Try AI Lab
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest research updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground flex flex-col items-center">
                  <Zap className="w-12 h-12 mb-3 opacity-20" />
                  <p>No recent activity</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Featured Papers */}
        <motion.div
          variants={itemVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Recent Papers</h2>
            <Button variant="ghost" asChild>
              <Link href="/papers" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {papers.length === 0 ? (
              <div className="col-span-full py-12 text-center bg-card rounded-xl border border-dashed border-border flex flex-col items-center">
                <FileText className="w-12 h-12 mb-3 text-muted-foreground/50" />
                <h3 className="text-lg font-medium text-foreground">No papers yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Get started by creating your first research paper.</p>
                <Button asChild>
                  <Link href="/papers/new"><Plus className="w-4 h-4 mr-2" /> Create Paper</Link>
                </Button>
              </div>
            ) : (
              papers.slice(0, 4).map((paper, i) => (
                <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.05 }}
              >
                <Link href={`/papers/${paper.id}`}>
                  <Card className="hover:border-accent hover:shadow-lg transition-all cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary">{paper.category}</Badge>
                        <Badge
                          variant={
                            paper.status === 'accepted'
                              ? 'default'
                              : paper.status === 'rejected'
                                ? 'destructive'
                                : 'secondary'
                          }
                        >
                          {paper.status}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                        {paper.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {paper.abstract}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{paper.views} views</span>
                        <span>{paper.downloads} downloads</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
