import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const mockData = [
  { id: 1, month: 'Jan', revenue: 45000, users: 1200, churn: '2.4%' },
  { id: 2, month: 'Feb', revenue: 52000, users: 1350, churn: '2.1%' },
  { id: 3, month: 'Mar', revenue: 48000, users: 1400, churn: '2.8%' },
  { id: 4, month: 'Apr', revenue: 61000, users: 1600, churn: '1.9%' },
  { id: 5, month: 'May', revenue: 65000, users: 1850, churn: '1.5%' },
];

const mockColumns = [
  { id: 'month', name: 'Month', selector: (row: any) => row.month, sortable: true },
  { id: 'revenue', name: 'Revenue', selector: (row: any) => row.revenue, sortable: true, format: (row: any) => `$${row.revenue.toLocaleString()}` },
  { id: 'users', name: 'Active Users', selector: (row: any) => row.users, sortable: true },
  { id: 'churn', name: 'Churn Rate', selector: (row: any) => row.churn, sortable: true },
];

interface Insight {
  title: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export function AiInsightsDashboardPlayground() {
  const [insights, setInsights] = useState<Insight[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    setInsights(null);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: mockData })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate insights');
      }
      
      const result = await response.json();
      setInsights(result);
    } catch (err: any) {
      console.error("AI Insights Error:", err);
      setError(`Error: ${err.message || "An error occurred while generating insights."}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const codeSnippet = `
// Initialize state for the insights array
const [insights, setInsights] = useState<Insight[] | null>(null);
const [isGenerating, setIsGenerating] = useState(false);

const handleGenerateInsights = async () => {
  setIsGenerating(true);
  
  // Call your AI backend to analyze the grid data
  const response = await fetch('/api/ai-insights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: gridData })
  });
  
  const result = await response.json();
  setInsights(result);
  setIsGenerating(false);
};

return (
  <div>
    <button onClick={handleGenerateInsights}>
      Generate Insights
    </button>
    
    {insights && (
      <div className="grid grid-cols-3 gap-4">
        {insights.map(insight => (
          <div className="card">
            <h4>{insight.title}</h4>
            <p className="text-2xl">{insight.value}</p>
            <p className="text-sm">{insight.description}</p>
          </div>
        ))}
      </div>
    )}
    
    <DataTable columns={columns} data={data} />
  </div>
);
  `.trim();

  return (
    <div id="ai-insights-dashboard" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">📊 AI Insights Dashboard</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Transform raw grid data into actionable intelligence. This feature allows users to generate an automated dashboard of key performance indicators (KPIs) and trends directly from the dataset using a Language Model.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
             <span className="text-sm font-semibold text-slate-700">Financial Data</span>
             <button
               onClick={handleGenerateInsights}
               disabled={isGenerating}
               className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center space-x-2 ${
                 isGenerating 
                   ? 'bg-emerald-400 text-white cursor-wait' 
                   : 'bg-emerald-600 text-white hover:bg-emerald-700'
               }`}
             >
               {isGenerating ? (
                 <>
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                   <span>Analyzing...</span>
                 </>
               ) : (
                 <>
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                   </svg>
                   <span>Generate Dashboard</span>
                 </>
               )}
             </button>
          </div>
          
          <div className="p-0 flex-grow relative bg-slate-50/50">
            {error && (
              <div className="m-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            {insights && (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {insights.map((insight, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{insight.title}</span>
                    <div className="flex items-end space-x-2 mb-2">
                      <span className="text-2xl font-bold text-slate-800">{insight.value}</span>
                      {insight.trend === 'up' && <span className="text-emerald-500 flex items-center text-sm font-medium"><svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>Up</span>}
                      {insight.trend === 'down' && <span className="text-rose-500 flex items-center text-sm font-medium"><svg className="w-4 h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>Down</span>}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            )}
            
            <div className={insights ? "border-t border-slate-200" : ""}>
              <DataTable 
                columns={mockColumns} 
                data={mockData} 
                config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
              />
            </div>
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
