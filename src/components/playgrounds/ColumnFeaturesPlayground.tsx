import React from 'react';
import { DataTable } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function ColumnFeaturesPlayground() {
  return (
    <BasePlayground
      id="column-features"
      title="Column Features API"
      description="Enable per-column features like sorting, filtering, editing, scaling, alignment, and conditional styling."
      initialConfig={{
        filterable: true,
        editableTitle: true,
        alignDirectorRight: false,
        conditionalYearColor: true,
      }}
      renderCode={(config) => `const cols = [
  { 
    name: 'Title', 
    selector: row => row.title, ${config.filterable ? '\\n    filterable: true,' : ''}${config.editableTitle ? '\\n    editable: true,' : ''}
  },
  { 
    name: 'Director', 
    selector: row => row.director,${config.alignDirectorRight ? '\\n    right: true,' : ''}
  },
  { 
    name: 'Year', 
    selector: row => row.year,${config.conditionalYearColor ? "\\n    conditionalCellStyles: [\\n      { when: r => r.year < 2000, style: { color: 'red' } }\\n    ]" : ''}
  }
];`}
      renderTable={(config) => {
        const cols = [
          { ...mockColumns[0], filterable: config.filterable, editable: config.editableTitle },
          { ...mockColumns[1], right: config.alignDirectorRight },
          { 
            ...mockColumns[2], 
            conditionalCellStyles: config.conditionalYearColor 
              ? [{ when: (row: any) => Number(row.year) < 2000, style: { color: '#dc2626', fontWeight: 'bold' } }] 
              : undefined 
          }
        ];

        return (
          <DataTable
            columns={cols}
            data={mockData.slice(0, 5)}
            config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
          />
        );
      }}
    />
  );
}
