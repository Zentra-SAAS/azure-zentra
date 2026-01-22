import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Receipt, Smartphone, Wifi, CheckCircle, Clock, Shield } from 'lucide-react';
import { useDarkMode } from '../../context/DarkModeContext';

const POSBillingPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const features = [
    {
      icon: CreditCard,
      title: 'Multiple Payment Methods',
      description: 'Accept cash, cards, UPI, wallets, and BNPL options all from one terminal.'
    },
    {
      icon: Receipt,
      title: 'Instant PDF Invoices',
      description: 'Generate professional invoices instantly with automatic tax calculations and compliance.'
    },
    {
      icon: Smartphone,
      title: 'Mobile POS',
      description: 'Turn any smartphone or tablet into a complete point-of-sale system.'
    },
    {
      icon: Wifi,
      title: 'Offline Mode',
      description: 'Continue selling even without internet. Data syncs automatically when connection returns.'
    }
  ];

  const benefits = [
    'Process transactions 3x faster',
    'Reduce checkout queues by 60%',
    'Automatic inventory updates',
    'Real-time sales reporting',
    'GST compliant invoicing',
    'Customer purchase history',
    'Barcode scanning support',
    'Multi-currency support'
  ];

  const paymentMethods = [
    { name: 'Credit/Debit Cards', icon: '💳' },
    { name: 'UPI Payments', icon: '📱' },
    { name: 'Digital Wallets', icon: '💰' },
    { name: 'Cash Payments', icon: '💵' },
    { name: 'Buy Now Pay Later', icon: '⏰' },
    { name: 'Bank Transfers', icon: '🏦' }
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
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              POS & Billing System
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Complete point-of-sale solution with fast checkout, professional invoicing, and real-time inventory sync. Accept all payment methods with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            POS Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
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

      {/* Payment Methods */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Accept All Payment Methods
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{method.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{method.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Our POS System?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Built specifically for Indian businesses with features that matter most to local retailers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-teal-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">POS Dashboard Preview</h3>
              
              {/* Mock POS Interface */}
              <div className="bg-white/20 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Transaction #1234</span>
                  <span className="text-sm">12:34 PM</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>iPhone Case x2</span>
                    <span>₹1,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Screen Guard x1</span>
                    <span>₹300</span>
                  </div>
                  <div className="border-t border-white/30 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹1,500</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-white/20 rounded p-2 text-sm">💳 Card</button>
                <button className="bg-white/20 rounded p-2 text-sm">📱 UPI</button>
                <button className="bg-white/20 rounded p-2 text-sm">💵 Cash</button>
                <button className="bg-white/20 rounded p-2 text-sm">🧾 Print</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Technical Specifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Process transactions in under 3 seconds with optimized performance
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure & Compliant</h3>
              <p className="text-gray-600 dark:text-gray-300">
                PCI DSS compliant with end-to-end encryption for all transactions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Works Offline</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continue operations without internet, sync when connection returns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Upgrade Your Checkout Experience?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start processing payments faster and more efficiently with our modern POS system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/demo"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Try POS Demo
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

export default POSBillingPage;