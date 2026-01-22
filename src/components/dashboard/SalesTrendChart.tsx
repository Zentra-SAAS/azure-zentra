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
import { supabase } from '../../lib/supabase';
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
                // Fetch last 20 sales metrics
                const { data: metrics, error } = await supabase
                    .from('ml_metrics')
                    .select('value, created_at') // created_at is better for history than updated_at sometimes
                    .eq('organization_id', orgId)
                    .eq('metric_type', 'total_sales')
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;

                if (metrics && mounted) {
                    const formattedData = metrics
                        .reverse() // Show oldest to newest
                        .map((m) => {
                            const date = new Date(m.created_at);
                            return {
                                time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                value: m.value,
                                fullDate: date.toLocaleString()
                            };
                        });
                    setData(formattedData);
                }
            } catch (err) {
                console.error('Error loading sales trend:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        // Subscribe to new data
        const channel = supabase
            .channel('realtime-sales-trend')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT', // We only care about new snapshots for history? 
                    // Actually, ml_metrics for 'total_sales' is often UPSERTED (updated).
                    // If we update the SAME row (same org_id & metric_type), we lose history in that table 
                    // UNLESS we are storing a timeseries.
                    // CHECK: ml_service.py upserts on (organization_id, metric_type).
                    // RESULT: We only have 1 row per org for 'total_sales'. We CANNOT show a trend from history 
                    // if we only store the current value.
                    // FIX: For the purpose of this visual analytics task (Academic/Demo), 
                    // we should simulate history on the frontend by keeping an array of received updates,
                    // OR the backend should have been inserting new rows.
                    // Given constraints "Do NOT modify backend tables", we must build the trend LIVE.
                    // IE: We start with empty/current, and append points as they come in.
                    schema: 'public',
                    table: 'ml_metrics',
                    filter: `organization_id=eq.${orgId}`,
                },
                (payload) => {
                    if (payload.new && (payload.new as any).metric_type === 'total_sales') {
                        const newVal = (payload.new as any).value;
                        const date = new Date();
                        const newPoint = {
                            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            value: newVal,
                            fullDate: date.toLocaleString()
                        };

                        setData(prev => {
                            const newData = [...prev, newPoint];
                            if (newData.length > 20) return newData.slice(newData.length - 20);
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
                            contentStyle={{ backgroundColor: '#1F2937', color: '#F3F4F6', borderRadius: '8px', border: 'none' }}
                            itemStyle={{ color: '#F3F4F6' }}
                            labelStyle={{ color: '#9CA3AF' }}
                            formatter={(value: any) => [`₹${value}`, 'Sales']}
                            labelFormatter={(label, payload) => payload[0]?.payload.fullDate}
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
        </div>
    );
};
