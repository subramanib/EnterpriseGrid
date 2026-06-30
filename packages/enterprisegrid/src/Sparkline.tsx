import React, { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface SparklineConfig {
  type?: 'line' | 'bar' | 'area';
  strokeColor?: string;
  fillColor?: string;
  width?: number | string;
  height?: number;
  strokeWidth?: number;
  highlightMin?: boolean;
  highlightMax?: boolean;
  highlightLast?: boolean;
  interactive?: boolean;
  animate?: boolean;
}

interface SparklineProps {
  data: number[];
  config?: SparklineConfig;
  label?: string;
}

export function Sparkline({ data, config = {}, label }: SparklineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const type = config.type || 'line';
  const width = config.width || '100%';
  const height = config.height || 32;
  const strokeColor = config.strokeColor || '#4f46e5'; // Indigo-600
  const fillColor = config.fillColor || 'rgba(79, 70, 229, 0.1)';
  const strokeWidth = config.strokeWidth !== undefined ? config.strokeWidth : 1.5;
  const highlightMin = config.highlightMin ?? true;
  const highlightMax = config.highlightMax ?? true;
  const highlightLast = config.highlightLast ?? true;
  const interactive = config.interactive ?? true;
  const animate = config.animate ?? true;

  // Edge cases
  if (!data || data.length === 0) {
    return <div className="text-slate-400 text-xs italic">No data</div>;
  }

  const { min, max, points, barWidth, minIdx, maxIdx, lastIdx } = useMemo(() => {
    let minVal = Math.min(...data);
    let maxVal = Math.max(...data);
    
    // Guard against identical values or single element
    if (minVal === maxVal) {
      minVal = minVal - 1;
      maxVal = maxVal + 1;
    }

    const paddingY = 4;
    const paddingX = type === 'bar' ? 0 : 4;
    const svgW = 120;
    const svgH = height;

    const pointsList: { x: number; y: number; val: number; index: number }[] = [];
    const len = data.length;

    let minIndex = 0;
    let maxIndex = 0;
    let actualMin = data[0];
    let actualMax = data[0];

    data.forEach((val, idx) => {
      if (val < actualMin) {
        actualMin = val;
        minIndex = idx;
      }
      if (val > actualMax) {
        actualMax = val;
        maxIndex = idx;
      }
    });

    data.forEach((val, idx) => {
      const x = len > 1 
        ? paddingX + (idx / (len - 1)) * (svgW - 2 * paddingX)
        : svgW / 2;
      
      const y = svgH - paddingY - ((val - minVal) / (maxVal - minVal)) * (svgH - 2 * paddingY);
      pointsList.push({ x, y, val, index: idx });
    });

    const bWidth = len > 0 ? (svgW / len) * 0.75 : 4;

    return {
      min: minVal,
      max: maxVal,
      points: pointsList,
      barWidth: bWidth,
      minIdx: minIndex,
      maxIdx: maxIndex,
      lastIdx: len - 1
    };
  }, [data, height, type]);

  // Handle Mouse Hover Interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pctX = mouseX / rect.width;
    const idx = Math.min(
      Math.max(Math.round(pctX * (data.length - 1)), 0),
      data.length - 1
    );
    setHoveredIndex(idx);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Build SVG Paths/Elements
  const linePath = useMemo(() => {
    if (points.length < 2) return '';
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return '';
    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    return `${linePath} L ${lastPoint.x} ${height} L ${firstPoint.x} ${height} Z`;
  }, [linePath, points, height]);

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null;

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center py-1 group/spark"
      style={{ width, height: height + 8 }}
    >
      <svg
        viewBox={`0 0 120 ${height}`}
        className="w-full h-full overflow-visible select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Gradients */}
        <defs>
          <linearGradient id={`area-grad-${label || 'default'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Render Type Area */}
        {type === 'area' && areaPath && (
          <path
            d={areaPath}
            fill={`url(#area-grad-${label || 'default'})`}
            className="transition-all duration-200"
          />
        )}

        {/* Render Type Line / Area outline */}
        {(type === 'line' || type === 'area') && linePath && (
          <motion.path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0 } : undefined}
            animate={animate ? { pathLength: 1 } : undefined}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}

        {/* Render Type Bar */}
        {type === 'bar' && (
          <g>
            {points.map((p, idx) => {
              const barHeight = height - p.y;
              const isHovered = hoveredIndex === idx;
              return (
                <rect
                  key={idx}
                  x={p.x - barWidth / 2}
                  y={p.y}
                  width={barWidth}
                  height={Math.max(barHeight, 2)}
                  fill={isHovered ? strokeColor : strokeColor}
                  opacity={isHovered ? 1.0 : 0.6}
                  rx={1}
                  className="transition-all duration-150"
                />
              );
            })}
          </g>
        )}

        {/* Static Highlights (Only show when not hovering, or show always) */}
        {hoveredIndex === null && (type === 'line' || type === 'area') && (
          <g>
            {highlightMin && (
              <circle
                cx={points[minIdx].x}
                cy={points[minIdx].y}
                r={2}
                fill="#ef4444" // Red for min
                stroke="white"
                strokeWidth={0.5}
              />
            )}
            {highlightMax && (
              <circle
                cx={points[maxIdx].x}
                cy={points[maxIdx].y}
                r={2}
                fill="#22c55e" // Green for max
                stroke="white"
                strokeWidth={0.5}
              />
            )}
            {highlightLast && (
              <circle
                cx={points[lastIdx].x}
                cy={points[lastIdx].y}
                r={2}
                fill={strokeColor}
                stroke="white"
                strokeWidth={0.5}
                className="animate-pulse"
              />
            )}
          </g>
        )}

        {/* Interactive Hover Indicators */}
        {hoveredPoint && (
          <g>
            {/* Vertical dotted guide line */}
            <line
              x1={hoveredPoint.x}
              y1={0}
              x2={hoveredPoint.x}
              y2={height}
              stroke="#94a3b8"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
            {/* Hover Dot */}
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r={3.5}
              fill={strokeColor}
              stroke="white"
              strokeWidth={1}
            />
          </g>
        )}
      </svg>

      {/* Floating Tooltip Panel */}
      <AnimatePresence>
        {hoveredPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.1 }}
            className="absolute z-30 bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-lg flex items-center gap-1.5 whitespace-nowrap -top-7 pointer-events-none"
            style={{
              left: `${(hoveredPoint.x / 120) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <span className="opacity-75">Val:</span>
            <span className="font-mono">{hoveredPoint.val}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
