import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function LayoutAppearancePlayground() {
  return (
    <BasePlayground
      id="layout-appearance"
      title="Layout & Appearance Props"
      description="Modify the layout of the table, including headers, fixed headers, and density."
      initialConfig={{
        noHeader: false,
        noTableHead: false,
        fixedHeader: true,
        responsive: true,
        dense: false,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}${config.noHeader ? '\\n  noHeader' : ''}${config.noTableHead ? '\\n  noTableHead' : ''}${config.fixedHeader ? '\\n  fixedHeader\\n  fixedHeaderScrollHeight="250px"' : ''}${config.responsive ? '\\n  responsive' : ''}${config.dense ? '\\n  dense' : ''}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={mockData.slice(0, 6)}
          title="Movies Database"
          noHeader={config.noHeader}
          noTableHead={config.noTableHead}
          fixedHeader={config.fixedHeader}
          fixedHeaderScrollHeight="250px"
          responsive={config.responsive}
          dense={config.dense}
          config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
        />
      )}
    />
  );
}
