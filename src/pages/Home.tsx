import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Copy, Check, ChevronRight, Star, Download, Calendar, LayoutGrid, ArrowUpDown, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useState, useRef, useMemo, forwardRef, useEffect } from 'react';
import { SEO } from '../components/SEO';
import Footer from '../components/Footer';
import { DataTable as EnterpriseGridDemo, createTheme } from '@enterprisegrid/grid';
import type { DataTableHandle, Direction, Alignment } from '@enterprisegrid/grid';

const today = new Date();
const todayStr = today.toISOString().split('T')[0];
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().split('T')[0];
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayStr = yesterday.toISOString().split('T')[0];

const initialData = [
  { id: 1, title: 'Beetlejuice', year: '1988', director: 'Tim Burton', lat: 34.0522, lng: -118.2437, date: todayStr, trend: [45, 52, 49, 63, 58, 67, 72, 85, 78, 92], rating: 4.2 },
  { id: 2, title: 'Ghostbusters', year: '1984', director: 'Ivan Reitman', lat: 40.7128, lng: -74.0060, date: tomorrowStr, trend: [68, 72, 70, 78, 85, 82, 89, 94, 91, 98], rating: 4.5 },
  { id: 3, title: 'The Matrix', year: '1999', director: 'Lana Wachowski, Lilly Wachowski', lat: -33.8688, lng: 151.2093, date: yesterdayStr, trend: [95, 92, 90, 88, 85, 82, 80, 83, 85, 89], rating: 4.9 },
  { id: 4, title: 'Inception', year: '2010', director: 'Christopher Nolan', lat: 51.5074, lng: -0.1278, date: todayStr, trend: [75, 78, 82, 80, 85, 89, 93, 91, 95, 99], rating: 4.8 },
  { id: 5, title: 'Interstellar', year: '2014', director: 'Christopher Nolan', lat: 64.1466, lng: -21.9426, date: tomorrowStr, trend: [80, 83, 85, 84, 88, 90, 92, 95, 98, 102], rating: 4.7 },
  { id: 6, title: 'Pulp Fiction', year: '1994', director: 'Quentin Tarantino', lat: 34.0522, lng: -118.2437, date: yesterdayStr, trend: [90, 88, 85, 87, 82, 80, 78, 75, 79, 82], rating: 4.9 },
  { id: 7, title: 'The Shawshank Redemption', year: '1994', director: 'Frank Darabont', lat: 40.7587, lng: -82.5221, date: todayStr, trend: [98, 99, 100, 97, 98, 99, 100, 99, 100, 102], rating: 5.0 },
  { id: 8, title: 'The Godfather', year: '1972', director: 'Francis Ford Coppola', lat: 40.7128, lng: -74.0060, date: tomorrowStr, trend: [92, 94, 93, 95, 91, 90, 92, 94, 93, 96], rating: 5.0 },
  { id: 9, title: 'The Dark Knight', year: '2008', director: 'Christopher Nolan', lat: 41.8781, lng: -87.6298, date: yesterdayStr, trend: [88, 90, 92, 95, 93, 96, 98, 100, 99, 104], rating: 4.9 },
  { id: 10, title: 'Schindler\'s List', year: '1993', director: 'Steven Spielberg', lat: 50.0647, lng: 19.9450, date: todayStr, trend: [70, 72, 75, 73, 78, 80, 82, 85, 84, 88], rating: 4.9 },
  { id: 11, title: 'Forrest Gump', year: '1994', director: 'Robert Zemeckis', lat: 32.0809, lng: -81.0912, date: tomorrowStr, trend: [85, 84, 86, 88, 89, 91, 93, 92, 95, 97], rating: 4.6 },
  { id: 12, title: 'Star Wars: Episode V', year: '1980', director: 'Irvin Kershner', lat: 60.5518, lng: -6.4080, date: yesterdayStr, trend: [78, 82, 80, 85, 89, 87, 91, 95, 93, 98], rating: 4.8 },
  { id: 13, title: 'Goodfellas', year: '1990', director: 'Martin Scorsese', lat: 40.7128, lng: -74.0060, date: todayStr, trend: [82, 80, 83, 85, 82, 81, 84, 88, 86, 90], rating: 4.7 },
  { id: 14, title: 'The Lord of the Rings', year: '2003', director: 'Peter Jackson', lat: -41.2865, lng: 174.7762, date: tomorrowStr, trend: [94, 96, 95, 98, 97, 99, 100, 102, 101, 105], rating: 4.9 },
  { id: 15, title: 'Spirited Away', year: '2001', director: 'Hayao Miyazaki', lat: 35.6762, lng: 139.6503, date: yesterdayStr, trend: [72, 75, 78, 76, 80, 83, 85, 89, 87, 92], rating: 4.5 },
];

createTheme('enterprisegrid-brand', {
  text: {
    primary: '#1e293b',
    secondary: '#4f46e5',
  },
  background: {
    default: '#f8fafc',
  },
  context: {
    background: '#4f46e5',
    text: '#ffffff',
  },
  divider: {
    default: '#e2e8f0',
  },
  action: {
    button: '#6366f1',
    hover: 'rgba(79, 70, 229, 0.08)',
    disabled: 'rgba(15, 23, 42, 0.12)',
  },
}, 'light');

const CustomLoader = () => (
  <div className="flex flex-col items-center gap-3 bg-white border border-slate-200 p-6 rounded-xl shadow-lg m-4">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
    <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">Loading Database...</span>
  </div>
);

const CustomEmptyState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-indigo-50/30 border border-indigo-100/50 rounded-2xl m-4 text-center">
    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3">
      <LayoutGrid className="w-6 h-6 stroke-2" />
    </div>
    <h4 className="text-sm font-bold text-slate-800">Your Movie List is Empty</h4>
    <p className="text-xs text-slate-500 max-w-xs mt-1">Try toggling off "Simulate Empty Data" in the controls below to see your film list again.</p>
  </div>
);

const CustomPagination = ({ rowsPerPage, rowCount, onChangePage, onChangeRowsPerPage, currentPage }: any) => {
  const totalPages = Math.ceil(rowCount / rowsPerPage);
  return (
    <div className="p-3.5 bg-slate-900 text-slate-100 rounded-b-xl flex flex-wrap justify-between items-center gap-4 text-xs font-sans">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
        <span>Total: <span className="font-mono font-bold text-indigo-300">{rowCount}</span> movies</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-slate-800 font-semibold transition-colors disabled:cursor-not-allowed border border-slate-700"
          disabled={currentPage === 1}
          onClick={() => onChangePage(currentPage - 1)}
        >
          &larr; Previous
        </button>
        <span className="text-slate-400 font-medium">Page {currentPage} of {totalPages || 1}</span>
        <button
          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-lg disabled:opacity-30 disabled:hover:bg-slate-800 font-semibold transition-colors disabled:cursor-not-allowed border border-slate-700"
          disabled={currentPage >= totalPages}
          onClick={() => onChangePage(currentPage + 1)}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
};

const CustomSummaryFooter = ({ rows, columns }: any) => {
  const validYears = rows
    .map((r: any) => parseInt(r.year))
    .filter((y: any) => !isNaN(y));
  const avgYear = validYears.length 
    ? Math.round(validYears.reduce((sum: number, y: number) => sum + y, 0) / validYears.length) 
    : 'N/A';

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-850 text-white font-sans text-[11px] px-4 py-3 rounded-b-xl border-t border-slate-700 flex flex-wrap items-center justify-between gap-4 shadow-inner">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
        <span className="font-semibold text-indigo-200">Custom Summary Footer</span>
      </div>
      <div className="flex gap-4 font-mono text-slate-300">
        <div>Total Rows: <span className="text-white font-bold">{rows.length}</span></div>
        <div>Total Columns: <span className="text-white font-bold">{columns.length}</span></div>
        <div>Avg Release Year: <span className="text-indigo-300 font-bold">{avgYear}</span></div>
      </div>
    </div>
  );
};

const CustomCheckbox = forwardRef(({ checked, onChange, disabled, type, ...rest }: any, ref: any) => {
  return (
    <span 
      ref={ref}
      onClick={(e) => {
        if (disabled) return;
        onChange?.(e);
      }}
      className={`inline-flex items-center justify-center w-5 h-5 rounded-md border cursor-pointer transition-all ${
        checked 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-105' 
          : 'bg-white border-slate-300 text-transparent hover:border-indigo-400'
      } ${disabled ? 'opacity-40 cursor-not-allowed bg-slate-50 border-slate-200' : ''}`}
      {...rest}
    >
      <Check className={`w-3.5 h-3.5 stroke-[3px] transition-transform ${checked ? 'scale-100' : 'scale-0 text-white'}`} />
    </span>
  );
});
CustomCheckbox.displayName = 'CustomCheckbox';

const ExpandedMovieComponent = ({ data, showRating = true }: any) => {
  const plots: Record<number, string> = {
    1: "A couple of recently deceased ghosts contract the services of a 'bio-exorcist' in order to scare away the obnoxious new owners of their former home.",
    2: "Three parapsychologists forced out of their university funding setup a unique ghost-removal service in New York City, attracting frightened yet skeptical customers.",
    3: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    4: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project.",
    5: "When Earth becomes uninhabitable, a team of explorers travels through a wormhole in space in an attempt to ensure humanity's survival.",
    6: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    7: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    8: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    9: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    10: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis."
  };

  const ratings: Record<number, string> = {
    1: "★ 7.5/10 (IMDb)",
    2: "★ 7.8/10 (IMDb)",
    3: "★ 8.7/10 (IMDb)",
    4: "★ 8.8/10 (IMDb)",
    5: "★ 8.6/10 (IMDb)",
    6: "★ 8.9/10 (IMDb)",
    7: "★ 9.3/10 (IMDb)",
    8: "★ 9.2/10 (IMDb)",
    9: "★ 9.0/10 (IMDb)",
    10: "★ 9.0/10 (IMDb)"
  };

  const plot = plots[data.id] || "No plot synopsis is available for this vintage film selection.";
  const rating = ratings[data.id] || "★ 8.0/10 (IMDb)";

  return (
    <div className="p-4 sm:p-5 bg-indigo-50/40 rounded-xl border border-indigo-100/50 flex flex-col sm:flex-row gap-4 text-xs">
      <div className="flex-1 flex flex-col gap-1.5">
        <h4 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
          <span>🎬 {data.title} Details</span>
          <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-700 font-semibold rounded-full">{data.year}</span>
        </h4>
        <p className="text-slate-600 leading-relaxed font-medium">{plot}</p>
        <p className="text-slate-400">Directed by <span className="font-semibold text-slate-500">{data.director}</span></p>
      </div>
      {showRating && (
        <div className="sm:w-40 flex sm:flex-col justify-between sm:justify-center items-start sm:items-center bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm gap-2 shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Audience Score</span>
          <span className="text-indigo-600 font-bold text-sm sm:text-base font-mono">{rating}</span>
          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-100">Recommended</span>
        </div>
      )}
    </div>
  );
};

import LiveCodeEditor from '../components/LiveCodeEditor';

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    pagination: true,
    selectableRows: true,
    expandableRows: true,
    sortable: true,
    searchable: true,
    exportable: true,
    densityToggle: true,
    columnVisibility: true,
    animations: true,
    mapView: true,
    calendarView: true,
    savedViews: true,
    shareableViews: true,
    auditTrail: true,
    timeTravel: true,
    rowComments: true,
    heatmapCells: true,
    bookmarks: true,
    commandPalette: true,
    progressPending: false,
    simulateEmptyData: false,
    customProgressComponent: false,
    customNoDataComponent: false,
    keyField: 'id',
  });

  // Layout & Appearance states
  const [titleText, setTitleText] = useState('My Custom Movie Directory');
  const [hasCustomTitle, setHasCustomTitle] = useState(true);
  const [noHeader, setNoHeader] = useState(false);
  const [noTableHead, setNoTableHead] = useState(false);
  const [persistTableHead, setPersistTableHead] = useState(false);
  const [dense, setDense] = useState(false);
  const [responsive, setResponsive] = useState(true);
  const [fixedHeader, setFixedHeader] = useState(false);
  const [fixedHeaderScrollHeight, setFixedHeaderScrollHeight] = useState('250px');
  const [hasSubHeader, setHasSubHeader] = useState(false);
  const [subHeaderAlign, setSubHeaderAlign] = useState<any>('right');
  const [subHeaderWrap, setSubHeaderWrap] = useState(true);
  const [direction, setDirection] = useState<any>('ltr');
  const [disabled, setDisabled] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [hasCustomActions, setHasCustomActions] = useState(false);
  const [actionClicked, setActionClicked] = useState(false);

  // Theming & Styling states
  const [selectedTheme, setSelectedTheme] = useState<'default' | 'dark' | 'enterprisegrid-brand'>('default');
  const [striped, setStriped] = useState(false);
  const [highlightOnHover, setHighlightOnHover] = useState(true);
  const [pointerOnHover, setPointerOnHover] = useState(true);
  const [columnSeparator, setColumnSeparator] = useState<'none' | 'subtle' | 'full'>('none');
  const [headerSeparator, setHeaderSeparator] = useState<'none' | 'subtle' | 'full'>('subtle');
  const [animateRows, setAnimateRows] = useState(true);
  const [useCustomStyles, setUseCustomStyles] = useState(false);
  const [useConditionalRowStyles, setUseConditionalRowStyles] = useState(false);

  // Sorting Feature states
  const tableRef = useRef<DataTableHandle>(null);
  const [sortMulti, setSortMulti] = useState(true);
  const [sortServer, setSortServer] = useState(false);
  const [useDefaultSort, setUseDefaultSort] = useState(false);
  const [defaultSortFieldId, setDefaultSortFieldId] = useState<'title' | 'year' | 'director'>('year');
  const [defaultSortAsc, setDefaultSortAsc] = useState(true);
  const [useCustomSortFunction, setUseCustomSortFunction] = useState(false);
  const [useCustomSortIcon, setUseCustomSortIcon] = useState(false);
  const [lastSortLog, setLastSortLog] = useState<string>('No sort events fired yet');

  // Pagination Feature states
  const [paginationPerPage, setPaginationPerPage] = useState<number>(5);
  const [paginationPosition, setPaginationPosition] = useState<'top' | 'bottom' | 'both'>('bottom');
  const [paginationRowsPerPageOptions] = useState<number[]>([5, 10, 15, 20]);
  const [paginationDefaultPage] = useState<number>(1);
  const [paginationPage, setPaginationPage] = useState<number | undefined>(undefined);
  const [paginationResetDefaultPage, setPaginationResetDefaultPage] = useState<boolean>(false);
  const [paginationServer, setPaginationServer] = useState<boolean>(false);
  const [useCustomPaginationIcons, setUseCustomPaginationIcons] = useState<boolean>(false);
  const [useCustomPaginationComponent, setUseCustomPaginationComponent] = useState<boolean>(false);
  const [noRowsPerPage, setNoRowsPerPage] = useState<boolean>(false);
  const [rowsPerPageText, setRowsPerPageText] = useState<string>('Rows per page:');
  const [rangeSeparatorText, setRangeSeparatorText] = useState<string>('of');
  const [lastPaginationLog, setLastPaginationLog] = useState<string>('No pagination events fired yet');

  // Server pagination simulated state
  const [serverPage, setServerPage] = useState<number>(1);
  const [serverRowsPerPage, setServerRowsPerPage] = useState<number>(5);

  // Footer Feature states
  const [showFooterState, setShowFooterState] = useState<'auto' | 'true' | 'false'>('auto');
  const [useCustomFooterComponent, setUseCustomFooterComponent] = useState<boolean>(false);
  const [colFooterTitleText, setColFooterTitleText] = useState<string>('Total Movies');
  const [colFooterDirectorText, setColFooterDirectorText] = useState<string>('Count: 15');
  const [colFooterYearText, setColFooterYearText] = useState<string>('Avg: 1995');

  // Row Selection Feature states
  const [selectableRowsSingle, setSelectableRowsSingle] = useState<boolean>(false);
  const [selectableRowsNoSelectAll, setSelectableRowsNoSelectAll] = useState<boolean>(false);
  const [selectableRowsVisibleOnly, setSelectableRowsVisibleOnly] = useState<boolean>(false);
  const [selectableRowsHighlight, setSelectableRowsHighlight] = useState<boolean>(true);
  const [selectableRowsRange, setSelectableRowsRange] = useState<boolean>(true);
  const [disableThirdAndFifth, setDisableThirdAndFifth] = useState<boolean>(false);
  const [preselectEven, setPreselectEven] = useState<boolean>(false);
  const [useCustomCheckbox, setUseCustomCheckbox] = useState<boolean>(false);
  const [selectedRowsState, setSelectedRowsState] = useState<any[] | undefined>(undefined);
  const [lastSelectionLog, setLastSelectionLog] = useState<string>('No selection events fired yet');
  
  // AI Insights Feature states
  const [currentSelectedRows, setCurrentSelectedRows] = useState<any[]>([]);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [insightsText, setInsightsText] = useState<string | null>(null);

  const generateInsights = async () => {
    setIsGeneratingInsights(true);
    setInsightsText(null);
    try {
      const dataToAnalyze = currentSelectedRows.length > 0 ? currentSelectedRows : activeData;
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          data: dataToAnalyze, 
          title: hasCustomTitle ? titleText : 'Grid Data' 
        })
      });
      if (!response.ok) throw new Error('Failed to fetch insights');
      const result = await response.json();
      setInsightsText(result.insights);
    } catch (err) {
      console.error(err);
      setInsightsText('Error generating insights. Make sure the server is running and GEMINI_API_KEY is set in .env.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  // Expandable Rows Feature states
  const [expandOnRowClicked, setExpandOnRowClicked] = useState<boolean>(true);
  const [expandOnRowDoubleClicked, setExpandOnRowDoubleClicked] = useState<boolean>(false);
  const [expandableRowsHideExpander, setExpandableRowsHideExpander] = useState<boolean>(false);
  const [expandableInheritConditionalStyles, setExpandableInheritConditionalStyles] = useState<boolean>(false);
  const [useCustomExpandIcons, setUseCustomExpandIcons] = useState<boolean>(false);
  const [expandMovie4ByDefault, setExpandMovie4ByDefault] = useState<boolean>(false);
  const [disableMovie2Expansion, setDisableMovie2Expansion] = useState<boolean>(false);
  const [showRatingInExpanded, setShowRatingInExpanded] = useState<boolean>(true);
  const [lastExpandLog, setLastExpandLog] = useState<string>('No row expansion events fired yet');

  // Row Events Feature states
  const [enableRowClicked, setEnableRowClicked] = useState<boolean>(true);
  const [enableRowDoubleClicked, setEnableRowDoubleClicked] = useState<boolean>(true);
  const [enableRowMiddleClicked, setEnableRowMiddleClicked] = useState<boolean>(true);
  const [enableRowMouseEnter, setEnableRowMouseEnter] = useState<boolean>(false);
  const [enableRowMouseLeave, setEnableRowMouseLeave] = useState<boolean>(false);
  const [lastRowEventLog, setLastRowEventLog] = useState<string>('No Row Interaction Events fired yet. Hover, click, double-click or middle-click on any row above!');

  // Column Features API states
  const [colResizable, setColResizable] = useState<boolean>(true);
  const [colGrouping, setColGrouping] = useState<boolean>(true);
  const [groupAlign, setGroupAlign] = useState<'left' | 'center' | 'right'>('center');
  const [groupReorder, setGroupReorder] = useState<boolean>(true);
  const [groupCustomJSX, setGroupCustomJSX] = useState<boolean>(true);
  const [lastColumnOrderLog, setLastColumnOrderLog] = useState<string>('No column reorder events fired yet');
  const [lastColumnGroupOrderLog, setLastColumnGroupOrderLog] = useState<string>('No column group reorder events fired yet');
  const [lastColumnFilterLog, setLastColumnFilterLog] = useState<string>('No column filter events fired yet');

  // Localization Feature states
  const [localeType, setLocaleType] = useState<string>('en');
  const [useLegacyLocalizationProps, setUseLegacyLocalizationProps] = useState<boolean>(false);

  const localizationObj = useMemo(() => {
    if (useLegacyLocalizationProps) return undefined;
    
    if (localeType === 'ta') {
      return {
        pagination: {
          rowsPerPage: "ஒரு பக்கத்தில் வரிசைகள்",
          nextPage: "அடுத்த பக்கம்",
          previousPage: "முந்தைய பக்கம்",
          firstPage: "முதல் பக்கம்",
          lastPage: "கடைசி பக்கம்",
        },
        filter: {
          apply: "பயன்படுத்து",
          clear: "அழி",
        },
        expandable: {
          expand: "விரிவாக்கு",
          collapse: "சுருக்கு",
        },
      };
    }
    
    if (localeType === 'en-custom') {
      return {
        pagination: {
          rowsPerPage: "Items per page",
          nextPage: "Next Page",
          previousPage: "Previous Page",
          firstPage: "First Index",
          lastPage: "Last Index",
        },
        filter: {
          apply: "Search",
          clear: "Reset",
        },
        expandable: {
          expand: "Show Details",
          collapse: "Hide Details",
        },
      };
    }

    if (localeType === 'en-accessibility') {
      return {
        pagination: {
          nextPageAriaLabel: "Navigate to the next screen of results",
          previousPageAriaLabel: "Navigate to the previous screen of results",
        },
      };
    }

    return undefined;
  }, [localeType, useLegacyLocalizationProps]);

  const columnFilterOptionsObj = useMemo(() => {
    if (!useLegacyLocalizationProps) return undefined;
    return {
      applyText: localeType === 'ta' ? "பயன்படுத்து" : localeType === 'en-custom' ? "Search" : "Done",
      clearText: localeType === 'ta' ? "அழி" : localeType === 'en-custom' ? "Reset" : "Clear",
    };
  }, [localeType, useLegacyLocalizationProps]);

  const expandableRowsOptionsObj = useMemo(() => {
    if (!useLegacyLocalizationProps) return undefined;
    return {
      expandText: localeType === 'ta' ? "விரிவாக்கு" : localeType === 'en-custom' ? "Show Details" : "Expand",
      collapseText: localeType === 'ta' ? "சுருக்கு" : localeType === 'en-custom' ? "Hide Details" : "Collapse",
    };
  }, [localeType, useLegacyLocalizationProps]);

  const expandableRowExpanded = useMemo(() => {
    if (!expandMovie4ByDefault) return undefined;
    return (row: any) => row.id === 4;
  }, [expandMovie4ByDefault]);

  const expandableRowDisabled = useMemo(() => {
    if (!disableMovie2Expansion) return undefined;
    return (row: any) => row.id === 2;
  }, [disableMovie2Expansion]);

  const selectableRowDisabled = useMemo(() => {
    if (!disableThirdAndFifth) return undefined;
    return (row: any) => row.id === 3 || row.id === 5;
  }, [disableThirdAndFifth]);

  const selectableRowSelected = useMemo(() => {
    if (!preselectEven) return undefined;
    return (row: any) => row.id % 2 === 0;
  }, [preselectEven]);

  const customColumns = useMemo(() => {
    return [
      { 
        name: 'Title', 
        selector: (row: any) => row.title, 
        cell: (row: any) => <strong className="text-indigo-600">{row.title}</strong>,
        sortable: true, 
        id: 'title',
        filterable: true,
        filterType: 'text' as const,
        width: '30%',
        editable: true,
        validate: (value: string) => value.trim() ? true : 'Title is required',
        footer: colFooterTitleText || undefined,
        conditionalCellStyles: [
          {
            when: (row: any) => row.title.length > 15,
            style: { fontStyle: 'italic' }
          }
        ]
      },
      { 
        name: 'Director', 
        selector: (row: any) => row.director, 
        sortable: true, 
        id: 'director',
        filterable: true,
        filterType: 'text' as const,
        footer: colFooterDirectorText || undefined,
        sortFunction: (a: any, b: any) => {
          const lastA = a.director.split(' ').pop();
          const lastB = b.director.split(' ').pop();
          return lastA.localeCompare(lastB);
        }
      },
      { 
        name: 'Year', 
        selector: (row: any) => row.year, 
        format: (row: any) => `${row.year} 🎬`,
        sortable: true, 
        id: 'year',
        right: true,
        filterable: true,
        filterType: 'number' as const,
        editor: { type: 'number' as const },
        validate: (value: string) => {
          const num = parseInt(value, 10);
          return (num > 1800 && num <= new Date().getFullYear()) ? true : 'Invalid year';
        },
        footer: (rows: any[]) => {
          const text = colFooterYearText || 'Avg:';
          if (!rows.length) return `${text} -`;
          const avg = Math.round(rows.reduce((sum, r) => sum + parseInt(r.year), 0) / rows.length);
          return `${text} ${avg}`;
        }
      },
      {
        name: 'Genre',
        selector: (row: any) => row.genre || 'Action',
        id: 'genre',
        width: '120px',
        editor: {
          type: 'select' as const,
          options: [
            { value: 'Action', label: 'Action' },
            { value: 'Comedy', label: 'Comedy' },
            { value: 'Drama', label: 'Drama' },
            { value: 'Sci-Fi', label: 'Sci-Fi' },
          ]
        }
      },
      {
        name: 'Seen',
        selector: (row: any) => row.seen === 'true' || row.seen === true ? 'Yes' : 'No',
        id: 'seen',
        width: '80px',
        center: true,
        editor: { type: 'checkbox' as const }
      },
      {
        name: 'Rating',
        selector: (row: any) => row.rating || '5',
        id: 'rating',
        width: '120px',
        center: true,
        heatmap: config.heatmapCells,
        heatmapConfig: {
          colorScale: 'purples' as const,
          min: 3.5,
          max: 5.0
        },
        editor: {
          type: 'custom' as const,
          render: (ctx: any) => (
            <div className="flex gap-1 justify-center w-full">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => ctx.commit(String(star))}
                  onMouseEnter={() => ctx.setValue(String(star))}
                  className={`text-lg ${Number(ctx.value || 0) >= star ? 'text-amber-400' : 'text-slate-200'}`}
                >
                  ★
                </button>
              ))}
            </div>
          )
        }
      },
      {
        name: 'Trend',
        id: 'trend',
        selector: (row: any) => row.trend || [50, 50, 50],
        sparkline: true,
        sparklineConfig: {
          type: 'area' as const,
          strokeColor: '#4f46e5',
          fillColor: 'rgba(79, 70, 229, 0.1)',
          height: 28,
          highlightMin: true,
          highlightMax: true,
          highlightLast: true,
          interactive: true,
          animate: true
        },
        width: '130px'
      },
      {
        name: 'Action',
        id: 'action',
        selector: () => 'View',
        button: true,
        ignoreRowClick: true,
        cell: (row: any) => (
          <button 
            onClick={() => alert(`Viewing ${row.title}`)}
            className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded"
          >
            Details
          </button>
        ),
        width: '100px',
        center: true
      }
    ];
  }, [colFooterTitleText, colFooterDirectorText, colFooterYearText]);

  const [localData, setLocalData] = useState(initialData);
  const [serverTotalCount, setServerTotalCount] = useState(initialData.length);
  const [isLoadingServerData, setIsLoadingServerData] = useState(false);
  const [serverSortField, setServerSortField] = useState<string | null>(null);
  const [serverSortDirection, setServerSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    let isMounted = true;
    const loadServerData = async () => {
      setIsLoadingServerData(true);
      try {
        const queryParams = new URLSearchParams({
          page: String(paginationServer ? serverPage : 1),
          limit: String(paginationServer ? serverRowsPerPage : 100),
        });
        
        if (sortServer && serverSortField) {
          queryParams.set('sortBy', serverSortField);
          queryParams.set('sortOrder', serverSortDirection);
        }

        const res = await fetch(`/api/movies?${queryParams}`);
        if (res.ok && isMounted) {
          const result = await res.json();
          setLocalData(result.data || []);
          setServerTotalCount(result.totalCount || result.data?.length || 0);
        }
      } catch (err) {
        console.error("Failed to load movie data from backend API:", err);
      } finally {
        if (isMounted) setIsLoadingServerData(false);
      }
    };

    loadServerData();

    return () => {
      isMounted = false;
    };
  }, [paginationServer, sortServer, serverPage, serverRowsPerPage, serverSortField, serverSortDirection]);

  const activeData = useMemo(() => {
    if (config.simulateEmptyData) return [];
    return localData;
  }, [config.simulateEmptyData, localData]);

  const copyInstall = () => {
    navigator.clipboard.writeText('npm install @enterprisegrid/grid');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden w-full">
      <SEO 
        title="EnterpriseGrid - The AI-Powered React Data Table"
        description="EnterpriseGrid - The ultimate AI-Native, high-performance interactive data grid for modern React applications. Features row commenting, smart summaries, automatic pagination, theme customization, and flexible layout configuration."
        url="https://enterprisegrid.io/"
        keywords="React data grid, React data table, high-performance table component, AI data insights, React 18 table, customizable grid components, developer UI library"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "EnterpriseGrid",
          "operatingSystem": "All",
          "applicationCategory": "DeveloperApplication",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          },
          "description": "EnterpriseGrid is an AI-powered interactive data grid for React, featuring smart summaries, query assistant, automatic pagination, server sorting, real-time filters, and layout control.",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "128"
          }
        }}
      />
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium border border-indigo-100"
            >
              <span>AI-Native &middot; Data Management &middot; React 18+</span>
              <span className="w-px h-4 bg-indigo-200"></span>
              <a href="#" className="flex items-center hover:text-indigo-800">
                What's new in v8 <ChevronRight className="w-4 h-4" />
              </a>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-slate-800"
            >
              The AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Interactive Data Grid</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed"
            >
              EnterpriseGrid powers the EnterpriseGrid Interactive Learning Universe. Sorting, AI-driven insights, pagination, row selection, theming, and expandable rows, all included.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link to="/docs" className="h-12 px-8 rounded-lg bg-indigo-600 text-white font-semibold flex items-center justify-center hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                Get started &rarr;
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-8 flex flex-col items-center gap-4"
            >
              <div className="group relative flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 w-full max-w-md cursor-pointer overflow-hidden" onClick={copyInstall}>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex-1 px-4 py-2 font-mono text-sm text-slate-600 flex items-center gap-2">
                  <span className="text-slate-400">$</span> npm install @enterprisegrid/grid
                </div>
                <div className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative z-10">
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </div>
              </div>


            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white border-t border-slate-200 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="w-full lg:w-[58.333%] flex-shrink-0">
              <h2 className="text-3xl font-bold mb-6 text-slate-800">Enterprise grid quick start</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Just provide an array of data and an array of columns. EnterpriseGrid will automatically handle rendering, and you can easily opt-in to AI features, sorting, pagination, and selection by simply adding props.
              </p>
              
              <div className="mb-6">
                <LiveCodeEditor language="jsx" title="MyComponent.tsx">
{`import EnterpriseGrid from '@enterprisegrid/grid';

function MyComponent() {
  return (
    <EnterpriseGrid
      columns={columns}
      data={data}${config.keyField !== 'id' ? `\n      keyField="${config.keyField}"` : ''}${config.pagination ? '\n      pagination' : ''}${config.selectableRows ? '\n      selectableRows' : ''}${config.sortable ? '\n      sortable' : ''}${config.searchable ? '\n      searchable' : ''}${config.exportable ? '\n      exportable' : ''}${config.densityToggle ? '\n      densityToggle' : ''}${config.columnVisibility ? '\n      columnVisibility' : ''}${config.animations ? '\n      animations' : ''}${config.mapView ? '\n      mapView' : ''}${config.calendarView ? '\n      calendarView' : ''}${config.savedViews ? '\n      savedViews' : ''}${config.shareableViews ? '\n      shareableViews' : ''}${config.auditTrail ? '\n      auditTrail' : ''}${config.timeTravel ? '\n      timeTravel' : ''}${config.rowComments ? '\n      rowComments' : ''}${config.heatmapCells ? '\n      heatmapCells' : ''}${config.bookmarks ? '\n      bookmarks' : ''}${config.commandPalette ? '\n      commandPalette' : ''}${config.progressPending ? '\n      progressPending' : ''}${config.progressPending && config.customProgressComponent ? '\n      progressComponent={<CustomLoader />}' : ''}${config.customNoDataComponent ? '\n      noDataComponent={<CustomEmptyState />}' : ''}${hasCustomTitle ? `\n      title="${titleText}"` : ''}${hasCustomActions ? '\n      actions={<CustomButton />}' : ''}${noHeader ? '\n      noHeader' : ''}${noTableHead ? '\n      noTableHead' : ''}${persistTableHead ? '\n      persistTableHead' : ''}${dense ? '\n      dense' : ''}${!responsive ? '\n      responsive={false}' : ''}${fixedHeader ? '\n      fixedHeader' : ''}${fixedHeader ? `\n      fixedHeaderScrollHeight="${fixedHeaderScrollHeight}"` : ''}${hasSubHeader ? '\n      subHeader={<MySubHeader />}' : ''}${hasSubHeader && subHeaderAlign !== 'right' ? `\n      subHeaderAlign="${subHeaderAlign}"` : ''}${hasSubHeader && !subHeaderWrap ? '\n      subHeaderWrap={false}' : ''}${direction !== 'ltr' ? `\n      direction="${direction}"` : ''}${disabled ? '\n      disabled' : ''}
    />
  );
}`}
                </LiveCodeEditor>
              </div>


            </div>
            
            <div className="w-full lg:w-[41.667%] flex-1 min-w-0 relative">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Features Configuration</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(config)
                    .filter(key => typeof config[key as keyof typeof config] === 'boolean')
                    .map(key => (
                      <label key={key} className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4"
                          checked={config[key as keyof typeof config] as boolean}
                          onChange={() => setConfig(prev => ({...prev, [key]: !prev[key as keyof typeof config]}))}
                        />
                        <span className="capitalize">
                          {key === 'rowComments' ? 'Row Comments & Mentions' :
                           key === 'heatmapCells' ? 'Heatmap Cells 🌡️' :
                           key === 'bookmarks' ? 'Favorites & Bookmarks ⭐' :
                           key === 'commandPalette' ? 'Command Palette ⌨️ (Ctrl+K)' :
                           key === 'simulateEmptyData' ? 'Simulate Empty Data' :
                           key === 'customProgressComponent' ? 'Custom Loader UI' :
                           key === 'customNoDataComponent' ? 'Custom Empty State UI' :
                           key === 'progressPending' ? 'Loading (progressPending)' :
                           key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                </div>

                <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 text-xs text-indigo-700 flex items-start sm:items-center gap-2 w-full sm:w-fit max-w-full">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse mt-1.5 sm:mt-0 shrink-0"></span>
                  <span className="leading-relaxed">
                    <strong>Inline Editing:</strong> Click any cell in the <strong>Title</strong> or <strong>Year</strong> column to try it out!
                  </span>
                </div>
                
                {/* keyField selector */}
                <div className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl w-fit">
                  <span className="font-semibold">keyField:</span>
                  <select 
                    value={config.keyField}
                    onChange={(e) => setConfig(prev => ({...prev, keyField: e.target.value}))}
                    className="bg-transparent border border-slate-200 rounded px-2 py-1 outline-none text-indigo-600 font-mono font-semibold"
                  >
                    <option value="id">"id"</option>
                    <option value="title">"title"</option>
                  </select>
                  <span className="text-xs text-slate-400 font-normal">Stable React key identifier field</span>
                </div>

                {/* Layout & Appearance section */}
                <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Layout & Appearance Props</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Title input */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={hasCustomTitle}
                          onChange={(e) => setHasCustomTitle(e.target.checked)}
                        />
                        Grid Title (title)
                      </label>
                      <input 
                        type="text" 
                        disabled={!hasCustomTitle}
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        className="border border-slate-200 rounded px-2 py-1 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full disabled:opacity-50 font-medium"
                      />
                    </div>

                    {/* Custom Actions */}
                    <div className="flex flex-col gap-1 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl justify-center">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={hasCustomActions}
                          onChange={(e) => setHasCustomActions(e.target.checked)}
                        />
                        Custom Actions (actions)
                      </label>
                      <span className="text-[10px] text-slate-400">Add custom button inside header</span>
                    </div>

                    {/* noHeader toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={noHeader}
                        onChange={(e) => setNoHeader(e.target.checked)}
                      />
                      <span>Hide Header (noHeader)</span>
                    </label>

                    {/* noTableHead toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={noTableHead}
                        onChange={(e) => setNoTableHead(e.target.checked)}
                      />
                      <span>Hide Column Head (noTableHead)</span>
                    </label>

                    {/* persistTableHead toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={persistTableHead}
                        onChange={(e) => setPersistTableHead(e.target.checked)}
                      />
                      <span>Persist Head (persistTableHead)</span>
                    </label>

                    {/* dense toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={dense}
                        onChange={(e) => setDense(e.target.checked)}
                      />
                      <span>Compact Mode (dense)</span>
                    </label>

                    {/* responsive toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={responsive}
                        onChange={(e) => setResponsive(e.target.checked)}
                      />
                      <span>Responsive Scroll (responsive)</span>
                    </label>

                    {/* fixedHeader options */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <label className="flex items-center gap-2 cursor-pointer font-semibold">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={fixedHeader}
                          onChange={(e) => setFixedHeader(e.target.checked)}
                        />
                        Fixed Grid Head (fixedHeader)
                      </label>
                      <select 
                        disabled={!fixedHeader}
                        value={fixedHeaderScrollHeight}
                        onChange={(e) => setFixedHeaderScrollHeight(e.target.value)}
                        className="border border-slate-200 rounded px-2 py-0.5 text-xs bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none w-full disabled:opacity-50"
                      >
                        <option value="150px">Max Height: 150px</option>
                        <option value="250px">Max Height: 250px</option>
                        <option value="400px">Max Height: 400px</option>
                      </select>
                    </div>

                    {/* subHeader settings */}
                    <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl col-span-1 sm:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                            checked={hasSubHeader}
                            onChange={(e) => setHasSubHeader(e.target.checked)}
                          />
                          Show Subheader Bar (subHeader)
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                          <input 
                            type="checkbox" 
                            disabled={!hasSubHeader}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3 h-3"
                            checked={subHeaderWrap}
                            onChange={(e) => setSubHeaderWrap(e.target.checked)}
                          />
                          Allow wrapping (subHeaderWrap)
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span>Alignment (subHeaderAlign):</span>
                        <div className="flex gap-1 bg-white border border-slate-200 rounded p-0.5">
                          {(['left', 'center', 'right'] as const).map(align => (
                            <button
                              key={align}
                              disabled={!hasSubHeader}
                              onClick={() => setSubHeaderAlign(align)}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase transition-colors disabled:opacity-50 ${subHeaderAlign === align && hasSubHeader ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* direction selector */}
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <span className="font-semibold">Text Direction (direction):</span>
                      <select 
                        value={direction}
                        onChange={(e) => setDirection(e.target.value as any)}
                        className="bg-transparent border border-slate-200 rounded px-2 py-0.5 text-xs outline-none text-indigo-600 font-semibold"
                      >
                        <option value="ltr">"ltr" (Left-to-Right)</option>
                        <option value="rtl">"rtl" (Right-to-Left)</option>
                      </select>
                    </div>

                    {/* disabled toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-rose-100 hover:bg-rose-50/50">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                        checked={disabled}
                        onChange={(e) => setDisabled(e.target.checked)}
                      />
                      <span className="text-slate-700">Disable Controls (disabled)</span>
                    </label>
                  </div>
                </div>

                {/* Theming & Styling section */}
                <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                  <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Theming & Styling Props</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Theme selector */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <span className="font-semibold">Active Theme (theme):</span>
                      <select 
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full"
                      >
                        <option value="default">Default Light Theme</option>
                        <option value="dark">Dark Theme</option>
                        <option value="enterprisegrid-brand">EnterpriseGrid Brand Theme</option>
                      </select>
                    </div>

                    {/* Striped rows toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={striped}
                        onChange={(e) => setStriped(e.target.checked)}
                      />
                      <span>Alternating striped rows (striped)</span>
                    </label>

                    {/* Highlight on hover toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={highlightOnHover}
                        onChange={(e) => setHighlightOnHover(e.target.checked)}
                      />
                      <span>Highlight on row hover (highlightOnHover)</span>
                    </label>

                    {/* Pointer on hover toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={pointerOnHover}
                        onChange={(e) => setPointerOnHover(e.target.checked)}
                      />
                      <span>Pointer on row hover (pointerOnHover)</span>
                    </label>

                    {/* Column Separator selector */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <span className="font-semibold">Column Separator (columnSeparator):</span>
                      <select 
                        value={columnSeparator}
                        onChange={(e) => setColumnSeparator(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full"
                      >
                        <option value="none">None (false)</option>
                        <option value="subtle">Subtle 60% line</option>
                        <option value="full">Full height border</option>
                      </select>
                    </div>

                    {/* Header Separator selector */}
                    <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                      <span className="font-semibold">Header Separator (headerSeparator):</span>
                      <select 
                        value={headerSeparator}
                        onChange={(e) => setHeaderSeparator(e.target.value as any)}
                        className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full"
                      >
                        <option value="none">None (false)</option>
                        <option value="subtle">Subtle 60% line (default)</option>
                        <option value="full">Full height border</option>
                      </select>
                    </div>

                    {/* Animate rows toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={animateRows}
                        onChange={(e) => setAnimateRows(e.target.checked)}
                      />
                      <span>Stagger entrance & sort (animateRows)</span>
                    </label>

                    {/* Custom style overrides toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-indigo-100 hover:bg-indigo-50/30">
                      <input 
                        type="checkbox" 
                        className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                        checked={useCustomStyles}
                        onChange={(e) => setUseCustomStyles(e.target.checked)}
                      />
                      <span>Apply Fine-Grained (customStyles)</span>
                    </label>

                    {/* Conditional Row styles toggle */}
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-teal-100 hover:bg-teal-50/30">
                      <input 
                        type="checkbox" 
                        className="rounded border-teal-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
                        checked={useConditionalRowStyles}
                        onChange={(e) => setUseConditionalRowStyles(e.target.checked)}
                      />
                      <span>Apply (conditionalRowStyles)</span>
                    </label>
                  </div>
                  
                  {/* Event indicator */}
                  <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100/50 rounded-xl flex items-center justify-between text-xs text-indigo-800 hidden">
                    <span className="font-medium">⚡ Scroll Event Hook (onScroll):</span>
                    <span className="font-mono bg-indigo-100 px-2 py-0.5 rounded font-bold text-indigo-700">
                      scrollCount: {scrollCount}
                    </span>
                  </div>

                  {/* Advanced Sorting configuration */}
                  <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Advanced Sorting Features</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* sortMulti */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={sortMulti}
                          onChange={(e) => setSortMulti(e.target.checked)}
                        />
                        <div>
                          <span>Multi-Column Sorting (sortMulti)</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Hold Ctrl/⌘ + click column headers</span>
                        </div>
                      </label>

                      {/* sortServer */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-amber-100 hover:bg-amber-50/20">
                        <input 
                          type="checkbox" 
                          className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                          checked={sortServer}
                          onChange={(e) => setSortServer(e.target.checked)}
                        />
                        <div>
                          <span>Server-Side Sorting (sortServer)</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Disables client-side sort, fires callback</span>
                        </div>
                      </label>

                      {/* useCustomSortFunction */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={useCustomSortFunction}
                          onChange={(e) => setUseCustomSortFunction(e.target.checked)}
                        />
                        <div>
                          <span>Custom Sort Function</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Custom logic reversing entries</span>
                        </div>
                      </label>

                      {/* useCustomSortIcon */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={useCustomSortIcon}
                          onChange={(e) => setUseCustomSortIcon(e.target.checked)}
                        />
                        <div>
                          <span>Custom Sort Icon</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Uses ArrowUpDown instead of default Chevron</span>
                        </div>
                      </label>

                      {/* defaultSort configuration */}
                      <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl col-span-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input 
                              type="checkbox" 
                              className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              checked={useDefaultSort}
                              onChange={(e) => setUseDefaultSort(e.target.checked)}
                            />
                            Configure Default Sort
                          </label>
                        </div>
                        
                        {useDefaultSort && (
                          <div className="grid grid-cols-2 gap-3 mt-1 pt-2 border-t border-slate-200/60">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">Field</span>
                              <select 
                                value={defaultSortFieldId}
                                onChange={(e) => setDefaultSortFieldId(e.target.value as any)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs outline-none text-slate-800 font-semibold focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="title">Title</option>
                                <option value="director">Director</option>
                                <option value="year">Year</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-400 font-semibold uppercase">Direction</span>
                              <div className="flex gap-1 bg-white border border-slate-200 rounded p-0.5">
                                <button
                                  onClick={() => setDefaultSortAsc(true)}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${defaultSortAsc ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                  ASC
                                </button>
                                <button
                                  onClick={() => setDefaultSortAsc(false)}
                                  className={`flex-1 py-1 rounded text-[10px] font-bold uppercase transition-colors ${!defaultSortAsc ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                  DESC
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Imperative Action Trigger */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
                      <button
                        onClick={() => tableRef.current?.clearSort()}
                        className="w-full sm:w-auto px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg border border-indigo-100 text-xs transition-colors flex items-center justify-center gap-1.5 font-sans"
                      >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        Trigger ref.clearSort() Imperatively
                      </button>
                      <span className="text-[10px] text-slate-400 text-center sm:text-right">Resets column sorting state back to default/cleared</span>
                    </div>

                    {/* Terminal monitor */}
                    <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                        <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider">⚡ onSort API Event Callback Logger</span>
                        <span className="text-[9px] text-slate-500">Real-time log stream</span>
                      </div>
                      <pre className="font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-[110px] overflow-y-auto leading-relaxed scrollbar-thin">
                        {lastSortLog}
                      </pre>
                    </div>
                  </div>

                  {/* Advanced Pagination configuration */}
                  <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                    <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Advanced Pagination Features</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* paginationPosition */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold">Controls Position (paginationPosition):</span>
                        <select 
                          value={paginationPosition}
                          onChange={(e) => setPaginationPosition(e.target.value as any)}
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full font-sans"
                        >
                          <option value="bottom">Bottom only (default)</option>
                          <option value="top">Top only</option>
                          <option value="both">Both Top & Bottom</option>
                        </select>
                      </div>

                      {/* paginationPerPage */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold">Initial Page Size (paginationPerPage):</span>
                        <select 
                          value={paginationPerPage}
                          onChange={(e) => setPaginationPerPage(Number(e.target.value))}
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full font-sans"
                        >
                          <option value={5}>5 Rows per page (default)</option>
                          <option value={10}>10 Rows per page</option>
                          <option value={15}>15 Rows per page</option>
                        </select>
                      </div>

                      {/* noRowsPerPage */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={noRowsPerPage}
                          onChange={(e) => setNoRowsPerPage(e.target.checked)}
                        />
                        <div>
                          <span>Hide Row Selector (noRowsPerPage)</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Removes the rows per page selection dropdown</span>
                        </div>
                      </label>

                      {/* paginationServer */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-amber-100 hover:bg-amber-50/20">
                        <input 
                          type="checkbox" 
                          className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                          checked={paginationServer}
                          onChange={(e) => {
                            setPaginationServer(e.target.checked);
                            setServerPage(1);
                          }}
                        />
                        <div>
                          <span>Server-Side Pagination (paginationServer)</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Slices on back-end, triggers reload callbacks</span>
                        </div>
                      </label>

                      {/* useCustomPaginationComponent */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border-indigo-100 hover:bg-indigo-50/20">
                        <input 
                          type="checkbox" 
                          className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={useCustomPaginationComponent}
                          onChange={(e) => setUseCustomPaginationComponent(e.target.checked)}
                        />
                        <div>
                          <span>Custom Pagination Component</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Replaces layout with dark-themed CustomPagination</span>
                        </div>
                      </label>

                      {/* useCustomPaginationIcons */}
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          checked={useCustomPaginationIcons}
                          onChange={(e) => setUseCustomPaginationIcons(e.target.checked)}
                        />
                        <div>
                          <span>Custom Pagination Icons</span>
                          <span className="block text-[9px] text-slate-400 font-normal">Uses text badges instead of chevron SVG arrows</span>
                        </div>
                      </label>

                      {/* Custom text translation row - rowsPerPageText */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold">Dropdown Label (rowsPerPageText):</span>
                        <input 
                          type="text" 
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold focus:ring-1 focus:ring-indigo-500"
                          value={rowsPerPageText}
                          onChange={(e) => setRowsPerPageText(e.target.value)}
                        />
                      </div>

                      {/* rangeSeparatorText */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold">Range Label (rangeSeparatorText):</span>
                        <input 
                          type="text" 
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold focus:ring-1 focus:ring-indigo-500"
                          value={rangeSeparatorText}
                          onChange={(e) => setRangeSeparatorText(e.target.value)}
                        />
                      </div>

                      {/* Controlled page mode - paginationPage */}
                      <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl col-span-1 sm:col-span-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 cursor-pointer font-semibold">
                            <input 
                              type="checkbox" 
                              className="rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                              checked={paginationPage !== undefined}
                              onChange={(e) => {
                                setPaginationPage(e.target.checked ? 1 : undefined);
                              }}
                            />
                            Controlled Page Mode (paginationPage)
                          </label>
                        </div>
                        
                        {paginationPage !== undefined && (
                          <div className="flex flex-wrap gap-2 items-center mt-1 pt-2 border-t border-slate-200/60 font-sans">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase">Current Controlled Page:</span>
                            <div className="flex gap-1.5">
                              {[1, 2, 3].map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setPaginationPage(p)}
                                  className={`px-3 py-1 rounded text-xs font-bold transition-all ${paginationPage === p ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border text-slate-600 hover:bg-slate-50'}`}
                                >
                                  Page {p}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* reset default page toggle */}
                      <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl col-span-1 sm:col-span-2">
                        <div className="flex items-center justify-between font-sans">
                          <span className="font-semibold">Reset back to page 1 on search / toggle:</span>
                          <button
                            onClick={() => setPaginationResetDefaultPage(prev => !prev)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${paginationResetDefaultPage ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                          >
                            {paginationResetDefaultPage ? 'ACTIVE (paginationResetDefaultPage)' : 'INACTIVE'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Pagination Terminal Logger */}
                    <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
                        <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-wider">⚡ Pagination API Event Logger</span>
                        <span className="text-[9px] text-slate-500">Real-time callbacks monitor</span>
                      </div>
                      <pre className="font-mono text-[10px] text-emerald-400 overflow-x-auto whitespace-pre-wrap max-h-[110px] overflow-y-auto leading-relaxed scrollbar-thin">
                        {lastPaginationLog}
                      </pre>
                    </div>
                  </div>

                  {/* Advanced Footer configuration */}
                  <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">F</div>
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Advanced Footer Features (Footer API)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* showFooter control */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">Footer Visibility (showFooter):</span>
                        <select 
                          value={showFooterState}
                          onChange={(e) => setShowFooterState(e.target.value as any)}
                          className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs outline-none text-indigo-600 font-semibold w-full font-sans"
                        >
                          <option value="auto">Auto (Auto-detect from columns/component)</option>
                          <option value="true">True (Always render footer row)</option>
                          <option value="false">False (Never render footer row)</option>
                        </select>
                        <p className="text-[10px] text-slate-400">Controls whether the footer is rendered. False suppresses the entire footer.</p>
                      </div>

                      {/* footerComponent toggle */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">Footer Mode:</span>
                        <div className="flex gap-1 bg-white border border-slate-200 p-0.5 rounded-lg w-full">
                          <button
                            onClick={() => setUseCustomFooterComponent(false)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${!useCustomFooterComponent ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Column-level
                          </button>
                          <button
                            onClick={() => setUseCustomFooterComponent(true)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${useCustomFooterComponent ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Custom Component
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">Specify whether to use column-level "footer" fields or a single unified "footerComponent".</p>
                      </div>

                      {/* Column-level values editing inputs (only shown if useCustomFooterComponent is false) */}
                      {!useCustomFooterComponent && (
                        <div className="flex flex-col gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-3 rounded-xl col-span-1 sm:col-span-2">
                          <span className="font-bold text-slate-700 border-b pb-1">Define Column Footer Values:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-semibold">Title Column:</span>
                              <input 
                                type="text"
                                value={colFooterTitleText}
                                onChange={(e) => setColFooterTitleText(e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 font-sans"
                                placeholder="Total Movies"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-semibold">Director Column:</span>
                              <input 
                                type="text"
                                value={colFooterDirectorText}
                                onChange={(e) => setColFooterDirectorText(e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 font-sans"
                                placeholder="Count: 15"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] text-slate-500 font-semibold">Year Column:</span>
                              <input 
                                type="text"
                                value={colFooterYearText}
                                onChange={(e) => setColFooterYearText(e.target.value)}
                                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 outline-none focus:border-indigo-500 font-sans"
                                placeholder="Avg: 1995"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Custom footer component explanation when selected */}
                      {useCustomFooterComponent && (
                        <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl col-span-1 sm:col-span-2">
                          <span className="font-bold text-indigo-700">CustomSummaryFooter Active</span>
                          <p className="text-[11px] leading-relaxed text-slate-500">
                            Replaces the entire footer row with a custom component receiving <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700 font-mono text-[10px]">rows</code> and <code className="bg-slate-200 px-1 py-0.5 rounded text-indigo-700 font-mono text-[10px]">columns</code>. In this demo, it computes the exact count of displayed movies and their average release year dynamically in real-time.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Advanced Row Selection configuration */}
                  <div className="border-t border-slate-200 pt-6 mt-6 hidden">
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">S</div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Advanced Row Selection Features</h3>
                      </div>
                      <button
                        onClick={() => tableRef.current?.clearSelectedRows()}
                        className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg shadow-sm transition-all"
                        title="Clear all selections programmatically"
                      >
                        Clear Selection via Ref
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* selectableRows Single Toggle */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">Selection Mode:</span>
                        <div className="flex gap-1 bg-white border border-slate-200 p-0.5 rounded-lg w-full">
                          <button
                            onClick={() => setSelectableRowsSingle(false)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${!selectableRowsSingle ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Multi-Select
                          </button>
                          <button
                            onClick={() => setSelectableRowsSingle(true)}
                            className={`flex-1 py-1 rounded text-[10px] font-bold transition-all ${selectableRowsSingle ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
                          >
                            Single-Select (Single)
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">Restricts selection to one row at a time.</p>
                      </div>

                      {/* selectableRowsHighlight and selectableRowsRange */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">Row Highlighting & Range:</span>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={selectableRowsHighlight}
                              onChange={(e) => setSelectableRowsHighlight(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Highlight Selected Row</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={selectableRowsRange}
                              onChange={(e) => setSelectableRowsRange(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Shift + Click Range Selection</span>
                          </label>
                        </div>
                      </div>

                      {/* selectableRowsNoSelectAll and selectableRowsVisibleOnly */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">All Select Behavior:</span>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={selectableRowsNoSelectAll}
                              onChange={(e) => setSelectableRowsNoSelectAll(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Hide "Select All" checkbox</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={selectableRowsVisibleOnly}
                              onChange={(e) => setSelectableRowsVisibleOnly(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>"Select All" affects current page only</span>
                          </label>
                        </div>
                      </div>

                      {/* Custom Checkbox and Row disabling / preselection */}
                      <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl">
                        <span className="font-semibold text-slate-700">Advanced Hooks & Predicates:</span>
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={disableThirdAndFifth}
                              onChange={(e) => setDisableThirdAndFifth(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Disable Movie 3 & 5 (Row Disabled)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={preselectEven}
                              onChange={(e) => setPreselectEven(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Pre-select Even Movie IDs (Row Selected)</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                            <input 
                              type="checkbox" 
                              checked={useCustomCheckbox}
                              onChange={(e) => setUseCustomCheckbox(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span>Use Custom Checkbox component</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {lastSelectionLog && (
                      <div className="mt-3 p-3 bg-indigo-950 text-indigo-200 font-mono text-[10px] rounded-xl border border-indigo-900 leading-normal whitespace-pre-wrap">
                        <div className="flex justify-between items-center border-b border-indigo-900 pb-1 mb-1 font-sans text-[11px] font-bold text-indigo-300">
                          <span>Latest Selection Callback (onSelectedRowsChange):</span>
                          <span className="text-emerald-400">Live API Log</span>
                        </div>
                        {lastSelectionLog}
                      </div>
                    )}
                  </div>

                  {/* Advanced Expandable Rows configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Advanced Expandable Rows</h3>
                        <p className="text-xs text-slate-400 mt-1">Master-detail drilldowns, customized triggers, initial states, and disabled rows.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-bold text-[10px] tracking-wide uppercase">New Scenario</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {/* Left Column Toggles */}
                      <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={config.expandableRows}
                            onChange={(e) => setConfig(prev => ({ ...prev, expandableRows: e.target.checked }))}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="font-semibold text-indigo-600">expandableRows (Enable Feature)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={expandOnRowClicked}
                            onChange={(e) => setExpandOnRowClicked(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandOnRowClicked (Click anywhere to expand)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={expandOnRowDoubleClicked}
                            onChange={(e) => setExpandOnRowDoubleClicked(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandOnRowDoubleClicked (Double-click to expand)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={expandableRowsHideExpander}
                            onChange={(e) => setExpandableRowsHideExpander(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableRowsHideExpander (Hide chevron column)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={expandableInheritConditionalStyles}
                            onChange={(e) => setExpandableInheritConditionalStyles(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableInheritConditionalStyles (Match parent style)</span>
                        </label>
                      </div>

                      {/* Right Column Customizers */}
                      <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Drilldown & Scenario Control</div>
                        
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={useCustomExpandIcons}
                            onChange={(e) => setUseCustomExpandIcons(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableIcon (Custom +/- button icons)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={expandMovie4ByDefault}
                            onChange={(e) => setExpandMovie4ByDefault(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableRowExpanded (ID 4: Inception expanded by default)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={disableMovie2Expansion}
                            onChange={(e) => setDisableMovie2Expansion(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableRowDisabled (Disable expansion for ID 2)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={showRatingInExpanded}
                            onChange={(e) => setShowRatingInExpanded(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>expandableRowsComponentProps (Pass showRating parameter)</span>
                        </label>
                      </div>
                    </div>

                    {lastExpandLog && (
                      <div className="mt-3 p-3 bg-indigo-950 text-indigo-200 font-mono text-[10px] rounded-xl border border-indigo-900 leading-normal whitespace-pre-wrap">
                        <div className="flex justify-between items-center border-b border-indigo-900 pb-1 mb-1 font-sans text-[11px] font-bold text-indigo-300">
                          <span>Latest Expand Event (onRowExpandToggled):</span>
                          <span className="text-emerald-400 font-mono">onRowExpandToggled</span>
                        </div>
                        {lastExpandLog}
                      </div>
                    )}
                  </div>

                  {/* Advanced Row Events configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Advanced Row Events</h3>
                        <p className="text-xs text-slate-400 mt-1">Bind to user clicks, double-clicks, middle-clicks, or hover gestures on any row.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-bold text-[10px] tracking-wide uppercase">Interactive</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {/* Left Column: Row Event Bindings */}
                      <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Listeners</div>
                        
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={enableRowClicked}
                            onChange={(e) => setEnableRowClicked(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="font-semibold text-indigo-600">onRowClicked</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={enableRowDoubleClicked}
                            onChange={(e) => setEnableRowDoubleClicked(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>onRowDoubleClicked</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={enableRowMiddleClicked}
                            onChange={(e) => setEnableRowMiddleClicked(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>onRowMiddleClicked (Scroll wheel)</span>
                        </label>
                      </div>

                      {/* Right Column: Hover settings */}
                      <div className="space-y-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hover Gestures</div>
                        
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={enableRowMouseEnter}
                            onChange={(e) => setEnableRowMouseEnter(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>onRowMouseEnter (Logs on enter)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={enableRowMouseLeave}
                            onChange={(e) => setEnableRowMouseLeave(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>onRowMouseLeave (Logs on exit)</span>
                        </label>

                        <div className="text-[9px] text-slate-400 leading-relaxed pt-1 border-t border-slate-200/50 mt-1">
                          💡 <strong>Protip:</strong> Click the mouse wheel/middle-click on a row to test <code>onRowMiddleClicked</code> without opening normal links.
                        </div>
                      </div>
                    </div>

                    {lastRowEventLog && (
                      <div className="mt-3 p-3 bg-slate-950 text-indigo-200 font-mono text-[10px] rounded-xl border border-slate-900 leading-normal relative">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1 font-sans text-[11px] font-bold text-slate-400">
                          <span>Row Events Console Logger:</span>
                          <button 
                            onClick={() => setLastRowEventLog('Console logs cleared. Interact with any row above!')}
                            className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-[9px] rounded text-slate-300 font-mono uppercase tracking-wider transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="whitespace-pre-wrap">{lastRowEventLog}</div>
                      </div>
                    )}
                  </div>

                  {/* Advanced Column Features configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Column Features API</h3>
                        <p className="text-xs text-slate-400 mt-1">Resize columns, group headers, drag-and-drop to reorder, and apply column-level filters.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-bold text-[10px] tracking-wide uppercase">New Features</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {/* Toggles */}
                      <div className="space-y-3">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feature Configuration</div>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={colResizable}
                            onChange={(e) => setColResizable(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span className="font-semibold text-indigo-600">resizable (Drag to resize widths)</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                          <input 
                            type="checkbox" 
                            checked={colGrouping}
                            onChange={(e) => setColGrouping(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                          <span>columnGroups (Spans Title & Director vs. Year)</span>
                        </label>

                        {colGrouping && (
                          <div className="pl-5 border-l-2 border-indigo-500/20 space-y-2 mt-2 ml-1">
                            <div className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider mb-1.5">Group API Options:</div>
                            
                            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                              <input 
                                type="checkbox" 
                                checked={groupReorder}
                                onChange={(e) => setGroupReorder(e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span>reorder (Draggable Groups)</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                              <input 
                                type="checkbox" 
                                checked={groupCustomJSX}
                                onChange={(e) => setGroupCustomJSX(e.target.checked)}
                                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              />
                              <span>Custom JSX name (with Emojis)</span>
                            </label>

                            <div className="flex items-center gap-2 pt-1 text-[11px]">
                              <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider">align:</span>
                              <div className="flex rounded-lg shadow-sm border border-slate-200 overflow-hidden bg-white">
                                <button
                                  type="button"
                                  onClick={() => setGroupAlign('left')}
                                  className={`px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 ${groupAlign === 'left' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                  Left
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGroupAlign('center')}
                                  className={`px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 border-l border-r border-slate-200 ${groupAlign === 'center' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                  Center
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setGroupAlign('right')}
                                  className={`px-2.5 py-1 text-[10px] font-semibold transition-all duration-150 ${groupAlign === 'right' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                >
                                  Right
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Instructions */}
                      <div className="space-y-2 bg-slate-50/50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">How to test:</div>
                        <ul className="list-disc pl-4 space-y-1">
                          <li><strong>Column Resizing:</strong> Hover between headers and drag the resize handle.</li>
                          <li><strong>Column Filters:</strong> Click the 🔍 filter icon on any header to filter by custom values.</li>
                          <li><strong>Header Reordering:</strong> Drag and drop individual headers or group headers to reorder them!</li>
                        </ul>
                      </div>
                    </div>

                    {/* Interactive Loggers */}
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {lastColumnOrderLog && lastColumnOrderLog !== 'No column reorder events yet' && (
                        <div className="p-2.5 bg-slate-900 text-indigo-200 font-mono text-[10px] rounded-xl border border-slate-800 leading-normal">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1 font-sans text-[10px] font-bold text-slate-400">
                            <span>Reorder Event (onColumnOrderChange):</span>
                          </div>
                          <div>{lastColumnOrderLog}</div>
                        </div>
                      )}

                      {lastColumnGroupOrderLog && lastColumnGroupOrderLog !== 'No column group reorder events yet' && (
                        <div className="p-2.5 bg-slate-900 text-indigo-200 font-mono text-[10px] rounded-xl border border-slate-800 leading-normal">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1 font-sans text-[10px] font-bold text-slate-400">
                            <span>Group Reorder Event (onColumnGroupOrderChange):</span>
                          </div>
                          <div>{lastColumnGroupOrderLog}</div>
                        </div>
                      )}

                      {lastColumnFilterLog && lastColumnFilterLog !== 'No column filter events yet' && (
                        <div className="p-2.5 bg-slate-900 text-indigo-200 font-mono text-[10px] rounded-xl border border-slate-800 leading-normal">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-1 mb-1 font-sans text-[10px] font-bold text-slate-400">
                            <span>Filter Event (onFilterChange / Controlled):</span>
                          </div>
                          <div>{lastColumnFilterLog}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Localization & Custom Wording API configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-4 hidden">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Localization & Accessibility API</h3>
                        <p className="text-xs text-slate-400 mt-1">Translate all user-visible strings, pagination controls, filter popups, and ARIA labels.</p>
                      </div>
                      <span className="px-2.5 py-1 bg-teal-50 text-teal-700 border border-teal-100 rounded-full font-bold text-[10px] tracking-wide uppercase">Localization</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                      {/* Configuration Controls */}
                      <div className="space-y-4">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select Language / Override Mode</div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setLocaleType('en')}
                              className={`px-3 py-2 text-left rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                localeType === 'en'
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              English (Default)
                            </button>
                            <button
                              type="button"
                              onClick={() => setLocaleType('ta')}
                              className={`px-3 py-2 text-left rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                localeType === 'ta'
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              Tamil (தமிழ்)
                            </button>
                            <button
                              type="button"
                              onClick={() => setLocaleType('en-custom')}
                              className={`px-3 py-2 text-left rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                localeType === 'en-custom'
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              Custom Wording (English)
                            </button>
                            <button
                              type="button"
                              onClick={() => setLocaleType('en-accessibility')}
                              className={`px-3 py-2 text-left rounded-xl border text-xs font-semibold transition-all duration-200 ${
                                localeType === 'en-accessibility'
                                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                              }`}
                            >
                              Aria-Label Override
                            </button>
                          </div>
                        </div>

                        <div className="border-t pt-3 border-slate-100">
                          <label className="flex items-start gap-2.5 cursor-pointer font-medium text-slate-700">
                            <input
                              type="checkbox"
                              checked={useLegacyLocalizationProps}
                              onChange={(e) => setUseLegacyLocalizationProps(e.target.checked)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-0.5"
                            />
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-700">Use Legacy / Deprecated Props</span>
                              <span className="text-[10px] text-slate-400 mt-0.5 font-normal leading-normal">
                                Disabled the <code>localization</code> object to test fallback to <code>columnFilterOptions</code> and <code>expandableRowsOptions</code>.
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Info / Visualizing Overrides */}
                      <div className="space-y-2.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-600 leading-relaxed flex flex-col justify-between">
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Active Translations Applied:</div>
                          <div className="space-y-1.5 font-mono text-[10px]">
                            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                              <span className="text-slate-400">Pagination Label:</span>
                              <span className="font-semibold text-indigo-700">
                                {useLegacyLocalizationProps ? "Rows per page:" : (localeType === 'ta' ? "ஒரு பக்கத்தில் வரிசைகள்" : localeType === 'en-custom' ? "Items per page" : "Rows per page:")}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                              <span className="text-slate-400">Expandable row:</span>
                              <span className="font-semibold text-indigo-700">
                                {localeType === 'ta' ? "விரிவாக்கு / சுருக்கு" : localeType === 'en-custom' ? "Show Details / Hide" : "Expand / Collapse"}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-slate-200 pb-1">
                              <span className="text-slate-400">Filter Apply/Clear:</span>
                              <span className="font-semibold text-indigo-700">
                                {localeType === 'ta' ? "பயன்படுத்து / அழி" : localeType === 'en-custom' ? "Search / Reset" : "Done / Clear"}
                              </span>
                            </div>
                            <div className="flex justify-between pb-0.5">
                              <span className="text-slate-400">ARIA Labels:</span>
                              <span className="font-semibold text-indigo-700 truncate max-w-[130px]">
                                {localeType === 'en-accessibility' ? "Custom Navigate..." : "Standard Default"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-amber-50/80 border border-amber-100 p-2 rounded-lg text-[10px] text-amber-800 leading-normal">
                          💡 <strong>How to test:</strong> Look at the bottom of the grid to see the paginator labels, expand any movie row, or click the header 🔍 filter!
                        </div>
                      </div>
                    </div>
                  </div>

                  {actionClicked && (
                    <div className="mt-3 p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-800 text-center animate-pulse font-semibold">
                      🚀 Custom "Add Movie" action was triggered dynamically!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-6 bg-slate-50 border-t border-slate-200 relative">
      <div className="container mx-auto px-4 max-w-6xl">
                     <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 blur-3xl opacity-50 rounded-full"></div>

                     <div className="relative bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 overflow-hidden">
                 {(() => {
                   const customStylesOverride = useCustomStyles ? {
                     header: {
                       style: {
                         fontSize: '22px',
                         color: selectedTheme === 'enterprisegrid-brand' ? '#4f46e5' : '#e11d48',
                         letterSpacing: '0.05em',
                       }
                     },
                     headCells: {
                       style: {
                         textTransform: 'uppercase' as const,
                         letterSpacing: '0.1em',
                         fontSize: '11px',
                         fontWeight: 'bold',
                       }
                     },
                     rows: {
                       style: {
                         minHeight: '62px',
                       },
                       stripedStyle: {
                         backgroundColor: selectedTheme === 'enterprisegrid-brand' ? '#f8fafc' : '#f1f5f9',
                       }
                     },
                     pagination: {
                       style: {
                         borderTopWidth: '2px',
                         borderTopColor: '#3b82f6',
                       }
                     }
                   } : undefined;

                   const conditionalRowStylesOverride = useConditionalRowStyles ? [
                     {
                       when: (row: any) => row.year === '1994',
                       style: {
                         backgroundColor: selectedTheme === 'enterprisegrid-brand' ? 'rgba(79, 70, 229, 0.1)' : 'rgba(20, 184, 166, 0.1)',
                         color: selectedTheme === 'enterprisegrid-brand' ? '#4f46e5' : '#0d9488',
                         fontWeight: 'bold',
                       },
                       classNames: ['border-l-4', 'border-teal-500'],
                     },
                     {
                       when: (row: any) => row.director === 'Christopher Nolan',
                       style: {
                         borderLeftWidth: '4px',
                         borderLeftColor: '#6366f1',
                       }
                     }
                   ] : undefined;

                   return (
                     <div className="space-y-4">
                       {insightsText && (
                         <div className="bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 p-4 rounded-xl shadow-sm relative">
                           <button 
                             onClick={() => setInsightsText(null)}
                             className="absolute top-3 right-3 text-indigo-400 hover:text-indigo-600 transition-colors"
                           >
                             &times;
                           </button>
                           <h4 className="text-indigo-800 font-bold text-sm flex items-center gap-2 mb-2">
                             <Star className="w-4 h-4 text-indigo-500" />
                             AI Analytics Insights
                           </h4>
                           <div className="text-sm text-indigo-900/80 leading-relaxed whitespace-pre-wrap">
                             {insightsText}
                           </div>
                         </div>
                       )}
                       <EnterpriseGridDemo 
                         data={activeData}
                        ref={tableRef}
                        selectableRows={config.selectableRows}
                        selectableRowsSingle={selectableRowsSingle}
                        selectableRowsNoSelectAll={selectableRowsNoSelectAll}
                        selectableRowsVisibleOnly={selectableRowsVisibleOnly}
                        selectableRowsHighlight={selectableRowsHighlight}
                        selectableRowsRange={selectableRowsRange}
                        selectableRowDisabled={selectableRowDisabled}
                        selectableRowSelected={selectableRowSelected}
                        selectedRows={selectedRowsState}
                        selectableRowsComponent={useCustomCheckbox ? CustomCheckbox : 'input'}
                        onSelectedRowsChange={({ allSelected, selectedCount, selectedRows }) => {
                          setCurrentSelectedRows(selectedRows);
                          const log = `onSelectedRowsChange callback executed!
 • All Selected: ${allSelected}
 • Selected Count: ${selectedCount}
 • Selected Rows: ${JSON.stringify(selectedRows.map(r => r.title))}
 • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastSelectionLog(log);
                        }}
                        expandableRows={config.expandableRows}
                        expandableRowsComponent={ExpandedMovieComponent}
                        expandableRowsComponentProps={{ showRating: showRatingInExpanded }}
                        expandableRowExpanded={expandableRowExpanded}
                        expandableRowDisabled={expandableRowDisabled}
                        expandableRowsHideExpander={expandableRowsHideExpander}
                        expandOnRowClicked={expandOnRowClicked}
                        expandOnRowDoubleClicked={expandOnRowDoubleClicked}
                        expandableInheritConditionalStyles={expandableInheritConditionalStyles}
                        expandableIcon={useCustomExpandIcons ? {
                          collapsed: <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 hover:bg-indigo-100 transition-colors">+</span>,
                          expanded: <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 hover:bg-indigo-100 transition-colors">-</span>
                        } : undefined}
                        onRowExpandToggled={(expanded, row) => {
                          const log = `onRowExpandToggled callback executed!
  • Expanded State: ${expanded}
  • Target Row Title: ${row.title} (ID: ${row.id})
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastExpandLog(log);
                        }}
                        onCellEdit={(row, value, column) => {
                          const log = `onCellEdit callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Column ID: ${column.id}
  • New Value: ${value}
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                          setLocalData(prev => prev.map(item => 
                            item.id === row.id ? { ...item, [column.id as string]: value } : item
                          ));
                        }}
                        keyField={config.keyField}
                        onRowClicked={enableRowClicked ? (row, e) => {
                          const log = `onRowClicked callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Modifier Keys: Shift: ${e.shiftKey ? '✅' : '❌'} | Ctrl: ${e.ctrlKey ? '✅' : '❌'} | Alt: ${e.altKey ? '✅' : '❌'} | Meta: ${e.metaKey ? '✅' : '❌'}
  • Target Element: <${(e.target as HTMLElement).tagName.toLowerCase()}>
  • Client Coordinates: X: ${e.clientX}px, Y: ${e.clientY}px
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                        } : undefined}
                        onRowDoubleClicked={enableRowDoubleClicked ? (row, e) => {
                          const log = `onRowDoubleClicked callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Modifier Keys: Shift: ${e.shiftKey ? '✅' : '❌'} | Ctrl: ${e.ctrlKey ? '✅' : '❌'} | Alt: ${e.altKey ? '✅' : '❌'} | Meta: ${e.metaKey ? '✅' : '❌'}
  • Target Element: <${(e.target as HTMLElement).tagName.toLowerCase()}>
  • Client Coordinates: X: ${e.clientX}px, Y: ${e.clientY}px
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                        } : undefined}
                        onRowMiddleClicked={enableRowMiddleClicked ? (row, e) => {
                          const log = `onRowMiddleClicked callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Modifier Keys: Shift: ${e.shiftKey ? '✅' : '❌'} | Ctrl: ${e.ctrlKey ? '✅' : '❌'} | Alt: ${e.altKey ? '✅' : '❌'} | Meta: ${e.metaKey ? '✅' : '❌'}
  • Target Element: <${(e.target as HTMLElement).tagName.toLowerCase()}>
  • Client Coordinates: X: ${e.clientX}px, Y: ${e.clientY}px
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                        } : undefined}
                        onRowMouseEnter={enableRowMouseEnter ? (row, e) => {
                          const log = `onRowMouseEnter callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Client Coordinates: X: ${e.clientX}px, Y: ${e.clientY}px
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                        } : undefined}
                        onRowMouseLeave={enableRowMouseLeave ? (row, e) => {
                          const log = `onRowMouseLeave callback executed!
  • Row Title: "${row.title}" (ID: ${row.id})
  • Client Coordinates: X: ${e.clientX}px, Y: ${e.clientY}px
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                          setLastRowEventLog(log);
                        } : undefined}
                       columns={customColumns}
                       localization={localizationObj}
                       columnFilterOptions={columnFilterOptionsObj}
                       expandableRowsOptions={expandableRowsOptionsObj}
                       resizable={colResizable}
                       columnGroups={colGrouping ? [
                         {
                           id: 'movie_info',
                           name: groupCustomJSX ? (
                              <span className="flex items-center gap-1 text-teal-600 font-bold">
                                🎬 Movie Info
                              </span>
                            ) : 'General Information',
                           columnIds: ['title', 'director'],
                            align: groupAlign,
                            reorder: groupReorder
                         },
                         {
                           id: 'meta_info',
                           name: groupCustomJSX ? (
                              <span className="flex items-center gap-1 text-indigo-600 font-bold">
                                📅 Release Info
                              </span>
                            ) : 'Release Information',
                           columnIds: ['year'],
                            align: groupAlign,
                            reorder: groupReorder
                         }
                       ] : undefined}
                       onColumnOrderChange={(columns) => {
                         const log = `onColumnOrderChange callback executed!
  • New Order: ${columns.map(c => c.name).join(' ➔ ')}
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                         setLastColumnOrderLog(log);
                       }}
                       onColumnGroupOrderChange={(groups, columns) => {
                         const log = `onColumnGroupOrderChange callback executed!
  • New Groups: ${groups.map(g => g.name).join(' ➔ ')}
  • New Columns: ${columns.map(c => c.name).join(' ➔ ')}
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                         setLastColumnGroupOrderLog(log);
                       }}
                       onFilterChange={(columnId, filter) => {
                         const log = `onFilterChange callback executed!
  • Column ID: "${columnId}"
  • Operator: "${filter.operator}"
  • Value: "${filter.value}"
  • Timestamp: ${new Date().toLocaleTimeString()}`;
                         setLastColumnFilterLog(log);
                       }}
                       footerComponent={useCustomFooterComponent ? CustomSummaryFooter : undefined}
                       showFooter={showFooterState === 'auto' ? undefined : (showFooterState === 'true')}
                       progressPending={config.progressPending}
                       progressComponent={config.customProgressComponent ? <CustomLoader /> : undefined}
                       noDataComponent={config.customNoDataComponent ? <CustomEmptyState /> : undefined}
                       config={config} 
                       mapConfig={{ latField: 'lat', lngField: 'lng', titleField: 'title' }}
                       calendarConfig={{ dateField: 'date', titleField: 'title' }}
                       id="demo-table-main"
                       pagination={config.pagination}
                       paginationPerPage={paginationPerPage}
                       paginationPosition={paginationPosition}
                       paginationRowsPerPageOptions={paginationRowsPerPageOptions}
                       paginationDefaultPage={paginationDefaultPage}
                       paginationPage={paginationPage}
                       paginationResetDefaultPage={paginationResetDefaultPage}
                        paginationTotalRows={paginationServer ? serverTotalCount : undefined}
                       paginationServer={paginationServer}
                       paginationComponentOptions={{
                         rowsPerPageText,
                         rangeSeparatorText,
                         noRowsPerPage
                       }}
                       paginationComponent={useCustomPaginationComponent ? CustomPagination : undefined}
                       paginationIcons={useCustomPaginationIcons ? {
                         previous: <span className="font-mono font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors">&lt; Prev</span>,
                         next: <span className="font-mono font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors">Next &gt;</span>,
                         first: <span className="font-mono font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors">&lt;&lt; First</span>,
                         last: <span className="font-mono font-bold text-xs text-indigo-600 hover:text-indigo-800 transition-colors">Last &gt;&gt;</span>
                       } : undefined}
                       onChangePage={(page, totalRows) => {
                         const log = `onChangePage callback executed!
• Target Page: ${page}
• Total Rows Count: ${totalRows}
• Timestamp: ${new Date().toLocaleTimeString()}`;
                         setLastPaginationLog(log);
                         if (paginationServer) {
                           setServerPage(page);
                         }
                       }}
                       onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                         const log = `onChangeRowsPerPage callback executed!
• New Page Size: ${currentRowsPerPage}
• Current Page: ${currentPage}
• Timestamp: ${new Date().toLocaleTimeString()}`;
                         setLastPaginationLog(log);
                         if (paginationServer) {
                           setServerRowsPerPage(currentRowsPerPage);
                           setServerPage(1);
                         }
                       }}

                       // Layout & Appearance props
                       title={hasCustomTitle ? titleText : undefined}
                       actions={
                         <div className="flex items-center gap-2">
                           <button 
                             onClick={generateInsights} 
                             disabled={isGeneratingInsights}
                             className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-[11px] font-bold rounded-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                           >
                             {isGeneratingInsights ? (
                               <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                             ) : (
                               <Star className="w-3 h-3" />
                             )}
                             AI Insights
                           </button>
                           {hasCustomActions && (
                             <button 
                               onClick={() => {
                                 setActionClicked(true);
                                 setTimeout(() => setActionClicked(false), 2000);
                               }}
                               className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold shadow-sm transition-colors"
                             >
                               Add Movie
                             </button>
                           )}
                         </div>
                       }
                       subHeader={hasSubHeader ? (
                         <div className="flex flex-wrap items-center gap-2">
                           <button className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-semibold rounded hover:bg-indigo-700 transition-colors">All Time</button>
                           <button className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold rounded hover:bg-slate-50 transition-colors">80s Hits</button>
                           <button className="px-3 py-1 bg-white border border-slate-200 text-slate-700 text-[10px] font-semibold rounded hover:bg-slate-50 transition-colors">90s Hits</button>
                         </div>
                       ) : undefined}
                       subHeaderAlign={subHeaderAlign}
                       subHeaderWrap={subHeaderWrap}
                       noHeader={noHeader}
                       noTableHead={noTableHead}
                       persistTableHead={persistTableHead}
                       dense={dense}
                       responsive={responsive}
                       fixedHeader={fixedHeader}
                       fixedHeaderScrollHeight={fixedHeaderScrollHeight}
                       onScroll={() => setScrollCount(prev => prev + 1)}
                       direction={direction}
                       disabled={disabled}
                       ariaLabel="Movies list with advanced controls"

                       // Theming & Styling props
                       theme={selectedTheme}
                       striped={striped}
                       highlightOnHover={highlightOnHover}
                       pointerOnHover={pointerOnHover}
                       columnSeparator={columnSeparator === 'none' ? false : columnSeparator}
                       headerSeparator={headerSeparator === 'none' ? false : headerSeparator}
                       animateRows={animateRows}
                       customStyles={customStylesOverride}
                       conditionalRowStyles={conditionalRowStylesOverride}
                        sortMulti={sortMulti}
                        sortServer={sortServer}
                        defaultSortFieldId={useDefaultSort ? defaultSortFieldId : undefined}
                        defaultSortAsc={defaultSortAsc}
                        sortIcon={useCustomSortIcon ? <ArrowUpDown className="w-4 h-4 text-emerald-600 animate-pulse" /> : undefined}
                        sortFunction={useCustomSortFunction ? (rows, column, direction) => {

                          const selector = column.selector;
                          return [...rows].sort((a, b) => {
                            const valA = selector ? selector(a) : '';
                            const valB = selector ? selector(b) : '';
                            if (valA < valB) return direction === 'asc' ? 1 : -1;
                            if (valA > valB) return direction === 'asc' ? -1 : 1;
                            return 0;
                          });
                        } : null}
                        onSort={(column, direction, sortedRows, sortColumns) => {
                          const formattedColumnsLog = sortColumns.map(s => `${s.id} (${s.direction})`).join(', ');
                          const newLog = `onSort callback executed!
• Affected Column: "${column.name}" (id: "${column.id || String(column.name).toLowerCase()}")
• Sort Direction: "${direction}"
• Active Sort Columns: [${formattedColumnsLog || 'none'}]
• Row Count: ${sortedRows.length} rows processed.`;
                          setLastSortLog(newLog);

                          if (sortServer) {
                            setServerSortField(column.id ? String(column.id) : null);
                            if (direction !== 'clear') {
                              setServerSortDirection(direction);
                            }
                            setServerPage(1); // Reset to first page on sort
                          }
                        }}
                     />
                     </div>
                   );
                 })()}
               </div>
               </div>
      </section>
      {/* Features Grid */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Professional Data Management</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">EnterpriseGrid provides a robust set of professional-grade features tailored for high-performance applications. Enable complex AI functionality by simply passing a prop.</p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            {[
              { title: '💬 Row Comments & Mentions', desc: 'Add interactive, thread-based cell and row conversations. Mention team members with autocomplete suggestions dynamically.' },
              { title: '📊 Sparkline Charts', desc: 'Miniature inline trend line, area, or bar charts directly inside grid cells for visual-first analytical clarity.' },
              { title: '🌡️ Heatmap Cells', desc: 'Instantly style numeric columns based on value gradients with accessible WCAG-compliant dynamic text contrast.' },
              { title: '⏳ Time Travel (History Replay)', desc: 'Record layout and view changes dynamically. Step back and forward through previous session states.' },
              { title: '📜 Audit Trail', desc: 'Track, log, and review inline cell edit history during user sessions natively.' },
              { title: '🔗 Shareable Views', desc: 'Generate unique, shareable URLs containing current table state and layout.' },
              { title: '🔖 Saved Views', desc: 'Allow users to persist and load their preferred table configuration seamlessly.' },
              { title: '🗺️ Map View Integration', desc: 'Toggle tabular data into an interactive geospatial map seamlessly.' },
              { title: '📅 Calendar View', desc: 'Visualize date-driven data on an integrated full-featured calendar.' },
              { title: '📊 AI Insights Dashboard', desc: 'Transform raw grid data into an automated dashboard of KPIs and trends.' },
              { title: '🧠 AI Smart Summary', desc: 'Instantly generate an executive summary of your current grid data using AI.' },
              { title: 'AI-Driven Analytics', desc: 'Instantly generate insights, summaries, and data trends directly from the grid.' },
              { title: 'AI Query Assistant', desc: 'Search, filter, and sort datasets conversationally using natural language prompts.' },
              { title: 'Smart Pagination', desc: 'Predictive data fetching and seamless client or server-side pagination.' },
              { title: 'Contextual Selection', desc: 'Multi-row selection tailored for complex learning and data environments.' },
              { title: 'Dynamic Expandables', desc: 'Expand rows to view related AI learning paths, rich media, and deep content.' },
              { title: 'Universal Theming', desc: 'Adaptable UI designed to perfectly match your platform\'s design system.' },
              { title: 'Accessibility First', desc: 'Built for everyone with WAI-ARIA compliance, screen reader, and keyboard support.' },
              { title: 'Inline Cell Editing', desc: 'Real-time cell editing with customizable inputs and instant state synchronization.' },
              { title: 'Advanced Data Sorting', desc: 'Multi-column sorting and custom comparison functions for complex data sets.' },
              { title: 'Responsive Design', desc: 'Fully fluid grids that automatically adapt to any screen size or device.' }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors shadow-sm w-full md:w-[calc(33.333%-22px)] flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
