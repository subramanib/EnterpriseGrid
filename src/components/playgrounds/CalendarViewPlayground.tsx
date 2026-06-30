import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];

const mockData = [
  { id: 1, title: 'Team Sync', attendees: 12, date: todayStr },
  { id: 2, title: 'Project Kickoff', attendees: 8, date: new Date(today.getTime() + 86400000).toISOString().split('T')[0] },
  { id: 3, title: 'Quarterly Review', attendees: 45, date: new Date(today.getTime() - 86400000).toISOString().split('T')[0] },
  { id: 4, title: 'Design Session', attendees: 4, date: todayStr },
  { id: 5, title: 'Client Pitch', attendees: 6, date: new Date(today.getTime() + 172800000).toISOString().split('T')[0] },
];

const mockColumns = [
  { id: 'title', name: 'Event', selector: (row: any) => row.title, sortable: true },
  { id: 'attendees', name: 'Attendees', selector: (row: any) => row.attendees, sortable: true },
  { id: 'date', name: 'Date', selector: (row: any) => row.date, sortable: true },
];

export function CalendarViewPlayground() {
  const [calendarView, setCalendarView] = useState(true);

  const codeSnippet = `
<DataTable
  columns={columns}
  data={data}
  config={{
    calendarView: true // Enable Calendar View toggle in the toolbar
  }}
  calendarConfig={{
    dateField: 'date',     // Field for the start date
    endDateField: 'date',  // Optional field for the end date
    titleField: 'title'    // Field for event title
  }}
/>
  `.trim();

  return (
    <div id="calendar-view" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">📅 Calendar View</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Toggle tabular data into a full-featured, interactive calendar. Perfect for event data, meeting schedules, deadlines, or booking systems directly inside your data table interface.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Schedule Data</span>
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
                calendarView: calendarView 
              }}
              calendarConfig={{ dateField: 'date', titleField: 'title' }}
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