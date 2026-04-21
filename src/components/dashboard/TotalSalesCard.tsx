import React, { useEffect, useState } from 'react';
import { TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { azureApi } from '../../lib/api';
import { GlassCard } from '../ui/GlassCard';

interface TotalSalesCardProps {
    orgId: string;
}

export const TotalSalesCard: React.FC<TotalSalesCardProps> = ({ orgId }) => {
    const [sales, setSales] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchSales = async () => {
            try {
                setLoading(true);
                const { data, error } = await azureApi.getAnalytics(orgId);
                if (error) throw new Error(error);
                const total = parseFloat(data?.sales?.total_revenue || '0');
                if (mounted) setSales(total);
            } catch (err) {
                console.error('Error fetching sales:', err);
                if (mounted) setError('Failed to load sales data');
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchSales();
        // Poll every 30 seconds for near-realtime updates
        const interval = setInterval(fetchSales, 30000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [orgId]);

    return (
        <GlassCard className="p-6 relative overflow-hidden group hover:shadow-md transition-all duration-300">
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
                                {error}
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
        </GlassCard>
    );
};
