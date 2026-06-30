import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const trendSales = [30, 42, 35, 55, 48, 70, 62, 85, 78, 95];
const trendUsers = [120, 135, 140, 138, 155, 172, 165, 180, 195, 210];
const trendConversion = [2.8, 3.1, 2.9, 3.4, 3.2, 3.8, 3.5, 4.0, 4.2, 4.5];
const trendRefunds = [18, 15, 12, 14, 10, 8, 9, 6, 5, 4];
const trendBounce = [45, 42, 44, 40, 38, 35, 37, 32, 30, 28];

const mockDataWithTrends = [
  { id: 1, name: 'Sales Revenue', current: '$84,520', change: '+24%', changeType: 'positive', history: trendSales },
  { id: 2, name: 'Monthly Active Users', current: '210,480', change: '+18%', changeType: 'positive', history: trendUsers },
  { id: 3, name: 'Conversion Rate', current: '4.52%', change: '+12.4%', changeType: 'positive', history: trendConversion },
  { id: 4, name: 'Customer Refunds', current: '$420', change: '-52%', changeType: 'positive', history: trendRefunds },
  { id: 5, name: 'Landing Page Bounce Rate', current: '28.4%', change: '-18%', changeType: 'positive', history: trendBounce }
];

export function SparklinePlayground() {
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [highlightLast, setHighlightLast] = useState(true);
  const [highlightMin, setHighlightMin] = useState(true);
  const [highlightMax, setHighlightMax] = useState(true);

  const mockColumns = [
    { 
      id: 'name', 
      name: 'Metric Name', 
      selector: (row: any) => row.name, 
      sortable: true,
      style: { fontWeight: '600', color: '#1e293b' }
    },
    { 
      id: 'current', 
      name: 'Current Value', 
      selector: (row: any) => row.current, 
      sortable: true 
    },
    { 
      id: 'change', 
      name: 'MoM Change', 
      selector: (row: any) => row.change, 
      sortable: true,
      cell: (row: any) => {
        const isNegative = row.name.includes('Refund') || row.name.includes('Bounce') 
          ? row.change.startsWith('+') 
          : row.change.startsWith('-');
        return (
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
            isNegative ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
          }`}>
            {row.change}
          </span>
        );
      }
    },
    {
      id: 'history',
      name: 'Performance Trend',
      selector: (row: any) => row.history,
      sparkline: true,
      sparklineConfig: {
        type: chartType,
        strokeColor: '#6366f1',
        fillColor: 'rgba(99, 102, 241, 0.12)',
        height: 36,
        highlightMin,
        highlightMax,
        highlightLast,
        interactive: true,
        animate: true
      },
      width: '180px'
    }
  ];

  const codeSnippet = `
const columns = [
  { id: 'name', name: 'Metric', selector: row => row.name },
  { id: 'current', name: 'Current', selector: row => row.current },
  {
    id: 'history',
    name: 'Performance Trend (Sparkline)',
    selector: row => row.history, // Returns an array of numbers, e.g. [10, 15, 8, 24...]
    sparkline: true,              // Enable sparkline formatting for this column
    sparklineConfig: {
      type: '${chartType}',            // 'line' | 'bar' | 'area'
      strokeColor: '#6366f1',     // Line / bar outline color
      fillColor: 'rgba(99, 102, 241, 0.12)', // Area gradient color
      height: 36,                 // Height of sparkline
      highlightMin: ${highlightMin},         // Mark minimum with a red point
      highlightMax: ${highlightMax},         // Mark maximum with a green point
      highlightLast: ${highlightLast},        // Pulsing dot at the last value
      interactive: true,          // Hover interactive tooltips
      animate: true               // Draw transitions automatically
    },
    width: '180px'
  }
];

<DataTable
  id="sparkline-grid-demo"
  columns={columns}
  data={data}
  config={{ searchable: true }}
/>
  `.trim();

  return (
    <div id="sparklines" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">📊 Sparkline Charts</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Bring tabular trends to life with miniature, highly performant inline visualizations. Embed line, area, or bar charts directly inside cells to communicate key trends in a glance without cluttering your layout.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Live Trend Dashboard</span>
            
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                {(['line', 'area', 'bar'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md capitalize transition-colors ${
                      chartType === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setHighlightLast(!highlightLast)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                    highlightLast ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Toggle highlight for current/last value point"
                >
                  Last Dot
                </button>
                <button
                  onClick={() => setHighlightMin(!highlightMin)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                    highlightMin ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Toggle highlight for minimum value point"
                >
                  Min Dot
                </button>
                <button
                  onClick={() => setHighlightMax(!highlightMax)}
                  className={`px-2 py-1 text-[10px] font-bold rounded border transition-colors ${
                    highlightMax ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Toggle highlight for maximum value point"
                >
                  Max Dot
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-0 flex-grow relative min-h-[380px]">
            <DataTable 
              id="playground-sparkline-demo"
              columns={mockColumns} 
              data={mockDataWithTrends} 
              config={{ 
                searchable: false, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Sparkline Configuration</div>
          <div className="flex-grow p-4 overflow-auto">
            <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}>
              {codeSnippet}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
