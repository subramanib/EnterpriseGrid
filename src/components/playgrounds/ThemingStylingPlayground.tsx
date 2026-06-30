import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function ThemingStylingPlayground() {
  return (
    <BasePlayground
      id="theming-styling"
      title="Theming & Styling Props"
      description="Apply themes, row striping, hover effects, and borders."
      initialConfig={{
        striped: true,
        highlightOnHover: true,
        pointerOnHover: true,
        themeDark: false,
        borders: true,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}${config.striped ? '\\n  striped' : ''}${config.highlightOnHover ? '\\n  highlightOnHover' : ''}${config.pointerOnHover ? '\\n  pointerOnHover' : ''}${config.themeDark ? '\\n  theme="dark"' : ''}${config.borders ? '\\n  columnSeparator="subtle"\\n  headerSeparator="full"' : ''}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={mockData.slice(0, 5)}
          striped={config.striped}
          highlightOnHover={config.highlightOnHover}
          pointerOnHover={config.pointerOnHover}
          theme={config.themeDark ? 'dark' : 'default'}
          columnSeparator={config.borders ? 'subtle' : false}
          headerSeparator={config.borders ? 'full' : false}
          config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
        />
      )}
    />
  );
}
