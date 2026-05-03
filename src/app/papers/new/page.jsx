'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FileText, Save, X, Info } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { usePapers } from '@/context/PaperContext';
export default function NewPaperPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { createPaper } = usePapers();
    const [mounted, setMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        abstract: '',
        content: '',
        category: 'ai',
    });
    useEffect(() => {
        setMounted(true);
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, authLoading, router]);
    if (!mounted || authLoading)
        return null;
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.abstract || !formData.content)
            return;
        setIsLoading(true);
        try {
            await createPaper({
                title: formData.title,
                abstract: formData.abstract,
                content: formData.content,
                category: formData.category,
            });
            router.push('/papers');
        }
        catch (err) {
            console.error('Failed to create paper:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Create New Paper</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Draft your research and submit it for AI analysis or peer review
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              <X className="w-4 h-4 mr-2"/> Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent"/>
                  Paper Information
                </CardTitle>
                <CardDescription>Basic details about your research paper</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Paper Title
                  </label>
                  <Input id="title" name="title" placeholder="Enter a descriptive title for your research" value={formData.title} onChange={handleChange} required/>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Research Category
                  </label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option value="ai">Artificial Intelligence</option>
                    <option value="ml">Machine Learning</option>
                    <option value="nlp">Natural Language Processing</option>
                    <option value="cv">Computer Vision</option>
                    <option value="data-science">Data Science</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Abstract */}
                <div className="space-y-2">
                  <label htmlFor="abstract" className="text-sm font-medium">
                    Abstract
                  </label>
                  <textarea id="abstract" name="abstract" rows={4} placeholder="A brief summary of your research goals and findings..." value={formData.abstract} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" required/>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Info className="w-5 h-5 text-accent"/>
                  Full Content
                </CardTitle>
                <CardDescription>Write or paste your full paper content here</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea id="content" name="content" rows={15} placeholder="Start writing your research paper content here..." value={formData.content} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono" required/>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                {isLoading ? (<>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-r-transparent mr-2"/>
                    Saving...
                  </>) : (<>
                    <Save className="w-4 h-4"/> Save Paper
                  </>)}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>);
}
