import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const initialMockData = [
  { id: 1, product: 'Wireless Mouse', category: 'Electronics', stock: 120, status: 'In Stock' },
  { id: 2, product: 'Mechanical Keyboard', category: 'Electronics', stock: 45, status: 'Low Stock' },
  { id: 3, product: 'Desk Mat', category: 'Accessories', stock: 300, status: 'In Stock' },
  { id: 4, product: 'USB-C Cable', category: 'Accessories', stock: 0, status: 'Out of Stock' },
];

export function AuditTrailPlayground() {
  const [data, setData] = useState(initialMockData);
  const [auditTrailEnabled, setAuditTrailEnabled] = useState(true);

  const handleCellEdit = (row: any, value: string, col: any) => {
    const updatedData = [...data];
    const rowIndex = updatedData.findIndex(r => r.id === row.id);
    if (rowIndex > -1) {
      updatedData[rowIndex] = { ...updatedData[rowIndex], [col.id]: value };
      setData(updatedData);
    }
  };

  const columns = [
    { id: 'product', name: 'Product Name', selector: (row: any) => row.product, sortable: true, editable: true },
    { id: 'category', name: 'Category', selector: (row: any) => row.category, sortable: true, editable: true },
    { id: 'stock', name: 'Stock Quantity', selector: (row: any) => row.stock, sortable: true, editable: true },
    { id: 'status', name: 'Status', selector: (row: any) => row.status, sortable: true, editable: true },
  ];

  const codeSnippet = `
<DataTable
  columns={columns}
  data={data}
  onCellEdit={handleCellEdit}
  config={{
    auditTrail: true // Enables the Audit Trail tracking and toolbar button
  }}
/>
  `.trim();

  return (
    <div id="audit-trail" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">📜 Audit Trail</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Track cell edits natively in the datatable. Enabling this feature logs inline changes with their previous and new values, and provides a modal in the toolbar to review edit history across the session.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Inventory Tracker (Editable)</span>
          </div>
          <div className="p-0 flex-grow relative min-h-[400px]">
            <DataTable 
              columns={columns} 
              data={data} 
              onCellEdit={handleCellEdit}
              config={{ 
                searchable: false, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false,
                auditTrail: auditTrailEnabled
              }}
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
