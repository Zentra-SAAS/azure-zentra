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

const HadoopAnalyticsPage: React.FC = () => {
    const { user, logout, loading: authLoading } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsResult[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            fetchAnalytics();
        }
    }, [user?.id]);

    const fetchAnalytics = async () => {
        if (!user?.organization_id) return;
        
        try {
            setLoading(true);
            
            // Use the Azure analytics endpoint
            const { data: analytics, error } = await azureApi.getAnalytics(user.organization_id);
            if (error) throw new Error(error);

            // Map top_products into the AnalyticsResult shape
            const mappedData: AnalyticsResult[] = (analytics?.top_products || []).map((p: { name: string; revenue: string }) => ({
                branch: p.name,
                total_revenue: parseFloat(p.revenue),
                shop_id: user.organization_id || '',
                shop_name: p.name
            }));

            setAnalyticsData(mappedData);
        } catch (err) {
            console.error('Error fetching analytics:', err);
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

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

    if (authLoading) return null;

    return (
        <AdminLayout onLogout={handleLogoutClick} userName={user?.name || ''} orgName={user?.organization?.name}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center tracking-tight">
                            <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
                            Hadoop-Based Branch Revenue Analysis
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Big Data analytics for your managed store locations
                        </p>
                    </div>
                </div>

                {/* Main Graph Section */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                            <TrendingUp className="mr-2 h-5 w-5 text-emerald-500" />
                            Revenue Distribution by Shop
                        </h2>
                        <div className="flex items-center space-x-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <Zap className="h-3 w-3 text-yellow-400" />
                            <span>MapReduce Engine</span>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        {loading ? (
                            <div className="h-full flex flex-col items-center justify-center">
                                <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
                                <p className="text-gray-500 text-sm">Synchronizing with Hadoop cluster...</p>
                            </div>
                        ) : analyticsData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={analyticsData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                    <XAxis 
                                        dataKey="shop_name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                        angle={-45} 
                                        textAnchor="end"
                                        interval={0}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fill: '#9CA3AF', fontSize: 11 }} 
                                        tickFormatter={(value) => `₹${value.toLocaleString()}`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', color: '#fff' }}
                                        itemStyle={{ color: '#60A5FA' }}
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Total Revenue']}
                                    />
                                    <Bar dataKey="total_revenue" radius={[4, 4, 0, 0]} barSize={40}>
                                        {analyticsData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <BarChart3 className="h-12 w-12 mb-4 opacity-10" />
                                <p className="text-sm font-medium">No results found for your stores</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detailed Data Table */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shop Summary</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900/50">
                                <tr>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Shop / Branch</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Aggregated Revenue</th>
                                    <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">Market Share</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={3} className="px-6 py-12 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" /></td></tr>
                                ) : analyticsData.length > 0 ? (
                                    analyticsData.map((item, index) => {
                                        const total = analyticsData.reduce((acc, curr) => acc + curr.total_revenue, 0);
                                        const contribution = ((item.total_revenue / total) * 100).toFixed(1);
                                        return (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-1.5 h-6 rounded-full mr-4 group-hover:scale-y-125 transition-transform" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">{item.shop_name}</div>
                                                            <div className="text-[10px] text-gray-500 font-mono">{item.branch}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-gray-900 dark:text-white">
                                                    ₹{item.total_revenue.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center space-x-3">
                                                        <div className="w-24 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                                            <div 
                                                                className="h-full rounded-full group-hover:opacity-80 transition-opacity" 
                                                                style={{ 
                                                                    width: `${contribution}%`,
                                                                    backgroundColor: COLORS[index % COLORS.length]
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-500 min-w-[35px]">{contribution}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-500 text-sm">No analysis results found for your associated shops.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default HadoopAnalyticsPage;
