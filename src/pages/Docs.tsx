import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { SEO } from '../components/SEO';
import Footer from '../components/Footer';
import LiveCodeEditor from '../components/LiveCodeEditor';
import { DataTable, Direction } from '@enterprisegrid/grid';
import {
  FeaturesConfigPlayground,
  LayoutAppearancePlayground,
  ThemingStylingPlayground,
  AdvancedSortingPlayground,
  AdvancedPaginationPlayground,
  AdvancedFooterPlayground,
  AdvancedRowSelectionPlayground,
  AdvancedExpandableRowsPlayground,
  AdvancedRowEventsPlayground,
  ColumnFeaturesPlayground,
  LocalizationPlayground,
  AiAnalyticsPlayground,
  CellEditingPlayground,
  AiQueryAssistantPlayground,
  AiSmartSummaryPlayground,
  AiInsightsDashboardPlayground,
  MapViewPlayground,
  CalendarViewPlayground,
  SavedViewsPlayground,
  ShareableViewsPlayground,
  AuditTrailPlayground,
  TimeTravelPlayground,
  RowCommentsPlayground,
  SparklinePlayground,
  HeatmapPlayground,
  BookmarksPlayground,
  CommandPalettePlayground,
  SidePreviewPlayground,
  PluginSystemPlayground,
  MobileSwipeActionsPlayground,
  ThemeBuilderPlayground,
  OfflineSyncPlayground,
  MultiViewPlayground
} from '../components/playgrounds';

const mockData = [
  { id: 1, title: 'Beetlejuice', year: '1988', director: 'Tim Burton' },
  { id: 2, title: 'Ghostbusters', year: '1984', director: 'Ivan Reitman' },
  { id: 3, title: 'The Matrix', year: '1999', director: 'Lana Wachowski' },
  { id: 4, title: 'Inception', year: '2010', director: 'Christopher Nolan' },
  { id: 5, title: 'Interstellar', year: '2014', director: 'Christopher Nolan' },
  { id: 6, title: 'The Dark Knight', year: '2008', director: 'Christopher Nolan' },
  { id: 7, title: 'Pulp Fiction', year: '1994', director: 'Quentin Tarantino' },
  { id: 8, title: 'Fight Club', year: '1999', director: 'David Fincher' },
  { id: 9, title: 'Forrest Gump', year: '1994', director: 'Robert Zemeckis' },
  { id: 10, title: 'The Shawshank Redemption', year: '1994', director: 'Frank Darabont' }
];

const mockColumns = [
  { name: 'Title', selector: (row: any) => row.title, sortable: true, id: 'title' },
  { name: 'Director', selector: (row: any) => row.director, sortable: true, id: 'director' },
  { name: 'Year', selector: (row: any) => row.year, sortable: true, id: 'year' }
];

function DocSection({ id, title, description, code, children }: { id: string, title: string, description: React.ReactNode, code: string, children: React.ReactNode }) {
  return (
    <div id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-display font-semibold mb-4 text-slate-800">{title}</h2>
      <div className="text-slate-600 mb-6 leading-relaxed">{description}</div>
      
      <div className="mb-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Preview</div>
        <div className="p-4 overflow-x-auto">
          {children}
        </div>
      </div>
      
      <LiveCodeEditor language="jsx" title={`${id || 'snippet'}.tsx`}>
        {code}
      </LiveCodeEditor>
    </div>
  );
}

export default function Docs() {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commandCopied, setCommandCopied] = useState(false);

  useEffect(() => {
    const handleToggle = () => {
      setSidebarOpen(prev => !prev);
    };
    window.addEventListener('toggle-docs-sidebar', handleToggle);
    return () => {
      window.removeEventListener('toggle-docs-sidebar', handleToggle);
    };
  }, []);

  useEffect(() => {
    const event = new CustomEvent('docs-sidebar-state', { detail: sidebarOpen });
    window.dispatchEvent(event);
  }, [sidebarOpen]);

  return (
    <div className="flex flex-1 overflow-hidden bg-white relative">
      <SEO 
        title="Documentation" 
        description="Explore the capabilities of EnterpriseGrid with interactive examples and code snippets for each major feature."
        url="https://enterprisegrid.io/docs"
        keywords="EnterpriseGrid Docs, React Data Grid tutorial, React table documentation, developer documentation, API options, custom plugins"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "EnterpriseGrid Documentation",
          "description": "Explore the capabilities of EnterpriseGrid with interactive examples and code snippets for each major feature.",
          "audience": {
            "@type": "Audience",
            "audienceType": "Developers"
          },
          "about": {
            "@type": "SoftwareApplication",
            "name": "EnterpriseGrid",
            "applicationCategory": "DeveloperApplication"
          }
        }}
      />

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed top-16 inset-x-0 bottom-0 bg-slate-900/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-16 bottom-0 left-0 z-40
        w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto
        transform transition-transform duration-300 ease-in-out h-[calc(100vh-4rem)] md:h-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-8">
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Package Distribution</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li>
                <a href="#download-package" className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  NPM Tarball Pack
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">AI & Advanced</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#ai-analytics" className="text-slate-600 hover:text-indigo-600 font-semibold">AI-Driven Analytics</a></li>
              <li><a href="#ai-query-assistant" className="text-slate-600 hover:text-indigo-600 font-semibold">AI Query Assistant</a></li>
              <li><a href="#ai-smart-summary" className="text-slate-600 hover:text-indigo-600 font-semibold">AI Smart Summary</a></li>
              <li><a href="#ai-insights-dashboard" className="text-slate-600 hover:text-indigo-600 font-semibold">AI Insights Dashboard</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Data Views</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#map-view" className="text-slate-600 hover:text-indigo-600 font-semibold">Map View</a></li>
              <li><a href="#calendar-view" className="text-slate-600 hover:text-indigo-600 font-semibold">Calendar View</a></li>
              <li><a href="#saved-views" className="text-slate-600 hover:text-indigo-600 font-semibold">Saved Views</a></li>
              <li><a href="#shareable-views" className="text-slate-600 hover:text-indigo-600 font-semibold">Shareable Views</a></li>
              <li><a href="#multi-view" className="text-slate-600 hover:text-indigo-600 font-semibold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded border border-indigo-100">Multi-View (Kanban, Gallery)</a></li>
              <li><a href="#sparklines" className="text-slate-600 hover:text-indigo-600 font-semibold">Sparkline Charts</a></li>
              <li><a href="#heatmap-cells" className="text-slate-600 hover:text-indigo-600 font-semibold">Heatmap Cells</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Collaboration & Tracking</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#audit-trail" className="text-slate-600 hover:text-indigo-600 font-semibold">Audit Trail</a></li>
              <li><a href="#time-travel" className="text-slate-600 hover:text-indigo-600 font-semibold">Time Travel</a></li>
              <li><a href="#row-comments" className="text-slate-600 hover:text-indigo-600 font-semibold">Row Comments</a></li>
              <li><a href="#favorites-bookmarks" className="text-slate-600 hover:text-indigo-600 font-semibold">Favorites & Bookmarks</a></li>
              <li><a href="#offline-sync" className="text-slate-600 hover:text-indigo-600 font-semibold">Offline Editing & Sync</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Interactive Elements</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#command-palette-section" className="text-slate-600 hover:text-indigo-600 font-semibold">Command Palette</a></li>
              <li><a href="#side-preview-section" className="text-slate-600 hover:text-indigo-600 font-semibold">Side Preview Panel</a></li>
              <li><a href="#plugin-system-section" className="text-slate-600 hover:text-indigo-600 font-semibold">Plugin System</a></li>
              <li><a href="#mobile-swipe-actions-section" className="text-slate-600 hover:text-indigo-600 font-semibold">Mobile Swipe Actions</a></li>
              <li><a href="#theme-builder-section" className="text-slate-600 hover:text-indigo-600 font-semibold">Theme Builder</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Core Features</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#basic-usage" className="text-slate-600 hover:text-indigo-600">Basic Usage</a></li>
              <li><a href="#pagination" className="text-slate-600 hover:text-indigo-600">Pagination</a></li>
              <li><a href="#pagination-server" className="text-slate-600 hover:text-indigo-600">Server-Side Data</a></li>
              <li><a href="#sorting" className="text-slate-600 hover:text-indigo-600">Sorting</a></li>
              <li><a href="#multi-sorting" className="text-slate-600 hover:text-indigo-600">Multi-Sorting</a></li>
              <li><a href="#custom-cells" className="text-slate-600 hover:text-indigo-600">Custom Cells</a></li>
              <li><a href="#filtering" className="text-slate-600 hover:text-indigo-600">Column Filtering</a></li>
              <li><a href="#resizing" className="text-slate-600 hover:text-indigo-600">Column Resizing</a></li>
              <li><a href="#editing" className="text-slate-600 hover:text-indigo-600">Inline Editing</a></li>
              <li><a href="#selection" className="text-slate-600 hover:text-indigo-600">Row Selection</a></li>
              <li><a href="#expandable" className="text-slate-600 hover:text-indigo-600">Expandable Rows</a></li>
              <li><a href="#row-events" className="text-slate-600 hover:text-indigo-600">Row Events</a></li>
              <li><a href="#column-groups" className="text-slate-600 hover:text-indigo-600">Column Groups</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">UI & Styling</h3>
            <ul className="space-y-3 text-sm" onClick={() => setSidebarOpen(false)}>
              <li><a href="#toolbar" className="text-slate-600 hover:text-indigo-600">Toolbar Configuration</a></li>
              <li><a href="#loading" className="text-slate-600 hover:text-indigo-600">Progress Pending</a></li>
              <li><a href="#styling" className="text-slate-600 hover:text-indigo-600">Styling & Interaction</a></li>
              <li><a href="#separators" className="text-slate-600 hover:text-indigo-600">Separators</a></li>
              <li><a href="#title-subheader" className="text-slate-600 hover:text-indigo-600">Title & Actions</a></li>
              <li><a href="#empty-state" className="text-slate-600 hover:text-indigo-600">Empty States</a></li>
              <li><a href="#disabled-state" className="text-slate-600 hover:text-indigo-600">Disabled State</a></li>
              <li><a href="#conditional-styles" className="text-slate-600 hover:text-indigo-600">Conditional Row Styles</a></li>
              <li><a href="#conditional-cell-styles" className="text-slate-600 hover:text-indigo-600">Conditional Cell Styles</a></li>
              <li><a href="#table-footers" className="text-slate-600 hover:text-indigo-600">Table Footers</a></li>
              <li><a href="#fixed-header" className="text-slate-600 hover:text-indigo-600">Fixed Header & Scrolling</a></li>
              <li><a href="#no-table-head" className="text-slate-600 hover:text-indigo-600">Hide Table Head</a></li>
              <li><a href="#responsive-columns" className="text-slate-600 hover:text-indigo-600">Responsive Columns</a></li>
              <li><a href="#column-sizing" className="text-slate-600 hover:text-indigo-600">Column Sizing & Alignment</a></li>
              <li><a href="#column-formatting" className="text-slate-600 hover:text-indigo-600">Column Formatting</a></li>
              <li><a href="#rtl-support" className="text-slate-600 hover:text-indigo-600">RTL Support</a></li>
              <li><a href="#localization" className="text-slate-600 hover:text-indigo-600">Localization</a></li>
              <li><a href="#custom-styles" className="text-slate-600 hover:text-indigo-600">Custom Styles</a></li>
              <li><a href="#themes" className="text-slate-600 hover:text-indigo-600">Theming</a></li>
            </ul>
          </div>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-12">
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Documentation</h1>
            <p className="text-lg text-slate-600">
              Explore the capabilities of EnterpriseGrid with interactive examples and code snippets for each major feature.
            </p>
          </div>

          {/* NPM Package Download Panel */}
          <div id="download-package" className="mb-12 bg-gradient-to-br from-indigo-50 via-white to-emerald-50/40 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm scroll-mt-24">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Reusable NPM Package Build
                </span>
                 <h2 className="text-2xl font-bold text-slate-900">
                  Download Local NPM Package Archive
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  Get the fully compiled, highly-performant production build of <strong>@enterprisegrid/grid</strong> containing ESM/CJS assets and typings. Ready to install in any React project, extract locally, or publish directly to the NPM registry.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <a 
                  href="/enterprisegrid-grid-1.0.1.zip" 
                  download
                  className="h-12 px-5 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/15 select-none cursor-pointer"
                  id="docs-download-zip-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-archive"><path d="M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v18"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="10" cy="14" r="2"/><path d="M10 12v-1"/><path d="M10 18v-2"/></svg>
                  <span>Download .zip Package</span>
                </a>
                <a 
                  href="/enterprisegrid-grid-1.0.1.tgz" 
                  download
                  className="h-12 px-5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 font-semibold flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors select-none cursor-pointer"
                  id="docs-download-tarball-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  <span>Download .tgz Tarball</span>
                </a>
              </div>
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Option A: Install Locally</h4>
                <div className="bg-slate-950 text-indigo-200 p-3.5 rounded-xl font-mono text-xs flex items-center justify-between gap-4 border border-slate-900 h-13">
                  <span className="overflow-x-auto whitespace-nowrap scrollbar-none">npm install ./enterprisegrid-grid-1.0.1.tgz</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("npm install ./enterprisegrid-grid-1.0.1.tgz");
                      setCommandCopied(true);
                      setTimeout(() => setCommandCopied(false), 2000);
                    }}
                    className={`px-3 py-1 rounded-lg border text-[11px] font-semibold transition-all select-none shrink-0 ${
                      commandCopied 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {commandCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Best for testing the fully-compiled bundle locally inside another React project before publishing.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Option B: Publish to NPM Registry</h4>
                <div className="bg-slate-950 text-emerald-300 p-3.5 rounded-xl font-mono text-xs flex items-center justify-between gap-4 border border-emerald-950/50 h-13">
                  <span className="overflow-x-auto whitespace-nowrap scrollbar-none">npm publish ./enterprisegrid-grid-1.0.1.tgz --access public</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("npm publish ./enterprisegrid-grid-1.0.1.tgz --access public");
                    }}
                    className="px-3 py-1 rounded-lg border bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700 text-[11px] font-semibold transition-all select-none shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                  Run this command in your local terminal where your npm CLI is logged in (`npm login`) to publish immediately!
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Complete Step-by-Step Publishing Guide</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/80 border border-slate-200 p-4 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">1</div>
                  <h5 className="font-semibold text-slate-800 text-xs">Download Tarball</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Click the download button above to get the compiled `.tgz` package file.
                  </p>
                </div>
                <div className="bg-white/80 border border-slate-200 p-4 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">2</div>
                  <h5 className="font-semibold text-slate-800 text-xs">Login to NPM</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Open your terminal and authenticate by running <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] text-indigo-600">npm login</code>.
                  </p>
                </div>
                <div className="bg-white/80 border border-slate-200 p-4 rounded-xl space-y-1.5">
                  <div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center justify-center">3</div>
                  <h5 className="font-semibold text-slate-800 text-xs">Publish!</h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Execute the publish command targeting the downloaded `.tgz` tarball to complete release.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <AiAnalyticsPlayground />
          <AiQueryAssistantPlayground />
          <AiSmartSummaryPlayground />
          <AiInsightsDashboardPlayground />
          <MapViewPlayground />
          <CalendarViewPlayground />
          <SavedViewsPlayground />
          <ShareableViewsPlayground />
          <AuditTrailPlayground />
          <TimeTravelPlayground />
          <RowCommentsPlayground />
          <SparklinePlayground />
          <HeatmapPlayground />
          <BookmarksPlayground />
          <CommandPalettePlayground />
          <SidePreviewPlayground />
          <PluginSystemPlayground />
          <MobileSwipeActionsPlayground />
          <ThemeBuilderPlayground />
          <OfflineSyncPlayground />
          <MultiViewPlayground />
          <CellEditingPlayground />

          <FeaturesConfigPlayground />
          <LayoutAppearancePlayground />
          <ThemingStylingPlayground />
          <AdvancedSortingPlayground />
          <AdvancedPaginationPlayground />
          <AdvancedFooterPlayground />
          <AdvancedRowSelectionPlayground />
          <AdvancedExpandableRowsPlayground />
          <AdvancedRowEventsPlayground />
          <ColumnFeaturesPlayground />
          <LocalizationPlayground />

          <DocSection
            id="custom-styles"
            title="Custom Styles"
            description={
              <p>
                Override default component styles using the <code>customStyles</code> prop. It allows you to inject inline styles or CSS classes into specific table components like <code>rows</code>, <code>headRow</code>, <code>cells</code>, etc.
              </p>
            }
            code={`<DataTable\n  columns={columns}\n  data={data}\n  customStyles={{\n    headRow: { style: { backgroundColor: '#f1f5f9', borderTop: '2px solid #6366f1' } },\n    rows: { style: { minHeight: '64px', fontSize: '15px' } },\n  }}\n  config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}\n/>`}
          >
            <DataTable 
              columns={mockColumns} 
              data={mockData.slice(0, 3)} 
              customStyles={{
                headRow: { style: { backgroundColor: '#f1f5f9', borderTop: '2px solid #6366f1' } },
                rows: { style: { minHeight: '64px', fontSize: '15px' } },
              }}
              config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }} 
            />
          </DocSection>

          <DocSection
            id="themes"
            title="Theming & Custom Theme Builder"
            description={
              <p>
                Set the table theme using the <code>theme</code> prop. You can choose from built-in themes (<code>light</code>, <code>dark</code>) or define custom ones using the <code>createTheme</code> utility.
                Use our interactive <strong>Theme Builder</strong> above to build and export custom registration code in real time!
              </p>
            }
            code={`import { createTheme } from '@enterprisegrid/grid';\n\n// 1. Create your custom theme\ncreateTheme('custom-dark', {\n  text: { primary: '#f8fafc', secondary: '#cbd5e1' },\n  background: { default: '#0f172a' },\n  divider: { default: '#1e293b' },\n});\n\n// 2. Apply theme to DataTable\n<DataTable\n  columns={columns}\n  data={data}\n  theme="custom-dark"\n  config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }}\n/>`}
          >
            <div className="bg-slate-900 p-4 -m-4">
              <DataTable 
                columns={mockColumns} 
                data={mockData.slice(0, 3)} 
                theme="dark"
                config={{ searchable: false, exportable: false, densityToggle: false, columnVisibility: false }} 
              />
            </div>
          </DocSection>

        </div>
        <Footer />
      </div>
    </div>
  );
}
