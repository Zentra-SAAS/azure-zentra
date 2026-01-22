import React from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, BarChart3, ShoppingCart } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-900" />
      
      {/* Floating bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="bubble absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 dark:bg-blue-800/20 rounded-full" />
        <div className="bubble absolute top-3/4 right-1/4 w-48 h-48 bg-teal-200/30 dark:bg-teal-800/20 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="bubble absolute top-1/2 left-1/3 w-32 h-32 bg-purple-200/30 dark:bg-purple-800/20 rounded-full" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Manage all your shops.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                Smarter. Faster. Simpler.
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Zentra — AI-powered multi-branch shop management for small businesses.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Try Demo — No Signup
              </Link>
              
              <a
                href="#trial"
                className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 font-medium rounded-lg transition-all duration-200"
              >
                Start 30-Day Free Trial
              </a>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No credit card required for 30-day trial
            </p>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Store Dashboard</h3>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Revenue</p>
                      <p className="text-2xl font-bold">₹45.2K</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-200" />
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-sm">Orders</p>
                      <p className="text-2xl font-bold">127</p>
                    </div>
                    <ShoppingCart className="h-8 w-8 text-teal-200" />
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sales Trend</p>
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                </div>
                
                {/* Animated Chart Bars */}
                <div className="flex items-end justify-between h-24 space-x-1">
                  {[40, 65, 45, 80, 35, 90, 70].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-sm flex-1 transition-all duration-1000 ease-out"
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${index * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;