'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Building2, 
  MapPin, 
  DollarSign, 
  Calendar, 
  ArrowRight,
  Star,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  Target,
  Users,
  Trophy,
  AlertCircle,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { cn } from '@/lib/utils';

const jobStages = [
  { 
    id: 'opportunities', 
    title: '🎯 Opportunities', 
    description: 'Jobs you\'re researching or considering',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  { 
    id: 'applied', 
    title: '📝 Applied', 
    description: 'Applications submitted',
    color: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
    badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
  },
  { 
    id: 'screening', 
    title: '📞 Screening', 
    description: 'Initial contact and phone screens',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
  },
  { 
    id: 'interviewing', 
    title: '💼 Interviewing', 
    description: 'In the interview process',
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
  },
  { 
    id: 'final', 
    title: '🎉 Final Round', 
    description: 'Final interviews and references',
    color: 'bg-pink-50 border-pink-200 dark:bg-pink-950 dark:border-pink-800',
    badgeColor: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
  },
  { 
    id: 'offers', 
    title: '✨ Offers', 
    description: 'Offers received and negotiations',
    color: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
    badgeColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  }
];

const sampleJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary: '$120K - $150K',
    stage: 'interviewing',
    priority: 'high',
    appliedDate: '2024-01-15',
    logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['React', 'TypeScript', 'Remote'],
    notes: 'Great team culture, exciting product roadmap'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'New York, NY',
    salary: '$100K - $130K',
    stage: 'applied',
    priority: 'medium',
    appliedDate: '2024-01-20',
    logo: 'https://images.pexels.com/photos/326508/pexels-photo-326508.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Node.js', 'React', 'AWS'],
    notes: 'Early stage startup with great potential'
  },
  {
    id: '3',
    title: 'UI/UX Developer',
    company: 'DesignStudio',
    location: 'Remote',
    salary: '$85K - $110K',
    stage: 'opportunities',
    priority: 'low',
    appliedDate: null,
    logo: 'https://images.pexels.com/photos/301920/pexels-photo-301920.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Figma', 'React', 'Design'],
    notes: 'Focus on design systems and user experience'
  },
  {
    id: '4',
    title: 'Lead Developer',
    company: 'Enterprise Corp',
    location: 'Austin, TX',
    salary: '$140K - $170K',
    stage: 'final',
    priority: 'high',
    appliedDate: '2024-01-10',
    logo: 'https://images.pexels.com/photos/442559/pexels-photo-442559.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    tags: ['Leadership', 'Java', 'Microservices'],
    notes: 'Leadership opportunity with great benefits'
  }
];

export default function JourneyPage() {
  const [jobs, setJobs] = useState(sampleJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isAddingJob, setIsAddingJob] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getDaysAgo = (dateString: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Career Journey 🚀</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
              Track your applications through every stage of success
            </p>
          </div>
          <Button 
            onClick={() => setIsAddingJob(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Applications', value: '12', icon: Target, color: 'text-blue-500' },
            { title: 'Active Interviews', value: '3', icon: Users, color: 'text-purple-500' },
            { title: 'Response Rate', value: '75%', icon: Trophy, color: 'text-green-500' },
            { title: 'Avg. Response Time', value: '5 days', icon: Clock, color: 'text-orange-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
                        {stat.value}
                      </p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Board */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {jobStages.map((stage) => {
              const stageJobs = jobs.filter(job => job.stage === stage.id);
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className={cn("border-2", stage.color)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold">
                          {stage.title}
                        </CardTitle>
                        <Badge className={stage.badgeColor}>
                          {stageJobs.length}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {stage.description}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <AnimatePresence>
                        {stageJobs.map((job) => (
                          <motion.div
                            key={job.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ y: -2, scale: 1.02 }}
                            className="cursor-pointer"
                            onClick={() => setSelectedJob(job)}
                          >
                            <Card className="p-4 hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-800">
                              <div className="flex items-start space-x-3">
                                <img
                                  src={job.logo}
                                  alt={job.company}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                                    {job.title}
                                  </h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                    {job.company}
                                  </p>
                                  <div className="flex items-center mt-2 space-x-2">
                                    <Badge 
                                      variant="outline" 
                                      className={cn("text-xs", getPriorityColor(job.priority))}
                                    >
                                      {job.priority}
                                    </Badge>
                                    {job.appliedDate && (
                                      <span className="text-xs text-slate-500">
                                        {getDaysAgo(job.appliedDate)}d ago
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {job.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      
                      {stageJobs.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                          <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No jobs in this stage</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Job Details Modal */}
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedJob && (
              <>
                <DialogHeader>
                  <div className="flex items-start space-x-4">
                    <img
                      src={selectedJob.logo}
                      alt={selectedJob.company}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <DialogTitle className="text-2xl font-bold">
                        {selectedJob.title}
                      </DialogTitle>
                      <p className="text-lg text-slate-600 dark:text-slate-400">
                        {selectedJob.company}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center text-slate-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          {selectedJob.location}
                        </div>
                        <div className="flex items-center text-slate-500">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {selectedJob.salary}
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Status and Priority */}
                  <div className="flex items-center space-x-4">
                    <Badge className={getPriorityColor(selectedJob.priority)}>
                      {selectedJob.priority.toUpperCase()} PRIORITY
                    </Badge>
                    {selectedJob.appliedDate && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Applied {getDaysAgo(selectedJob.appliedDate)} days ago
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Skills & Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      {selectedJob.notes}
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex space-x-3">
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Follow Up
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>

                  {/* Stage Actions */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Move to Stage</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {jobStages.filter(stage => stage.id !== selectedJob.stage).map((stage) => (
                        <Button
                          key={stage.id}
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setJobs(jobs.map(job => 
                              job.id === selectedJob.id 
                                ? { ...job, stage: stage.id }
                                : job
                            ));
                            setSelectedJob(null);
                          }}
                          className="justify-start"
                        >
                          {stage.title}
                          <ArrowRight className="w-3 h-3 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Job Modal */}
        <Dialog open={isAddingJob} onOpenChange={setIsAddingJob}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Job Opportunity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="Senior Developer" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="TechCorp" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="San Francisco, CA" />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input id="salary" placeholder="$100K - $130K" />
                </div>
              </div>
              <div>
                <Label htmlFor="stage">Initial Stage</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobStages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Any additional notes..." />
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setIsAddingJob(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingJob(false)} className="flex-1">
                  Add Job
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}