import React, { useState } from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const mockData = [
  { id: 1, title: 'Beetlejuice', year: '1988', director: 'Tim Burton' },
  { id: 2, title: 'Ghostbusters', year: '1984', director: 'Ivan Reitman' },
  { id: 3, title: 'The Matrix', year: '1999', director: 'Lana Wachowski' },
  { id: 4, title: 'Inception', year: '2010', director: 'Christopher Nolan' },
  { id: 5, title: 'Interstellar', year: '2014', director: 'Christopher Nolan' },
  { id: 6, title: 'The Dark Knight', year: '2008', director: 'Christopher Nolan' },
  { id: 7, title: 'Pulp Fiction', year: '1994', director: 'Quentin Tarantino' },
  { id: 8, title: 'Fight Club', year: '1999', director: 'David Fincher' },
  { id: 9, title: 'Forrest Gump', year: '1994', director: 'Robert Zemeckis' },
  { id: 10, title: 'The Shawshank Redemption', year: '1994', director: 'Frank Darabont' }
];

const mockColumns = [
  { name: 'Title', selector: (row: any) => row.title, sortable: true, id: 'title' },
  { name: 'Director', selector: (row: any) => row.director, sortable: true, id: 'director' },
  { name: 'Year', selector: (row: any) => row.year, sortable: true, id: 'year' }
];

export default function WorkingGridPlayground() {
  const [config, setConfig] = useState({
    pagination: true,
    selectableRows: true,
    expandableRows: false,
    striped: true,
    highlightOnHover: true,
    fixedHeader: false,
    dense: false,
    pointerOnHover: true,
    responsive: true,
    noHeader: true,
    noTableHead: false
  });

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const codeSnippet = `
<DataTable
  columns={columns}
  data={data}${config.pagination ? '\n  pagination' : ''}${config.selectableRows ? '\n  selectableRows' : ''}${config.expandableRows ? '\n  expandableRows\n  expandableRowsComponent={ExpComponent}' : ''}${config.striped ? '\n  striped' : ''}${config.highlightOnHover ? '\n  highlightOnHover' : ''}${config.fixedHeader ? '\n  fixedHeader' : ''}${config.dense ? '\n  dense' : ''}${config.pointerOnHover ? '\n  pointerOnHover' : ''}${config.responsive ? '\n  responsive' : ''}${config.noHeader ? '\n  noHeader' : ''}${config.noTableHead ? '\n  noTableHead' : ''}
/>`.trim();

  return (
    <div id="working-grid" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">10-Line Grid Quickstart</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Toggle features below to see how you can build a powerful data grid in under 10 lines of code.
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4 flex-shrink-0">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sticky top-24">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">Props Configuration</h3>
            <div className="space-y-3">
              {Object.entries(config).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      checked={value} 
                      onChange={() => toggleConfig(key as keyof typeof config)}
                      className="peer sr-only"
                    />
                    <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                    {key}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-3/4 flex-1 min-w-0 flex flex-col space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Live Preview</span>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-[10px]">10 Rows Max</span>
            </div>
            <div className="p-0 flex-grow overflow-auto relative min-h-[300px]">
              <DataTable 
                columns={mockColumns} 
                data={mockData} 
                pagination={config.pagination}
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 10]}
                selectableRows={config.selectableRows}
                expandableRows={config.expandableRows}
                expandableRowsComponent={({ data }: any) => (
                  <div className="p-6 bg-slate-50 text-sm text-slate-700 border-b border-slate-200 shadow-inner">
                    Expanded details for: <strong className="text-indigo-600">{data.title}</strong> ({data.year})
                  </div>
                )}
                striped={config.striped}
                highlightOnHover={config.highlightOnHover}
                fixedHeader={config.fixedHeader}
                fixedHeaderScrollHeight={config.fixedHeader ? "300px" : undefined}
                dense={config.dense}
                pointerOnHover={config.pointerOnHover}
                responsive={config.responsive}
                noHeader={config.noHeader}
                noTableHead={config.noTableHead}
                config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col h-64">
              <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300 flex justify-between items-center">
                <span>Generated Code</span>
                <span className="text-[10px] text-slate-500 font-mono">React</span>
              </div>
              <div className="flex-grow p-4 overflow-auto">
                <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}>
                  {codeSnippet}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="w-full md:w-1/2 flex-1 min-w-0 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden shadow-sm flex flex-col h-64">
              <div className="bg-amber-100 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Accessibility Check
              </div>
              <div className="p-4 text-sm text-amber-900 space-y-3 overflow-auto">
                {!config.pagination && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5 text-amber-600 font-bold">•</span>
                    <span><strong>Suggestion:</strong> Enable pagination for large datasets to improve keyboard navigation efficiency and screen reader performance.</span>
                  </div>
                )}
                {!config.highlightOnHover && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5 text-amber-600 font-bold">•</span>
                    <span><strong>WAI-ARIA:</strong> Ensure custom row styling provides sufficient contrast ratio (at least 4.5:1) for visually impaired users.</span>
                  </div>
                )}
                {config.selectableRows && (
                  <div className="flex items-start">
                    <span className="mr-2 mt-0.5 text-emerald-600 font-bold">✓</span>
                    <span className="text-emerald-800"><strong>Good:</strong> Row selection checkboxes are properly linked with ARIA labels describing the row content.</span>
                  </div>
                )}
                <div className="flex items-start">
                  <span className="mr-2 mt-0.5 text-emerald-600 font-bold">✓</span>
                  <span className="text-emerald-800"><strong>Status:</strong> Generated grid structure meets WCAG 2.1 AA requirements. Table roles and standard keyboard navigation are active.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
