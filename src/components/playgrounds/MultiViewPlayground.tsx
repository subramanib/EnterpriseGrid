import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Layers, Kanban, Calendar as CalendarIcon, LayoutGrid, Table } from 'lucide-react';
import { DataTable } from '@enterprisegrid/grid';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const initialData = [
  { 
    id: 1, 
    name: 'Quantum Physics & Mechanics', 
    category: 'Science', 
    status: 'In Progress', 
    enrollment: 1250, 
    fee: 149,
    date: todayStr,
    description: 'Explore wave-particle duality, quantum state superposition, and quantum computing mechanics.',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60'
  },
  { 
    id: 2, 
    name: 'Interactive Calculus & Algebra', 
    category: 'Mathematics', 
    status: 'Not Started', 
    enrollment: 820, 
    fee: 99,
    date: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
    description: 'Master derivatives, integration, vector fields, and linear algebra transformations with interactive visualizations.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=60'
  },
  { 
    id: 3, 
    name: 'Neural Networks & Deep Learning', 
    category: 'Technology', 
    status: 'Completed', 
    enrollment: 3400, 
    fee: 199,
    date: new Date(today.getTime() - 86400000).toISOString().split('T')[0],
    description: 'Build neural networks from scratch. Learn convolution, transformer architectures, and modern LLM pipelines.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=60'
  },
  { 
    id: 4, 
    name: 'Spanish Fluency Immersion', 
    category: 'Languages', 
    status: 'In Progress', 
    enrollment: 1540, 
    fee: 129,
    date: todayStr,
    description: 'Develop natural speaking flow, master complex grammar concepts, and expand vocabulary with direct immersive conversations.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=60'
  },
  { 
    id: 5, 
    name: 'Modern React & Design Systems', 
    category: 'Technology', 
    status: 'Completed', 
    enrollment: 2100, 
    fee: 89,
    date: new Date(today.getTime() + 172800000).toISOString().split('T')[0],
    description: 'Construct atomic web architectures, optimize state synchronization, and render fluid design tokens beautifully.',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=60'
  },
];

export function MultiViewPlayground() {
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
    },
    {
      id: 'status',
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      editable: true,
      editor: {
        type: 'select' as const,
        options: [
          { value: 'Not Started', label: 'Not Started' },
          { value: 'In Progress', label: 'In Progress' },
          { value: 'Completed', label: 'Completed' },
        ]
      },
      cell: (row: any) => (
        <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
          row.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
          row.status === 'In Progress' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
          'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      id: 'enrollment',
      name: 'Enrollment',
      selector: (row: any) => row.enrollment,
      sortable: true,
    },
    {
      id: 'fee',
      name: 'Fee (USD)',
      selector: (row: any) => `$${row.fee}`,
      sortable: true,
    }
  ];

  const codeSnippet = `
import { DataTable } from '@enterprisegrid/grid';

// Enable and configure the Multi-View Layout options (Table, Kanban, Calendar, Gallery)
<DataTable 
  id="learning-universe-grid"
  columns={columns} 
  data={data}
  onCellEdit={handleCellEdit}
  config={{ 
    kanbanView: true,      // Enables the Kanban board view toggle
    calendarView: true,    // Enables the Calendar scheduler view toggle
    galleryView: true,     // Enables the Gallery visual card bento view toggle
    sidePreview: true,     // Enables deep slide-out previews
  }}
  kanbanConfig={{
    columnField: 'status',          // Field to partition columns by
    titleField: 'name',             // Card title
    descriptionField: 'description'  // Card details
  }}
  calendarConfig={{
    dateField: 'date',              // Schedule date
    titleField: 'name'              // Event item title
  }}
  galleryConfig={{
    titleField: 'name',             // Cover title
    descriptionField: 'description', // Cover details
    imageField: 'image'             // Card visual image URL
  }}
/>
`.trim();

  return (
    <div id="multi-view" className="mb-16 scroll-mt-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            🌌 Multi-View Universe (Table, Kanban, Calendar, Gallery)
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Let users consume tabular data in their preferred workflow shape. Fluidly switch layout perspectives with shared state, bookmark syncing, and unified query filters.
          </p>
        </div>
        <div className="bg-indigo-50 text-indigo-800 px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1 border border-indigo-100">
          <Layers className="w-3.5 h-3.5" />
          <span>Multi-View Ready</span>
        </div>
      </div>

      {/* Mini Overview Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
            <Table className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs">Table View</div>
            <p className="text-[10px] text-slate-400">Inline grids & sheets</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <Kanban className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs">Kanban View</div>
            <p className="text-[10px] text-slate-400">Status swimlane cards</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CalendarIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs">Calendar View</div>
            <p className="text-[10px] text-slate-400">Dates & event calendars</p>
          </div>
        </div>
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl flex items-center gap-3 shadow-sm">
          <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-xs">Gallery View</div>
            <p className="text-[10px] text-slate-400">Grid card visual panels</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspaces */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider flex justify-between items-center">
            <span>Learning Universe Course Catalog</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">Universe Enabled</span>
          </div>
          <div className="p-0 flex-grow">
            <DataTable 
              id="multi-view-universe-playground"
              columns={columns} 
              data={data} 
              onCellEdit={handleUpdate}
              config={{ 
                searchable: true, 
                exportable: true, 
                densityToggle: true, 
                columnVisibility: true,
                kanbanView: true,
                calendarView: true,
                galleryView: true,
                sidePreview: true,
                bookmarks: true
              }}
              kanbanConfig={{
                columnField: 'status',
                titleField: 'name',
                descriptionField: 'description'
              }}
              calendarConfig={{
                dateField: 'date',
                titleField: 'name'
              }}
              galleryConfig={{
                titleField: 'name',
                descriptionField: 'description',
                imageField: 'image'
              }}
              renderSidePreview={(row, onClose) => (
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold rounded-full text-xs uppercase tracking-wider">
                      {row.category}
                    </span>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-sm font-semibold">Close</button>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{row.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">Scheduled for: <strong>{row.date}</strong></p>
                  </div>
                  {row.image && (
                    <div className="w-full h-48 rounded-xl overflow-hidden shadow bg-slate-50 border">
                      <img src={row.image} alt={row.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About this course</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{row.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4 border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Enrolled Learners</h4>
                        <span className="text-sm font-bold text-slate-700">{row.enrollment.toLocaleString()}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Course Fee</h4>
                        <span className="text-sm font-bold text-indigo-600">${row.fee} USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        </div>

        {/* Live Configurator Output */}
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Dynamic state.json</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono font-medium">Synced Live</span>
          </div>
          <div className="flex-grow p-4 overflow-auto max-h-[450px]">
            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '11px' }}>
              {JSON.stringify(data, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Integration Code Guide */}
      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
        <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-3 text-xs font-bold text-slate-300 uppercase tracking-wider">
          How to configure the Multi-View Layouts
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
