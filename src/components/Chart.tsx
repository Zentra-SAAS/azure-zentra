import React, { useEffect, useState } from 'react';

interface ChartProps {
  type: 'line' | 'bar';
}

const Chart: React.FC<ChartProps> = ({ type }) => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (type === 'line') {
    const points = [
      { x: 10, y: 80 },
      { x: 30, y: 60 },
      { x: 50, y: 90 },
      { x: 70, y: 45 },
      { x: 90, y: 70 },
      { x: 110, y: 30 },
      { x: 130, y: 85 }
    ];

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="h-40">
        <svg width="100%" height="100%" viewBox="0 0 150 100" className="overflow-visible">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Animated line */}
          <path
            d={pathData}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={animated ? "0" : "200"}
            strokeDashoffset={animated ? "0" : "200"}
            style={{
              transition: 'stroke-dashoffset 2s ease-out, stroke-dasharray 2s ease-out'
            }}
          />
          
          {/* Data points */}
          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3B82F6"
              className={`transform transition-all duration-500 ${
                animated ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200 + 500}ms` }}
            />
          ))}
        </svg>
      </div>
    );
  }

  // Bar chart
  const barData = [65, 45, 78, 52, 89, 67, 94];
  
  return (
    <div className="h-40 flex items-end justify-between space-x-2">
      {barData.map((height, index) => (
        <div
          key={index}
          className="bg-gradient-to-t from-blue-500 to-teal-500 rounded-t-sm flex-1 transition-all duration-1000 ease-out"
          style={{ 
            height: animated ? `${height}%` : '0%',
            transitionDelay: `${index * 150}ms`
          }}
        />
      ))}
    </div>
  );
};

export default Chart;