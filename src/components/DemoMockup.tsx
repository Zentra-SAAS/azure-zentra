import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart3, Users, ShoppingCart, Package } from 'lucide-react';

const DemoMockup: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Try our full interactive demo
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-2">
            Experience Zentra's complete dashboard with real data and full functionality
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sandbox demo — interact with real dashboard data without signing up
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Demo Preview */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Browser Header */}
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex-1 bg-white dark:bg-gray-600 rounded px-3 py-1 mx-4">
                <span className="text-xs text-gray-500 dark:text-gray-400">zentra.demo/dashboard</span>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-6">
              {/* Top Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-xs">Total Revenue</p>
                      <p className="text-lg font-bold">₹1,24,450</p>
                    </div>
                    <BarChart3 className="h-6 w-6 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-teal-100 text-xs">Active Shops</p>
                      <p className="text-lg font-bold">3</p>
                    </div>
                    <ShoppingCart className="h-6 w-6 text-teal-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-xs">Total Products</p>
                      <p className="text-lg font-bold">532</p>
                    </div>
                    <Package className="h-6 w-6 text-purple-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4 rounded-lg text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-xs">Team Members</p>
                      <p className="text-lg font-bold">12</p>
                    </div>
                    <Users className="h-6 w-6 text-orange-200" />
                  </div>
                </div>
              </div>

              {/* Chart Area */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales Overview</h3>
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs">Today</span>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded text-xs">Week</span>
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded text-xs">Month</span>
                  </div>
                </div>
                
                {/* Mock Chart */}
                <div className="h-32 flex items-end justify-between space-x-2">
                  {[65, 45, 78, 52, 89, 67, 94, 58, 76, 43, 82, 69].map((height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-400 to-blue-500 rounded-t-sm flex-1 transition-all duration-1000"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {['New order #1234 - ₹2,450', 'Stock updated for iPhone Cases', 'Payment received - ₹1,200'].map((activity, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400 py-1">
                        • {activity}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Low Stock Alerts</h3>
                  <div className="space-y-2">
                    {['iPhone Chargers (2 left)', 'Samsung Cases (1 left)', 'Power Banks (3 left)'].map((alert, index) => (
                      <div key={index} className="text-sm text-orange-600 dark:text-orange-400 py-1">
                        ⚠️ {alert}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl cursor-pointer">
            <Link
              to="/demo"
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:scale-105 transition-transform duration-200 flex items-center space-x-3"
            >
              <Play className="h-6 w-6" />
              <span>Launch Interactive Demo</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoMockup;