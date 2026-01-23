import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';

interface FreeTrialBannerProps {
    createdAt: string;
}

export const FreeTrialBanner: React.FC<FreeTrialBannerProps> = ({ createdAt }) => {
    // Calculate trial details
    const startDate = parseISO(createdAt);
    const trialLengthDays = 30;
    const endDate = addDays(startDate, trialLengthDays);
    const today = new Date();

    const daysRemaining = differenceInDays(endDate, today);
    const isExpired = daysRemaining < 0;

    // Don't show if trial is long over (e.g. converted to paid or way past trial)
    // For now, we just show "Expired" or "X days left"

    if (daysRemaining > 30) {
        // Should not happen if data is correct for a recent trial, but just in case
        return null;
    }

    // Styles based on urgency
    let bgClass = "bg-blue-50 dark:bg-blue-900/20";
    let borderClass = "border-blue-200 dark:border-blue-800";
    let textClass = "text-blue-800 dark:text-blue-300";
    let iconColor = "text-blue-600 dark:text-blue-400";

    if (daysRemaining <= 3) {
        bgClass = "bg-orange-50 dark:bg-orange-900/20";
        borderClass = "border-orange-200 dark:border-orange-800";
        textClass = "text-orange-800 dark:text-orange-300";
        iconColor = "text-orange-600 dark:text-orange-400";
    } else if (daysRemaining <= 7) {
        bgClass = "bg-yellow-50 dark:bg-yellow-900/20";
        borderClass = "border-yellow-200 dark:border-yellow-800";
        textClass = "text-yellow-800 dark:text-yellow-300";
        iconColor = "text-yellow-600 dark:text-yellow-400";
    }

    if (isExpired) {
        bgClass = "bg-red-50 dark:bg-red-900/20";
        borderClass = "border-red-200 dark:border-red-800";
        textClass = "text-red-800 dark:text-red-300";
        iconColor = "text-red-600 dark:text-red-400";
    }

    return (
        <div className={`rounded-xl border ${borderClass} ${bgClass} p-4 mb-6 shadow-sm`}>
            <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white dark:bg-gray-800 ${iconColor} shadow-sm`}>
                        {isExpired ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div>
                        <h3 className={`font-semibold ${textClass}`}>
                            {isExpired ? 'Free Trial Expired' : 'Free Trial Active'}
                        </h3>
                        <p className={`text-sm ${textClass} opacity-90`}>
                            {isExpired
                                ? `Your 30-day free trial ended on ${format(endDate, 'MMMM do, yyyy')}.`
                                : `You have ${daysRemaining} days remaining in your free trial.`
                            }
                        </p>
                    </div>
                </div>

                <div className={`flex items-center text-sm font-medium ${textClass} bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg`}>
                    <span>Trial ends: {format(endDate, 'MMM do, yyyy')}</span>
                </div>
            </div>
        </div>
    );
};
