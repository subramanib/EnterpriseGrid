import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const mockData = [
  { id: 1, title: 'Los Angeles (HQ)', employees: 120, lat: 34.0522, lng: -118.2437 },
  { id: 2, title: 'New York Branch', employees: 85, lat: 40.7128, lng: -74.0060 },
  { id: 3, title: 'London Hub', employees: 64, lat: 51.5074, lng: -0.1278 },
  { id: 4, title: 'Sydney Office', employees: 42, lat: -33.8688, lng: 151.2093 },
  { id: 5, title: 'Tokyo Center', employees: 150, lat: 35.6762, lng: 139.6503 },
];

const mockColumns = [
  { id: 'location', name: 'Location', selector: (row: any) => row.title, sortable: true },
  { id: 'employees', name: 'Employees', selector: (row: any) => row.employees, sortable: true },
  { id: 'latitude', name: 'Latitude', selector: (row: any) => row.lat },
  { id: 'longitude', name: 'Longitude', selector: (row: any) => row.lng },
];

export function MapViewPlayground() {
  const [mapView, setMapView] = useState(true);

  const codeSnippet = `
<DataTable
  columns={columns}
  data={data}
  config={{
    mapView: true // Enable Map View toggle in the toolbar
  }}
  mapConfig={{
    latField: 'lat',     // Field for latitude
    lngField: 'lng',     // Field for longitude
    titleField: 'title'  // Field for marker popup text
  }}
/>
  `.trim();

  return (
    <div id="map-view" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">🗺️ Map View Integration</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Toggle data between a traditional tabular format and an interactive geospatial map. Ideal for displaying physical locations, branches, deliveries, or regional data directly inside the table container.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Geospatial Data</span>
          </div>
          <div className="p-0 flex-grow relative">
            <DataTable 
              columns={mockColumns} 
              data={mockData} 
              config={{ 
                searchable: false, 
                exportable: false, 
                densityToggle: false, 
                columnVisibility: false,
                mapView: mapView 
              }}
              mapConfig={{ latField: 'lat', lngField: 'lng', titleField: 'title' }}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300">Integration Example</div>
          <div className="flex-grow p-4 overflow-auto">
            <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '13px' }}>
              {codeSnippet}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
