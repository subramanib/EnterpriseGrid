import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedSortingPlayground() {
  return (
    <BasePlayground
      id="advanced-sorting"
      title="Advanced Sorting Features"
      description="Test default sorting and multi-column sorting capabilities."
      initialConfig={{
        sortable: true,
        defaultSortField: true,
        defaultSortAsc: true,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}${config.defaultSortField ? '\\n  defaultSortFieldId="year"' : ''}${!config.defaultSortAsc && config.defaultSortField ? '\\n  defaultSortAsc={false}' : ''}
  config={{ sortable: ${config.sortable} }}
/>`}
      renderTable={(config) => {
        // Need to recreate component to apply default sort dynamically in playground
        return (
          <div key={JSON.stringify(config)}>
            <DataTable
              columns={mockColumns}
              data={mockData.slice(0, 6)}
              defaultSortFieldId={config.defaultSortField ? "year" : undefined}
              defaultSortAsc={config.defaultSortAsc}
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false, sortable: config.sortable }}
            />
          </div>
        );
      }}
    />
  );
}
