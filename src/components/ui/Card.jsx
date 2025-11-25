import React from 'react';

export const Card = ({ children, className = "" }) => (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-950 dark:text-slate-50 shadow-sm ${className}`}>
        {children}
    </div>
);
