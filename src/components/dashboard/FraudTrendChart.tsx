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
import { supabase } from '../../lib/supabase';
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

        // Initial fetch to get ONE point (current state)
        const fetchInitial = async () => {
            try {
                const { data: metric } = await supabase
                    .from('ml_metrics')
                    .select('value, created_at')
                    .eq('organization_id', orgId)
                    .eq('metric_type', 'fraud_alerts')
                    .single();

                if (metric && mounted) {
                    const date = new Date();
                    setData([{
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        value: metric.value,
                        fullDate: date.toLocaleString()
                    }]);
                } else if (mounted) {
                    setData([]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchInitial();

        const channel = supabase
            .channel('realtime-fraud-trend')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT and UPDATE
                    schema: 'public',
                    table: 'ml_metrics',
                    filter: `organization_id=eq.${orgId}`,
                },
                (payload) => {
                    if (payload.new && (payload.new as any).metric_type === 'fraud_alerts') {
                        const newVal = (payload.new as any).value;
                        const date = new Date();
                        const newPoint = {
                            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            value: newVal,
                            fullDate: date.toLocaleString()
                        };

                        setData(prev => {
                            // Keep last 15 points
                            const newData = [...prev, newPoint];
                            if (newData.length > 15) return newData.slice(newData.length - 15);
                            return newData;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [orgId]);

    if (loading && data.length === 0) {
        return <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
                            contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelFormatter={(label, payload) => payload[0]?.payload.fullDate}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#EF4444' : '#10B981'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
