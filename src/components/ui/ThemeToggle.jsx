import React, { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { value: 'light', label: 'Clair', icon: Sun },
        { value: 'dark', label: 'Sombre', icon: Moon },
        { value: 'system', label: 'Système', icon: Monitor },
    ];

    const currentThemeIcon = themes.find(t => t.value === theme)?.icon || Monitor;
    const ThemeIcon = currentThemeIcon;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <ThemeIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            </Button>

            {isOpen && (
                <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown menu */}
                    <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                        {themes.map((themeOption) => {
                            const Icon = themeOption.icon;
                            const isActive = theme === themeOption.value;

                            return (
                                <button
                                    key={themeOption.value}
                                    onClick={() => {
                                        setTheme(themeOption.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                                        isActive
                                            ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-50'
                                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{themeOption.label}</span>
                                    {isActive && (
                                        <span className="ml-auto text-slate-900 dark:text-slate-50">✓</span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};
