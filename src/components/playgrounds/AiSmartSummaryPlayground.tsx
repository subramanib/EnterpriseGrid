import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const mockData = [
  { id: 1, name: 'Q1 Launch', status: 'Completed', budget: 120000, impact: 'High' },
  { id: 2, name: 'Q2 Expansion', status: 'In Progress', budget: 250000, impact: 'Very High' },
  { id: 3, name: 'Q3 Refactor', status: 'Planning', budget: 85000, impact: 'Medium' },
  { id: 4, name: 'Q4 Marketing', status: 'At Risk', budget: 150000, impact: 'High' },
];

const mockColumns = [
  { id: 'name', name: 'Project Name', selector: (row: any) => row.name, sortable: true },
  { id: 'status', name: 'Status', selector: (row: any) => row.status, sortable: true },
  { id: 'budget', name: 'Budget', selector: (row: any) => row.budget, sortable: true, format: (row: any) => `$${row.budget.toLocaleString()}` },
  { id: 'impact', name: 'Impact', selector: (row: any) => row.impact, sortable: true },
];

export function AiSmartSummaryPlayground() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleGenerateSummary = async () => {
    setIsSummarizing(true);
    setSummary(null);
    
    try {
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mockData })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate summary');
      }
      
      const result = await response.json();
      setSummary(result.summary);
    } catch (error: any) {
      console.error("AI Summary Error:", error);
      setSummary(`Error: ${error.message || "An error occurred while generating the summary."}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const codeSnippet = `
// Initialize state for the AI summary
const [summary, setSummary] = useState<string | null>(null);
const [isSummarizing, setIsSummarizing] = useState(false);

const handleGenerateSummary = async () => {
  setIsSummarizing(true);
  
  // Call your AI backend to generate a summary of the grid data
  const response = await fetch('/api/ai-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: currentGridData })
  });
  
  const result = await response.json();
  setSummary(result.summary);
  setIsSummarizing(false);
};

return (
  <div>
    <div className="flex justify-between items-center mb-4">
      <button onClick={handleGenerateSummary} disabled={isSummarizing}>
        {isSummarizing ? 'Summarizing...' : 'Generate AI Summary'}
      </button>
    </div>
    
    {summary && (
      <div className="p-4 bg-indigo-50 text-indigo-900 rounded-lg mb-4">
        <h4 className="font-bold mb-2">🧠 Smart Summary</h4>
        <p>{summary}</p>
      </div>
    )}
    
    <DataTable columns={columns} data={data} />
  </div>
);
  `.trim();

  return (
    <div id="ai-smart-summary" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">🧠 AI Smart Summary</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Provide instant context to your users. Use an LLM to read the current grid data and generate a clear, human-readable executive summary. This feature is perfect for dashboards and reporting views where stakeholders need to understand data at a glance.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
             <span className="text-sm font-semibold text-slate-700">Project Data</span>
             <button
               onClick={handleGenerateSummary}
               disabled={isSummarizing}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center space-x-2 ${
                 isSummarizing 
                   ? 'bg-indigo-400 text-white cursor-wait' 
                   : 'bg-indigo-600 text-white hover:bg-indigo-700'
               }`}
             >
               {isSummarizing ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <span>Summarizing...</span>
                 </>
               ) : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                   <span>Generate Summary</span>
                 </>
               )}
             </button>
          </div>
          
          <div className="p-0 flex-grow relative">
            {summary && (
              <div className="m-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm">
                <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center">
                  <span className="mr-2">🧠</span> AI Smart Summary
                </h4>
                <p className="text-sm text-indigo-800 leading-relaxed">{summary}</p>
              </div>
            )}
            
            <DataTable 
              columns={mockColumns} 
              data={mockData} 
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
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
