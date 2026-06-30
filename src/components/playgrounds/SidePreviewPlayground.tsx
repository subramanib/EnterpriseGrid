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

export function SidePreviewPlayground() {
  const [sidePreviewEnabled, setSidePreviewEnabled] = useState(true);

  const codeSnippet = `
<DataTable
  id="playground-side-preview-demo"
  columns={columns}
  data={data}
  config={{
    sidePreview: true,     // Enable Side Preview Panel feature
    searchable: true,
  }}
  // Optional custom renderer:
  renderSidePreview={(row, onClose) => (
    <div className="space-y-4">
      <div className="p-4 bg-slate-100 rounded-lg">
        <h3 className="font-bold text-slate-800">{row.title}</h3>
        <p className="text-slate-600">Released in {row.year}</p>
        <p className="text-slate-600">Directed by {row.director}</p>
      </div>
      <button onClick={onClose} className="w-full py-2 bg-indigo-600 text-white rounded">Close</button>
    </div>
  )}
/>
  `.trim();

  return (
    <div id="side-preview-section" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">📖 Side Preview Panel</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Provide an intuitive, keyboard-accessible sliding detail drawer on the right side of your grid. Users can click any row to inspect all record attributes, copy individual field values to the clipboard instantly, and view raw metadata properties seamlessly alongside their structured grid views.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Interactive Side Preview Grid</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Side Preview:</span>
              <button 
                onClick={() => setSidePreviewEnabled(!sidePreviewEnabled)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  sidePreviewEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sidePreviewEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
          <div className="p-0 flex-grow relative min-h-[400px]">
            <div className="p-3 bg-indigo-50 border-b border-indigo-100 text-[11px] text-indigo-700 font-medium flex items-center justify-between">
              <span>💡 Click any row below to open the Sliding Side Preview Panel!</span>
            </div>
            <DataTable 
              id="playground-side-preview-demo"
              columns={mockColumns} 
              data={mockData.slice(0, 10)} 
              config={{ 
                searchable: true, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false,
                sidePreview: sidePreviewEnabled
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
