import React, { useState } from 'react';
import { Check, Star } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for single shop owners',
      monthlyPrice: 500,
      features: [
        '1 shop location',
        'Basic analytics & reports',
        'Up to 5 users',
        'POS system',
        'Inventory management',
        'Email support'
      ],
      cta: 'Start 30-Day Free Trial',
      popular: false
    },
    {
      name: 'Pro',
      description: 'Best for growing businesses',
      monthlyPrice: 750,
      features: [
        'Up to 3 shop locations',
        'Advanced analytics & AI insights',
        'Up to 15 users',
        'POS system',
        'Inventory management',
        'Multi-branch reporting',
        'Priority email support',
        'Mobile app access'
      ],
      cta: 'Start 30-Day Free Trial',
      popular: true
    },
    {
      name: 'Business',
      description: 'For established chains',
      monthlyPrice: 1000,
      features: [
        '5+ shop locations',
        'Full AI insights & forecasting',
        'Unlimited users',
        'Advanced POS features',
        'Custom integrations',
        'Dedicated account manager',
        'Priority phone support',
        'Custom training'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const getPrice = (monthlyPrice: number) => {
    const price = isAnnual ? monthlyPrice * 12 * 0.9 : monthlyPrice;
    return Math.round(price);
  };

  const getPeriod = () => isAnnual ? '/year' : '/month';

  return (
    <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. All plans include a 30-day free trial.
          </p>

          {/* Pricing Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                Annual
              </span>
              <span className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-xs px-2 py-1 rounded-full font-medium">
                10% off
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                plan.popular 
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 scale-105' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      ₹{getPrice(plan.monthlyPrice).toLocaleString()}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 ml-2">
                      {getPeriod()}
                    </span>
                  </div>
                  
                  {isAnnual && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Save ₹{(plan.monthlyPrice * 12 * 0.1).toLocaleString()} annually
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300 ml-3">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : plan.cta === 'Contact Sales'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
                      : 'bg-white dark:bg-gray-700 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                  }`}
                >
                  {plan.cta}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  30-day free trial • No credit card required
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;