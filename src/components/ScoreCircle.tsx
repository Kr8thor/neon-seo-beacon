
import { useState, useEffect } from 'react';

interface ScoreCircleProps {
  score: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

const SIZE_CONFIG = {
  sm: { width: 80, stroke: 6, fontSize: 'text-lg' },
  md: { width: 120, stroke: 8, fontSize: 'text-2xl' },
  lg: { width: 160, stroke: 10, fontSize: 'text-3xl' },
  xl: { width: 200, stroke: 12, fontSize: 'text-4xl' }
};

const getScoreColor = (score: number) => {
  if (score >= 85) return { from: '#10B981', to: '#059669', label: 'Excellent', bg: 'bg-green-500/20' };
  if (score >= 70) return { from: '#F59E0B', to: '#D97706', label: 'Good', bg: 'bg-yellow-500/20' };
  if (score >= 40) return { from: '#EF4444', to: '#DC2626', label: 'Fair', bg: 'bg-red-500/20' };
  return { from: '#DC2626', to: '#B91C1C', label: 'Poor', bg: 'bg-red-600/20' };
};

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score,
  size = 'md',
  animated = true,
  showLabel = true,
  className = ''
}) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  const config = SIZE_CONFIG[size];
  const radius = (config.width - config.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreColor = getScoreColor(score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      setCurrentProgress(score);
      return;
    }

    const duration = 2000; // 2 seconds
    const steps = 60; // 60fps
    const increment = score / steps;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(increment * currentStep, score);
      setDisplayScore(newScore);
      setCurrentProgress(newScore);
      
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [score, animated]);

  const strokeDashoffset = circumference - (currentProgress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg 
        width={config.width} 
        height={config.width}
        className="transform -rotate-90"
        aria-label={`SEO Score: ${Math.round(displayScore)} out of 100`}
      >
        {/* Background circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={config.stroke}
          fill="none"
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          stroke="url(#scoreGradient)"
          strokeWidth={config.stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={scoreColor.from} />
            <stop offset="100%" stopColor={scoreColor.to} />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-bold text-white ${config.fontSize}`}>
          {Math.round(displayScore)}
        </span>
        {showLabel && (
          <span className="text-xs text-gray-400 font-medium">
            {scoreColor.label}
          </span>
        )}
      </div>
      
      {/* Glow effect for high scores */}
      {score >= 85 && (
        <div className={`absolute inset-0 rounded-full ${scoreColor.bg} blur-xl scale-110 -z-10`} />
      )}
    </div>
  );
};
