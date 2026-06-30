import React, { useState, useMemo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Terminal, Trash2, Check, Pin, Smartphone, RotateCcw, Info, Sparkles } from 'lucide-react';
import { DataTable, MobileSwipeConfig } from '@enterprisegrid/grid';

interface Task {
  id: string;
  taskName: string;
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Pinned';
}

const initialTasks: Task[] = [
  { id: '1', taskName: 'Review code comments and test coverage', category: 'Engineering', priority: 'High', status: 'Pending' },
  { id: '2', taskName: 'Design interactive landing page hero', category: 'UI/UX Design', priority: 'Medium', status: 'Pending' },
  { id: '3', taskName: 'Draft enterprise grid quick start guide', category: 'Docs', priority: 'Low', status: 'Pinned' },
  { id: '4', taskName: 'Integrate swipe actions into DataTable', category: 'Core Dev', priority: 'High', status: 'Completed' },
  { id: '5', taskName: 'Debug touch event gesture handler delay', category: 'QA', priority: 'Medium', status: 'Pending' },
  { id: '6', taskName: 'Prepare next-gen learning platform features list', category: 'Product', priority: 'High', status: 'Pending' }
];

export function MobileSwipeActionsPlayground() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [logs, setLogs] = useState<string[]>(['[System] Mobile Swipe Actions initialized. Use touch gestures or mobile view simulation.']);
  const [enableSwipeActions, setEnableSwipeActions] = useState(true);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  const handleMarkComplete = (row: Task, index: number) => {
    setTasks(prev => prev.map(t => t.id === row.id ? { ...t, status: 'Completed' } : t));
    addLog(`[Swipe Right] Task "${row.taskName}" marked as Completed!`);
  };

  const handleTogglePin = (row: Task, index: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === row.id) {
        const nextStatus = t.status === 'Pinned' ? 'Pending' : 'Pinned';
        addLog(`[Swipe Left] Task "${row.taskName}" ${nextStatus === 'Pinned' ? 'Pinned to top' : 'Unpinned'}.`);
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleDelete = (row: Task, index: number) => {
    setTasks(prev => prev.filter(t => t.id !== row.id));
    addLog(`[Swipe Left] Task "${row.taskName}" deleted.`);
  };

  const swipeConfig = useMemo<MobileSwipeConfig<Task>>(() => ({
    left: [
      {
        key: 'complete',
        label: 'Complete',
        icon: <Check className="w-4 h-4" />,
        className: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        onClick: handleMarkComplete
      }
    ],
    right: [
      {
        key: 'pin',
        label: 'Pin',
        icon: <Pin className="w-4 h-4" />,
        className: 'bg-amber-500 hover:bg-amber-600 text-white',
        onClick: handleTogglePin
      },
      {
        key: 'delete',
        label: 'Delete',
        icon: <Trash2 className="w-4 h-4" />,
        className: 'bg-rose-600 hover:bg-rose-700 text-white',
        onClick: handleDelete
      }
    ]
  }), []);

  const columns = [
    {
      id: 'taskName',
      name: 'Task Name',
      selector: (row: Task) => row.taskName,
      sortable: true,
      cell: (row: Task) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            {row.status === 'Pinned' && (
              <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Pin className="w-2.5 h-2.5 fill-amber-800" /> PINNED
              </span>
            )}
            {row.status === 'Completed' && (
              <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                COMPLETED
              </span>
            )}
            <span className={`font-medium ${row.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
              {row.taskName}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-0.5">{row.category}</span>
        </div>
      )
    },
    {
      id: 'priority',
      name: 'Priority',
      selector: (row: Task) => row.priority,
      sortable: true,
      cell: (row: Task) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          row.priority === 'High' ? 'bg-red-100 text-red-800' :
          row.priority === 'Medium' ? 'bg-orange-100 text-orange-800' :
          'bg-slate-100 text-slate-800'
        }`}>
          {row.priority}
        </span>
      )
    }
  ];

  const codeSnippet = `
import { DataTable, MobileSwipeConfig } from 'enterprisegrid';

// 1. Define swipe actions config
const swipeConfig: MobileSwipeConfig<Task> = {
  left: [
    {
      key: 'complete',
      label: 'Complete',
      icon: <Check className="w-4 h-4" />,
      className: 'bg-emerald-600 text-white',
      onClick: (row, index) => markAsCompleted(row)
    }
  ],
  right: [
    {
      key: 'pin',
      label: 'Pin',
      icon: <Pin className="w-4 h-4" />,
      className: 'bg-amber-500 text-white',
      onClick: (row, index) => togglePin(row)
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 className="w-4 h-4" />,
      className: 'bg-rose-600 text-white',
      onClick: (row, index) => deleteTask(row)
    }
  ]
};

// 2. Pass to DataTable with swipeActions: true config
<DataTable
  id="swipe-actions-demo"
  columns={columns}
  data={tasks}
  mobileSwipeActions={swipeConfig}
  config={{
    swipeActions: true, // Enable swipe actions gesture
    pagination: false,
    searchable: false,
    exportable: false
  }}
/>
  `.trim();

  return (
    <div id="mobile-swipe-actions-section" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
        <Smartphone className="w-6 h-6 text-indigo-600" /> Mobile Swipe Actions
      </h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Provide intuitive, touch-friendly swipe gestures for mobile viewport users. Users can swipe left or right on table rows to trigger quick actions like marking tasks complete, pinning items, or deleting records instantly with smooth native spring-back snapping.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="w-full lg:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center shrink-0">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-slate-500" /> Interactive Mobile Preview Simulator
            </span>
            <button
              onClick={() => {
                setTasks(initialTasks);
                setLogs(['[System] Tasks and activity logs reset.']);
              }}
              className="p-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-500 transition-colors flex items-center justify-center"
              title="Reset Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Swipe Toggles */}
          <div className="px-4 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap gap-4 items-center shrink-0">
            <div className="flex items-center gap-1.5">
              <input
                id="toggle-swipe-actions"
                type="checkbox"
                checked={enableSwipeActions}
                onChange={() => setEnableSwipeActions(!enableSwipeActions)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="toggle-swipe-actions" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
                Enable Swipe Gestures (`config.swipeActions`)
              </label>
            </div>
            <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
              Simulate: click-and-drag or touch swipe
            </span>
          </div>

          {/* Table Container / Mobile Frame Simulation */}
          <div className="p-0 flex-grow relative min-h-[300px] overflow-hidden bg-slate-50/20 max-w-full">
            <div className="bg-indigo-50/40 p-2.5 text-xs text-indigo-900 border-b border-indigo-100 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Mobile Emulation</strong>: Drag or swipe a row in the table to reveal actions. Swipe **right** to Complete. Swipe **left** to Pin or Delete.
              </span>
            </div>
            <DataTable
              id="playground-swipe-demo"
              columns={columns}
              data={tasks}
              mobileSwipeActions={swipeConfig}
              config={{
                swipeActions: enableSwipeActions,
                searchable: false,
                exportable: false,
                densityToggle: false,
                columnVisibility: false,
                selectableRows: false
              }}
              pagination={false}
            />
          </div>

          {/* Log Console */}
          <div className="border-t border-slate-200 bg-slate-950 p-3 h-36 flex flex-col font-mono text-[10px]">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="flex items-center gap-1 text-green-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                SWIPE ACTIVITY CONSOLE
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
                <div className="text-slate-500 italic">No events logged. Try swiping a row!</div>
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
            <span>Implementation & Props Configuration</span>
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
