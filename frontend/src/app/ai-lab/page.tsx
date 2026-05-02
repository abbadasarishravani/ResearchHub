'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-updated';
import { 
  FileText, ArrowLeft, Brain, Sparkles, Zap, Shield, Target, 
  TrendingUp, CheckCircle, AlertTriangle, Info, Clock, 
  BarChart3, Lightbulb, Search, ArrowRight 
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuth } from '@/context/AuthContext';

export default function AILabPage() {
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

  const features = [
    {
      icon: Brain,
      title: 'Abstract Summarizer',
      description: 'AI-powered summarization of research papers, extracting key insights and findings in seconds.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      stats: '99.2% Accuracy'
    },
    {
      icon: Shield,
      title: 'Research Gap Analyzer',
      description: 'Identify gaps in existing literature and suggest new research directions based on comprehensive analysis.',
      color: 'bg-red-500/10 text-red-600 dark:text-red-400',
      stats: '50+ Analysis Types'
    },
    {
      icon: Target,
      title: 'Keyword Extractor',
      description: 'Automatically extract relevant keywords and topics from research papers for better indexing and discovery.',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      stats: '85% Precision'
    },
    {
      icon: TrendingUp,
      title: 'Quality Scoring',
      description: 'Comprehensive paper quality assessment based on methodology, citations, clarity, and impact potential.',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400',
      stats: 'Real-time Metrics'
    },
    {
      icon: Zap,
      title: 'Citation Analysis',
      description: 'Analyze citation patterns and identify influential papers and research connections automatically.',
      color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      stats: '< 5s Response'
    },
    {
      icon: Lightbulb,
      title: 'Methodology Review',
      description: 'Evaluate research methodology and suggest improvements for better experimental design and analysis.',
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      stats: '100+ Patterns'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Next-Gen Research Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                AI <span className="text-accent">Lab</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Advanced machine learning tools designed to accelerate your research and improve publication quality.
              </p>
            </div>
            <Button size="lg" className="gap-2 shadow-lg shadow-accent/20" asChild>
              <Link href="/papers/new">
                <Search className="w-5 h-5" /> Analyze New Paper
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Analyses Run', value: '12.4k', icon: BarChart3, color: 'text-blue-500' },
              { label: 'Insights Found', value: '45.2k', icon: Lightbulb, color: 'text-yellow-500' },
              { label: 'Time Saved', value: '840h', icon: Clock, color: 'text-green-500' },
              { label: 'Success Rate', value: '99.8%', icon: CheckCircle, color: 'text-purple-500' },
            ].map((stat, i) => (
              <Card key={i} className="border-none bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-background border border-border shadow-sm`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full hover:border-accent transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8 space-y-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                      <feature.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between border-t border-border">
                      <Badge variant="secondary">{feature.stats}</Badge>
                      <span className="text-accent text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="overflow-hidden border-none bg-accent/5">
              <CardHeader className="bg-accent/10 border-b border-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent" />
                  How it works
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  { title: 'Upload', desc: 'Securely upload your research paper in PDF or Markdown format.' },
                  { title: 'Process', desc: 'Our neural networks analyze the structure and semantics of your work.' },
                  { title: 'Report', desc: 'Receive a comprehensive report with actionable feedback and insights.' },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent text-white flex-shrink-0 flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-foreground">{step.title}</p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-none bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Key Capabilities
                </CardTitle>
                <CardDescription>Advanced research analysis features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Citation Network Analysis',
                    'Methodological Consistency',
                    'Ethical Guideline Check',
                    'Impact Factor Prediction',
                    'Reference Validation',
                    'Cross-domain Relevance',
                    'Automated Formatting',
                    'Plagiarism Detection'
                  ].map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground bg-background p-3 rounded-lg border border-border">
                      <Zap className="w-4 h-4 text-accent" />
                      {cap}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
