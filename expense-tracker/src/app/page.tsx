'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  BarChart3, 
  PieChart,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (session) {
    router.push('/dashboard');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('facebook', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ExpenseTracker
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center space-x-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <div className="loading-spinner mr-2" />
              ) : (
                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-blue-600 text-xs font-bold">G</span>
                </div>
              )}
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6">
                Track Your{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Expenses
                </span>
                <br />
                Like a Pro
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Take control of your finances with our intelligent expense tracking app. 
                Beautiful design, powerful analytics, and seamless experience.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <button 
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="btn-primary text-lg px-8 py-4"
                >
                  {isLoading ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 text-sm font-bold">G</span>
                    </div>
                  )}
                  Continue with Google
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                
                <button 
                  onClick={handleFacebookSignIn}
                  disabled={isLoading}
                  className="btn-outline text-lg px-8 py-4"
                >
                  {isLoading ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">f</span>
                    </div>
                  )}
                  Continue with Facebook
                </button>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Free forever
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  No credit card required
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Instant setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to track expenses
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make expense tracking effortless and insightful.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
                title: "Smart Analytics",
                description: "Get insights into your spending patterns with beautiful charts and detailed reports."
              },
              {
                icon: <Shield className="h-8 w-8 text-green-600" />,
                title: "Secure & Private",
                description: "Your data is encrypted and secure. Only you can see your financial information."
              },
              {
                icon: <Smartphone className="h-8 w-8 text-purple-600" />,
                title: "Mobile First",
                description: "Responsive design that works perfectly on all devices, anywhere, anytime."
              },
              {
                icon: <PieChart className="h-8 w-8 text-orange-600" />,
                title: "Category Insights",
                description: "Organize expenses by categories and see where your money goes each month."
              },
              {
                icon: <Zap className="h-8 w-8 text-yellow-600" />,
                title: "Lightning Fast",
                description: "Add expenses in seconds with our intuitive interface and smart features."
              },
              {
                icon: <TrendingUp className="h-8 w-8 text-red-600" />,
                title: "Budget Tracking",
                description: "Set budgets and get alerts when you're approaching your spending limits."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="card p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your account with Google or Facebook in seconds. No complex forms needed."
              },
              {
                step: "02", 
                title: "Add Expenses",
                description: "Quickly add your daily expenses with categories, amounts, and descriptions."
              },
              {
                step: "03",
                title: "Track & Analyze",
                description: "View beautiful dashboards, analytics, and insights to improve your spending habits."
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl font-bold">{step.step}</span>
                  </div>
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by thousands
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of users who have taken control of their finances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Manager",
                avatar: "👩‍💼",
                content: "This app changed how I think about money. The insights are incredible!"
              },
              {
                name: "Mike Chen", 
                role: "Software Engineer",
                avatar: "👨‍💻",
                content: "Simple, beautiful, and powerful. Exactly what I needed for expense tracking."
              },
              {
                name: "Emily Davis",
                role: "Freelancer",
                avatar: "👩‍🎨", 
                content: "Finally, an expense tracker that doesn't feel like work. Love the design!"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their spending habits with ExpenseTracker.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              {isLoading ? (
                <div className="loading-spinner mr-2" />
              ) : (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">G</span>
                </div>
              )}
              Get Started Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">ExpenseTracker</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most intuitive expense tracking app designed to help you take control of your finances.
              </p>
              <div className="flex space-x-4">
                <span className="text-gray-400">© 2025 ExpenseTracker. All rights reserved.</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
