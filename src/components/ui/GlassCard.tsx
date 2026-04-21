import React from 'react';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
    return (
        <div
            className={`
        relative overflow-hidden
        bg-white/70 dark:bg-gray-900/60 
        backdrop-blur-xl 
        border border-white/40 dark:border-gray-700/50 
        shadow-xl 
        rounded-2xl 
        transition-all duration-300
        hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-900/70
        group
        ${className}
      `}
        >
            {/* Crystal/Glass reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none opacity-50" />

            {/* Content wrapper to ensure content is above the reflection */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};
