import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedFooterPlayground() {
  return (
    <BasePlayground
      id="advanced-footer"
      title="Advanced Footer Features (Footer API)"
      description="Display a footer row with aggregate data like counts or sums."
      initialConfig={{
        showFooter: true,
        customGlobalFooter: false,
      }}
      renderCode={(config) => `const cols = [
  { name: 'Title', selector: row => row.title, footer: 'Total:' },
  { name: 'Year', selector: row => row.year, footer: rows => rows.length }
];

<DataTable
  columns={cols}
  data={data}
  showFooter={${config.showFooter}}${config.customGlobalFooter ? '\\n  footerComponent={() => <div className="p-4 text-center text-indigo-600 font-bold border-t">Global Footer Component</div>}' : ''}
/>`}
      renderTable={(config) => {
        const cols = [
          { ...mockColumns[0], footer: <span className="font-bold">Total Movies:</span> },
          mockColumns[1],
          { ...mockColumns[2], footer: (rows: any) => <span className="text-indigo-600 font-bold">{rows.length}</span> }
        ];
        
        return (
          <DataTable
            columns={cols}
            data={mockData.slice(0, 4)}
            showFooter={config.showFooter}
            footerComponent={config.customGlobalFooter ? () => <div className="p-4 text-center text-indigo-600 font-bold border-t border-slate-200">Global Footer Component</div> : undefined}
            config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
          />
        );
      }}
    />
  );
}
