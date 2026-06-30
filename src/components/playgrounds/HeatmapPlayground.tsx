import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const mockServerMetrics = [
  { id: 1, server: 'Production-Web-01', cpu: 78, memory: 88, latency: 124, errorRate: 0.12 },
  { id: 2, server: 'Production-Web-02', cpu: 45, memory: 62, latency: 95, errorRate: 0.04 },
  { id: 3, server: 'Staging-App-01', cpu: 12, memory: 35, latency: 45, errorRate: 0.00 },
  { id: 4, server: 'DB-Primary-01', cpu: 92, memory: 94, latency: 210, errorRate: 1.85 },
  { id: 5, server: 'Cache-Redis-01', cpu: 28, memory: 78, latency: 14, errorRate: 0.00 },
  { id: 6, server: 'Auth-Service-01', cpu: 60, memory: 58, latency: 110, errorRate: 0.35 },
  { id: 7, server: 'Worker-Queue-01', cpu: 85, memory: 42, latency: 315, errorRate: 2.10 },
];

export function HeatmapPlayground() {
  const [cpuPalette, setCpuPalette] = useState<'reds' | 'blues' | 'greens' | 'purples' | 'amber' | 'slate'>('reds');
  const [memPalette, setMemPalette] = useState<'reds' | 'blues' | 'greens' | 'purples' | 'amber' | 'slate'>('purples');
  const [textContrast, setTextContrast] = useState(true);
  const [customRanges, setCustomRanges] = useState(false);

  const columns = [
    {
      id: 'server',
      name: 'Server Node',
      selector: (row: any) => row.server,
      sortable: true,
      style: { fontWeight: '600', color: '#334155' }
    },
    {
      id: 'cpu',
      name: 'CPU Load (%)',
      selector: (row: any) => row.cpu,
      sortable: true,
      center: true,
      heatmap: true,
      heatmapConfig: {
        colorScale: cpuPalette,
        textContrast,
        ...(customRanges ? { min: 0, max: 100 } : {})
      }
    },
    {
      id: 'memory',
      name: 'Memory Util (%)',
      selector: (row: any) => row.memory,
      sortable: true,
      center: true,
      heatmap: true,
      heatmapConfig: {
        colorScale: memPalette,
        textContrast,
        ...(customRanges ? { min: 0, max: 100 } : {})
      }
    },
    {
      id: 'latency',
      name: 'Latency (ms)',
      selector: (row: any) => row.latency,
      sortable: true,
      center: true,
      heatmap: true,
      heatmapConfig: {
        colorScale: 'amber' as const,
        textContrast,
        ...(customRanges ? { min: 0, max: 500 } : {})
      }
    },
    {
      id: 'errorRate',
      name: 'Error Rate (%)',
      selector: (row: any) => row.errorRate,
      sortable: true,
      center: true,
      heatmap: true,
      heatmapConfig: {
        colorScale: 'slate' as const,
        textContrast,
        ...(customRanges ? { min: 0, max: 5.0 } : {})
      },
      format: (row: any) => `${row.errorRate.toFixed(2)}%`
    }
  ];

  const codeSnippet = `
const columns = [
  { id: 'server', name: 'Server Node', selector: row => row.server },
  {
    id: 'cpu',
    name: 'CPU Load (%)',
    selector: row => row.cpu,
    heatmap: true,                  // Enable dynamic heatmap shading
    heatmapConfig: {
      colorScale: '${cpuPalette}',          // 'reds' | 'blues' | 'greens' | 'purples' | 'amber' | 'slate' or raw custom ['#hex1', '#hex2']
      textContrast: ${textContrast},        // Auto adjust text color (white vs dark) based on luminance
      \${customRanges ? 'min: 0, max: 100' : '// Autocalculated: uses dynamic min/max bounds based on column values'}
    }
  },
  {
    id: 'memory',
    name: 'Memory Util (%)',
    selector: row => row.memory,
    heatmap: true,
    heatmapConfig: {
      colorScale: '${memPalette}',
      textContrast: ${textContrast}
    }
  }
];

<DataTable
  id="server-heatmap-demo"
  columns={columns}
  data={data}
  config={{ searchable: true }}
/>
  `.trim();

  return (
    <div id="heatmap-cells" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">🌡️ Heatmap Cells</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Transform pure numbers into instant visual insights with automatic heatmapping. Style cells dynamically along a customizable color gradient with automatic Web Content Accessibility Guidelines (WCAG) compliant text contrast, automatically calibrated to column bounds.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Cluster Status Metrics</span>
            
            {/* Interactive controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">CPU Scale:</span>
                <select 
                  value={cpuPalette} 
                  onChange={(e) => setCpuPalette(e.target.value as any)}
                  className="bg-white border border-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="reds">Reds</option>
                  <option value="blues">Blues</option>
                  <option value="greens">Greens</option>
                  <option value="purples">Purples</option>
                  <option value="amber">Amber</option>
                  <option value="slate">Slate</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">RAM Scale:</span>
                <select 
                  value={memPalette} 
                  onChange={(e) => setMemPalette(e.target.value as any)}
                  className="bg-white border border-slate-200 text-xs rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="purples">Purples</option>
                  <option value="reds">Reds</option>
                  <option value="blues">Blues</option>
                  <option value="greens">Greens</option>
                  <option value="amber">Amber</option>
                  <option value="slate">Slate</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setTextContrast(!textContrast)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors \${
                    textContrast ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Toggle automatic accessible text contrast calculation"
                >
                  Text Contrast
                </button>
                <button
                  onClick={() => setCustomRanges(!customRanges)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors \${
                    customRanges ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500'
                  }`}
                  title="Toggle manual ranges (e.g. 0-100) vs autocalculated dynamic bounds"
                >
                  {customRanges ? 'Manual Bounds' : 'Auto Bounds'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-0 flex-grow relative min-h-[380px]">
            <DataTable 
              id="playground-heatmap-demo"
              columns={columns} 
              data={mockServerMetrics} 
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
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Heatmap Column configuration</div>
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
