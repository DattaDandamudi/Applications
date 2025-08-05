'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  Sparkles,
  Plus,
  ArrowRight,
  BarChart3,
  Users,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const motivationalQuotes = [
  "Your dream job is just one application away! 🚀",
  "Every 'no' brings you closer to your 'yes'! 💪",
  "Success is the sum of small efforts repeated daily ✨",
  "The future belongs to those who believe in their dreams 🌟"
];

const achievements = [
  { id: 1, title: "First Application", description: "Submitted your first job application", icon: "🎯", unlocked: true },
  { id: 2, title: "Resume Master", description: "Created 3 different resume versions", icon: "📝", unlocked: true },
  { id: 3, title: "Interview Ready", description: "Scheduled your first interview", icon: "💼", unlocked: false },
  { id: 4, title: "Offer Champion", description: "Received your first job offer", icon: "🏆", unlocked: false }
];

const weeklyGoals = [
  { goal: "Apply to 5 positions", current: 3, target: 5 },
  { goal: "Update LinkedIn profile", current: 1, target: 1 },
  { goal: "Practice interview questions", current: 0, target: 1 }
];

export default function DashboardPage() {
  const todayQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <motion.div 
          className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl p-8"
          variants={fadeIn}
          initial="initial"
          animate="animate"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Welcome back, Sarah! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
                {todayQuote}
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  3 applications this week
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  <Calendar className="w-4 h-4 mr-1" />
                  2 interviews scheduled
                </Badge>
              </div>
            </div>
            <motion.div 
              className="hidden md:block"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {[
            {
              title: "Create Resume",
              description: "Build a stunning resume",
              icon: <FileText className="w-8 h-8" />,
              href: "/resume",
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950"
            },
            {
              title: "Track Applications",
              description: "Manage your job journey",
              icon: <Target className="w-8 h-8" />,
              href: "/journey",
              gradient: "from-purple-500 to-pink-500",
              bgGradient: "from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
            },
            {
              title: "AI Optimization",
              description: "Optimize with AI",
              icon: <Sparkles className="w-8 h-8" />,
              href: "/resume/optimize",
              gradient: "from-emerald-500 to-teal-500",
              bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950"
            },
            {
              title: "Analytics",
              description: "View your progress",
              icon: <BarChart3 className="w-8 h-8" />,
              href: "/analytics",
              gradient: "from-orange-500 to-red-500",
              bgGradient: "from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
            }
          ].map((action, index) => (
            <motion.div
              key={index}
              variants={fadeIn}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`h-full cursor-pointer transition-all duration-300 hover:shadow-xl bg-gradient-to-br ${action.bgGradient} border-2 hover:border-blue-200 dark:hover:border-blue-800`}>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${action.gradient} text-white flex items-center justify-center mb-4`}>
                    {action.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {action.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {action.description}
                  </p>
                  <Button asChild variant="ghost" className="p-0 h-auto">
                    <Link href={action.href} className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                      Get started
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Goals */}
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Target className="w-6 h-6 mr-2 text-blue-500" />
                  Weekly Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {weeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {goal.goal}
                      </span>
                      <span className="text-sm text-slate-500">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
                <Button className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Clock className="w-6 h-6 mr-2 text-green-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { action: "Applied to Software Engineer at TechCorp", time: "2 hours ago", type: "application" },
                  { action: "Updated resume for Frontend position", time: "1 day ago", type: "resume" },
                  { action: "Interview scheduled with StartupXYZ", time: "2 days ago", type: "interview" },
                  { action: "AI optimized resume for Data Analyst role", time: "3 days ago", type: "optimization" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'application' ? 'bg-blue-500' :
                      activity.type === 'resume' ? 'bg-green-500' :
                      activity.type === 'interview' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={fadeIn} initial="initial" animate="animate">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Award className="w-6 h-6 mr-2 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id} 
                    className={`p-4 rounded-lg border-2 transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800' 
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}