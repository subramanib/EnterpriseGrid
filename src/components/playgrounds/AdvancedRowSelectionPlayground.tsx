import React, { useState } from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedRowSelectionPlayground() {
  const [selectedCount, setSelectedCount] = useState(0);

  return (
    <div className="relative">
      <BasePlayground
        id="advanced-row-selection"
        title="Advanced Row Selection Features"
        description="Configure row selection, single selection mode, highlight on selection, and disable specific rows."
        initialConfig={{
          selectableRows: true,
          selectableRowsSingle: false,
          selectableRowsHighlight: true,
          selectableRowsNoSelectAll: false,
          disableBefore2000: false,
        }}
        renderCode={(config) => `<DataTable
  columns={columns}
  data={data}
  selectableRows={${config.selectableRows}}${config.selectableRowsSingle ? '\\n  selectableRowsSingle' : ''}${config.selectableRowsHighlight ? '\\n  selectableRowsHighlight' : ''}${config.selectableRowsNoSelectAll ? '\\n  selectableRowsNoSelectAll' : ''}${config.disableBefore2000 ? "\\n  selectableRowDisabled={row => row.year < '2000'}" : ''}
  onSelectedRowsChange={({ selectedCount }) => console.log(selectedCount)}
/>`}
        renderTable={(config) => (
          <div className="flex flex-col h-full">
            <div className="mb-2 text-sm font-semibold text-indigo-600">Selected Rows: {selectedCount}</div>
            <DataTable
              columns={mockColumns}
              data={mockData.slice(0, 5)}
              selectableRows={config.selectableRows}
              selectableRowsSingle={config.selectableRowsSingle}
              selectableRowsHighlight={config.selectableRowsHighlight}
              selectableRowsNoSelectAll={config.selectableRowsNoSelectAll}
              selectableRowDisabled={config.disableBefore2000 ? (row: any) => Number(row.year) < 2000 : undefined}
              onSelectedRowsChange={(state: any) => setSelectedCount(state.selectedCount)}
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
            />
          </div>
        )}
      />
    </div>
  );
}
