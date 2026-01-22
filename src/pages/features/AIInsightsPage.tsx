import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, Target, CheckCircle, Zap, BarChart3 } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

const AIInsightsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const features = [
    {
      icon: TrendingUp,
      title: 'Sales Forecasting',
      description: 'Predict future sales trends with 95% accuracy using advanced machine learning algorithms.'
    },
    {
      icon: AlertTriangle,
      title: 'Smart Alerts',
      description: 'Get notified about unusual patterns, potential fraud, and inventory issues before they impact your business.'
    },
    {
      icon: Target,
      title: 'Demand Prediction',
      description: 'Know which products will be in high demand and when to stock up for maximum profitability.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Deep insights into customer behavior, peak hours, and seasonal trends across all locations.'
    }
  ];

  const insights = [
    {
      title: 'Revenue Optimization',
      description: 'AI identifies the best pricing strategies and promotional timing',
      impact: '+25% average revenue increase'
    },
    {
      title: 'Inventory Management',
      description: 'Prevent stockouts and overstock situations with smart predictions',
      impact: '40% reduction in inventory costs'
    },
    {
      title: 'Fraud Detection',
      description: 'Real-time monitoring for suspicious transactions and activities',
      impact: '99.8% fraud detection accuracy'
    },
    {
      title: 'Customer Insights',
      description: 'Understand buying patterns and preferences for better targeting',
      impact: '30% improvement in customer retention'
    }
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
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="h-10 w-10 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Insights
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to make smarter business decisions. Get predictive analytics, fraud detection, and automated insights that drive growth.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            AI Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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

      {/* AI Insights Impact */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Real Business Impact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {insights.map((insight, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-xl text-white">
                <h3 className="text-xl font-bold mb-3">{insight.title}</h3>
                <p className="mb-4 text-purple-100">{insight.description}</p>
                <div className="bg-white/20 rounded-lg p-3">
                  <p className="font-semibold text-lg">{insight.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How AI Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                How Our AI Works
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Collection</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Continuously gather data from all your sales, inventory, and customer interactions
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Pattern Recognition</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Advanced algorithms identify trends, anomalies, and opportunities in your data
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Actionable Insights</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Get clear recommendations and predictions to optimize your business operations
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-8 rounded-2xl text-white">
              <div className="flex items-center mb-6">
                <Zap className="h-8 w-8 mr-3" />
                <h3 className="text-2xl font-bold">AI in Action</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">🔮 Prediction</p>
                  <p className="text-sm">iPhone cases will see 40% increase in demand next week</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">⚠️ Alert</p>
                  <p className="text-sm">Unusual transaction pattern detected at Store #2</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <p className="font-semibold mb-1">💡 Recommendation</p>
                  <p className="text-sm">Reduce price of winter items by 15% to clear inventory</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Unlock AI-Powered Growth?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of businesses using AI to make smarter decisions and increase profits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              See AI in Action - Demo
            </Link>
            <a
              href="#trial"
              className="border border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AIInsightsPage;