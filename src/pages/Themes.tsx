import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import Footer from '../components/Footer';
import { DataTable, createTheme } from '@enterprisegrid/grid';
import LiveCodeEditor from '../components/LiveCodeEditor';

const mockData = [
  { id: 1, title: 'Beetlejuice', year: '1988', director: 'Tim Burton' },
  { id: 2, title: 'Ghostbusters', year: '1984', director: 'Ivan Reitman' },
  { id: 3, title: 'The Matrix', year: '1999', director: 'Lana Wachowski' }
];

const mockColumns = [
  { id: 'title', name: 'Title', selector: (row: any) => row.title, sortable: true },
  { id: 'director', name: 'Director', selector: (row: any) => row.director, sortable: true },
  { id: 'year', name: 'Year', selector: (row: any) => row.year, sortable: true }
];

export default function Themes() {
  const [themeName, setThemeName] = useState('custom-theme');
  const [baseTheme, setBaseTheme] = useState<'light' | 'dark'>('light');
  
  const [colors, setColors] = useState({
    textPrimary: '#1e293b',
    textSecondary: '#4f46e5',
    bgDefault: '#f8fafc',
    contextBg: '#4f46e5',
    contextText: '#ffffff',
    dividerDefault: '#e2e8f0',
    actionButton: '#6366f1',
    actionHover: 'rgba(79, 70, 229, 0.08)',
    actionDisabled: 'rgba(15, 23, 42, 0.12)'
  });

  useEffect(() => {
    createTheme(themeName, {
      text: {
        primary: colors.textPrimary,
        secondary: colors.textSecondary,
      },
      background: {
        default: colors.bgDefault,
      },
      context: {
        background: colors.contextBg,
        text: colors.contextText,
      },
      divider: {
        default: colors.dividerDefault,
      },
      action: {
        button: colors.actionButton,
        hover: colors.actionHover,
        disabled: colors.actionDisabled,
      },
    }, baseTheme);
  }, [colors, themeName, baseTheme]);

  const handleChange = (key: keyof typeof colors, value: string) => {
    setColors(prev => ({ ...prev, [key]: value }));
  };

  const codeSnippet = `
import EnterpriseGrid, { createTheme } from '@enterprisegrid/grid';

createTheme('${themeName}', {
  text: {
    primary: '${colors.textPrimary}',
    secondary: '${colors.textSecondary}',
  },
  background: {
    default: '${colors.bgDefault}',
  },
  context: {
    background: '${colors.contextBg}',
    text: '${colors.contextText}',
  },
  divider: {
    default: '${colors.dividerDefault}',
  },
  action: {
    button: '${colors.actionButton}',
    hover: '${colors.actionHover}',
    disabled: '${colors.actionDisabled}',
  },
}, '${baseTheme}');

const MyComponent = () => (
  <EnterpriseGrid
    title="EnterpriseGrid Users"
    columns={columns}
    data={data}
    theme="${themeName}"
  />
);
  `.trim();

  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50/50">
      <SEO 
        title="Theme Builder" 
        description="Create custom themes for EnterpriseGrid by picking your brand colors. See live changes and copy the generated configuration instantly."
        url="https://enterprisegrid.io/themes"
        keywords="React table theme builder, data grid style creator, custom CSS generator, Tailwind component styling, visual data grid customizer"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "EnterpriseGrid Theme Builder",
          "description": "Create custom themes for EnterpriseGrid by picking your brand colors. See live changes and copy the generated configuration instantly.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        }}
      />
      <div className="container mx-auto px-4 py-12 max-w-6xl flex-1">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center rounded-2xl mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-800">Interactive Theme Generator</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Create custom themes by picking your brand colors. See live changes and copy the generated configuration instantly.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex-shrink-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">Base Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Theme Name</label>
                <input 
                  type="text" 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)}
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Base Theme</label>
                <select 
                  value={baseTheme} 
                  onChange={(e) => setBaseTheme(e.target.value as 'light' | 'dark')}
                  className="w-full border-slate-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border bg-white"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
            
            <h3 className="font-semibold text-slate-800 mt-8 mb-4">Color Palette</h3>
            <div className="space-y-4">
              {Object.entries(colors).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400 font-mono w-16">{value}</span>
                    <input 
                      type="color" 
                      value={value.startsWith('rgba') ? '#ffffff' : value} 
                      onChange={(e) => handleChange(key as keyof typeof colors, e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-2/3 flex-1 min-w-0 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">Live Preview</span>
            </div>
            <div className="p-4" style={{ backgroundColor: colors.bgDefault }}>
              <DataTable 
                title="Movie Database"
                columns={mockColumns} 
                data={mockData} 
                theme={themeName}
                selectableRows
                pagination
                config={{ searchable: true, exportable: false, densityToggle: false, columnVisibility: false }}
              />
            </div>
          </div>
          
          <LiveCodeEditor language="jsx" title="theme-config.ts">
            {codeSnippet}
          </LiveCodeEditor>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

