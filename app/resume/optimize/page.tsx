'use client';
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  FileText,
  ArrowRight,
  BarChart3,
  Clock,
  Zap,
  Brain,
  Award,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import Link from 'next/link';

const optimizationSteps = [
  { id: 1, title: 'Analyzing Job Description', status: 'completed' },
  { id: 2, title: 'Extracting Key Requirements', status: 'completed' },
  { id: 3, title: 'Matching Your Experience', status: 'completed' },
  { id: 4, title: 'Generating Recommendations', status: 'active' },
  { id: 5, title: 'Finalizing Optimizations', status: 'pending' }
];

const analysisResults = {
  keywordMatch: 78,
  atsCompatibility: 92,
  readabilityScore: 85,
  impactScore: 71
};

const recommendations = [
  {
    type: 'high',
    category: 'Keywords',
    title: 'Add missing technical skills',
    description: 'Include "microservices", "Kubernetes", and "CI/CD" in your experience section',
    impact: 'High Impact',
    before: 'Developed web applications using React and Node.js',
    after: 'Developed scalable web applications using React, Node.js, and microservices architecture with Kubernetes deployment and CI/CD pipeline integration'
  },
  {
    type: 'medium',
    category: 'Experience',
    title: 'Quantify achievements',
    description: 'Add specific metrics to demonstrate your impact',
    impact: 'Medium Impact',
    before: 'Improved application performance',
    after: 'Improved application performance by 40%, reducing page load times from 3.2s to 1.9s'
  },
  {
    type: 'low',
    category: 'Format',
    title: 'Optimize section order',
    description: 'Move "Projects" section above "Education" for better visibility',
    impact: 'Low Impact',
    before: 'Education → Projects → Skills',
    after: 'Projects → Skills → Education'
  }
];

interface ParsedResume {
  id: string;
  title: string;
  sections: Array<{
    id: string;
    type: string;
    title: string;
    content: string;
    confidence: number;
    wordCount: number;
  }>;
  metadata: {
    confidence: number;
    parsingMethod: string;
    wordCount: number;
    technologiesFound: string[];
    warnings: string[];
  };
}

export default function OptimizePage() {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [acceptedRecommendations, setAcceptedRecommendations] = useState(new Set());
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);

  useEffect(() => {
    // Load parsed resume from localStorage
    const stored = localStorage.getItem('parsedResume');
    if (stored) {
      try {
        setParsedResume(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to load parsed resume:', error);
      }
    }
  }, []);

  const handleOptimize = () => {
    if (!jobDescription.trim() || !parsedResume) return;
    
    setIsAnalyzing(true);
    // Simulate AI optimization process
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  const toggleRecommendation = (index: number) => {
    const newAccepted = new Set(acceptedRecommendations);
    if (newAccepted.has(index)) {
      newAccepted.delete(index);
    } else {
      newAccepted.add(index);
    }
    setAcceptedRecommendations(newAccepted);
  };

  const getImpactColor = (type: string) => {
    switch (type) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Step 2: AI Resume Optimization
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto">
              Now that we've parsed your resume, let's optimize it for a specific job description.
            </p>
            <div className="mt-4">
              <Link href="/resume">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Resume Upload
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Resume Summary */}
        {parsedResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  Resume Ready for Optimization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {parsedResume.sections.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Sections</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {parsedResume.metadata.wordCount}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Words</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {parsedResume.metadata.technologiesFound.length}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Technologies</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-slate-900 dark:text-white">
                      {Math.round(parsedResume.metadata.confidence * 100)}%
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">Parse Confidence</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!parsedResume && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card>
              <CardContent className="p-8">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Resume Data Found
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Please upload and parse your resume first before proceeding with optimization.
                </p>
                <Link href="/resume">
                  <Button>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go to Resume Upload
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-blue-500" />
                  Job Description Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="jobDescription" className="text-base font-semibold">
                    Paste the job description you're targeting
                  </Label>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-3">
                    Our AI will analyze the requirements and optimize your resume accordingly
                  </p>
                  <Textarea
                    id="jobDescription"
                    rows={10}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Senior Software Engineer

We are looking for an experienced Senior Software Engineer to join our growing team. The ideal candidate will have:

• 5+ years of experience with React, Node.js, and TypeScript
• Experience with microservices architecture and Kubernetes
• Strong knowledge of CI/CD pipelines and DevOps practices
• Experience with AWS cloud services
• Bachelor's degree in Computer Science or related field

Responsibilities:
• Design and develop scalable web applications
• Lead technical initiatives and mentor junior developers
• Collaborate with cross-functional teams to deliver high-quality products
• Implement best practices for code quality and testing

Join us to work on cutting-edge technology and make a real impact!"
                    className="min-h-[250px]"
                  />
                </div>

                <Button 
                  onClick={handleOptimize}
                  disabled={!jobDescription.trim() || !parsedResume || isAnalyzing}
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Optimize My Resume
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <Card>
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      AI is analyzing your resume...
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {optimizationSteps.map((step, index) => (
                      <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.3 }}
                        className="flex items-center space-x-3"
                      >
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : step.status === 'active' ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <RefreshCw className="w-5 h-5 text-blue-500" />
                          </motion.div>
                        ) : (
                          <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-600 rounded-full" />
                        )}
                        <span className={`${
                          step.status === 'completed' ? 'text-slate-900 dark:text-white' : 'text-slate-500'
                        }`}>
                          {step.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Analysis Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-green-500" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { 
                        label: 'Keyword Match', 
                        value: analysisResults.keywordMatch, 
                        icon: Target,
                        color: analysisResults.keywordMatch >= 80 ? 'text-green-500' : analysisResults.keywordMatch >= 60 ? 'text-yellow-500' : 'text-red-500'
                      },
                      { 
                        label: 'ATS Compatibility', 
                        value: analysisResults.atsCompatibility, 
                        icon: CheckCircle2,
                        color: analysisResults.atsCompatibility >= 80 ? 'text-green-500' : analysisResults.atsCompatibility >= 60 ? 'text-yellow-500' : 'text-red-500'
                      },
                      { 
                        label: 'Readability', 
                        value: analysisResults.readabilityScore, 
                        icon: FileText,
                        color: analysisResults.readabilityScore >= 80 ? 'text-green-500' : analysisResults.readabilityScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                      },
                      { 
                        label: 'Impact Score', 
                        value: analysisResults.impactScore, 
                        icon: Award,
                        color: analysisResults.impactScore >= 80 ? 'text-green-500' : analysisResults.impactScore >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                      >
                        <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                          {metric.value}%
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {metric.label}
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Lightbulb className="w-6 h-6 mr-2 text-yellow-500" />
                      AI Recommendations ({acceptedRecommendations.size}/{recommendations.length} applied)
                    </CardTitle>
                    <Button
                      onClick={() => setAcceptedRecommendations(new Set(recommendations.map((_, i) => i)))}
                      variant="outline"
                      size="sm"
                    >
                      Accept All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border-2 rounded-lg p-4 transition-all ${
                        acceptedRecommendations.has(index)
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Badge className={getImpactColor(rec.type)}>
                            {rec.impact}
                          </Badge>
                          <Badge variant="outline">{rec.category}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant={acceptedRecommendations.has(index) ? "default" : "outline"}
                          onClick={() => toggleRecommendation(index)}
                        >
                          {acceptedRecommendations.has(index) ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Applied
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Apply
                            </>
                          )}
                        </Button>
                      </div>

                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        {rec.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        {rec.description}
                      </p>

                      <div className="space-y-3">
                        <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-200 dark:border-red-800">
                          <div className="flex items-center mb-2">
                            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                            <span className="font-medium text-red-700 dark:text-red-300">Before</span>
                          </div>
                          <p className="text-sm text-red-600 dark:text-red-400">{rec.before}</p>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="w-5 h-5 text-slate-400" />
                        </div>

                        <div className="bg-green-50 dark:bg-green-950 p-3 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                            <span className="font-medium text-green-700 dark:text-green-300">After</span>
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400">{rec.after}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex space-x-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Apply Selected Changes
                </Button>
                <Button size="lg" variant="outline">
                  <FileText className="w-5 h-5 mr-2" />
                  Download Optimized Resume
                </Button>
                <Button size="lg" variant="outline" onClick={() => setShowResults(false)}>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Optimize Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}