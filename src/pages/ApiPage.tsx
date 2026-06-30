import { SEO } from '../components/SEO';
import Footer from '../components/Footer';

export default function ApiPage() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col bg-slate-50/50">
      <SEO 
        title="API Reference" 
        description="Complete list of all available props and configurations for the EnterpriseGrid component."
        url="https://enterprisegrid.io/api"
        keywords="React table props, EnterpriseGrid API, data table configurations, custom selectors, conditional styling, event handlers, interactive columns"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "TechArticle",
          "headline": "EnterpriseGrid API Reference",
          "description": "Complete list of all available props and configurations for the EnterpriseGrid component.",
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
      <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
      <h1 className="text-4xl font-bold mb-8 text-slate-800">API Reference</h1>
      <p className="text-slate-600 mb-12">Below is a list of all available props for the EnterpriseGrid component.</p>
      
      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50">
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-48">Property</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32">Type</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-32 text-center">Required</th>
              <th className="p-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Description</th>
            </tr>
          </thead>
          <tbody className="text-sm text-slate-600">
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Core Configuration</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">columns</td>
              <td className="p-4 font-mono text-xs text-orange-600">Array</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Yes</span></td>
              <td className="p-4">The column configuration array.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">data</td>
              <td className="p-4 font-mono text-xs text-orange-600">Array</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">Yes</span></td>
              <td className="p-4">The data array to populate the table.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">keyField</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Property on each row used as a stable React key. Defaults to "id".</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">id</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Unique identifier for the datatable. Required when using Saved Views to store configuration per table.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">config</td>
              <td className="p-4 font-mono text-xs text-orange-600">Config</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Global toolbar capabilities (pagination, selectableRows, calendarView, mapView, savedViews, shareableViews, etc).</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Header & Toolbar</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">title</td>
              <td className="p-4 font-mono text-xs text-orange-600">string | ReactNode</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Table title shown in the header bar.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">actions</td>
              <td className="p-4 font-mono text-xs text-orange-600">ReactNode | ReactNode[]</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Content rendered on the right side of the header bar.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">subHeader</td>
              <td className="p-4 font-mono text-xs text-orange-600">ReactNode</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Content for the sub-header bar. Providing any value shows the bar.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">subHeaderAlign</td>
              <td className="p-4 font-mono text-xs text-orange-600">Alignment</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Alignment of sub-header content: "left", "right", or "center" (default: "right").</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">subHeaderWrap</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Allow sub-header to wrap onto multiple lines (default: true).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">noHeader</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Hide the title/actions header bar entirely (default: false).</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Layout & Display</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">noTableHead</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Hide the column header row (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">persistTableHead</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Show the column header even when data is empty. The header always stays visible during progressPending regardless of this prop (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">dense</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Reduce row height for a compact look (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">responsive</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Wrap the table in a horizontally scrollable container (default: true).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">fixedHeader</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Stick the column header at the top when scrolling (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">fixedHeaderScrollHeight</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Max height of the scrollable body when fixedHeader is on (default: "100vh").</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">direction</td>
              <td className="p-4 font-mono text-xs text-orange-600">Direction</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Text direction on the root element: "ltr", "rtl", or "auto" (default: "ltr").</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">className</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Extra CSS class to append to the root element.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">style</td>
              <td className="p-4 font-mono text-xs text-orange-600">Object</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Inline styles on the root element.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">ariaLabel</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Value for the table's aria-label attribute.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Selection</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to show checkboxes to select rows (default: false). Takes precedence over configuration config block values.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsSingle</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Restricts selection to one row at a time. Multi-select header checkbox is automatically omitted (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsNoSelectAll</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Hides the "Select All" checkbox in the table header (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsVisibleOnly</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">If true, clicking the "Select All" header checkbox affects only the visible rows on the current page (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsHighlight</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Highlights selected rows using the theme-defined selection background color (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsRange</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Enables Shift + Click range selection. Automatically disabled in single-select mode (default: true).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowDisabled</td>
              <td className="p-4 font-mono text-xs text-orange-600">(row: T) =&gt; boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">A predicate function that disables checkboxes and selections for rows returning true.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowSelected</td>
              <td className="p-4 font-mono text-xs text-orange-600">(row: T) =&gt; boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">A predicate function to pre-select rows on initial mount if they return true.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectedRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">T[]</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Controlled state of selected rows. Uses the specified keyField to match selection identity.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsComponent</td>
              <td className="p-4 font-mono text-xs text-orange-600">ComponentType&lt;any&gt; | string</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Overrides the standard input checkbox element with a custom React component (default: "input").</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">selectableRowsComponentProps</td>
              <td className="p-4 font-mono text-xs text-orange-600">Object</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Additional props to pass down to the custom selectableRowsComponent.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">onSelectedRowsChange</td>
              <td className="p-4 font-mono text-xs text-orange-600">Function</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Callback executed whenever selected rows change. Receives <code>{`{ allSelected, selectedCount, selectedRows }`}</code>.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">ref.current.clearSelectedRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">() =&gt; void</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">An imperative handle method exposed via React ref to clear all currently selected rows programmatically.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">AI Features</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-indigo-50/30">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">enableAiQuery</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Enable the built-in natural language AI Query Assistant search bar in the toolbar (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-indigo-50/30">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onAiQuery</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(query: string) => Promise<T[]>`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback to handle natural language queries. Return a promise that resolves to the filtered dataset. Automatically manages the "isSearching" loading state.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-indigo-50/30">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">enableAiInsights</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Enable the built-in AI Insights dashboard generator button (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-indigo-50/30">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onAiInsights</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(data: T[]) => Promise<Insight[]>`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback to handle generation of insights. Returns a promise resolving to an array of insights objects.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Expandable Rows</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Enables expandable rows to support visual drill-downs for master-detail records (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRowsComponent</td>
              <td className="p-4 font-mono text-xs text-orange-600">ComponentType&lt;{`{ data: T }`}&gt;</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">The custom React component rendered inside the expanded area. Receives the row's record under the <code>data</code> prop.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRowsComponentProps</td>
              <td className="p-4 font-mono text-xs text-orange-600">Object</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Additional custom properties passed down directly to the <code>expandableRowsComponent</code>.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRowExpanded</td>
              <td className="p-4 font-mono text-xs text-orange-600">(row: T) =&gt; boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">A predicate function that determines which rows are expanded initially on initial mount.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRowDisabled</td>
              <td className="p-4 font-mono text-xs text-orange-600">(row: T) =&gt; boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">A predicate function that prevents specific rows from being expanded when they return true.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableRowsHideExpander</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Hides the default expand/collapse icon chevron column. Typically used with <code>expandOnRowClicked</code> (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandOnRowClicked</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Expands or collapses a row when its cells are clicked (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandOnRowDoubleClicked</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Expands or collapses a row on double-clicking a cell (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableInheritConditionalStyles</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Applies the parent row's active conditional styling rules to the expanded detail panel (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">expandableIcon</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`{ collapsed: ReactNode, expanded: ReactNode }`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Overrides the standard chevron icons for row expansion with custom React nodes.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowExpandToggled</td>
              <td className="p-4 font-mono text-xs text-orange-600">(expanded: boolean, row: T) =&gt; void</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when a row is expanded or collapsed. Receives the expanded state and the corresponding row data.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">expandableRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether rows can be expanded.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Row Events</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowClicked</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(row: T, event: MouseEvent) => void`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when a row is left-clicked. Receives the corresponding row's record and the native React mouse event.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowDoubleClicked</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(row: T, event: MouseEvent) => void`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when a row is double-clicked. Receives the corresponding row's record and the native React mouse event.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowMiddleClicked</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(row: T, event: MouseEvent) => void`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when a row is middle-clicked (scroll wheel click). Perfect for launching custom browser tabs or background operations.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowMouseEnter</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(row: T, event: MouseEvent) => void`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when the user's cursor mouse enters a row boundary.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors bg-emerald-50/20">
              <td className="p-4 font-mono text-xs text-indigo-600 font-semibold">onRowMouseLeave</td>
              <td className="p-4 font-mono text-xs text-orange-600">{`(row: T, event: MouseEvent) => void`}</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">New</span></td>
              <td className="p-4">Callback event triggered when the user's cursor mouse leaves a row boundary.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Legacy Config Booleans</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">sortable</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to enable sorting for columns.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">searchable</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to enable global search functionality.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">animations</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Enable Framer Motion row animations.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">exportable</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Show CSV export button in the table header.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">densityToggle</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Allow users to toggle padding and density.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">columnVisibility</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Allow users to show/hide specific columns.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">theme</td>
              <td className="p-4 font-mono text-xs text-orange-600">String</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">The theme to use (e.g. 'dark' or custom).</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Styling & UI States</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">progressPending</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Show a loading state. Initial loading renders shimmer skeleton rows. Re-fetching dims existing data and overlays a centered spinner.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">progressComponent</td>
              <td className="p-4 font-mono text-xs text-orange-600">ReactNode</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Custom loading indicator or spinner to override the built-in default spinner.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">noDataComponent</td>
              <td className="p-4 font-mono text-xs text-orange-600">ReactNode</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Custom message or component rendered when the dataset is empty.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">striped</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to alternate row background colors for improved legibility (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">highlightOnHover</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to highlight table rows on mouse hover (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">pointerOnHover</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Whether to show a pointer cursor when hovering over rows (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">columnSeparator</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean | "subtle" | "full"</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Vertical lines between body columns. true/"subtle" = inset 60%-height line, "full" = full-height line (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">headerSeparator</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean | "subtle" | "full"</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Vertical lines between header cells. true/"subtle" = inset line, "full" = full-height, false = none (default: true).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">animateRows</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Staggered entrance and sort animations using Framer Motion (default: false).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">customStyles</td>
              <td className="p-4 font-mono text-xs text-orange-600">TableStyles</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Fine-grained CSS custom styling overrides for header, headCells, rows, and pagination cells.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">conditionalRowStyles</td>
              <td className="p-4 font-mono text-xs text-orange-600">ConditionalStyles[]</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Apply custom styles or class names dynamically to rows matching specific condition predicates.</td>
            </tr>
            <tr className="bg-slate-100/80 border-b border-slate-200">
              <td colSpan={4} className="p-4 font-semibold text-slate-800 text-xs tracking-wider uppercase">Advanced Features</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">onScroll</td>
              <td className="p-4 font-mono text-xs text-orange-600">Function</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Callback function called when the user scrolls the table body. Works with both fixedHeader enabled and disabled.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">disabled</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Disable all interactive controls: checkboxes, pagination buttons, column sorting, search input, settings dropdown, export button.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">pagination</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Enable or disable built-in pagination.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">showFooter</td>
              <td className="p-4 font-mono text-xs text-orange-600">Boolean</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Controls whether the footer is rendered. By default, the footer appears automatically when a custom footerComponent is provided or when at least one column defines a footer. Set false to hide it, or true to always render.</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">calendarConfig</td>
              <td className="p-4 font-mono text-xs text-orange-600">Object</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Configuration for calendar view mapping (dateField, endDateField, titleField).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">mapConfig</td>
              <td className="p-4 font-mono text-xs text-orange-600">Object</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Configuration for map view mapping (latField, lngField, titleField).</td>
            </tr>
<tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              <td className="p-4 font-mono text-xs text-indigo-600">footerComponent</td>
              <td className="p-4 font-mono text-xs text-orange-600">ComponentType&lt;FooterProps&gt;</td>
              <td className="p-4 text-center"><span className="px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">No</span></td>
              <td className="p-4">Replaces the entire footer row with a custom component. Receives context props of {`{ rows, columns }`}. Column-level footers are bypassed when this is provided.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <Footer />
  </div>
  );
}
