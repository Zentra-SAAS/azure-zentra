import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { supabase } from '../../lib/supabase';

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

        // 1. Initial Fetch
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('ml_metrics')
                    .select('value, meta')
                    .eq('organization_id', orgId)
                    .eq('metric_type', 'fraud_alerts')
                    .single();

                if (error) {
                    if (error.code === 'PGRST116') {
                        if (mounted) setData({ value: 0, meta: {} });
                    } else {
                        console.error('Error fetching fraud alerts:', error);
                    }
                } else {
                    if (mounted) setData(data as FraudData);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        // 2. Realtime Subscription
        const channel = supabase
            .channel('realtime-fraud-card')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'ml_metrics',
                    filter: `organization_id=eq.${orgId}`,
                },
                (payload) => {
                    if (payload.new && (payload.new as any).metric_type === 'fraud_alerts') {
                        setData(payload.new as FraudData);
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [orgId]);

    if (loading) {
        return <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>;
    }

    const alertCount = data?.value || 0;
    const isSafe = alertCount === 0;

    return (
        <div className={`rounded-xl shadow-sm border p-6 transition-all duration-300 ${isSafe
                ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/50'
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
        </div>
    );
};
