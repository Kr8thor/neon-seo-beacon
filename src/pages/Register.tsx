
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Mail, Lock, Eye, EyeOff, User, Check, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        variant: "destructive",
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (passwordStrength < 3) {
      toast({
        variant: "destructive",
        title: "Weak Password",
        description: "Please choose a stronger password for better security.",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to SEO AI. You can now start auditing your websites.",
      });
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center p-6">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Search className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">SEO AI</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-gray-400">Start your SEO journey with us today</p>
        </div>

        {/* Registration Form */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[Math.min(passwordStrength - 1, 4)] : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400">
                    Strength: <span className={passwordStrength >= 3 ? 'text-green-400' : 'text-yellow-400'}>
                      {strengthLabels[Math.min(passwordStrength, 4)] || 'Very Weak'}
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 bg-gray-900/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {formData.confirmPassword && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {formData.password === formData.confirmPassword ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="border-gray-600 data-[state=checked]:bg-purple-500 mt-1"
              />
              <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !acceptTerms}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800/50 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 text-gray-300">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="border-gray-600 bg-gray-900/50 hover:bg-gray-800/50 text-gray-300">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
