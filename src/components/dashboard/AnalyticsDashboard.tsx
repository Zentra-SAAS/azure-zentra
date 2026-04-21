import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar
} from 'recharts';
import {
    Package, AlertCircle, ShoppingCart,
    DollarSign, Activity, ArrowUpRight, Calendar, Store, ChevronDown
} from 'lucide-react';
import { azureApi } from '../../lib/api';

interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    lowStockCount: number;
    revenueTrend: any[];
    salesByCategory: any[];
    recentOrders: any[];
    topProducts: any[];
    shopRanking: any[];
}

interface Shop {
    id: string;
    name: string;
}

interface AnalyticsDashboardProps {
    orgId: string;
    isOwner?: boolean;
    userId?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ orgId, isOwner, userId }) => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        lowStockCount: 0,
        revenueTrend: [],
        salesByCategory: [],
        recentOrders: [],
        topProducts: [],
        shopRanking: []
    });
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('7d');
    const [shops, setShops] = useState<Shop[]>([]);
    const [selectedShopId, setSelectedShopId] = useState<string>('all');

    useEffect(() => {
        if (isOwner && userId) {
            fetchShops();
        } else {
            // Default to just the current org if not owner or logic pending
            setSelectedShopId(orgId);
        }
    }, [isOwner, userId, orgId]);

    useEffect(() => {
        fetchDashboardData();
    }, [selectedShopId, timeRange, orgId]); // depends on shop selection

    const fetchShops = async () => {
        try {
            const { data, error } = await azureApi.getShops();
            if (error) throw new Error(error);
            if (data) {
                setShops(data as Shop[]);
                if (data.length > 1) setSelectedShopId('all');
                else if (data.length === 1) setSelectedShopId(data[0].id);
                else setSelectedShopId(orgId);
            }
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const targetId = selectedShopId === 'all' ? orgId : selectedShopId;
            if (!targetId) return;

            // Fetch analytics and products in parallel
            const [analyticsResult, productsResult] = await Promise.all([
                azureApi.getAnalytics(targetId),
                azureApi.getProducts(targetId)
            ]);

            const analytics = analyticsResult.data;
            const products = productsResult.data || [];

            const totalProducts = products.length;
            const lowStockCount = products.filter(
                (p: { stock_quantity: number; low_stock_threshold: number }) =>
                    p.stock_quantity <= (p.low_stock_threshold || 10)
            ).length;

            const totalRevenue = parseFloat(analytics?.sales?.total_revenue || '0');
            const totalOrders = parseInt(analytics?.sales?.total_bills || '0');

            // Revenue trend from analytics
            const revenueTrend = (analytics?.sales_trend || []).map(
                (t: { date: string; revenue: string }) => ({
                    date: new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    amount: parseFloat(t.revenue)
                })
            );

            // Category distribution from products
            const categoryMap = new Map<string, number>();
            products.forEach((p: { category?: string }) => {
                const cat = p.category || 'Uncategorized';
                categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
            });
            const salesByCategory = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

            // Top products from analytics
            const topProducts = (analytics?.top_products || []).map(
                (p: { name: string; units_sold: string; revenue: string }) => ({
                    id: p.name,
                    name: p.name,
                    price: parseFloat(p.revenue),
                    stock_quantity: parseFloat(p.units_sold),
                    category: 'Top Selling'
                })
            );

            // Recent orders (bills from analytics - simplified)
            const recentOrders: any[] = [];

            setStats({
                totalRevenue,
                totalOrders,
                totalProducts,
                lowStockCount,
                revenueTrend,
                salesByCategory,
                recentOrders,
                topProducts,
                shopRanking: []
            });

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Activity className="mr-2 h-6 w-6 text-blue-600" />
                        Performance Overview
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Real-time data from your organization</p>
                </div>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">

                    {/* Shop Selector */}
                    {isOwner && shops.length > 0 && (
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <select
                                value={selectedShopId}
                                onChange={(e) => setSelectedShopId(e.target.value)}
                                className="pl-9 pr-8 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none w-full sm:w-48 cursor-pointer"
                            >
                                <option value="all">All Shops</option>
                                {shops.map(shop => (
                                    <option key={shop.id} value={shop.id}>{shop.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                    )}

                    {/* Time Range Selector */}
                    <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setTimeRange('7d')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === '7d'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            7D
                        </button>
                        <button
                            onClick={() => setTimeRange('30d')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === '30d'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            30D
                        </button>
                        <button
                            onClick={() => setTimeRange('all')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${timeRange === 'all'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            All
                        </button>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Revenue */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none group-hover:w-32 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                ₹{stats.totalRevenue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                            <DollarSign className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-violet-50/50 to-transparent dark:from-violet-900/10 pointer-events-none group-hover:w-32 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalOrders}
                            </h3>
                        </div>
                        <div className="p-3 bg-violet-100 dark:bg-violet-900/20 rounded-lg text-violet-600 dark:text-violet-400">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-emerald-50/50 to-transparent dark:from-emerald-900/10 pointer-events-none group-hover:w-32 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Products</p>
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                {stats.totalProducts}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Low Stock */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-orange-50/50 to-transparent dark:from-orange-900/10 pointer-events-none group-hover:w-32 transition-all duration-500" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Low Stock Alerts</p>
                            <h3 className="text-3xl font-bold text-orange-600 dark:text-orange-500 mt-1">
                                {stats.lowStockCount}
                            </h3>
                        </div>
                        <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Ranking (Only when All Shops selected and owner has multiple shops) */}
            {selectedShopId === 'all' && stats.shopRanking.length > 0 && (
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold flex items-center">
                            <Store className="h-6 w-6 mr-2 text-yellow-400" />
                            Shop Performance Ranking
                        </h3>
                        {/* <span className="text-sm bg-white/10 px-3 py-1 rounded-full">Top Performers</span> */}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {stats.shopRanking.map((shop, index) => (
                            <div key={shop.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors relative overflow-hidden">
                                {index === 0 && <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-bl-lg">#1 LEADER</div>}
                                <h4 className="font-bold text-lg mb-1">{shop.name}</h4>
                                <div className="flex justify-between items-center mt-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Revenue</p>
                                        <p className="text-xl font-bold text-emerald-400">₹{shop.revenue.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Orders</p>
                                        <p className="text-lg font-semibold">{shop.orders}</p>
                                    </div>
                                </div>
                                {/* Progress Bar relative to top shop */}
                                <div className="mt-3 w-full bg-black/30 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full ${index === 0 ? 'bg-yellow-400' : 'bg-blue-500'}`}
                                        style={{ width: `${(shop.revenue / stats.shopRanking[0].revenue) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Revenue Trend Chart - Spans 2 columns */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analytics</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Income over time</p>
                        </div>
                    </div>

                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.revenueTrend}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6B7280', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Product Distribution - Spans 1 column */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Inventory Mix</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Products by Category</p>
                    </div>

                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.salesByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.salesByCategory.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalProducts}</p>
                            <p className="text-xs text-gray-500 font-medium">Total Items</p>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {stats.salesByCategory.map((category, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="text-gray-600 dark:text-gray-300 truncate max-w-[120px]">{category.name}</span>
                                </div>
                                <span className="font-semibold text-gray-900 dark:text-white">{category.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {stats.recentOrders.length > 0 ? (
                                    stats.recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                                                        {order.customer_name ? order.customer_name.charAt(0).toUpperCase() : 'C'}
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                            {order.customer_name || 'Walk-in Customer'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                                ₹{order.total_amount?.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'completed'
                                                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                                    : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                                            No recent orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top/High Value Products */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">High Value Inventory</h3>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Inventory</button>
                    </div>
                    <div className="p-4 space-y-4">
                        {stats.topProducts.length > 0 ? (
                            stats.topProducts.map((product, idx) => (
                                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-400 font-bold text-lg w-4">#{idx + 1}</span>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">{product.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{product.category || 'General'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white">₹{product.price?.toLocaleString()}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.stock_quantity} in stock</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                No products found.
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsDashboard;
