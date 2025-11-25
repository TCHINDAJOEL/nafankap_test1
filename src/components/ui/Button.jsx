import React from 'react';

export const Button = ({ children, variant = "primary", size = "default", className = "", onClick, ...props }) => {
    const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white dark:ring-offset-slate-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        primary: "bg-slate-900 dark:bg-slate-100 text-slate-50 dark:text-slate-900 hover:bg-slate-900/90 dark:hover:bg-slate-100/90",
        secondary: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 hover:bg-slate-100/80 dark:hover:bg-slate-800/80",
        outline: "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-50",
        danger: "bg-red-500 dark:bg-red-600 text-white hover:bg-red-600 dark:hover:bg-red-700",
        success: "bg-green-600 dark:bg-green-700 text-white hover:bg-green-700 dark:hover:bg-green-800"
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        xs: "h-7 rounded px-2 text-xs",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
    };
    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {children}
        </button>
    );
};
