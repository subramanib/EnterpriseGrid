import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function FeaturesConfigPlayground() {
  return (
    <BasePlayground
      id="features-config"
      title="Features Configuration"
      description="Toggle global table features like search, export, density, column visibility, etc."
      initialConfig={{
        searchable: true,
        exportable: true,
        densityToggle: true,
        columnVisibility: true,
        animations: true,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}
  config={{
    searchable: ${config.searchable},
    exportable: ${config.exportable},
    densityToggle: ${config.densityToggle},
    columnVisibility: ${config.columnVisibility},
    animations: ${config.animations}
  }}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={mockData.slice(0, 5)}
          config={{ ...config }}
        />
      )}
    />
  );
}
