import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Brain, CreditCard, Shield } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Store,
      title: 'Multi-Branch Management',
      description: 'Create and manage shops from one dashboard',
      details: 'Centralized control over inventory, sales, and staff across all locations',
      link: '/features/multi-branch'
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Sales forecasts, restock suggestions, and fraud alerts',
      details: 'Machine learning powered analytics to optimize your business operations',
      link: '/features/ai-insights'
    },
    {
      icon: CreditCard,
      title: 'POS & Billing',
      description: 'Fast checkout, PDF invoices, and stock sync',
      details: 'Integrated point of sale system with real-time inventory updates',
      link: '/features/pos-billing'
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'RLS, audit logs, 2FA, encrypted storage',
      details: 'Enterprise-grade security with complete data protection and compliance',
      link: '/features/security'
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything you need to manage your shops
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            From inventory management to AI-powered insights, Zentra provides all the tools your multi-branch business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              to={feature.link}
              key={index}
              className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer block"
            >
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {feature.description}
              </p>

              {/* Inline CTA - appears on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  {feature.details}
                </p>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Learn more →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;