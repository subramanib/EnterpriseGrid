import React, { useState } from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedRowEventsPlayground() {
  const [lastEvent, setLastEvent] = useState<string>('None');

  return (
    <div className="relative">
      <BasePlayground
        id="advanced-row-events"
        title="Advanced Row Events"
        description="Listen to row interactions like click, double click, hover, and context menu events."
        initialConfig={{
          onRowClicked: true,
          onRowDoubleClicked: true,
          onRowMouseEnter: false,
        }}
        renderCode={(config) => `<DataTable
  columns={columns}
  data={data}${config.onRowClicked ? "\\n  onRowClicked={(row) => log('Clicked ' + row.title)}" : ''}${config.onRowDoubleClicked ? "\\n  onRowDoubleClicked={(row) => log('Double Clicked ' + row.title)}" : ''}${config.onRowMouseEnter ? "\\n  onRowMouseEnter={(row) => log('Hovered ' + row.title)}" : ''}
/>`}
        renderTable={(config) => (
          <div className="flex flex-col h-full">
            <div className="mb-2 text-sm px-3 py-2 bg-slate-100 rounded border border-slate-200 text-slate-700 font-mono">
              Last Event: <span className="font-semibold text-indigo-600">{lastEvent}</span>
            </div>
            <DataTable
              columns={mockColumns}
              data={mockData.slice(0, 5)}
              pointerOnHover={config.onRowClicked || config.onRowDoubleClicked}
              onRowClicked={config.onRowClicked ? (row: any) => setLastEvent(`Clicked ${row.title}`) : undefined}
              onRowDoubleClicked={config.onRowDoubleClicked ? (row: any) => setLastEvent(`Double Clicked ${row.title}`) : undefined}
              onRowMouseEnter={config.onRowMouseEnter ? (row: any) => setLastEvent(`Hovered ${row.title}`) : undefined}
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
            />
          </div>
        )}
      />
    </div>
  );
}
