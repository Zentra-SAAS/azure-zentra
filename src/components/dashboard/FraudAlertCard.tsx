import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { azureApi } from '../../lib/api';
import { GlassCard } from '../ui/GlassCard';

interface FraudAlertCardProps {
    orgId: string;
}

interface FraudData {
    value: number;
    meta: {
        average_bill?: number;
        threshold_used?: number;
        details?: string[];
    };
}

export const FraudAlertCard: React.FC<FraudAlertCardProps> = ({ orgId }) => {
    const [data, setData] = useState<FraudData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // 1. Initial Fetch & JS Analytics
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: analytics, error } = await azureApi.getAnalytics(orgId);
                if (error) throw new Error(error);

                const trend = analytics?.sales_trend || [];
                const amounts = trend.map((t: { revenue: string }) => parseFloat(t.revenue));
                const avg = amounts.length ? amounts.reduce((a: number, b: number) => a + b, 0) / amounts.length : 0;
                const threshold = Math.max(avg * 3, 1000);
                const suspicious = amounts.filter((a: number) => a > threshold);

                if (mounted) {
                    setData({
                        value: suspicious.length,
                        meta: {
                            average_bill: Math.round(avg),
                            threshold_used: Math.round(threshold),
                            details: suspicious.slice(0, 5).map((amt: number) =>
                                `Day revenue ₹${amt.toFixed(0)} exceeds alert threshold`
                            )
                        }
                    });
                }
            } catch (error) {
                console.error('Error fetching bills for fraud analysis:', error);
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

    const alertCount = data?.value || 0;
    const isSafe = alertCount === 0;

    return (
        <GlassCard className={`p-6 transition-all duration-300 ${isSafe
            ? ''
            : '!bg-red-50/70 dark:!bg-red-900/20 !border-red-500/30'
            }`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-lg font-bold flex items-center ${isSafe ? 'text-gray-900 dark:text-gray-100' : 'text-red-700 dark:text-red-400'
                        }`}>
                        {isSafe ? (
                            <>
                                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                System Status Normal
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="h-5 w-5 mr-2 text-red-600 animate-pulse" />
                                Suspicious Activity Detected
                            </>
                        )}
                    </h3>

                    <div className="mt-2">
                        {isSafe ? (
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No anomalies detected in recent transactions.
                            </p>
                        ) : (
                            <div>
                                <p className="font-semibold text-red-800 dark:text-red-300 text-lg">
                                    {alertCount} unusual bill{alertCount !== 1 ? 's' : ''} found
                                </p>

                                {data?.meta?.details && data.meta.details.length > 0 && (
                                    <div className="mt-3 bg-white/50 dark:bg-black/20 rounded-lg p-3 text-sm text-red-700 dark:text-red-300 space-y-1">
                                        {data.meta.details.map((detail, idx) => (
                                            <div key={idx} className="flex items-start">
                                                <Info className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0 opacity-70" />
                                                <span>{detail}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
