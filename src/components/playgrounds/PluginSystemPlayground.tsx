import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal, Trash2, Zap, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import { DataTable, DataTablePlugin } from '@enterprisegrid/grid';
import { mockData } from './mockData';

const initialColumns = [
  { id: 'title', name: 'Title', selector: (row: any) => row.title, sortable: true },
  { id: 'year', name: 'Year', selector: (row: any) => row.year, sortable: true },
  { id: 'director', name: 'Director', selector: (row: any) => row.director, sortable: true },
];

export function PluginSystemPlayground() {
  const [logs, setLogs] = useState<string[]>(['[System] Plugin System Initialized.']);
  const [gridData, setGridData] = useState<any[]>(() => mockData.slice(0, 8));
  const [enableActionPlugin, setEnableActionPlugin] = useState(true);
  const [enableLoggerPlugin, setEnableLoggerPlugin] = useState(true);
  const [enableTransformPlugin, setEnableTransformPlugin] = useState(false);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 19)]);
  };

  // 1. Logger Plugin definition
  const loggerPlugin = useMemo<DataTablePlugin<any>>(() => ({
    name: 'ActivityLoggerPlugin',
    onInit: ({ data, columns }) => {
      addLog(`[Logger] Table initialized with ${data.length} records & ${columns.length} columns.`);
    },
    onRowClick: (row, index) => {
      addLog(`[Logger] Row Clicked at index ${index}: "${row.title}"`);
    },
  }), []);

  // 2. Action Buttons Plugin definition
  const actionPlugin = useMemo<DataTablePlugin<any>>(() => ({
    name: 'ActionButtonsPlugin',
    renderToolbarRight: () => (
      <button
        onClick={() => {
          const newId = Math.random().toString(36).substr(2, 5);
          const newMovie = {
            id: newId,
            title: `Custom Movie ${newId.toUpperCase()}`,
            year: new Date().getFullYear(),
            director: 'Plugin Generated',
          };
          setGridData(prev => [newMovie, ...prev]);
          addLog(`[Actions] Toolbar action triggered: Added "${newMovie.title}"`);
        }}
        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 shrink-0"
      >
        <Zap className="w-3.5 h-3.5" />
        Add Item via Plugin
      </button>
    ),
    renderRowAction: (row, index) => (
      <button
        onClick={(e) => {
          e.stopPropagation(); // Avoid triggering onRowClick
          setGridData(prev => prev.filter(item => (item.id || item.title) !== (row.id || row.title)));
          addLog(`[Actions] Row action triggered: Deleted "${row.title}" at row ${index + 1}`);
        }}
        className="p-1 rounded-md text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
        title="Delete Item via Plugin"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    ),
  }), []);

  // 3. Data Transformer Plugin definition
  const transformPlugin = useMemo<DataTablePlugin<any>>(() => ({
    name: 'DataTransformerPlugin',
    transformData: (data) => {
      return data.map(row => ({
        ...row,
        title: String(row.title).toUpperCase(),
      }));
    },
    transformColumns: (columns) => {
      return columns.map(col => {
        if (col.id === 'title') {
          return {
            ...col,
            name: (
              <span className="flex items-center gap-1 text-indigo-600 font-bold tracking-wider">
                <Sparkles className="w-3 h-3" /> TITLE (UPPERCASED)
              </span>
            ),
          };
        }
        return col;
      });
    },
  }), []);

  // Build the list of active plugins
  const activePlugins = useMemo(() => {
    const list: DataTablePlugin<any>[] = [];
    if (enableLoggerPlugin) list.push(loggerPlugin);
    if (enableActionPlugin) list.push(actionPlugin);
    if (enableTransformPlugin) list.push(transformPlugin);
    return list;
  }, [enableLoggerPlugin, enableActionPlugin, enableTransformPlugin, loggerPlugin, actionPlugin, transformPlugin]);

  const codeSnippet = `
import { DataTable, DataTablePlugin } from 'enterprisegrid';

// 1. Define custom plugins
const loggerPlugin: DataTablePlugin<Movie> = {
  name: 'ActivityLoggerPlugin',
  onInit: ({ data }) => console.log('Initialized with', data.length, 'items'),
  onRowClick: (row, index) => console.log('Row clicked:', row.title),
};

const actionPlugin: DataTablePlugin<Movie> = {
  name: 'ActionButtonsPlugin',
  renderToolbarRight: () => (
    <button onClick={handleAdd}>Add Item</button>
  ),
  renderRowAction: (row, index) => (
    <button onClick={() => handleDelete(row)}>Delete</button>
  ),
};

const uppercasePlugin: DataTablePlugin<Movie> = {
  name: 'DataTransformerPlugin',
  transformData: (data) => data.map(r => ({ ...r, title: r.title.toUpperCase() })),
};

// 2. Pass them to DataTable
<DataTable
  id="plugin-demo-grid"
  columns={columns}
  data={data}
  plugins={[loggerPlugin, actionPlugin, uppercasePlugin]}
/>
  `.trim();

  return (
    <div id="plugin-system-section" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">🔌 Expandable Plugin System</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Extend and customize your data grid behaviors with a flexible plug-and-play architecture. Inject custom toolbar controls, row action buttons, state change interceptors, and reactive data or column transformers.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
            <span className="text-sm font-semibold text-slate-700">Live Grid with Plugin Orchestration</span>
            <button
              onClick={() => {
                setGridData(mockData.slice(0, 8));
                setLogs(['[System] Data and logs reset.']);
              }}
              className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors flex items-center justify-center"
              title="Reset Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Plugin Toggles */}
          <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-4 items-center shrink-0">
            <div className="flex items-center gap-1.5">
              <input
                id="toggle-logger-plugin"
                type="checkbox"
                checked={enableLoggerPlugin}
                onChange={() => setEnableLoggerPlugin(!enableLoggerPlugin)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="toggle-logger-plugin" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                ActivityLogger
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                id="toggle-action-plugin"
                type="checkbox"
                checked={enableActionPlugin}
                onChange={() => setEnableActionPlugin(!enableActionPlugin)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="toggle-action-plugin" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                ActionButtons
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                id="toggle-transform-plugin"
                type="checkbox"
                checked={enableTransformPlugin}
                onChange={() => setEnableTransformPlugin(!enableTransformPlugin)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="toggle-transform-plugin" className="text-xs font-semibold text-indigo-600 cursor-pointer select-none flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-indigo-500" /> UpperCaseTransformer
              </label>
            </div>
          </div>

          {/* Datatable Container */}
          <div className="p-0 flex-grow relative min-h-[300px]">
            <DataTable
              id="playground-plugins-demo"
              columns={initialColumns}
              data={gridData}
              plugins={activePlugins}
              config={{
                searchable: false,
                exportable: false,
                densityToggle: false,
                columnVisibility: false,
              }}
              pagination={false}
            />
          </div>

          {/* Log Monitor Drawer */}
          <div className="border-t border-slate-200 bg-slate-950 p-3 h-36 flex flex-col font-mono text-[10px]">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                PLUGIN ACTIVITY CONSOLE
              </span>
              <button
                onClick={() => setLogs([])}
                className="hover:text-white transition-colors uppercase font-bold text-[9px]"
              >
                Clear
              </button>
            </div>
            <div className="flex-grow overflow-y-auto space-y-1 text-slate-300 pr-1 select-all">
              {logs.length === 0 ? (
                <div className="text-slate-500 italic">No events logged yet. Try clicking on a row or using plugin buttons above!</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      index === 0 ? 'text-indigo-300 font-bold border-l-2 border-indigo-500 pl-1.5' : ''
                    }`}
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-sm flex flex-col">
          <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Plugin Implementation Code</span>
            <span className="bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono">React TS</span>
          </div>
          <div className="flex-grow p-4 overflow-auto">
            <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12.5px' }}>
              {codeSnippet}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
