import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface TotalSalesCardProps {
    orgId: string;
}

export const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ orgId }) => {
    const [sales, setSales] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        // 1. Initial Fetch
        const fetchSales = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('ml_metrics')
                    .select('value')
                    .eq('organization_id', orgId)
                    .eq('metric_type', 'total_sales')
                    .single();

                if (error) {
                    // If no row found, it might be fine (0 sales), but if query failed, log it.
                    // .single() returns error code PGRST116 if no rows.
                    if (error.code === 'PGRST116') {
                        if (mounted) setSales(0);
                    } else {
                        throw error;
                    }
                } else {
                    if (mounted) setSales(data?.value || 0);
                }
            } catch (err) {
                console.error('Error fetching sales:', err);
                if (mounted) setError('Failed to load sales data');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSales();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('realtime-sales-card')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'ml_metrics',
                    filter: `organization_id=eq.${orgId}`,
                },
                (payload) => {
                    // Check if the updated row is for total_sales
                    if (payload.new.metric_type === 'total_sales') {
                        setSales(payload.new.value);
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'ml_metrics',
                    filter: `organization_id=eq.${orgId}`,
                },
                (payload) => {
                    if (payload.new.metric_type === 'total_sales') {
                        setSales(payload.new.value);
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [orgId]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
            {/* Decorative Gradient Background */}
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-indigo-50/50 to-transparent dark:from-indigo-900/10 pointer-events-none group-hover:w-32 transition-all duration-500" />

            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        Total Sales (Live)
                        <span className="ml-2 relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    </p>

                    <div className="mt-2 flex items-baseline">
                        {loading ? (
                            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        ) : error ? (
                            <div className="flex items-center text-red-500 text-sm">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Error
                            </div>
                        ) : (
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                ₹{sales?.toLocaleString() ?? '0'}
                            </h3>
                        )}
                    </div>
                </div>

                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="h-6 w-6" />
                </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <RefreshCw className="h-3 w-3 mr-1" />
                Updates automatically in real-time
            </div>
        </div>
    );
};
