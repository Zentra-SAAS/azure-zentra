import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { azureApi } from '../../lib/api';
import { GlassCard } from '../ui/GlassCard';
import { ShieldAlert } from 'lucide-react';

interface FraudTrendChartProps {
    orgId: string;
}

interface DataPoint {
    time: string;
    value: number;
    fullDate: string;
}

export const FraudTrendChart: React.FC<FraudTrendChartProps> = ({ orgId }) => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [loading, setLoading] = useState(true);

    // Since backend only stores *current* state (upsert), we must build trend live.
    // We cannot fetch history of alerts because we don't store history in ml_metrics, only snapshot.

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const { data: analytics, error } = await azureApi.getAnalytics(orgId);
                if (error) throw new Error(error);

                const trend = analytics?.sales_trend || [];
                const amounts = trend.map((t: { revenue: string }) => parseFloat(t.revenue));
                const avg = amounts.length ? amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length : 0;
                const threshold = Math.max(avg * 3, 1000);

                const trendData = trend.slice(0, 15).map((t: { date: string; revenue: string }) => {
                    const isSuspicious = parseFloat(t.revenue) > threshold;
                    return {
                        time: new Date(t.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
                        value: isSuspicious ? 1 : 0,
                        fullDate: new Date(t.date).toLocaleDateString()
                    };
                });

                if (mounted) setData(trendData);
            } catch (e) {
                console.error(e);
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
                        <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
                        Fraud Trend
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Suspicious activity over time</p>
                </div>
            </div>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                        />
                        <YAxis
                            allowDecimals={false}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 10 }}
                        />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none', backdropFilter: 'blur(5px)' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelFormatter={(_, payload) => payload[0]?.payload.fullDate}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#EF4444' : '#10B981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
};
