'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Filter, Search, Inbox, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

export default function ReviewsPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (!mounted || isLoading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Peer Reviews</h1>
            <p className="text-muted-foreground mt-1">Manage and track reviews for your research papers</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button className="gap-2">
              <Search className="w-4 h-4" /> Find Papers
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-24 px-4 text-center bg-card rounded-2xl border border-dashed border-border shadow-sm"
        >
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <Inbox className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No reviews yet</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't received any peer reviews for your papers yet. 
            Once your papers are submitted and assigned to reviewers, the feedback will appear here.
          </p>
          <Button asChild size="lg">
            <Link href="/papers">View My Papers</Link>
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
