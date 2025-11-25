import React from 'react';

export const SimpleBarChart = ({ data, labelKey, valueKey, color = "bg-slate-900", unit = "" }) => {
    if (!data || data.length === 0) return null;
    const maxValue = Math.max(...data.map(d => d[valueKey]));

    return (
        <div className="space-y-3">
            {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-24 truncate text-slate-600 font-medium" title={item[labelKey]}>{item[labelKey]}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full ${color}`}
                            style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                        />
                    </div>
                    <div className="w-20 text-right font-bold text-slate-900">{item[valueKey].toLocaleString()} {unit}</div>
                </div>
            ))}
        </div>
    );
};
