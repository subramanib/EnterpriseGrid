import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function AdvancedPaginationPlayground() {
  return (
    <BasePlayground
      id="advanced-pagination"
      title="Advanced Pagination Features"
      description="Experiment with pagination configuration, per-page settings, and positioning."
      initialConfig={{
        pagination: true,
        paginationServer: false,
        topPosition: false,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}
  pagination={${config.pagination}}${config.paginationServer ? '\\n  paginationServer\\n  paginationTotalRows={100}' : ''}${config.topPosition ? '\\n  paginationPosition="top"' : '\\n  paginationPosition="bottom"'}
  paginationPerPage={5}
  paginationRowsPerPageOptions={[5, 10, 15]}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={config.paginationServer ? mockData.slice(0, 5) : mockData}
          pagination={config.pagination}
          paginationServer={config.paginationServer}
          paginationTotalRows={config.paginationServer ? 100 : undefined}
          paginationPosition={config.topPosition ? 'top' : 'bottom'}
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 15]}
          config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
        />
      )}
    />
  );
}
