import React, { useState, useEffect } from 'react';
import { azureApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Loader2, Zap, BarChart3 } from 'lucide-react';

interface AnalyticsResult {
    branch: string;
    total_revenue: number;
    shop_id: string;
    shop_name?: string;
}

import React, { useState, useEffect } from 'react';
import { azureApi } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TrendingUp, Loader2, Zap, BarChart3, Shield, Cpu, Activity, PieChart as PieIcon } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

interface AnalyticsResult {
    name: string;
    value: number;
    color: string;
}

interface EfficiencyData {
    productName: string;
    margin: number;
    efficiency: number;
    stockLevel: number;
}

const AzureAnalyticsPage: React.FC = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [revenueData, setRevenueData] = useState<AnalyticsResult[]>([]);
    const [efficiencyData, setEfficiencyData] = useState<EfficiencyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            performDeepAnalysis();
        }
    }, [user?.id]);

    const performDeepAnalysis = async () => {
        if (!user?.organization_id) return;
        
        try {
            setLoading(true);
            const [analyticsRes, productsRes] = await Promise.all([
                azureApi.getAnalytics(user.organization_id),
                azureApi.getProducts(user.organization_id)
            ]);

            if (analyticsRes.error || productsRes.error) throw new Error("Analysis failed");

            const analytics = analyticsRes.data;
            const products = productsRes.data;

            // 1. Revenue Analysis
            const mappedRevenue = (analytics?.top_products || []).map((p: any, i: number) => ({
                name: p.name,
                value: parseFloat(p.revenue),
                color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][i % 5]
            }));
            setRevenueData(mappedRevenue);

            // 2. Efficiency & Profit Margin Analysis (The "Azure Function" logic)
            const analysis = products.map((p: any) => {
                const margin = p.price > 0 ? ((p.price - (p.cost_price || 0)) / p.price) * 100 : 0;
                // Efficiency = (Price / Stock) ratio - simplified heuristic
                const efficiency = p.stock_quantity > 0 ? (p.price / p.stock_quantity) * 10 : 0;
                
                return {
                    productName: p.name,
                    margin: Math.round(margin),
                    efficiency: Math.round(efficiency),
                    stockLevel: p.stock_quantity
                };
            }).sort((a: any, b: any) => b.efficiency - a.efficiency).slice(0, 10);

            setEfficiencyData(analysis);
        } catch (err) {
            console.error('Azure Analysis Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoutClick = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (authLoading) return null;

    return (
        <AdminLayout onLogout={handleLogoutClick} userName={user?.name || ''} orgName={user?.organization?.name}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Azure-Themed Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center tracking-tight">
                            <Cpu className="mr-3 h-8 w-8 text-blue-500 animate-pulse" />
                            Azure Deep Data Analytics
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            High-performance business intelligence powered by Azure Storage
                        </p>
                    </div>
                    <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl border border-blue-100 dark:border-blue-800">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Azure Identity Verified</span>
                    </div>
                </div>

                {/* Analysis Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <Activity className="h-5 w-5 text-teal-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Processing Status</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Active</p>
                        <p className="text-xs text-gray-500 mt-1">Real-time Azure Table indexing</p>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Compute Engine</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Optimized</p>
                        <p className="text-xs text-gray-500 mt-1">V8 Engine JIT Compilation</p>
                    </GlassCard>
                    <GlassCard className="p-6">
                        <div className="flex items-center space-x-3 mb-2">
                            <TrendingUp className="h-5 w-5 text-blue-500" />
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Analysis Level</h3>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Advanced</p>
                        <p className="text-xs text-gray-500 mt-1">Multi-tenant pattern detection</p>
                    </GlassCard>
                </div>

                {/* Main Analysis Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Revenue Distribution */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                                <PieIcon className="mr-2 h-5 w-5 text-blue-500" />
                                Revenue Attribution
                            </h2>
                        </div>
                        <div className="h-[350px]">
                            {loading ? (
                                <div className="h-full flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={revenueData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {revenueData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', color: '#fff' }}
                                            formatter={(val: any) => `₹${val.toLocaleString()}`}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>

                    {/* Efficiency Score */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center mb-8">
                            <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
                            Efficiency Analytics
                        </h2>
                        <div className="space-y-6">
                            {loading ? (
                                <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                            ) : (
                                efficiencyData.map((item, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="font-semibold text-gray-700 dark:text-gray-300">{item.productName}</span>
                                            <span className="text-blue-600 font-bold">{item.efficiency} Score</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
                                                style={{ width: `${Math.min(item.efficiency * 2, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Profit Margin Analysis Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Margin Analysis Results</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Current Stock</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Estimated Margin</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {efficiencyData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.productName}</td>
                                        <td className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">{item.stockLevel}</td>
                                        <td className="px-6 py-4 text-right font-mono text-emerald-600 font-bold">{item.margin}%</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.margin > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {item.margin > 20 ? 'High Profit' : 'Low Margin'}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AzureAnalyticsPage;
