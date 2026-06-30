import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const initialData = [
  { id: 1, name: 'Alice Smith', role: 'Developer', status: 'Active', salary: 85000 },
  { id: 2, name: 'Bob Jones', role: 'Designer', status: 'On Leave', salary: 72000 },
  { id: 3, name: 'Charlie Brown', role: 'Manager', status: 'Active', salary: 110000 },
  { id: 4, name: 'Diana Prince', role: 'QA Engineer', status: 'Active', salary: 68000 },
  { id: 5, name: 'Evan Davis', role: 'Developer', status: 'Terminated', salary: 80000 },
];

export function CellEditingPlayground() {
  const [data, setData] = useState(initialData);
  const [editingCell, setEditingCell] = useState<{ rowId: number, field: string } | null>(null);

  const handleUpdate = (rowId: number, field: string, value: any) => {
    setData(prev => prev.map(row => row.id === rowId ? { ...row, [field]: value } : row));
    setEditingCell(null);
  };

  const columns = [
    {
      id: 'name',
      name: 'Name',
      selector: (row: any) => row.name,
      sortable: true,
      cell: (row: any) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === 'name';
        return isEditing ? (
          <input
            type="text"
            autoFocus
            className="w-full px-2 py-1 text-sm border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            defaultValue={row.name}
            onBlur={(e) => handleUpdate(row.id, 'name', e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate(row.id, 'name', e.currentTarget.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
          />
        ) : (
          <div 
            className="w-full cursor-text group flex items-center justify-between" 
            onClick={() => setEditingCell({ rowId: row.id, field: 'name' })}
          >
            <span>{row.name}</span>
            <svg className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
        );
      }
    },
    {
      id: 'role',
      name: 'Role',
      selector: (row: any) => row.role,
      sortable: true,
      cell: (row: any) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === 'role';
        return isEditing ? (
          <select
            autoFocus
            className="w-full px-2 py-1 text-sm border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            defaultValue={row.role}
            onBlur={(e) => handleUpdate(row.id, 'role', e.target.value)}
            onChange={(e) => handleUpdate(row.id, 'role', e.target.value)}
          >
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            <option value="QA Engineer">QA Engineer</option>
          </select>
        ) : (
          <div 
            className="w-full cursor-pointer group flex items-center justify-between" 
            onClick={() => setEditingCell({ rowId: row.id, field: 'role' })}
          >
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{row.role}</span>
            <svg className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        );
      }
    },
    {
      id: 'status',
      name: 'Status',
      selector: (row: any) => row.status,
      sortable: true,
      cell: (row: any) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === 'status';
        return isEditing ? (
          <select
            autoFocus
            className="w-full px-2 py-1 text-sm border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
            defaultValue={row.status}
            onBlur={(e) => handleUpdate(row.id, 'status', e.target.value)}
            onChange={(e) => handleUpdate(row.id, 'status', e.target.value)}
          >
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        ) : (
          <div 
            className="w-full cursor-pointer group flex items-center justify-between" 
            onClick={() => setEditingCell({ rowId: row.id, field: 'status' })}
          >
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              row.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
              row.status === 'On Leave' ? 'bg-amber-100 text-amber-800' :
              'bg-rose-100 text-rose-800'
            }`}>
              {row.status}
            </span>
            <svg className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        );
      }
    },
    {
      id: 'salary',
      name: 'Salary',
      selector: (row: any) => row.salary,
      sortable: true,
      cell: (row: any) => {
        const isEditing = editingCell?.rowId === row.id && editingCell?.field === 'salary';
        return isEditing ? (
          <input
            type="number"
            autoFocus
            className="w-full px-2 py-1 text-sm border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            defaultValue={row.salary}
            onBlur={(e) => handleUpdate(row.id, 'salary', Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleUpdate(row.id, 'salary', Number(e.currentTarget.value));
              if (e.key === 'Escape') setEditingCell(null);
            }}
          />
        ) : (
          <div 
            className="w-full cursor-text group flex items-center justify-between font-mono" 
            onClick={() => setEditingCell({ rowId: row.id, field: 'salary' })}
          >
            <span>${row.salary.toLocaleString()}</span>
            <svg className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
        );
      }
    }
  ];

  const codeSnippet = `
const [data, setData] = useState(initialData);
const [editingCell, setEditingCell] = useState<{ rowId: number, field: string } | null>(null);

const handleUpdate = (rowId: number, field: string, value: any) => {
  setData(prev => prev.map(row => 
    row.id === rowId ? { ...row, [field]: value } : row
  ));
  setEditingCell(null);
};

// Inside columns definition:
cell: (row) => {
  const isEditing = editingCell?.rowId === row.id && editingCell?.field === 'name';
  return isEditing ? (
    <input
      autoFocus
      defaultValue={row.name}
      onBlur={(e) => handleUpdate(row.id, 'name', e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleUpdate(row.id, 'name', e.currentTarget.value);
        if (e.key === 'Escape') setEditingCell(null);
      }}
    />
  ) : (
    <div onClick={() => setEditingCell({ rowId: row.id, field: 'name' })}>
      {row.name}
    </div>
  );
}
  `.trim();

  return (
    <div id="editing" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">Inline Cell Editing</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Enable inline editing by toggling input fields within custom cell renderers. Update your data array in real-time when the input blurs or the user presses Enter. Click on any cell below to start editing.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between items-center">
            <span>Interactive Grid</span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">Click cells to edit</span>
          </div>
          <div className="p-0 flex-grow">
            <DataTable 
              columns={columns} 
              data={data} 
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Data State (Real-time)</div>
          <div className="flex-grow p-4 overflow-auto">
            <SyntaxHighlighter language="json" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px' }}>
              {JSON.stringify(data, null, 2)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
        <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Implementation Example</div>
        <div className="flex-grow p-4 overflow-auto">
          <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}>
            {codeSnippet}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
