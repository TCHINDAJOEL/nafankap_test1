import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from './Button';

export const Modal = ({ isOpen, onClose, title, children, size = "md", className = "" }) => {
    if (!isOpen) return null;
    const defaultMaxWidth = size === "lg" ? "max-w-2xl" : "max-w-lg";
    // Use className if provided, otherwise use default
    const maxWidthClass = className.includes('max-w-') ? '' : defaultMaxWidth;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 animate-in fade-in duration-200 p-4">
            <div className={`bg-white dark:bg-slate-900 rounded-xl shadow-lg w-full mx-auto overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ${maxWidthClass} ${className}`}>
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-50">{title}</h3>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <XCircle className="h-5 w-5" />
                    </Button>
                </div>
                <div className="p-4 overflow-y-auto text-slate-900 dark:text-slate-50">
                    {children}
                </div>
            </div>
        </div>
    );
};
