import React, { useState } from 'react';
import LiveCodeEditor from './LiveCodeEditor';

export interface BasePlaygroundProps {
  id?: string;
  title: string;
  description: React.ReactNode;
  initialConfig: Record<string, boolean>;
  renderCode: (config: Record<string, boolean>) => string;
  renderTable: (config: Record<string, boolean>) => React.ReactNode;
}

export function BasePlayground({ id, title, description, initialConfig, renderCode, renderTable }: BasePlaygroundProps) {
  const [config, setConfig] = useState(initialConfig);

  const toggleConfig = (key: string) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mb-16 scroll-mt-24" id={id || title.toLowerCase().replace(/\s+/g, '-')}>
      <h2 className="text-2xl font-semibold mb-4 text-slate-800">{title}</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {Object.keys(config).map((key) => (
          <label key={key} className="flex items-center space-x-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
            <input 
              type="checkbox" 
              checked={config[key]} 
              onChange={() => toggleConfig(key)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-slate-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
          </label>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="w-full xl:w-1/2 flex-1 min-w-0 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Live Preview</div>
          <div className="p-4 flex-grow overflow-auto relative min-h-[300px]">
            {renderTable(config)}
          </div>
        </div>

        <div className="w-full xl:w-1/2 flex-1 min-w-0">
          <LiveCodeEditor language="jsx" title="playground.tsx">
            {renderCode(config)}
          </LiveCodeEditor>
        </div>
      </div>
    </div>
  );
}
