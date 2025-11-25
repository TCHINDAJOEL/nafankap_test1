import React from 'react';

export const Avatar = ({ src, fallback, className = "" }) => (
    <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>
        {src ? (
            <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
        ) : (
            <div
                className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                {fallback}
            </div>
        )}
    </div>
);
