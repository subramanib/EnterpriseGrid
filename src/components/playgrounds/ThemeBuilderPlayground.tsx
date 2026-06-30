import React, { useState, useMemo, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Palette, Copy, Check, RotateCcw, Sparkles, Sliders, Layout, Info } from 'lucide-react';
import { DataTable, createTheme, Theme } from '@enterprisegrid/grid';

interface ThemePreset {
  name: string;
  label: string;
  theme: Partial<Theme>;
}

const presets: ThemePreset[] = [
  {
    name: 'nordic',
    label: 'Nordic Slate',
    theme: {
      text: {
        primary: '#2e3440',
        secondary: '#4c566a',
        disabled: '#d8dee9',
      },
      background: {
        default: '#f8fafc',
      },
      context: {
        background: '#88c0d0',
        text: '#2e3440',
      },
      divider: {
        default: '#e5e9f0',
      },
      button: {
        default: '#4c566a',
        hover: 'rgba(76, 86, 106, 0.08)',
        focus: 'rgba(76, 86, 106, 0.15)',
      },
      selected: {
        default: '#e5e9f0',
        text: '#5e81ac',
      },
      highlightOnHover: {
        default: '#eceff4',
        text: '#2e3440',
      },
      striped: {
        default: '#f0f4f8',
        text: '#2e3440',
      },
      colorScheme: 'light',
    } as any
  },
  {
    name: 'cyberpunk',
    label: 'Cyberpunk Neon',
    theme: {
      text: {
        primary: '#00ffcc',
        secondary: '#ff0055',
        disabled: '#374151',
      },
      background: {
        default: '#0f0c1b',
      },
      context: {
        background: '#ff0055',
        text: '#ffffff',
      },
      divider: {
        default: '#1f1a3a',
      },
      button: {
        default: '#00ffcc',
        hover: 'rgba(0, 255, 204, 0.1)',
        focus: 'rgba(0, 255, 204, 0.2)',
      },
      selected: {
        default: '#2a1a4a',
        text: '#00ffcc',
      },
      highlightOnHover: {
        default: '#1a142e',
        text: '#ff0055',
      },
      striped: {
        default: '#130f24',
        text: '#00ffcc',
      },
      colorScheme: 'dark',
    } as any
  },
  {
    name: 'forest',
    label: 'Emerald Moss',
    theme: {
      text: {
        primary: '#064e3b',
        secondary: '#047857',
        disabled: '#a7f3d0',
      },
      background: {
        default: '#f0fdf4',
      },
      context: {
        background: '#34d399',
        text: '#064e3b',
      },
      divider: {
        default: '#d1fae5',
      },
      button: {
        default: '#047857',
        hover: 'rgba(4, 120, 87, 0.08)',
        focus: 'rgba(4, 120, 87, 0.15)',
      },
      selected: {
        default: '#d1fae5',
        text: '#065f46',
      },
      highlightOnHover: {
        default: '#e6fbf1',
        text: '#064e3b',
      },
      striped: {
        default: '#f5fdf9',
        text: '#064e3b',
      },
      colorScheme: 'light',
    } as any
  },
  {
    name: 'sunset',
    label: 'Crimson Sunset',
    theme: {
      text: {
        primary: '#7f1d1d',
        secondary: '#b91c1c',
        disabled: '#fecaca',
      },
      background: {
        default: '#fff5f5',
      },
      context: {
        background: '#f87171',
        text: '#7f1d1d',
      },
      divider: {
        default: '#fee2e2',
      },
      button: {
        default: '#b91c1c',
        hover: 'rgba(185, 28, 28, 0.08)',
        focus: 'rgba(185, 28, 28, 0.15)',
      },
      selected: {
        default: '#fee2e2',
        text: '#991b1b',
      },
      highlightOnHover: {
        default: '#ffebeb',
        text: '#7f1d1d',
      },
      striped: {
        default: '#fff1f1',
        text: '#7f1d1d',
      },
      colorScheme: 'light',
    } as any
  },
  {
    name: 'ocean',
    label: 'Deep Ocean',
    theme: {
      text: {
        primary: '#e0f2fe',
        secondary: '#38bdf8',
        disabled: '#0f172a',
      },
      background: {
        default: '#020617',
      },
      context: {
        background: '#0369a1',
        text: '#e0f2fe',
      },
      divider: {
        default: '#0f172a',
      },
      button: {
        default: '#38bdf8',
        hover: 'rgba(56, 189, 248, 0.08)',
        focus: 'rgba(56, 189, 248, 0.15)',
      },
      selected: {
        default: '#075985',
        text: '#f0f9ff',
      },
      highlightOnHover: {
        default: '#0f172a',
        text: '#e0f2fe',
      },
      striped: {
        default: '#030712',
        text: '#e0f2fe',
      },
      colorScheme: 'dark',
    } as any
  },
];

const mockColumns = [
  { id: 'name', name: 'User Name', selector: (row: any) => row.name, sortable: true },
  { id: 'role', name: 'Role', selector: (row: any) => row.role, sortable: true },
  { id: 'status', name: 'Status', selector: (row: any) => row.status, sortable: true },
  { id: 'usage', name: 'Usage Limit', selector: (row: any) => row.usage, sortable: true },
];

const mockData = [
  { id: 1, name: 'Arlene McCoy', role: 'Global Admin', status: 'Active', usage: '94% used' },
  { id: 2, name: 'Cody Fisher', role: 'Support Specialist', status: 'Active', usage: '42% used' },
  { id: 3, name: 'Jane Cooper', role: 'Marketing Manager', status: 'Suspended', usage: '0% used' },
  { id: 4, name: 'Devon Webb', role: 'Senior Analyst', status: 'Pending', usage: '12% used' },
  { id: 5, name: 'Kristin Watson', role: 'Database Engineer', status: 'Active', usage: '89% used' },
];

export function ThemeBuilderPlayground() {
  const [themeName, setThemeName] = useState('my-builder-theme');
  const [activePreset, setActivePreset] = useState('nordic');
  const [copied, setCopied] = useState(false);

  // Theme states
  const [textPrimary, setTextPrimary] = useState('#2e3440');
  const [textSecondary, setTextSecondary] = useState('#4c566a');
  const [textDisabled, setTextDisabled] = useState('#d8dee9');
  
  const [backgroundDefault, setBackgroundDefault] = useState('#f8fafc');
  
  const [contextBackground, setContextBackground] = useState('#88c0d0');
  const [contextText, setContextText] = useState('#2e3440');
  
  const [dividerDefault, setDividerDefault] = useState('#e5e9f0');
  
  const [buttonDefault, setButtonDefault] = useState('#4c566a');
  const [buttonHover, setButtonHover] = useState('rgba(76, 86, 106, 0.08)');
  
  const [selectedDefault, setSelectedDefault] = useState('#e5e9f0');
  const [selectedText, setSelectedText] = useState('#5e81ac');
  
  const [highlightDefault, setHighlightDefault] = useState('#eceff4');
  const [highlightText, setHighlightText] = useState('#2e3440');
  
  const [stripedDefault, setStripedDefault] = useState('#f0f4f8');
  const [stripedText, setStripedText] = useState('#2e3440');
  
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  // Load preset on change
  const handlePresetChange = (presetName: string) => {
    const selectedPreset = presets.find(p => p.name === presetName);
    if (selectedPreset && selectedPreset.theme) {
      const t = selectedPreset.theme;
      setActivePreset(presetName);
      
      if (t.text?.primary) setTextPrimary(t.text.primary);
      if (t.text?.secondary) setTextSecondary(t.text.secondary);
      if (t.text?.disabled) setTextDisabled(t.text.disabled);
      
      if (t.background?.default) setBackgroundDefault(t.background.default);
      
      if (t.context?.background) setContextBackground(t.context.background);
      if (t.context?.text) setContextText(t.context.text);
      
      if (t.divider?.default) setDividerDefault(t.divider.default);
      
      if (t.button?.default) setButtonDefault(t.button.default);
      if (t.button?.hover) setButtonHover(t.button.hover);
      
      if (t.selected?.default) setSelectedDefault(t.selected.default);
      if (t.selected?.text) setSelectedText(t.selected.text);
      
      if (t.highlightOnHover?.default) setHighlightDefault(t.highlightOnHover.default);
      if (t.highlightOnHover?.text) setHighlightText(t.highlightOnHover.text);
      
      if (t.striped?.default) setStripedDefault(t.striped.default);
      if (t.striped?.text) setStripedText(t.striped.text);
      
      if (t.colorScheme) setColorScheme(t.colorScheme);
    }
  };

  // Build the live custom theme configuration object
  const customThemeConfig = useMemo(() => {
    return {
      text: {
        primary: textPrimary,
        secondary: textSecondary,
        disabled: textDisabled,
      },
      background: {
        default: backgroundDefault,
      },
      context: {
        background: contextBackground,
        text: contextText,
      },
      divider: {
        default: dividerDefault,
      },
      button: {
        default: buttonDefault,
        hover: buttonHover,
        focus: buttonHover,
      },
      selected: {
        default: selectedDefault,
        text: selectedText,
      },
      highlightOnHover: {
        default: highlightDefault,
        text: highlightText,
      },
      striped: {
        default: stripedDefault,
        text: stripedText,
      },
      colorScheme,
    };
  }, [
    textPrimary, textSecondary, textDisabled,
    backgroundDefault, contextBackground, contextText,
    dividerDefault, buttonDefault, buttonHover,
    selectedDefault, selectedText, highlightDefault, highlightText,
    stripedDefault, stripedText, colorScheme
  ]);

  // Dynamically register the theme into the table's theme registry
  useEffect(() => {
    createTheme(themeName, customThemeConfig);
  }, [themeName, customThemeConfig]);

  const [isSaving, setIsSaving] = useState(false);

  const saveThemeToCloud = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: themeName,
          config: customThemeConfig
        })
      });
      
      if (response.ok) {
        alert(`Theme "${themeName}" saved to the cloud successfully!`);
      } else {
        throw new Error('Failed to save theme');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving theme to cloud. Check server status.');
    } finally {
      setIsSaving(false);
    }
  };

  const copyCodeToClipboard = () => {
    const code = `
import { DataTable, createTheme } from 'enterprisegrid';

// 1. Create and register your custom theme
createTheme('${themeName}', {
  text: {
    primary: '${textPrimary}',
    secondary: '${textSecondary}',
    disabled: '${textDisabled}',
  },
  background: {
    default: '${backgroundDefault}',
  },
  context: {
    background: '${contextBackground}',
    text: '${contextText}',
  },
  divider: {
    default: '${dividerDefault}',
  },
  button: {
    default: '${buttonDefault}',
    hover: '${buttonHover}',
    focus: '${buttonHover}',
  },
  selected: {
    default: '${selectedDefault}',
    text: '${selectedText}',
  },
  highlightOnHover: {
    default: '${highlightDefault}',
    text: '${highlightText}',
  },
  striped: {
    default: '${stripedDefault}',
    text: '${stripedText}',
  },
  colorScheme: '${colorScheme}',
});

// 2. Render DataTable with your custom theme
<DataTable
  columns={columns}
  data={data}
  theme="${themeName}"
  striped
  highlightOnHover
/>
    `.trim();

    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const codeString = `
createTheme('${themeName}', {
  text: {
    primary: '${textPrimary}',
    secondary: '${textSecondary}'
  },
  background: {
    default: '${backgroundDefault}'
  },
  divider: {
    default: '${dividerDefault}'
  },
  selected: {
    default: '${selectedDefault}',
    text: '${selectedText}'
  }
});
  `.trim();

  return (
    <div id="theme-builder-section" className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-semibold mb-4 text-slate-800 flex items-center gap-2">
        <Palette className="w-6 h-6 text-indigo-600" /> Dynamic Theme Builder
      </h2>
      <div className="text-slate-600 mb-6 leading-relaxed">
        Customize every design facet of the data grid. Tweak background shades, text hierarchies, selection overlays, divider borders, and button hover states instantly in real time. Export standard, copy-pasteable registration scripts configured exactly to your visual guidelines.
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Controls Column */}
        <div className="w-full lg:w-[41.667%] flex-shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Customize Theme Design Tokens
            </span>
            <div className="flex gap-1.5">
              {presets.map(p => (
                <button
                  key={p.name}
                  onClick={() => handlePresetChange(p.name)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                    activePreset === p.name
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-4 max-h-[550px] overflow-y-auto">
            {/* Theme Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Theme Key Name
              </label>
              <input
                type="text"
                value={themeName}
                onChange={(e) => setThemeName(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono text-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="theme-name"
              />
            </div>

            {/* Colors Grid */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Typography / Text Elements
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Primary Text</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={textPrimary}
                      onChange={(e) => setTextPrimary(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={textPrimary}
                      onChange={(e) => setTextPrimary(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Secondary Text</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={textSecondary}
                      onChange={(e) => setTextSecondary(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={textSecondary}
                      onChange={(e) => setTextSecondary(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Background & Divider */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Surfaces & Dividers
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Row Background</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={backgroundDefault}
                      onChange={(e) => setBackgroundDefault(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={backgroundDefault}
                      onChange={(e) => setBackgroundDefault(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Table Divider</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={dividerDefault}
                      onChange={(e) => setDividerDefault(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={dividerDefault}
                      onChange={(e) => setDividerDefault(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Interaction States */}
            <div className="border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                Hover, Selection, and Stripe States
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Selected Row BG</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedDefault}
                      onChange={(e) => setSelectedDefault(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedDefault}
                      onChange={(e) => setSelectedDefault(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Selected Row Text</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={selectedText}
                      onChange={(e) => setSelectedText(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={selectedText}
                      onChange={(e) => setSelectedText(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Hover Highlight BG</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={highlightDefault}
                      onChange={(e) => setHighlightDefault(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={highlightDefault}
                      onChange={(e) => setHighlightDefault(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Striped Row BG</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={stripedDefault}
                      onChange={(e) => setStripedDefault(e.target.value)}
                      className="w-7 h-7 rounded border border-slate-200 cursor-pointer p-0 shrink-0"
                    />
                    <input
                      type="text"
                      value={stripedDefault}
                      onChange={(e) => setStripedDefault(e.target.value)}
                      className="w-full px-1.5 py-1 text-xs border border-slate-200 rounded font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Scheme Type & Button Header */}
            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Contrast Scheme Mode
                </span>
                <span className="text-[10px] text-slate-400">Controls icons/toolbar contrast</span>
              </div>
              <div className="flex bg-slate-100 rounded-md p-0.5">
                <button
                  type="button"
                  onClick={() => setColorScheme('light')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    colorScheme === 'light' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Light
                </button>
                <button
                  type="button"
                  onClick={() => setColorScheme('dark')}
                  className={`px-3 py-1 text-xs font-semibold rounded ${
                    colorScheme === 'dark' ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview and Output Column */}
        <div className="w-full lg:w-[58.333%] flex-1 min-w-0 space-y-6">
          {/* Live grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-indigo-500" /> Real-time Rendered Preview
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wide">
                Live Compiling
              </span>
            </div>

            <div className="p-0 relative min-h-[250px]">
              <DataTable
                id="playground-theme-preview"
                columns={mockColumns}
                data={mockData}
                theme={themeName}
                striped
                highlightOnHover
                selectableRows
                config={{
                  searchable: true,
                  exportable: true,
                  densityToggle: true,
                  columnVisibility: true,
                }}
                pagination={false}
              />
            </div>
          </div>

          {/* Export Code Block */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-md flex flex-col">
            <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2.5 text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
                Generated Registration Code
              </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveThemeToCloud}
                disabled={isSaving}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded transition-all active:scale-95 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Save to Cloud</span>
              </button>
              <button
                type="button"
                onClick={copyCodeToClipboard}
                className="flex items-center gap-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="p-4 overflow-auto max-h-[220px]">
              <SyntaxHighlighter language="jsx" style={vscDarkPlus} customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '12px' }}>
                {codeString}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
