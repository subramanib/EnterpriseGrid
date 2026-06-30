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

export function SavedViewsPlayground() {
  const [savedViewsEnabled, setSavedViewsEnabled] = useState(true);

  const codeSnippet = `
<DataTable
  id="my-unique-table-id"
  columns={columns}
  data={data}
  config={{
    savedViews: true,       // Enable Saved Views UI
    columnVisibility: true, // Allow users to hide/show columns
    densityToggle: true,    // Allow users to change density
  }}
/>
  `.trim();

  return (
    <div id="saved-views" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">🔖 Saved Views</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Allow users to persist and load their preferred table configuration. This stores search, sort orders, density, column visibility, and active views in local storage.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Movies Database</span>
          </div>
          <div className="p-0 flex-grow relative min-h-[400px]">
            <DataTable 
              id="playground-saved-views-demo"
              columns={mockColumns} 
              data={mockData} 
              config={{ 
                searchable: true, 
                exportable: false, 
                densityToggle: true, 
                columnVisibility: true,
                savedViews: savedViewsEnabled
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
