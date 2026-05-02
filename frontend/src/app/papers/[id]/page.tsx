'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit2, Trash2, Download, Share2, Eye } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-updated';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { usePapers } from '@/context/PaperContext';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaperDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { getPaperById, deletePaper, isLoading: papersLoading } = usePapers();
  const [mounted, setMounted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const paper = getPaperById(resolvedParams.id);
  // We'll hide reviews for now if they are mock and not linked to new papers
  const paperReviews: any[] = []; 

  if (!mounted || authLoading || papersLoading) return null;

  if (!paper) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Paper not found</h1>
          <Button asChild className="mt-4">
            <Link href="/papers">Back to Papers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deletePaper(resolvedParams.id);
    setShowDeleteConfirm(false);
    router.push('/papers');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-3">{paper.title}</h1>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                  {paper.author.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{paper.author.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(paper.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/papers/${paper.id}/edit`}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{paper.category}</Badge>
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
            {paper.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {paper.views} views
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-4 h-4" /> {paper.downloads} downloads
            </span>
          </div>
        </motion.div>

        {/* Abstract */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Abstract</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{paper.abstract}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Full Paper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <div className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {paper.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({paperReviews.length})</CardTitle>
              <CardDescription>Peer feedback and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              {paperReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews yet</p>
              ) : (
                <div className="space-y-6">
                  {paperReviews.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={review.reviewer.avatar}
                            alt={review.reviewer.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-foreground">{review.reviewer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-muted-foreground'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <Badge className="mb-3">
                        {review.recommendation === 'accept'
                          ? 'Accept'
                          : review.recommendation === 'reject'
                            ? 'Reject'
                            : 'Revision Needed'}
                      </Badge>
                      <p className="text-sm text-foreground">{review.comments}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Paper</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this paper? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
