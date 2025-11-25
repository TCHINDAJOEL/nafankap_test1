import React from 'react';

export const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "border-transparent bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 hover:bg-slate-900/80 dark:hover:bg-slate-100/80",
        outline: "text-slate-950 dark:text-slate-50 border-slate-200 dark:border-slate-700",
        success: "border-transparent bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50",
        warning: "border-transparent bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50",
        destructive: "border-transparent bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50",
        info: "border-transparent bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50"
    };
    return (
        <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 dark:focus:ring-slate-300 focus:ring-offset-2 ${variants[variant]} ${className}`}>
            {children}
        </div>
    );
};
