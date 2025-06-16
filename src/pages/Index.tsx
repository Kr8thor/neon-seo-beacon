
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Brain, Zap, TrendingUp, Search, ArrowRight, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SEO AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-32">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              ✨ Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Uncover Hidden
              <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                SEO Opportunities
              </span>
              with AI
            </h1>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Get comprehensive website audits in seconds, powered by advanced AI analysis. 
              Discover what's holding your site back and get actionable recommendations to boost your rankings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-lg px-8 py-4">
                <Link to="/register">
                  Start Free Audit <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                Watch Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center space-x-6 text-gray-400">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-gray-800 flex items-center justify-center text-white text-sm font-semibold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm">Join 10,000+ marketers</span>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm ml-2">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to dominate search rankings and outperform your competition.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning-fast Analysis",
                description: "Get comprehensive SEO audits in under 30 seconds. Our advanced crawling technology analyzes hundreds of ranking factors instantly.",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: Brain,
                title: "AI-Powered Insights",
                description: "Machine learning algorithms identify opportunities your competitors miss. Get personalized recommendations based on your industry.",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: TrendingUp,
                title: "Real-time Monitoring",
                description: "Track your SEO progress 24/7. Get instant alerts when issues arise or opportunities emerge in your market.",
                color: "from-emerald-400 to-blue-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 backdrop-blur-xl p-8 hover:bg-gray-800/70 transition-all duration-300 group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get from zero to SEO insights in just four simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Enter URL", description: "Simply paste your website URL into our analyzer" },
              { step: "02", title: "AI Analysis", description: "Our AI scans 200+ SEO factors in real-time" },
              { step: "03", title: "Get Results", description: "Receive detailed report with actionable insights" },
              { step: "04", title: "Implement", description: "Follow our step-by-step optimization guide" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your SEO needs. All plans include our core features.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$29",
                description: "Perfect for small websites",
                features: ["10 audits/month", "Basic SEO analysis", "Email support", "Export reports"],
                popular: false
              },
              {
                name: "Professional",
                price: "$79",
                description: "For growing businesses",
                features: ["100 audits/month", "Advanced AI insights", "Priority support", "White-label reports", "API access"],
                popular: true
              },
              {
                name: "Enterprise",
                price: "$199",
                description: "For large organizations",
                features: ["Unlimited audits", "Custom integrations", "Dedicated support", "Team collaboration", "Custom reports"],
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative p-8 ${plan.popular ? 'bg-gradient-to-b from-purple-500/20 to-blue-500/20 border-purple-500/50' : 'bg-gray-800/50 border-gray-700'} backdrop-blur-xl`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-300 mb-4">{plan.description}</p>
                  <div className="text-4xl font-bold text-white mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-400">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-emerald-400 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SEO AI</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most advanced SEO analysis platform powered by artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SEO AI. All rights reserved. Built with ♥ for better web performance.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
