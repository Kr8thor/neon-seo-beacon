
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Bell, 
  Settings, 
  Users, 
  TrendingUp, 
  Clock, 
  Globe, 
  Zap,
  ArrowRight,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const analysisSteps = [
    { icon: Globe, text: 'Validating URL...', duration: 1000 },
    { icon: Search, text: 'Fetching page data...', duration: 1500 },
    { icon: Zap, text: 'Running AI analysis...', duration: 2000 },
    { icon: TrendingUp, text: 'Calculating SEO score...', duration: 1000 },
    { icon: CheckCircle, text: 'Generating recommendations...', duration: 1500 }
  ];

  const recentAudits = [
    { 
      id: 1, 
      url: 'example.com', 
      score: 85, 
      status: 'completed', 
      date: '2 hours ago',
      issues: { critical: 2, warnings: 5, recommendations: 8 }
    },
    { 
      id: 2, 
      url: 'mystore.com', 
      score: 72, 
      status: 'completed', 
      date: '1 day ago',
      issues: { critical: 4, warnings: 7, recommendations: 12 }
    },
    { 
      id: 3, 
      url: 'portfolio.dev', 
      score: 91, 
      status: 'completed', 
      date: '3 days ago',
      issues: { critical: 1, warnings: 3, recommendations: 5 }
    }
  ];

  const handleAnalysis = async () => {
    if (!url) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a website URL to analyze.",
      });
      return;
    }

    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(url)) {
      toast({
        variant: "destructive",
        title: "Invalid URL",
        description: "Please enter a valid website URL.",
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setProgress(0);

    // Simulate analysis process
    for (let i = 0; i < analysisSteps.length; i++) {
      setAnalysisStep(i);
      
      // Animate progress during each step
      const stepDuration = analysisSteps[i].duration;
      const intervalTime = 50;
      const totalIntervals = stepDuration / intervalTime;
      const progressIncrement = (100 / analysisSteps.length) / totalIntervals;
      
      for (let j = 0; j < totalIntervals; j++) {
        await new Promise(resolve => setTimeout(resolve, intervalTime));
        setProgress(prev => Math.min(prev + progressIncrement, (i + 1) * (100 / analysisSteps.length)));
      }
    }

    // Complete analysis
    setProgress(100);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete!",
      description: "Your SEO audit is ready. Check out the detailed results.",
    });
    
    // Reset form
    setUrl('');
    setProgress(0);
    setAnalysisStep(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Analysis Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="bg-gray-800/90 border-gray-700 p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-600"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                    className="transition-all duration-300 ease-out"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {analysisSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === analysisStep;
                  const isCompleted = index < analysisStep;
                  
                  return (
                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-purple-500/20 border border-purple-500/30' : 
                      isCompleted ? 'bg-green-500/20 border border-green-500/30' : 
                      'bg-gray-700/50'
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-purple-500' : 
                        isCompleted ? 'bg-green-500' : 
                        'bg-gray-600'
                      }`}>
                        <StepIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className={`text-sm ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
                        {step.text}
                      </span>
                      {isActive && (
                        <div className="ml-auto">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                      )}
                      {isCompleted && (
                        <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 px-6 py-6 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SEO AI</span>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-white font-semibold">Dashboard</Link>
            <Link to="/history" className="text-gray-300 hover:text-white transition-colors">History</Link>
            <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">Settings</Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-purple-500/50 text-purple-300">
              Pro Plan
            </Badge>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome back! 👋</h1>
            <p className="text-xl text-gray-300">Let's analyze your website and boost your SEO performance.</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Audits Today', value: '3/10', icon: Calendar, color: 'from-blue-500 to-cyan-500' },
              { label: 'Average Score', value: '82.5', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
              { label: 'Issues Fixed', value: '24', icon: CheckCircle, color: 'from-purple-500 to-pink-500' },
              { label: 'Time Saved', value: '12h', icon: Clock, color: 'from-orange-500 to-red-500' }
            ].map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                      <StatIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </Card>
              );
            })}
          </div>

          {/* Main Audit Section */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl p-8 mb-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Analyze Your Website</h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Enter your website URL below to get a comprehensive SEO audit with AI-powered recommendations.
              </p>
              
              <div className="max-w-2xl mx-auto">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter website URL (e.g., https://example.com)"
                      className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 h-12"
                      onKeyPress={(e) => e.key === 'Enter' && handleAnalysis()}
                    />
                  </div>
                  <Button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 px-8 h-12"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      <>
                        Analyze Website
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
                  <span>Audits remaining today: 7/10</span>
                  <span className="mx-2">•</span>
                  <span>Avg. analysis time: 15 seconds</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Audits */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Recent Audits</h2>
              <Button variant="ghost" asChild className="text-purple-400 hover:text-purple-300">
                <Link to="/history">
                  View all <ExternalLink className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid gap-4">
              {recentAudits.map((audit) => (
                <Card key={audit.id} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl p-6 hover:bg-gray-800/70 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{audit.url}</h3>
                        <p className="text-sm text-gray-400">{audit.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {/* Issues Summary */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span className="text-gray-300">{audit.issues.critical}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300">{audit.issues.warnings}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-300">{audit.issues.recommendations}</span>
                        </div>
                      </div>
                      
                      {/* SEO Score */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          audit.score >= 85 ? 'text-green-400' : 
                          audit.score >= 70 ? 'text-yellow-400' : 
                          'text-red-400'
                        }`}>
                          {audit.score}
                        </div>
                        <div className="text-sm text-gray-400">SEO Score</div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                        View Report <ArrowRight className="ml-1 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
