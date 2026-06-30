import React from 'react';
import { DataTable, Direction } from '@enterprisegrid/grid';
import { BasePlayground } from '../BasePlayground';
import { mockData, mockColumns } from './mockData';

export function LocalizationPlayground() {
  return (
    <BasePlayground
      id="localization"
      title="Localization & Accessibility API"
      description="Apply translations to pagination, search, expansion tooltips, and toggle Right-to-Left (RTL) mode."
      initialConfig={{
        spanishTranslation: true,
        rtlDirection: false,
      }}
      renderCode={(config) => `<DataTable
  columns={columns}
  data={data}
  pagination
  config={{ searchable: true }}${config.spanishTranslation ? `\\n  localization={{
    pagination: { rowsPerPage: 'Filas por página', nextPage: 'Siguiente', previousPage: 'Anterior' },
    filter: { clear: 'Limpiar' },
    expandable: { expand: 'Expandir', collapse: 'Colapsar' }
  }}` : ''}${config.rtlDirection ? '\\n  direction={Direction.RTL}' : ''}
/>`}
      renderTable={(config) => (
        <DataTable
          columns={mockColumns}
          data={mockData.slice(0, 5)}
          pagination
          paginationPerPage={3}
          direction={config.rtlDirection ? Direction.RTL : Direction.LTR}
          localization={config.spanishTranslation ? {
            pagination: { rowsPerPage: 'Filas:', nextPage: 'Siguiente', previousPage: 'Anterior', firstPage: 'Primera', lastPage: 'Última' },
            filter: { clear: 'Limpiar' },
            expandable: { expand: 'Expandir', collapse: 'Colapsar' }
          } : undefined}
          config={{ searchable: true, exportable: false, densityToggle: false, columnVisibility: false }}
        />
      )}
    />
  );
}
