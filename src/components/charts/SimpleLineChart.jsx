import React from 'react';

export const SimpleLineChart = ({ data, dataKey, color = "#0f172a", height = 250, fillArea = false }) => {
    if (!data || data.length === 0) return null;

    const width = 1000; // internal SVG coordinate space
    const padding = 20;
    const maxValue = Math.max(...data.map(d => d[dataKey])) * 1.1; // +10% headroom
    const minValue = 0;

    const getX = (index) => (index / (data.length - 1)) * (width - padding * 2) + padding;
    const getY = (value) => height - padding - ((value - minValue) / (maxValue - minValue)) * (height - padding * 2);

    const points = data.map((d, i) => `${getX(i)},${getY(d[dataKey])}`).join(' ');

    return (
        <div className="w-full h-full relative">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                <line x1={padding} y1={getY(0)} x2={width - padding} y2={getY(0)} stroke="#e2e8f0" strokeWidth="1" />
                <line x1={padding} y1={getY(maxValue / 2)} x2={width - padding} y2={getY(maxValue / 2)} stroke="#e2e8f0"
                    strokeWidth="1" strokeDasharray="4 4" />
                <line x1={padding} y1={getY(maxValue)} x2={width - padding} y2={getY(maxValue)} stroke="#e2e8f0" strokeWidth="1"
                    strokeDasharray="4 4" />

                {/* Y Axis Labels (approx) */}
                <text x={0} y={getY(maxValue)} className="text-[10px] fill-slate-400"
                    alignmentBaseline="middle">{Math.round(maxValue / 1000)}k</text>
                <text x={0} y={getY(maxValue / 2)} className="text-[10px] fill-slate-400"
                    alignmentBaseline="middle">{Math.round(maxValue / 2000)}k</text>
                <text x={0} y={getY(0)} className="text-[10px] fill-slate-400" alignmentBaseline="middle">0</text>

                {/* Area Fill */}
                {fillArea && (
                    <path d={`M ${points.split(' ')[0]} L ${points.split(' ').join(' L ')} L ${getX(data.length - 1)},${height - padding} L ${padding},${height - padding} Z`} fill={color} fillOpacity="0.1" />
                )}

                {/* The Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* X Axis Labels (Show only ~6 labels max) */}
                {data.map((d, i) => {
                    if (i % Math.ceil(data.length / 6) === 0) {
                        return (
                            <text key={i} x={getX(i)} y={height} textAnchor="middle" className="text-[10px] fill-slate-400">
                                {d.date}
                            </text>
                        );
                    }
                    return null;
                })}
            </svg>
        </div>
    );
};
