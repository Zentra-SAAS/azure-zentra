import React from 'react';
import { UserPlus, ShoppingCart, TrendingUp } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: UserPlus,
      title: 'Onboard in minutes',
      description: 'Create your org, add shops and employees',
      details: 'Quick setup wizard guides you through creating your organization structure'
    },
    {
      number: 2,
      icon: ShoppingCart,
      title: 'Sell & track',
      description: 'POS updates stock instantly, record expenses',
      details: 'Real-time synchronization across all your locations and channels'
    },
    {
      number: 3,
      icon: TrendingUp,
      title: 'Improve with AI',
      description: 'Get forecasts, restock suggestions, and fraud flags',
      details: 'Machine learning insights help optimize your business operations'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get started with Zentra in three simple steps and transform how you manage your shops
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-teal-200 to-purple-200 dark:from-blue-800 dark:via-teal-800 dark:to-purple-800 transform -translate-y-1/2" />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Step Number & Icon */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-blue-500">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl group-hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;