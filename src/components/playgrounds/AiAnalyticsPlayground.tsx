import React, { useState } from 'react';
import { DataTable } from '@enterprisegrid/grid';

const mockData = [
  { id: 1, title: 'Q1 Sales Report', category: 'Finance', status: 'Completed', value: 45000 },
  { id: 2, title: 'Q2 Marketing Plan', category: 'Marketing', status: 'In Progress', value: 12000 },
  { id: 3, title: 'User Feedback Survey', category: 'Product', status: 'Completed', value: 0 },
  { id: 4, title: 'Q3 Product Roadmap', category: 'Product', status: 'Draft', value: 0 },
  { id: 5, title: 'Q1 Server Costs', category: 'Engineering', status: 'Completed', value: -15000 },
  { id: 6, title: 'Q2 New Hires', category: 'HR', status: 'In Progress', value: -25000 },
];

const mockColumns = [
  { name: 'Title', selector: (row: any) => row.title, sortable: true, id: 'title' },
  { name: 'Category', selector: (row: any) => row.category, sortable: true, id: 'category' },
  { name: 'Status', selector: (row: any) => row.status, sortable: true, id: 'status' },
  { name: 'Value', selector: (row: any) => row.value, sortable: true, id: 'value', format: (row: any) => `$${row.value.toLocaleString()}` },
];

export function AiAnalyticsPlayground() {
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyticsResult, setAnalyticsResult] = useState<{ summary?: string, insights?: string[], trend?: string } | null>(null);

  const handleAnalyze = () => {
    if (selectedRows.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const totalValue = selectedRows.reduce((acc, row) => acc + row.value, 0);
      const categories = [...new Set(selectedRows.map(r => r.category))];
      
      setAnalyticsResult({
        summary: `Analyzed ${selectedRows.length} documents. Total financial impact is $${totalValue.toLocaleString()}.`,
        insights: [
          `Primary focus areas involve: ${categories.join(', ')}.`,
          `${selectedRows.filter(r => r.status === 'Completed').length} out of ${selectedRows.length} tasks are already completed.`,
          totalValue > 0 ? 'Overall positive value generated.' : 'Net cost incurred in the selected datasets.'
        ],
        trend: totalValue > 20000 ? 'Positive Growth' : 'Stable/Cost Phase'
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  return (
    <div id="ai-analytics" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">AI-Driven Analytics</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Select rows from the grid below and click "Analyze Data" to simulate our powerful AI capabilities that generate summaries, trends, and actionable insights based on your selected dataset.
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-slate-700">Business Data</span>
            <button
              onClick={handleAnalyze}
              disabled={selectedRows.length === 0 || isAnalyzing}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors flex items-center space-x-2 ${
                selectedRows.length === 0 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isAnalyzing ? (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Analyze Data</span>
                </>
              )}
            </button>
          </div>
          <div className="p-0">
            <DataTable 
              columns={mockColumns} 
              data={mockData} 
              selectableRows
              onSelectedRowsChange={(state: any) => setSelectedRows(state.selectedRows)}
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col h-full">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
            <span className="text-sm font-semibold text-slate-700">AI Insights Panel</span>
          </div>
          <div className="p-6 flex-grow flex flex-col relative">
            {!analyticsResult && !isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">Select rows and click Analyze Data to generate insights.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="animate-pulse space-y-4 w-full max-w-[200px]">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            )}

            {analyticsResult && !isAnalyzing && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Executive Summary</h4>
                  <p className="text-sm text-slate-700 font-medium">{analyticsResult.summary}</p>
                </div>
                
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Insights</h4>
                  <ul className="space-y-2">
                    {analyticsResult.insights?.map((insight, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-slate-600 leading-snug">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Detected Trend</h4>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-50 text-indigo-700">
                    {analyticsResult.trend}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
