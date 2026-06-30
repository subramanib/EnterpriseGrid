import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';
import { mockData } from './mockData';

const mockColumns = [
  { id: 'title', name: 'Title', selector: (row: any) => row.title, sortable: true },
  { id: 'year', name: 'Year', selector: (row: any) => row.year, sortable: true },
  { id: 'director', name: 'Director', selector: (row: any) => row.director, sortable: true },
];

export function TimeTravelPlayground() {
  const [timeTravelEnabled, setTimeTravelEnabled] = useState(true);

  const codeSnippet = `
<DataTable
  id="playground-time-travel-demo"
  columns={columns}
  data={data}
  config={{
    timeTravel: true,       // Enable Time Travel (Undo/Redo & Timeline History)
    searchable: true,       // Allow search tracking
    columnVisibility: true, // Allow column toggles tracking
    densityToggle: true,    // Allow density changes tracking
  }}
/>
  `.trim();

  return (
    <div id="time-travel" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">⏳ Time Travel (History Replay)</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Let users step backward and forward through layout changes, column reorders, density toggles, searches, and filters. A full-featured timeline log lists previous actions and allows instant replay/restoration to any historical snapshot.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Interactive Movie Grid</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Feature status:</span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-700">Active</span>
            </div>
          </div>
          <div className="p-0 flex-grow relative min-h-[400px]">
            <DataTable 
              id="playground-time-travel-demo"
              columns={mockColumns} 
              data={mockData} 
              config={{ 
                searchable: true, 
                exportable: false, 
                densityToggle: true, 
                columnVisibility: true,
                timeTravel: timeTravelEnabled
              }}
              pagination
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Integration Example</div>
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
