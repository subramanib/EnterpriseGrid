import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Wifi, WifiOff, Cloud, RefreshCw } from 'lucide-react';
import { DataTable } from '@enterprisegrid/grid';

const initialData = [
  { id: 1, name: 'Quantum Physics Course', category: 'Science', progress: 'In Progress', enrollment: 1250, fee: 149 },
  { id: 2, name: 'Interactive Calculus', category: 'Mathematics', progress: 'Not Started', enrollment: 820, fee: 99 },
  { id: 3, name: 'Machine Learning Basics', category: 'Technology', progress: 'Completed', enrollment: 3400, fee: 199 },
  { id: 4, name: 'Spanish Fluency Mastery', category: 'Languages', progress: 'In Progress', enrollment: 1540, fee: 129 },
  { id: 5, name: 'Modern React Essentials', category: 'Technology', progress: 'Completed', enrollment: 2100, fee: 89 },
];

export function OfflineSyncPlayground() {
  const [data, setData] = useState(initialData);

  const handleUpdate = (row: any, value: any, column: any) => {
    setData(prev => prev.map(r => r.id === row.id ? { ...r, [column.id]: value } : r));
  };

  const columns = [
    {
      id: 'name',
      name: 'Course Name',
      selector: (row: any) => row.name,
      sortable: true,
      editable: true,
    },
    {
      id: 'category',
      name: 'Category',
      selector: (row: any) => row.category,
      sortable: true,
      editable: true,
      editor: {
        type: 'select' as const,
        options: [
          { value: 'Science', label: 'Science' },
          { value: 'Mathematics', label: 'Mathematics' },
          { value: 'Technology', label: 'Technology' },
          { value: 'Languages', label: 'Languages' },
        ]
      }
    },
    {
      id: 'progress',
      name: 'Status',
      selector: (row: any) => row.progress,
      sortable: true,
      editable: true,
      editor: {
        type: 'select' as const,
        options: [
          { value: 'In Progress', label: 'In Progress' },
          { value: 'Not Started', label: 'Not Started' },
          { value: 'Completed', label: 'Completed' },
        ]
      },
      cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.progress === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          row.progress === 'In Progress' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
          'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
          {row.progress}
        </span>
      )
    },
    {
      id: 'enrollment',
      name: 'Enrollment',
      selector: (row: any) => row.enrollment,
      sortable: true,
      editable: true,
    },
    {
      id: 'fee',
      name: 'Fee (USD)',
      selector: (row: any) => row.fee,
      sortable: true,
      editable: true,
    }
  ];

  const codeSnippet = `
import { DataTable } from '@enterprisegrid/grid';

const [data, setData] = useState(initialData);

const handleCellEdit = (row, value, column) => {
  setData(prev => prev.map(r => 
    r.id === row.id ? { ...r, [column.id]: value } : r
  ));
};

// Enable offlineEditing in the configuration options
<DataTable 
  id="interactive-courses-table"
  columns={columns} 
  data={data} 
  onCellEdit={handleCellEdit}
  config={{ 
    offlineEditing: true, // Enables offline caching & manual/auto sync controls
    selectableRows: false 
  }}
/>
`.trim();

  return (
    <div id="offline-sync" className="mb-16 scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            Offline Editing & Synchronisation
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Ensure an uninterrupted workflow even without an internet connection. Queue data modifications offline and sync safely when connection is restored.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-100">
          <Wifi className="w-3.5 h-3.5" />
          <span>Sync Ready</span>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mb-2">1</div>
          <h4 className="font-semibold text-slate-800 text-sm">Simulate Offline Mode</h4>
          <p className="text-slate-500 text-xs mt-1">Click the "Offline Sync Center" button (the cloud icon in the table toolbar) and click "Go Offline".</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mb-2">2</div>
          <h4 className="font-semibold text-slate-800 text-sm">Modify Course Details</h4>
          <p className="text-slate-500 text-xs mt-1">Edit cells (e.g. click a Course Name or change Status). Notice the orange sync-pending indicator in the cells!</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm mb-2">3</div>
          <h4 className="font-semibold text-slate-800 text-sm">Sync with Server</h4>
          <p className="text-slate-500 text-xs mt-1">Click "Go Online" in the Sync Center menu, then hit "Sync to Server" to commit and sync all edits simultaneously.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Offline Sync Demo Grid</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">Offline Enabled</span>
          </div>
          <div className="p-0 flex-grow">
            <DataTable 
              id="offline-demo-courses"
              columns={columns} 
              data={data} 
              onCellEdit={handleUpdate}
              config={{ 
                searchable: false, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false,
                offlineEditing: true 
              }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Real-Time State</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full font-mono font-medium">courses.json</span>
          </div>
          <div className="flex-grow p-4 overflow-auto max-h-[350px]">
            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '11px' }}>
              {JSON.stringify(data, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
        <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
          How to Implement Offline Sync
        </div>
        <div className="p-4 overflow-auto">
          <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px' }}>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
