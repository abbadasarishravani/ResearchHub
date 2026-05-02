'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge-updated';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Sparkles,
  CheckCircle2,
  Brain,
  TrendingUp,
  MessageSquare,
  Star,
  ChevronRight,
  Zap,
  Shield,
  Users,
  FileText,
  Clock,
  Lightbulb,
  Lock,
  BookOpen,
  Plus,
  ArrowRight,
  BarChart3,
  Search,
  Code
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { usePapers } from '@/context/PaperContext';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { papers, stats, isLoading: papersLoading } = usePapers();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  if (!mounted || isLoading || (isAuthenticated && papersLoading)) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* 1. Hero Section */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-bold mb-8 border border-accent/20">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen Research Platform</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold mb-8 text-foreground tracking-tight leading-[1.1]">
              Transform Your Research
              <br />
              <span className="bg-gradient-to-r from-accent via-blue-500 to-purple-600 bg-clip-text text-transparent">
                With AI Intelligence
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Elevate your research quality with intelligent analysis, automated summarization, and collaborative review tools. 
              Publish better papers, faster.
            </p>

            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button size="lg" className="h-14 px-10 text-lg rounded-2xl shadow-xl shadow-accent/20 transition-all hover:scale-105" asChild>
                  <Link href="/register">
                    Get Started Free
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg rounded-2xl border-2 transition-all hover:bg-secondary" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </section>

        {/* 2. User Dashboard Section (Visible only when logged in) */}
        {isAuthenticated && user && (
          <section className="py-20 bg-accent/[0.03] border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div>
                  <h2 className="text-3xl font-bold text-foreground">
                    Welcome back, <span className="text-accent">{user.name}</span>!
                  </h2>
                  <p className="text-muted-foreground mt-2 text-lg">Your research workspace is ready.</p>
                </div>
                <div className="flex gap-4">
                  <Button className="rounded-xl shadow-lg" asChild>
                    <Link href="/papers/new">
                      <Plus className="w-4 h-4 mr-2" /> Create Paper
                    </Link>
                  </Button>
                  <Button variant="outline" className="rounded-xl" asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-xl bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-accent" />
                      Recent Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6 mb-10">
                      {[
                        { label: 'Papers', val: stats.total, color: 'text-blue-500' },
                        { label: 'In Review', val: stats.underReview, color: 'text-yellow-500' },
                        { label: 'Published', val: stats.published, color: 'text-green-500' },
                      ].map((s, i) => (
                        <div key={i} className="bg-background rounded-2xl p-6 border border-border shadow-sm text-center">
                          <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.val}</p>
                          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">Latest Research</h4>
                    {papers.length === 0 ? (
                      <div className="text-center py-12 bg-background/40 rounded-2xl border-2 border-dashed border-border">
                        <FileText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No papers created yet</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {papers.slice(0, 3).map((paper) => (
                          <Link key={paper.id} href={`/papers/${paper.id}`}>
                            <div className="p-4 rounded-xl bg-background border border-border hover:border-accent transition-all flex justify-between items-center group shadow-sm hover:shadow-md">
                              <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-foreground group-hover:text-accent transition-colors truncate max-w-[200px] sm:max-w-md">
                                  {paper.title}
                                </span>
                              </div>
                              <ArrowRight className="w-5 h-5 text-accent transform translate-x--2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Zap className="w-5 h-5 text-accent" />
                        Quick Lab
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="secondary" className="w-full h-12 justify-start gap-3 rounded-xl hover:bg-accent/10 transition-colors" asChild>
                        <Link href="/ai-lab">
                          <Brain className="w-5 h-5 text-accent" /> AI Analysis
                        </Link>
                      </Button>
                      <Button variant="secondary" className="w-full h-12 justify-start gap-3 rounded-xl hover:bg-accent/10 transition-colors" asChild>
                        <Link href="/reviews">
                          <MessageSquare className="w-5 h-5 text-accent" /> Peer Reviews
                        </Link>
                      </Button>
                      <Button variant="secondary" className="w-full h-12 justify-start gap-3 rounded-xl hover:bg-accent/10 transition-colors" asChild>
                        <Link href="/profile">
                          <Users className="w-5 h-5 text-accent" /> Profile Settings
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-xl bg-gradient-to-br from-accent/10 to-blue-500/10 backdrop-blur-sm">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center mx-auto shadow-lg">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="font-bold text-foreground">Premium Insights</h4>
                      <p className="text-sm text-muted-foreground">Get deeper AI feedback on your next submission.</p>
                      <Button variant="outline" className="w-full border-accent/20 text-accent hover:bg-accent/10" asChild>
                        <Link href="/ai-lab">Try Premium Tools</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. Features Section */}
        <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground tracking-tight">Powerful Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage, review, and optimize your research work in one intelligent platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: <FileText className="w-8 h-8" />,
                title: 'Paper Management',
                desc: 'Create, organize, and manage research papers with intuitive CRUD operations and folder structures.',
              },
              {
                icon: <Brain className="w-8 h-8" />,
                title: 'AI Analysis',
                desc: 'Automated summarization, keyword extraction, and deep content analysis for better understanding.',
              },
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: 'Collaborative Reviews',
                desc: 'Submit and receive detailed peer reviews with structured feedback and recommendation scores.',
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Impact Insights',
                desc: 'Track paper metrics, citations, views, and downloads with comprehensive analytics dashboard.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Secure & Private',
                desc: 'Enterprise-grade encryption for all research data and strictly controlled role-based access.',
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: 'Real-Time Sync',
                desc: 'Collaborate with your team in real-time with instant updates across all your research entities.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-2"
              >
                <div className="text-accent mb-8 bg-accent/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 4. How It Works */}
        <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 bg-secondary/30 border-y border-border scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground tracking-tight">Simple Workflow</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Designed for researchers who want to focus on discovery, not logistics.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { n: '1', t: 'Sign Up', d: 'Choose your role as Researcher or Reviewer and set up your lab.' },
                { n: '2', t: 'Submit Paper', d: 'Upload your research papers with abstracts and full content.' },
                { n: '3', t: 'Peer Review', d: 'Receive high-quality feedback from matched peer experts.' },
                { n: '4', t: 'Publish', d: 'Finalize your research and publish accepted work to the hub.' },
              ].map((s, i) => (
                <div key={i} className="text-center relative">
                  <div className="w-20 h-20 rounded-3xl bg-accent text-white flex items-center justify-center text-3xl font-extrabold mx-auto mb-8 shadow-xl shadow-accent/20 relative z-10">
                    {s.n}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-foreground">{s.t}</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">{s.d}</p>
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-accent/20 -z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. AI Features Section (MARKETING) */}
        <section id="ai-features" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-500 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-blue-500/20">
                <Brain className="h-4 w-4" />
                <span>Deep Learning Intelligence</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground tracking-tight leading-tight">
                AI That Understands <br />
                <span className="text-blue-500">The Nuance</span> of Science
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                Our advanced neural networks go beyond simple keyword matching. We analyze the structure, methodology, and logic of your research to provide truly expert feedback.
              </p>
              <ul className="space-y-6">
                {[
                  { t: 'Logical Consistency', d: 'Identify contradictions in research findings.' },
                  { t: 'Methodology Validation', d: 'Check if experimental designs meet standards.' },
                  { t: 'Citation Context', d: 'Ensure references are used in the correct context.' },
                ].map((item, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{item.t}</p>
                      <p className="text-muted-foreground">{item.d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-blue-500/20 rounded-3xl blur-3xl -z-10" />
              <Card className="border-none shadow-2xl bg-card/80 backdrop-blur-md p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <Badge variant="outline" className="border-blue-500/30 text-blue-500">AI Analysis Terminal</Badge>
                </div>
                <div className="space-y-6 font-mono text-sm">
                  <div className="flex gap-3 text-blue-500">
                    <span>$</span>
                    <span>rh analyze --file=paper_v2.pdf</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="text-green-500">✓ Parsing methodology structure...</p>
                    <p className="text-green-500">✓ Cross-referencing 42.1M citations...</p>
                    <p className="animate-pulse">◌ Generating consistency report...</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border mt-8">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-4 h-4 text-accent" />
                      <span className="font-bold text-accent uppercase text-xs tracking-widest">AI Insight</span>
                    </div>
                    <p className="text-foreground leading-relaxed italic">
                      "Sample size in Section 3.2 may be insufficient for the projected confidence interval. Suggesting additional power analysis."
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* 6. Testimonials */}
        <section id="testimonials" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-foreground tracking-tight">Trusted by Academics</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join the global community of researchers who have transformed their publication success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                author: 'Dr. Emily Watson',
                role: 'AI Researcher, Stanford',
                content: 'ResearchHub AI has cut my paper management time by 70%. The AI features are incredibly accurate and saved me months of revision.',
                rating: 5,
              },
              {
                author: 'Prof. Michael Chen',
                role: 'Computer Science, MIT',
                content: 'The peer review system is intuitive and efficient. My team loves using it for collaborative work and tracking citation impact.',
                rating: 5,
              },
              {
                author: 'Dr. Sarah Rodriguez',
                role: 'Bioinformatics, Oxford',
                content: 'A game-changer for research management. The UI is clean, and the AI insights are exactly what we needed for methodology validation.',
                rating: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-card p-10 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="flex gap-1 mb-8">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-10 italic leading-relaxed text-xl font-medium">"{t.content}"</p>
                <div className="border-t border-border pt-8 flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-extrabold text-xl">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-foreground text-lg">{t.author}</p>
                    <p className="text-sm text-muted-foreground font-semibold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 7. CTA Section */}
        {!isAuthenticated && (
          <section className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative text-center bg-gradient-to-br from-accent to-blue-600 rounded-[3rem] p-16 sm:p-24 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -mr-64 -mt-64" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black/10 rounded-full blur-[120px] -ml-64 -mb-64" />
              
              <h2 className="text-5xl sm:text-6xl font-extrabold mb-8 text-white relative z-10 tracking-tight">Ready to Transform Your Research?</h2>
              <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto relative z-10 leading-relaxed font-medium">
                Join thousands of researchers today and experience the future of scientific collaboration.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
                <Button size="lg" className="h-16 px-12 text-xl font-bold rounded-2xl bg-white text-accent hover:bg-white/90 shadow-2xl transition-all hover:scale-105" asChild>
                  <Link href="/register">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold rounded-2xl border-white/20 text-white hover:bg-white/10 transition-all" asChild>
                  <Link href="/login">Sign In Now</Link>
                </Button>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
