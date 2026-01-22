import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Store, Users, BarChart3, Settings, CheckCircle, Globe, Smartphone } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

const MultiBranchPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const features = [
    {
      icon: Store,
      title: 'Centralized Dashboard',
      description: 'Monitor all your shop locations from a single, unified dashboard with real-time data synchronization.'
    },
    {
      icon: Users,
      title: 'Staff Management',
      description: 'Assign roles, track performance, and manage permissions across all branches with ease.'
    },
    {
      icon: BarChart3,
      title: 'Cross-Branch Analytics',
      description: 'Compare performance metrics, identify top-performing locations, and optimize operations.'
    },
    {
      icon: Settings,
      title: 'Unified Settings',
      description: 'Configure pricing, promotions, and policies once and apply them across all locations.'
    }
  ];

  const benefits = [
    'Reduce management overhead by 70%',
    'Real-time inventory synchronization',
    'Centralized reporting and analytics',
    'Streamlined staff coordination',
    'Consistent customer experience',
    'Scalable architecture for growth'
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Multi-Branch Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Streamline operations across all your shop locations with our comprehensive multi-branch management system. Control everything from a single dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Key Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Multi-Branch Management?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Managing multiple shop locations doesn't have to be complicated. Our system simplifies operations while providing powerful insights.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Ready to Get Started?</h3>
              <p className="mb-6">
                Join thousands of business owners who have streamlined their multi-branch operations with Zentra.
              </p>
              <div className="space-y-4">
                <Link
                  to="/demo"
                  className="block w-full bg-white text-blue-600 text-center py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Try Interactive Demo
                </Link>
                <a
                  href="#trial"
                  className="block w-full border border-white text-center py-3 px-6 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  Start 30-Day Free Trial
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Perfect For
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Retail Chains</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fashion, electronics, grocery stores with multiple locations
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Franchise Businesses</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Restaurants, cafes, and service businesses with franchisees
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mobile Retailers</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Phone shops, repair centers, and accessory stores
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MultiBranchPage;