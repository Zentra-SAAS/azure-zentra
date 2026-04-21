import React, { useEffect, useState } from 'react';
import { Box, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { azureApi } from '../../lib/api';
import { GlassCard } from '../ui/GlassCard';

interface StockRiskCardProps {
    orgId: string;
}

interface StockData {
    value: number;
    meta: {
        details?: Array<{
            name: string;
            days_left: number;
            severity: 'High' | 'Medium';
            stock: number;
        }>;
    };
}

export const StockRiskCard: React.FC<StockRiskCardProps> = ({ orgId }) => {
    const [data, setData] = useState<StockData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: products, error } = await azureApi.getProducts(orgId);
                if (error) throw new Error(error);

                const atRisk = (products || [])
                    .filter((p: { stock_quantity: number; low_stock_threshold: number }) =>
                        p.stock_quantity <= (p.low_stock_threshold || 10)
                    )
                    .map((p: { name: string; stock_quantity: number; low_stock_threshold: number }) => ({
                        name: p.name,
                        days_left: Math.max(0, Math.round(p.stock_quantity / 2)),
                        severity: (p.stock_quantity < 5 ? 'High' : 'Medium') as 'High' | 'Medium',
                        stock: p.stock_quantity
                    }));

                if (mounted) {
                    setData({ value: atRisk.length, meta: { details: atRisk.slice(0, 5) } });
                }
            } catch (error) {
                console.error('Error fetching stock alerts:', error);
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

    if (loading) {
        return <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const riskCount = data?.value || 0;
    const isSafe = riskCount === 0;

    return (
        <GlassCard className={`p-6 transition-all duration-300 ${isSafe
            ? ''
            : '!bg-orange-50/70 dark:!bg-orange-900/20 !border-orange-500/30'
            }`}>
            <div className="flex justify-between items-start">
                <div className="w-full">
                    <h3 className={`text-lg font-bold flex items-center ${isSafe ? 'text-gray-900 dark:text-gray-100' : 'text-orange-700 dark:text-orange-400'
                        }`}>
                        {isSafe ? (
                            <>
                                <CheckBoxIcon className="h-5 w-5 mr-2 text-green-500" />
                                Inventory Level Healthy
                            </>
                        ) : (
                            <>
                                <AlertOctagon className="h-5 w-5 mr-2 text-orange-600 animate-pulse" />
                                Stock Risk Alerts
                            </>
                        )}
                    </h3>

                    <div className="mt-4">
                        {isSafe ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                                <Box className="h-4 w-4 mr-2" />
                                All products have sufficient stock coverage.
                            </p>
                        ) : (
                            <div className="grid gap-3">
                                {data?.meta?.details?.map((product, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white dark:bg-gray-900/40 p-3 rounded-lg border border-orange-100 dark:border-orange-900/30">
                                        <div className="flex items-center">
                                            <Box className="h-4 w-4 text-orange-500 mr-3" />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{product.name}</p>
                                                <p className="text-xs text-gray-500">{product.stock} units left</p>
                                            </div>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${product.severity === 'High'
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {product.days_left} days left
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

// Simple internal icon component for specific visual
const CheckBoxIcon = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center ${className}`}>
        <CheckCircle2 className="h-full w-full" />
    </div>
);
