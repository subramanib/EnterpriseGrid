import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DataTable } from '@enterprisegrid/grid';

const mockData = [
  { id: 1, name: 'Alice Smith', department: 'Engineering', role: 'Frontend Developer', salary: 95000 },
  { id: 2, name: 'Bob Jones', department: 'Design', role: 'UI/UX Designer', salary: 82000 },
  { id: 3, name: 'Charlie Brown', department: 'Management', role: 'Product Manager', salary: 115000 },
  { id: 4, name: 'Diana Prince', department: 'Engineering', role: 'Backend Developer', salary: 105000 },
  { id: 5, name: 'Evan Davis', department: 'Marketing', role: 'Growth Hacker', salary: 78000 },
  { id: 6, name: 'Fiona Gallagher', department: 'Engineering', role: 'DevOps Engineer', salary: 110000 },
];

const mockColumns = [
  { id: 'name', name: 'Name', selector: (row: any) => row.name, sortable: true },
  { id: 'department', name: 'Department', selector: (row: any) => row.department, sortable: true },
  { id: 'role', name: 'Role', selector: (row: any) => row.role, sortable: true },
  { id: 'salary', name: 'Salary', selector: (row: any) => row.salary, sortable: true, format: (row: any) => `$${row.salary.toLocaleString()}` },
];

export function AiQueryAssistantPlayground() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [filteredData, setFilteredData] = useState(mockData);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) {
      setFilteredData(mockData);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch('/api/ai-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to parse query');
      }
      
      const filterParams = await response.json();
      
      let result = [...mockData];
      
      if (filterParams.department) {
        result = result.filter(r => r.department.toLowerCase() === filterParams.department.toLowerCase());
      }
      if (filterParams.minSalary !== undefined) {
        result = result.filter(r => r.salary >= filterParams.minSalary);
      }
      if (filterParams.maxSalary !== undefined) {
        result = result.filter(r => r.salary <= filterParams.maxSalary);
      }
      if (filterParams.role) {
        result = result.filter(r => r.role.toLowerCase().includes(filterParams.role.toLowerCase()));
      }
      
      setFilteredData(result);
    } catch (error: any) {
      console.error("AI Search Error:", error);
      alert(`AI Query Error: ${error.message || "Failed to process query"}`);
    } finally {
      setIsSearching(false);
    }
  };

  const codeSnippet = `
// Initialize state for the natural language query and grid data
const [query, setQuery] = useState('');
const [data, setData] = useState(initialData);
const [isSearching, setIsSearching] = useState(false);

const handleAiSearch = async () => {
  setIsSearching(true);
  
  // Call your AI backend to parse the query into a filter object
  const aiFilterResponse = await fetch('/api/ai-query', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
  
  const filterParams = await aiFilterResponse.json();
  
  // Apply the returned filters to your dataset
  const filteredData = applyFilters(initialData, filterParams);
  
  setData(filteredData);
  setIsSearching(false);
};

return (
  <div>
    <form onSubmit={handleAiSearch}>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        placeholder="e.g., Show me engineers making over 100k"
      />
      <button type="submit" disabled={isSearching}>
        {isSearching ? 'Thinking...' : 'Search'}
      </button>
    </form>
    
    <DataTable columns={columns} data={data} />
  </div>
);
  `.trim();

  return (
    <div id="ai-query-assistant" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">AI Query Assistant</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Integrate natural language search directly into your grid. Allow users to filter, sort, and query datasets using conversational prompts like <span className="font-mono bg-slate-100 px-1 rounded text-sm">"show me all engineers"</span> or <span className="font-mono bg-slate-100 px-1 rounded text-sm">"who earns over 100k?"</span>.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 p-4">
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="e.g. 'Show me engineers' or 'over 100k'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className={`flex-shrink-0 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white ${
                  isSearching ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm`}
              >
                {isSearching ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Thinking...
                  </span>
                ) : (
                  'Ask AI'
                )}
              </button>
            </form>
          </div>
          <div className="p-0 flex-grow relative min-h-[300px]">
            {isSearching && (
               <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
                 <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center space-x-3">
                   <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-sm font-medium text-slate-700">AI is analyzing query...</span>
                 </div>
               </div>
            )}
            <DataTable 
              columns={mockColumns} 
              data={filteredData} 
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}
            />
            {filteredData.length === 0 && !isSearching && (
              <div className="p-8 text-center text-slate-500 text-sm">
                No results found for that query. Try "engineers" or "under 90k".
              </div>
            )}
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
