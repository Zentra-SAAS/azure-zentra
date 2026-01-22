import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { ArrowLeft, BarChart3, TrendingUp, Package, Users, ShoppingCart, AlertCircle, Moon, Sun } from 'lucide-react';
import Chart from '../components/Chart';

const DemoPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [selectedShop, setSelectedShop] = useState('main-store');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const shopData = {
    'main-store': {
      name: 'Main Store',
      revenue: '₹45,230',
      orders: 127,
      products: 245,
      lowStock: 12,
      topProducts: ['iPhone 15', 'Samsung Galaxy S24', 'MacBook Air'],
      recentOrders: [
        { id: '#1234', customer: 'Rajesh Kumar', amount: '₹2,450', status: 'completed' },
        { id: '#1235', customer: 'Priya Sharma', amount: '₹1,200', status: 'pending' },
        { id: '#1236', customer: 'Amit Singh', amount: '₹3,100', status: 'completed' },
      ]
    },
    'electronics-branch': {
      name: 'Electronics Branch',
      revenue: '₹32,140',
      orders: 89,
      products: 189,
      lowStock: 8,
      topProducts: ['Laptop Chargers', 'Phone Cases', 'Bluetooth Headphones'],
      recentOrders: [
        { id: '#1240', customer: 'Sunita Patel', amount: '₹850', status: 'completed' },
        { id: '#1241', customer: 'Vikram Modi', amount: '₹4,200', status: 'completed' },
        { id: '#1242', customer: 'Neha Gupta', amount: '₹675', status: 'pending' },
      ]
    },
    'mobile-outlet': {
      name: 'Mobile Outlet',
      revenue: '₹28,750',
      orders: 156,
      products: 98,
      lowStock: 5,
      topProducts: ['Screen Protectors', 'Power Banks', 'Wireless Chargers'],
      recentOrders: [
        { id: '#1250', customer: 'Ravi Agarwal', amount: '₹1,850', status: 'completed' },
        { id: '#1251', customer: 'Kavita Joshi', amount: '₹450', status: 'completed' },
        { id: '#1252', customer: 'Deepak Yadav', amount: '₹2,100', status: 'processing' },
      ]
    }
  };

  const currentShop = shopData[selectedShop as keyof typeof shopData];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Zentra Demo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <select 
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="main-store">Main Store</option>
                <option value="electronics-branch">Electronics Branch</option>
                <option value="mobile-outlet">Mobile Outlet</option>
              </select>

              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentShop.revenue}</p>
                <p className="text-sm text-green-600 dark:text-green-400">+12.5% from last {selectedPeriod}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentShop.orders}</p>
                <p className="text-sm text-green-600 dark:text-green-400">+8.2% from last {selectedPeriod}</p>
              </div>
              <div className="p-3 bg-teal-100 dark:bg-teal-900/20 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Products</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{currentShop.products}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active inventory</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock Alert</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{currentShop.lowStock}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">Items need restock</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <AlertCircle className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Trend</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <Chart type="line" />
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sales by Category</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <Chart type="bar" />
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
            <div className="space-y-3">
              {currentShop.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{product}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {currentShop.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{order.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                        : order.status === 'pending'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-medium">✨ Demo Mode - All data is simulated</p>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;