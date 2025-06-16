
import { useState } from 'react';
import { ChevronDown, ChevronRight, Copy, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface Issue {
  id: string;
  title: string;
  description: string;
  type: 'critical' | 'warning' | 'recommendation' | 'info';
  priority: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  impact: string;
  howToFix: string[];
  codeExample?: string;
  resources?: { title: string; url: string }[];
  affectedElements?: string[];
}

interface IssueCardProps {
  issue: Issue;
  expanded?: boolean;
  onToggle?: () => void;
}

const ISSUE_CONFIG = {
  critical: {
    icon: XCircle,
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30'
  },
  recommendation: {
    icon: CheckCircle,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30'
  },
  info: {
    icon: Info,
    color: 'text-gray-400',
    bg: 'bg-gray-500/10',
    border: 'border-gray-500/30'
  }
};

const PRIORITY_COLORS = {
  high: 'bg-red-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
};

const DIFFICULTY_COLORS = {
  easy: 'bg-green-500',
  medium: 'bg-yellow-500',
  hard: 'bg-red-500'
};

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  expanded = false,
  onToggle
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const { toast } = useToast();
  
  const config = ISSUE_CONFIG[issue.type];
  const Icon = config.icon;

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Code example has been copied to your clipboard.",
    });
  };

  return (
    <Card className={`${config.bg} ${config.border} border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02]`}>
      <div 
        className="p-6 cursor-pointer"
        onClick={handleToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center mt-1`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{issue.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`${PRIORITY_COLORS[issue.priority]} border-none text-white text-xs`}
                >
                  {issue.priority}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`${DIFFICULTY_COLORS[issue.difficulty]} border-none text-white text-xs`}
                >
                  {issue.difficulty}
                </Badge>
              </div>
              
              <p className="text-gray-300 text-sm mb-2">{issue.description}</p>
              
              <div className="flex items-center text-xs text-gray-400">
                <span>Impact: {issue.impact}</span>
                {issue.affectedElements && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{issue.affectedElements.length} elements affected</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-gray-700/50">
          {/* How to Fix */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-2">How to Fix:</h4>
            <ul className="space-y-1">
              {issue.howToFix.map((step, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start space-x-2">
                  <span className="text-purple-400 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Code Example */}
          {issue.codeExample && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-white">Code Example:</h4>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(issue.codeExample!)}
                  className="text-gray-400 hover:text-white h-6"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <pre className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs text-gray-300 overflow-x-auto">
                <code>{issue.codeExample}</code>
              </pre>
            </div>
          )}

          {/* Resources */}
          {issue.resources && issue.resources.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Learn More:</h4>
              <div className="space-y-1">
                {issue.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-purple-400 hover:text-purple-300 block"
                  >
                    {resource.title} →
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Affected Elements */}
          {issue.affectedElements && issue.affectedElements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Affected Elements:</h4>
              <div className="flex flex-wrap gap-1">
                {issue.affectedElements.slice(0, 5).map((element, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="text-xs text-gray-400 border-gray-600"
                  >
                    {element}
                  </Badge>
                ))}
                {issue.affectedElements.length > 5 && (
                  <Badge variant="outline" className="text-xs text-gray-400 border-gray-600">
                    +{issue.affectedElements.length - 5} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
