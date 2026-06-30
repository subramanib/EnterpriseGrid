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

export function RowCommentsPlayground() {
  const [commentsEnabled, setCommentsEnabled] = useState(true);

  const codeSnippet = `
<DataTable
  id="playground-comments-demo"
  columns={columns}
  data={data}
  config={{
    rowComments: true,     // Enable Row Comments & Mentions column
    searchable: true,
  }}
/>
  `.trim();

  return (
    <div id="row-comments" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">💬 Row Comments & Mentions</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Foster seamless collaboration right inside your data grids. Enable thread-based row conversations, user mentions with live autocomplete suggestions, avatar initial tags, and interactive popovers out of the box.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Interactive Comments Grid</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Comments Column:</span>
              <button 
                onClick={() => setCommentsEnabled(!commentsEnabled)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                  commentsEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {commentsEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>
          <div className="p-0 flex-grow relative min-h-[400px]">
            <DataTable 
              id="playground-comments-demo"
              columns={mockColumns} 
              data={mockData.slice(0, 5)} 
              config={{ 
                searchable: true, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false,
                rowComments: commentsEnabled
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
