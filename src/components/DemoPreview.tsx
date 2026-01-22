import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DemoPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState('grocery');

  const demoData = {
    grocery: {
      revenue: '₹32,450',
      topProduct: 'Organic Rice (5kg)',
      lowStock: '8 items',
      stockItems: ['Wheat Flour', 'Cooking Oil', 'Sugar', 'Tea Leaves']
    },
    fashion: {
      revenue: '₹28,750',
      topProduct: 'Cotton T-Shirts',
      lowStock: '5 items',
      stockItems: ['Denim Jeans', 'Summer Dresses', 'Sneakers', 'Handbags']
    },
    electronics: {
      revenue: '₹45,230',
      topProduct: 'iPhone 15 Cases',
      lowStock: '12 items',
      stockItems: ['Chargers', 'Headphones', 'Screen Guards', 'Power Banks']
    }
  };

  const currentData = demoData[activeTab as keyof typeof demoData];

  return (
    <section className="py-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg inline-flex">
            {['grocery', 'fashion', 'electronics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Revenue Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Revenue MTD</p>
                  <p className="text-3xl font-bold">{currentData.revenue}</p>
                  <p className="text-blue-200 text-sm">+12.5% from last month</p>
                </div>
                <TrendingUp className="h-12 w-12 text-blue-200" />
              </div>
            </div>

            {/* Top Product Card */}
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium mb-1">Top Product</p>
                  <p className="text-lg font-bold mb-1">{currentData.topProduct}</p>
                  <p className="text-teal-200 text-sm">Best seller this month</p>
                </div>
                <Package className="h-12 w-12 text-teal-200" />
              </div>
            </div>

            {/* Low Stock Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Low Stock Alert</p>
                  <p className="text-3xl font-bold">{currentData.lowStock}</p>
                  <div className="mt-2">
                    <p className="text-orange-200 text-xs">Need restock:</p>
                    <p className="text-orange-100 text-sm font-medium">
                      {currentData.stockItems.slice(0, 2).join(', ')}...
                    </p>
                  </div>
                </div>
                <AlertTriangle className="h-12 w-12 text-orange-200" />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <div className="text-center mt-8">
          <Link
            to="/demo"
            className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all duration-200 hover:scale-105"
          >
            Open full interactive demo
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DemoPreview;