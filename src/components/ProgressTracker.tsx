
import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  duration: number;
}

interface ProgressTrackerProps {
  auditId?: string;
  isActive: boolean;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

const PROGRESS_STEPS: ProgressStep[] = [
  {
    id: 'validate',
    title: 'Validating URL',
    description: 'Checking website accessibility and structure',
    icon: Loader2,
    duration: 1000
  },
  {
    id: 'fetch',
    title: 'Fetching Page Data',
    description: 'Analyzing HTML, meta tags, and content',
    icon: Loader2,
    duration: 1500
  },
  {
    id: 'analyze',
    title: 'Running AI Analysis',
    description: 'Processing SEO factors with advanced algorithms',
    icon: Loader2,
    duration: 2000
  },
  {
    id: 'score',
    title: 'Calculating SEO Score',
    description: 'Generating comprehensive performance metrics',
    icon: Loader2,
    duration: 1000
  },
  {
    id: 'recommendations',
    title: 'Generating Recommendations',
    description: 'Creating actionable improvement suggestions',
    icon: Loader2,
    duration: 1500
  }
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  auditId,
  isActive,
  onComplete,
  onError
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      setProgress(0);
      setCompleted(false);
      setError(null);
      return;
    }

    let stepInterval: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    const runStep = (stepIndex: number) => {
      if (stepIndex >= PROGRESS_STEPS.length) {
        setCompleted(true);
        setProgress(100);
        setTimeout(() => {
          onComplete?.();
        }, 500);
        return;
      }

      setCurrentStep(stepIndex);
      const step = PROGRESS_STEPS[stepIndex];
      
      // Animate progress during step
      const stepProgress = (stepIndex / PROGRESS_STEPS.length) * 100;
      const nextStepProgress = ((stepIndex + 1) / PROGRESS_STEPS.length) * 100;
      const progressIncrement = (nextStepProgress - stepProgress) / (step.duration / 50);
      let currentProgress = stepProgress;

      progressInterval = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= nextStepProgress) {
          currentProgress = nextStepProgress;
          clearInterval(progressInterval);
        }
        setProgress(currentProgress);
      }, 50);

      // Move to next step
      stepInterval = setTimeout(() => {
        runStep(stepIndex + 1);
      }, step.duration);
    };

    // Simulate potential error (5% chance)
    if (Math.random() < 0.05) {
      setTimeout(() => {
        const errorMessages = [
          'Website is not accessible',
          'Invalid URL format',
          'Connection timeout',
          'Server error occurred'
        ];
        const errorMsg = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        setError(errorMsg);
        onError?.(errorMsg);
      }, 2000);
    } else {
      runStep(0);
    }

    return () => {
      clearTimeout(stepInterval);
      clearInterval(progressInterval);
    };
  }, [isActive, onComplete, onError]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-800/90 border-gray-700 p-8 max-w-md w-full">
        <div className="text-center">
          {/* Progress Circle */}
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

          {error ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-red-400">
                <AlertCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Analysis Failed</span>
              </div>
              <p className="text-gray-300">{error}</p>
            </div>
          ) : completed ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg font-semibold">Analysis Complete!</span>
              </div>
              <p className="text-gray-300">Generating your detailed SEO report...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {PROGRESS_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;
                
                return (
                  <div key={step.id} className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive ? 'bg-purple-500/20 border border-purple-500/30' : 
                    isCompleted ? 'bg-green-500/20 border border-green-500/30' : 
                    'bg-gray-700/50'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isActive ? 'bg-purple-500' : 
                      isCompleted ? 'bg-green-500' : 
                      'bg-gray-600'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <StepIcon className={`w-4 h-4 text-white ${isActive ? 'animate-spin' : ''}`} />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className={`text-sm font-medium ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
                        {step.title}
                      </div>
                      <div className={`text-xs ${isActive || isCompleted ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
