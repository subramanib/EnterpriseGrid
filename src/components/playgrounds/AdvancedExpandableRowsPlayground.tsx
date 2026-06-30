import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedExpandableRowsPlayground() {
  return (
    <BasePlayground
      id="advanced-expandable-rows"
      title="Advanced Expandable Rows"
      description="Toggle expandable rows, click-to-expand, and conditional expansion."
      initialConfig={{
        expandableRows: true,
        expandOnRowClicked: false,
        expandableRowsHideExpander: false,
        disableExpansionBefore2000: false,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}
  expandableRows={${config.expandableRows}}${config.expandOnRowClicked ? '\\n  expandOnRowClicked' : ''}${config.expandableRowsHideExpander ? '\\n  expandableRowsHideExpander' : ''}${config.disableExpansionBefore2000 ? "\\n  expandableRowDisabled={row => row.year < '2000'}" : ''}
  expandableRowsComponent={({ data }) => <div className="p-4">...</div>}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={mockData.slice(0, 5)}
          expandableRows={config.expandableRows}
          expandOnRowClicked={config.expandOnRowClicked}
          expandableRowsHideExpander={config.expandableRowsHideExpander}
          expandableRowDisabled={config.disableExpansionBefore2000 ? (row: any) => Number(row.year) < 2000 : undefined}
          expandableRowsComponent={({ data }: any) => (
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-sm text-slate-700">
              <strong className="text-slate-900">Movie Insights:</strong> "{data.title}" was directed by {data.director} and released in {data.year}.
            </div>
          )}
          config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
        />
      )}
    />
  );
}
