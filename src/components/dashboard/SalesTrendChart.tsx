import React, { useEffect, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { azureApi } from '../../lib/api';
import { GlassCard } from '../ui/GlassCard';
import { TrendingUp } from 'lucide-react';

interface SalesTrendChartProps {
    orgId: string;
}

interface DataPoint {
    time: string;
    value: number;
    fullDate: string;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ orgId }) => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: analytics, error } = await azureApi.getAnalytics(orgId);
                if (error) throw new Error(error);

                const trend = analytics?.sales_trend || [];
                const formattedData = trend.map((t: { date: string; revenue: string }) => ({
                    time: new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                    value: parseFloat(t.revenue),
                    fullDate: new Date(t.date).toLocaleDateString()
                }));

                if (mounted) setData(formattedData);
            } catch (err) {
                console.error('Error loading sales trend:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [orgId]);

    if (loading && data.length === 0) {
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    return (
        <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                        Sales Trend (Live)
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time revenue updates</p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                            tickFormatter={(val) => `₹${val}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none', backdropFilter: 'blur(5px)' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelStyle={{ color: '#9CA3AF' }}
                            formatter={(value: any) => [`₹${value}`, 'Sales']}
                            labelFormatter={(_, payload) => payload[0]?.payload.fullDate}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorSales)"
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
