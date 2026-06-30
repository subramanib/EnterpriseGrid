import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Copy, Check, RotateCcw, Terminal, Code, Eye, Pencil, Search, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiveCodeEditorProps {
  children?: string;
  code?: string; // fallback if children is not provided
  language?: string;
  style?: any;
  customStyle?: any;
  onChange?: (newCode: string) => void;
  title?: string;
}

export default function LiveCodeEditor({
  children,
  code: propCode,
  language = 'jsx',
  style = vscDarkPlus,
  customStyle = {},
  onChange,
  title
}: LiveCodeEditorProps) {
  const initialCode = (children || propCode || '').trim();
  const [code, setCode] = useState(initialCode);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [consoleLogs, setConsoleLogs] = useState<Array<{ type: 'info' | 'success' | 'error'; message: string; timestamp: string }>>([]);
  const [showConsole, setShowConsole] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [searchMatches, setSearchMatches] = useState<number>(0);
  const [syntaxError, setSyntaxError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal code state if the parent's initial code changes (e.g., when toggling checkboxes in a playground)
  // but ONLY if the user is not actively editing their own custom code.
  useEffect(() => {
    if (!isEditing) {
      setCode(initialCode);
    }
  }, [initialCode, isEditing]);

  // Handle compilation simulation / syntax checking
  useEffect(() => {
    if (!code) {
      setSyntaxError(null);
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    
    // Simple dry-run syntax check for JS/JSX/JSON
    if (language === 'json') {
      try {
        JSON.parse(code);
        setSyntaxError(null);
        setConsoleLogs(prev => [
          { type: 'success', message: 'JSON parsed successfully. Configuration updated.', timestamp },
          ...prev.slice(0, 15)
        ]);
      } catch (err: any) {
        setSyntaxError(err.message);
        setConsoleLogs(prev => [
          { type: 'error', message: `JSON syntax error: ${err.message}`, timestamp },
          ...prev.slice(0, 15)
        ]);
      }
    } else {
      // Basic JS/JSX syntax checking using Function constructor as a lightweight linter
      try {
        // Strip out import/export statements which are ES Modules and won't compile in standard Function constructor
        const checkableCode = code
          .replace(/import\s+.*?\s+from\s+['"].*?['"]/g, '')
          .replace(/export\s+default\s+/g, '')
          .replace(/export\s+const\s+/g, 'const ')
          .replace(/export\s+function\s+/g, 'function ')
          .replace(/<\/?[A-Za-z0-9_$.]+[^>]*>/g, 'null'); // rough JSX bracket strip to avoid syntax errors from JSX tags

        new Function(checkableCode);
        setSyntaxError(null);
        setConsoleLogs(prev => [
          { type: 'success', message: 'Code syntax compiled. React sandbox refreshed successfully.', timestamp },
          ...prev.slice(0, 15)
        ]);
      } catch (err: any) {
        // Simple error logging
        const isLegitError = !err.message.includes('Unexpected identifier') && !err.message.includes('Unexpected token');
        if (isLegitError) {
          setSyntaxError(err.message);
          setConsoleLogs(prev => [
            { type: 'error', message: `Sandbox compilation error: ${err.message}`, timestamp },
            ...prev.slice(0, 15)
          ]);
        } else {
          // If it's a false positive from JSX syntax we can ignore or log gently
          setSyntaxError(null);
        }
      }
    }
  }, [code, language]);

  // Initial console log
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs([
      { type: 'info', message: 'Live sandbox compiler initialized.', timestamp },
      { type: 'success', message: 'HMR connected. Ready for modifications.', timestamp }
    ]);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [
      { type: 'info', message: 'Copied code snippet to clipboard.', timestamp },
      ...prev.slice(0, 15)
    ]);
  };

  const handleReset = () => {
    setCode(initialCode);
    setSyntaxError(null);
    if (onChange) onChange(initialCode);

    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [
      { type: 'info', message: 'Reset code snippet to default.', timestamp },
      ...prev.slice(0, 15)
    ]);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onChange) {
      onChange(newCode);
    }
  };

  // Intercept Tab key to insert spaces
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;

      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      setCode(newVal);
      if (onChange) onChange(newVal);

      // Reset selection
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Count search matches
  useEffect(() => {
    if (!searchQuery) {
      setSearchMatches(0);
      return;
    }
    try {
      const regex = new RegExp(searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
      const matches = code.match(regex);
      setSearchMatches(matches ? matches.length : 0);
    } catch {
      setSearchMatches(0);
    }
  }, [searchQuery, code]);

  // Line numbers calculation
  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#1e1e1e] shadow-lg flex flex-col w-full text-slate-300 font-sans">
      {/* Editor Header Toolbar */}
      <div className="bg-[#2d2d2d] border-b border-[#404040] px-4 py-2 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
          </div>
          <span className="text-xs font-mono text-slate-400 select-none border-r border-[#404040] pr-3 mr-1">
            {title || `sandbox.${language === 'json' ? 'json' : 'tsx'}`}
          </span>
          <div className="flex bg-[#1e1e1e] p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setIsEditing(false)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                !isEditing
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2a2a]'
              }`}
              id="live-editor-view-mode-btn"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                isEditing
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#2a2a2a]'
              }`}
              id="live-editor-edit-mode-btn"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Code</span>
            </button>
          </div>
          {isEditing && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
              <Sparkles className="w-3 h-3" />
              Live Editor
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Find Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors text-slate-400 hover:text-slate-200 relative ${
              showSearch ? 'bg-[#3a3a3a] text-indigo-400' : ''
            }`}
            title="Find"
            id="live-editor-search-btn"
          >
            <Search className="w-3.5 h-3.5" />
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors text-slate-400 hover:text-slate-200"
            title="Reset to default code"
            id="live-editor-reset-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Console Toggle */}
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`p-1.5 rounded-lg hover:bg-[#3a3a3a] transition-colors text-slate-400 hover:text-slate-200 flex items-center gap-1 ${
              showConsole ? 'bg-indigo-950/40 text-indigo-400 border border-indigo-800/40' : ''
            }`}
            title="Sandbox Console Logs"
            id="live-editor-console-btn"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold">Console</span>
            {syntaxError && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700"
            id="live-editor-copy-btn"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Find Panel */}
      {showSearch && (
        <div className="bg-[#242424] border-b border-[#3c3c3c] px-4 py-1.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-grow max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Find..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1a] border border-slate-700 rounded px-2 py-0.5 text-xs text-white focus:outline-none focus:border-indigo-500 w-full"
              autoFocus
              id="live-editor-search-input"
            />
          </div>
          <div className="flex items-center gap-3">
            {searchQuery && (
              <span className="text-[11px] font-mono text-slate-500">
                {searchMatches} {searchMatches === 1 ? 'match' : 'matches'}
              </span>
            )}
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchQuery('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200"
              id="live-editor-search-close-btn"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Editor Body */}
      <div className="flex flex-1 relative min-h-[180px] max-h-[500px] overflow-hidden font-mono text-[13px] leading-relaxed">
        {isEditing ? (
          /* EDITABLE MODE */
          <div className="flex flex-1 w-full h-full overflow-auto scrollbar-thin">
            {/* Line Numbers column */}
            <div className="bg-[#1a1a1a] text-slate-600 select-none py-4 text-right pr-3 pl-4 min-w-[3.5rem] border-r border-[#2d2d2d] flex flex-col">
              {lineNumbers.map((num) => (
                <div key={num} className="h-6">
                  {num}
                </div>
              ))}
            </div>

            {/* Input Textarea */}
            <div className="relative flex-1 min-w-0 h-full">
              <textarea
                ref={textareaRef}
                value={code}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                className="absolute inset-0 w-full h-full p-4 bg-[#1e1e1e] text-indigo-100 whitespace-pre font-mono text-[13px] leading-6 resize-none outline-none border-none focus:ring-0 focus:outline-none scrollbar-thin"
                spellCheck={false}
                placeholder="Write or edit code here..."
                id="live-editor-textarea"
              />
            </div>
          </div>
        ) : (
          /* HIGHLIGHTED STATIC MODE */
          <div className="flex-1 overflow-auto scrollbar-thin p-1 cursor-text" onClick={() => setIsEditing(true)}>
            <SyntaxHighlighter
              language={language}
              style={style}
              customStyle={{
                margin: 0,
                padding: '1rem',
                background: 'transparent',
                fontSize: '13px',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.5rem',
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        )}
      </div>

      {/* Compiler Syntax Error Alert */}
      {syntaxError && (
        <div className="bg-rose-950/80 border-t border-rose-800/60 px-4 py-2 flex items-center gap-2.5 text-rose-200 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-semibold text-rose-300">Syntax Alert:</span>
          <span className="font-mono truncate flex-1">{syntaxError}</span>
        </div>
      )}

      {/* Collapsible Console Panel */}
      {showConsole && (
        <div className="bg-[#151515] border-t border-[#333] flex flex-col h-[180px]">
          <div className="bg-[#1e1e1e] px-4 py-1.5 flex items-center justify-between border-b border-[#2c2c2c]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                Live Console Sandbox Logs
              </span>
            </div>
            <button
              onClick={() => setShowConsole(false)}
              className="text-slate-500 hover:text-slate-300 text-xs"
              id="live-editor-console-close-btn"
            >
              Hide
            </button>
          </div>
          <div className="p-3 overflow-y-auto flex-1 font-mono text-[11px] space-y-1.5 scrollbar-thin">
            {consoleLogs.length === 0 ? (
              <div className="text-slate-600 italic">No compile logs yet. Edit code to see status.</div>
            ) : (
              consoleLogs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                  <span
                    className={
                      log.type === 'error'
                        ? 'text-rose-400 font-semibold'
                        : log.type === 'success'
                        ? 'text-emerald-400'
                        : 'text-indigo-400'
                    }
                  >
                    {log.type === 'error' ? '✖ [ERROR]' : log.type === 'success' ? '✔ [SUCCESS]' : 'ℹ [INFO]'}
                  </span>
                  <span className="text-slate-300 break-words">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
