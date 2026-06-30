import React, { useState, useMemo, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { ChevronDown, Search, ChevronLeft, ChevronRight, Settings2, Download, Eye, EyeOff, LayoutGrid, ChevronsLeft, ChevronsRight, GripVertical, Map as MapIcon, MapPin, Calendar as CalendarIcon, Save, Bookmark, Share2, History, Undo2, Redo2, Clock, MessageSquare, Send, AtSign, X, Star, Command, Terminal, Keyboard, Copy, Check, Cloud, CloudOff, RefreshCw, Trello } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Sparkline, SparklineConfig } from './Sparkline';

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Fix leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

export type SortFunction<T> = (rows: T[], column: TableColumn<T>, direction: 'asc' | 'desc') => T[];

export interface ActiveSort<T> {
  column: TableColumn<T>;
  id: string | number;
  direction: 'asc' | 'desc';
}

export interface DataTableHandle {
  clearSort: () => void;
  clearSelectedRows: () => void;
}

export enum Media {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
}

export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
  AUTO = 'auto',
}

export enum Alignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface CustomCellEditorContext<T> {
  row: T;
  value: string;
  setValue: (next: string) => void;
  commit: (value?: string) => void;
  cancel: () => void;
  column: TableColumn<T>;
}

export type CellEditor<T = unknown> =
  | { type: 'text'; placeholder?: string; }
  | { type: 'number'; placeholder?: string; min?: number; max?: number; step?: number; }
  | { type: 'date'; min?: string; max?: string; }
  | { type: 'checkbox'; }
  | { type: 'select'; options: Array<{ value: string; label: React.ReactNode }>; placeholder?: string; }
  | { type: 'custom'; render: (ctx: CustomCellEditorContext<T>) => React.ReactNode; };

export interface PaginationOptions {
  rowsPerPageText?: string;
  rangeSeparatorText?: string;
  noRowsPerPage?: boolean;
  selectAllRowsItem?: boolean;
  selectAllRowsItemText?: string;
}

export interface PaginationServerOptions {
  persistSelectedOnPageChange?: boolean;
  persistSelectedOnSort?: boolean;
}

export interface PaginationComponentProps {
  rowsPerPage: number;
  rowCount: number;
  currentPage: number;
  onChangePage: (page: number, totalRows: number) => void;
  onChangeRowsPerPage: (numRows: number, currentPage: number) => void;
}

export interface HeatmapConfig {
  min?: number;
  max?: number;
  colorScale?: string[] | 'blues' | 'greens' | 'reds' | 'amber' | 'purples' | 'slate';
  textContrast?: boolean;
}

export type TableColumn<T> = {
  id: string | number;
  name: React.ReactNode;
  selector: (row: T, index?: number) => any;
  cell?: (row: T, index: number, column: TableColumn<T>, id: string | number) => React.ReactNode;
  format?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  sortFunction?: (a: T, b: T) => number;
  sortField?: string;
  filterable?: boolean;
  filterType?: 'text' | 'number' | 'date';
  filterFunction?: (row: T, filter: any) => boolean;
  editable?: boolean;
  editor?: CellEditor<T>;
  validate?: (value: string, row: T, column: TableColumn<T>) => boolean | string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  grow?: number;
  right?: boolean;
  center?: boolean;
  wrap?: boolean;
  compact?: boolean;
  button?: boolean;
  allowOverflow?: boolean;
  ignoreRowClick?: boolean;
  hide?: Media | number | string;
  omit?: boolean;
  reorder?: boolean;
  style?: React.CSSProperties;
  conditionalCellStyles?: ConditionalStyles<T>[];
  footer?: React.ReactNode | ((rows: T[]) => React.ReactNode);
  sparkline?: boolean;
  sparklineConfig?: SparklineConfig;
  heatmap?: boolean;
  heatmapConfig?: HeatmapConfig;
};

export interface FooterComponentProps<T> {
  rows: T[];
  columns: TableColumn<T>[];
}


export interface FilterState {
  value: string | number;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
}

export interface SavedView {
  id: string;
  name: string;
  state: {
    search: string;
    viewMode: 'table' | 'map' | 'calendar' | 'kanban' | 'gallery';
    density: 'compact' | 'normal' | 'spacious';
    columnsOrder: string[];
    visibleColumns: Record<string, boolean>;
    sortColumns: any[];
    internalFilters: Record<string, FilterState>;
    columnWidths: Record<string, number>;
  };
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  rowId: string | number;
  columnId: string;
  columnName: string;
  oldValue: any;
  newValue: any;
}

export interface ColumnGroup {
  id?: string;
  name: React.ReactNode;
  columnIds: (string | number)[];
  align?: 'left' | 'center' | 'right';
  reorder?: boolean;
}

export interface TableStyles {
  table?: {
    style?: React.CSSProperties;
  };
  tableWrapper?: {
    style?: React.CSSProperties;
  };
  responsiveWrapper?: {
    style?: React.CSSProperties;
  };
  header?: {
    style?: React.CSSProperties;
    fontColor?: string;
    fontSize?: string;
  };
  subHeader?: {
    style?: React.CSSProperties;
  };
  head?: {
    style?: React.CSSProperties;
  };
  headRow?: {
    style?: React.CSSProperties;
    denseStyle?: React.CSSProperties;
  };
  headCells?: {
    style?: React.CSSProperties;
    draggingStyle?: React.CSSProperties;
  };
  cells?: {
    style?: React.CSSProperties;
    draggingStyle?: React.CSSProperties;
  };
  rows?: {
    style?: React.CSSProperties;
    selectedHighlightStyle?: React.CSSProperties;
    highlightOnHoverStyle?: React.CSSProperties;
    stripedStyle?: React.CSSProperties;
    denseStyle?: React.CSSProperties;
  };
  expanderRow?: {
    style?: React.CSSProperties;
  };
  expanderCell?: {
    style?: React.CSSProperties;
  };
  expanderButton?: {
    style?: React.CSSProperties;
  };
  pagination?: {
    style?: React.CSSProperties;
    pageButtonsStyle?: React.CSSProperties;
  };
  footer?: {
    style?: React.CSSProperties;
  };
  footerCells?: {
    style?: React.CSSProperties;
  };
  noData?: {
    style?: React.CSSProperties;
  };
  progress?: {
    style?: React.CSSProperties;
  };
}

export interface ConditionalStyles<T> {
  when: (row: T) => boolean;
  style?: React.CSSProperties | ((row: T) => React.CSSProperties);
  classNames?: string[];
}

export interface Theme {
  text: {
    primary: string;
    secondary: string;
    disabled?: string;
  };
  background: {
    default: string;
  };
  context: {
    background: string;
    text: string;
  };
  divider: {
    default: string;
  };
  button: {
    default: string;
    hover: string;
    focus: string;
    disabled?: string;
  };
  selected: {
    default: string;
    text: string;
  };
  highlightOnHover: {
    default: string;
    text: string;
  };
  striped: {
    default: string;
    text: string;
  };
  colorScheme?: 'light' | 'dark';
}

const defaultThemes: Record<string, Theme> = {
  default: {
    text: {
      primary: '#1e293b', // slate-800
      secondary: '#64748b', // slate-500
      disabled: '#94a3b8',
    },
    background: {
      default: '#ffffff',
    },
    context: {
      background: '#e0e7ff', // indigo-100
      text: '#4f46e5', // indigo-600
    },
    divider: {
      default: '#e2e8f0', // slate-200
    },
    button: {
      default: '#64748b',
      hover: 'rgba(0, 0, 0, 0.04)',
      focus: 'rgba(0, 0, 0, 0.12)',
      disabled: 'rgba(0, 0, 0, 0.12)',
    },
    selected: {
      default: '#e0e7ff',
      text: '#4f46e5',
    },
    highlightOnHover: {
      default: 'rgba(0, 0, 0, 0.04)',
      text: '#1e293b',
    },
    striped: {
      default: 'rgba(0, 0, 0, 0.015)',
      text: '#1e293b',
    },
    colorScheme: 'light',
  },
  dark: {
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      disabled: '#475569',
    },
    background: {
      default: '#0f172a',
    },
    context: {
      background: '#312e81',
      text: '#c7d2fe',
    },
    divider: {
      default: '#334155',
    },
    button: {
      default: '#94a3b8',
      hover: 'rgba(255, 255, 255, 0.04)',
      focus: 'rgba(255, 255, 255, 0.12)',
      disabled: 'rgba(255, 255, 255, 0.12)',
    },
    selected: {
      default: '#312e81',
      text: '#c7d2fe',
    },
    highlightOnHover: {
      default: 'rgba(255, 255, 255, 0.04)',
      text: '#f8fafc',
    },
    striped: {
      default: 'rgba(255, 255, 255, 0.02)',
      text: '#f8fafc',
    },
    colorScheme: 'dark',
  }
};

const themeRegistry: Record<string, Theme> = { ...defaultThemes };

export function createTheme(name: string, overrides: Partial<Theme> | any, inherit: string = 'default') {
  const base = themeRegistry[inherit] || themeRegistry.default;
  const text = { ...base.text, ...(overrides?.text || {}) };
  const background = { ...base.background, ...(overrides?.background || {}) };
  const context = { ...base.context, ...(overrides?.context || {}) };
  const divider = { ...base.divider, ...(overrides?.divider || {}) };
  const button = { ...base.button, ...(overrides?.button || {}) };
  const selected = { ...base.selected, ...(overrides?.selected || {}) };
  const highlightOnHover = { ...base.highlightOnHover, ...(overrides?.highlightOnHover || {}) };
  const striped = { ...base.striped, ...(overrides?.striped || {}) };
  const colorScheme = overrides?.colorScheme || base.colorScheme;
  
  themeRegistry[name] = { text, background, context, divider, button, selected, highlightOnHover, striped, colorScheme };
  return themeRegistry[name];
}

export interface Localization {
  pagination?: {
    rowsPerPage?: string;
    nextPage?: string;
    previousPage?: string;
    firstPage?: string;
    lastPage?: string;
    nextPageAriaLabel?: string;
    previousPageAriaLabel?: string;
  };
  filter?: {
    apply?: string;
    clear?: string;
  };
  expandable?: {
    expand?: string;
    collapse?: string;
  };
}

export interface ColumnFilterOptions {
  /** @deprecated Use localization={{ filter: { apply, clear } }} instead */
  applyText?: string;
  /** @deprecated Use localization={{ filter: { apply, clear } }} instead */
  clearText?: string;
}

export interface ExpandableRowsOptions {
  /** @deprecated Use localization={{ expandable: { expand, collapse } }} instead */
  expandText?: string;
  /** @deprecated Use localization={{ expandable: { expand, collapse } }} instead */
  collapseText?: string;
}

export interface DataTablePlugin<T> {
  name: string;
  onInit?: (context: {
    data: T[];
    columns: TableColumn<T>[];
    setViewMode: (viewMode: 'table' | 'map' | 'calendar' | 'kanban' | 'gallery') => void;
    setDensity: (density: 'compact' | 'normal' | 'spacious') => void;
  }) => void;
  renderToolbarLeft?: () => React.ReactNode;
  renderToolbarRight?: () => React.ReactNode;
  renderRowAction?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T, index: number) => void;
  transformData?: (data: T[]) => T[];
  transformColumns?: (columns: TableColumn<T>[]) => TableColumn<T>[];
}

export interface SwipeAction<T> {
  key: string;
  label: string;
  icon?: React.ReactNode;
  className?: string;
  onClick: (row: T, index: number) => void;
}

export interface MobileSwipeConfig<T> {
  left?: SwipeAction<T>[];
  right?: SwipeAction<T>[];
}

type Config = {
  pagination?: boolean;
  selectableRows?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  exportable?: boolean;
  densityToggle?: boolean;
  columnVisibility?: boolean;
  animations?: boolean;
  mapView?: boolean;
  calendarView?: boolean;
  kanbanView?: boolean;
  galleryView?: boolean;
  savedViews?: boolean;
  shareableViews?: boolean;
  auditTrail?: boolean;
  timeTravel?: boolean;
  rowComments?: boolean;
  bookmarks?: boolean;
  commandPalette?: boolean;
  sidePreview?: boolean;
  swipeActions?: boolean;
  offlineEditing?: boolean;
};

interface DataTableProps<T> {
  id?: string;
  data?: T[];
  plugins?: DataTablePlugin<T>[];
  mobileSwipeActions?: MobileSwipeConfig<T>;
  renderSidePreview?: (row: T, onClose: () => void) => React.ReactNode;
  columns?: TableColumn<T>[];
  keyField?: string;
  progressPending?: boolean;
  progressComponent?: React.ReactNode;
  noDataComponent?: React.ReactNode;
  config?: Config;
  mapConfig?: {
    latField: string;
    lngField: string;
    titleField?: string;
  };
  calendarConfig?: {
    dateField: string;
    endDateField?: string;
    titleField?: string;
  };
  kanbanConfig?: {
    columnField: string;
    titleField?: string;
    descriptionField?: string;
    columns?: string[];
  };
  galleryConfig?: {
    titleField?: string;
    descriptionField?: string;
    imageField?: string;
  };
  localization?: Localization;
  columnFilterOptions?: ColumnFilterOptions;
  expandableRowsOptions?: ExpandableRowsOptions;

  // Layout & appearance props
  title?: string | React.ReactNode;
  actions?: React.ReactNode | React.ReactNode[];
  subHeader?: React.ReactNode;
  subHeaderAlign?: Alignment;
  subHeaderWrap?: boolean;
  noHeader?: boolean;
  noTableHead?: boolean;
  persistTableHead?: boolean;
  dense?: boolean;
  responsive?: boolean;
  fixedHeader?: boolean;
  fixedHeaderScrollHeight?: string;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  direction?: Direction;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  disabled?: boolean;

  // Theming & styling props
  theme?: string;
  customStyles?: TableStyles;
  conditionalRowStyles?: ConditionalStyles<T>[];
  striped?: boolean;
  highlightOnHover?: boolean;
  pointerOnHover?: boolean;
  columnSeparator?: boolean | "subtle" | "full";
  headerSeparator?: boolean | "subtle" | "full";
  animateRows?: boolean;

  // Sorting props
  defaultSortFieldId?: string | number;
  defaultSortAsc?: boolean;
  sortServer?: boolean;
  sortMulti?: boolean;
  sortFunction?: SortFunction<T> | null;
  sortIcon?: React.ReactNode;
  onSort?: (
    column: TableColumn<T>,
    direction: 'asc' | 'desc' | 'clear',
    sortedRows: T[],
    sortColumns: ActiveSort<T>[]
  ) => void;

  // Pagination props
  pagination?: boolean;
  paginationPerPage?: number;
  paginationPosition?: 'top' | 'bottom' | 'both';
  paginationRowsPerPageOptions?: number[];
  paginationDefaultPage?: number;
  paginationPage?: number;
  paginationResetDefaultPage?: boolean;
  paginationTotalRows?: number;
  paginationServer?: boolean;
  paginationServerOptions?: PaginationServerOptions;
  paginationComponentOptions?: PaginationOptions;
  paginationComponent?: React.ComponentType<PaginationComponentProps>;
  paginationIcons?: {
    previous?: React.ReactNode;
    next?: React.ReactNode;
    first?: React.ReactNode;
    last?: React.ReactNode;
  };
  onChangePage?: (page: number, totalRows: number) => void;
  onChangeRowsPerPage?: (rowsPerPage: number, page: number) => void;
  footerComponent?: React.ComponentType<FooterComponentProps<T>>;
  showFooter?: boolean;

  // Selection Props
  selectableRows?: boolean;
  selectableRowsSingle?: boolean;
  selectableRowsNoSelectAll?: boolean;
  selectableRowsVisibleOnly?: boolean;
  selectableRowsHighlight?: boolean;
  selectableRowsRange?: boolean;
  selectableRowDisabled?: (row: T) => boolean;
  selectableRowSelected?: (row: T) => boolean;
  selectedRows?: T[];
  selectableRowsComponent?: "input" | React.ComponentType<any>;
  selectableRowsComponentProps?: Record<string, any>;
  onSelectedRowsChange?: (state: { allSelected: boolean; selectedCount: number; selectedRows: T[] }) => void;

  // Expandable Rows Props
  expandableRows?: boolean;
  expandableRowsComponent?: React.ComponentType<{ data: T } & any>;
  expandableRowsComponentProps?: Record<string, any>;
  expandableRowExpanded?: (row: T) => boolean;
  expandableRowDisabled?: (row: T) => boolean;
  expandableRowsHideExpander?: boolean;
  expandOnRowClicked?: boolean;
  expandOnRowDoubleClicked?: boolean;
  expandableInheritConditionalStyles?: boolean;
  expandableIcon?: { collapsed: React.ReactNode; expanded: React.ReactNode };
  onRowExpandToggled?: (expanded: boolean, row: T) => void;

  // Row Events Props
  onRowClicked?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowDoubleClicked?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowMiddleClicked?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowMouseEnter?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;
  onRowMouseLeave?: (row: T, event: React.MouseEvent<HTMLTableRowElement>) => void;

  // Column Features Props
  resizable?: boolean;
  columnGroups?: ColumnGroup[];
  filterValues?: Record<string | number, FilterState>;
  onFilterChange?: (columnId: string | number, filter: FilterState) => void;
  onColumnOrderChange?: (columns: TableColumn<T>[]) => void;
  onColumnGroupOrderChange?: (groups: ColumnGroup[], columns: TableColumn<T>[]) => void;
  onCellEdit?: (row: T, value: string, column: TableColumn<T>) => void;
}

const DefaultSpinner = () => (
  <div className="flex flex-col items-center gap-2 p-8">
    <div className="w-8 h-8 border-2 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
    <span className="text-xs font-medium text-slate-500">Loading records...</span>
  </div>
);

const DefaultNoDataComponent = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4">
    <div className="text-slate-300 mb-2">
      <LayoutGrid className="w-12 h-12 stroke-1" />
    </div>
    <h4 className="text-sm font-semibold text-slate-700">No data available</h4>
    <p className="text-xs text-slate-500 mt-1 text-center max-w-xs">There are no records to display in this view.</p>
  </div>
);

interface AnimatePresenceWrapperProps {
  children: React.ReactNode;
  enabled: boolean;
}

const AnimatePresenceWrapper: React.FC<AnimatePresenceWrapperProps> = ({ children, enabled }) => {
  if (!enabled) {
    return <>{children}</>;
  }
  return (
    <AnimatePresence initial={false} mode="popLayout">
      {children}
    </AnimatePresence>
  );
};

const getNumericValue = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[$,%]/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

const colorPresets: Record<string, [string, string]> = {
  blues: ['#f0f9ff', '#1d4ed8'],
  greens: ['#f0fdf4', '#15803d'],
  reds: ['#fef2f2', '#b91c1c'],
  amber: ['#fffbeb', '#b45309'],
  purples: ['#faf5ff', '#6d28d9'],
  slate: ['#f8fafc', '#334155']
};

function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = color1.startsWith('#') ? color1.replace('#', '') : color1;
  const c2 = color2.startsWith('#') ? color2.replace('#', '') : color2;

  const parseHex = (hex: string) => {
    if (hex.length === 3) {
      return hex.split('').map(char => char + char).join('');
    }
    return hex;
  };

  const hex1 = parseHex(c1);
  const hex2 = parseHex(c2);

  const r1 = parseInt(hex1.substring(0, 2), 16) || 0;
  const g1 = parseInt(hex1.substring(2, 4), 16) || 0;
  const b1 = parseInt(hex1.substring(4, 6), 16) || 0;

  const r2 = parseInt(hex2.substring(0, 2), 16) || 0;
  const g2 = parseInt(hex2.substring(2, 4), 16) || 0;
  const b2 = parseInt(hex2.substring(4, 6), 16) || 0;

  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));

  const rHex = Math.min(Math.max(r, 0), 255).toString(16).padStart(2, '0');
  const gHex = Math.min(Math.max(g, 0), 255).toString(16).padStart(2, '0');
  const bHex = Math.min(Math.max(b, 0), 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function getHeatmapStyles(
  value: number,
  min: number,
  max: number,
  config?: HeatmapConfig
): React.CSSProperties {
  const scale = config?.colorScale || 'blues';
  let startColor = '#f0f9ff';
  let endColor = '#1d4ed8';

  if (Array.isArray(scale)) {
    if (scale.length >= 2) {
      startColor = scale[0];
      endColor = scale[scale.length - 1];
    } else if (scale.length === 1) {
      startColor = '#ffffff';
      endColor = scale[0];
    }
  } else if (typeof scale === 'string' && colorPresets[scale]) {
    [startColor, endColor] = colorPresets[scale];
  }

  let factor = 0;
  if (max > min) {
    factor = (value - min) / (max - min);
  }
  factor = Math.min(Math.max(factor, 0), 1);

  const bgColor = interpolateColor(startColor, endColor, factor);

  let textColor = undefined;
  if (config?.textContrast !== false) {
    const c = bgColor.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    textColor = yiq >= 128 ? '#1e293b' : '#ffffff';
  }

  return {
    backgroundColor: bgColor,
    color: textColor,
  };
}

function DataTableInner<T extends Record<string, any>>({
  id,
  data,
  columns,
  plugins,
  mobileSwipeActions,
  renderSidePreview,
  keyField = 'id',
  progressPending = false,
  progressComponent,
  noDataComponent,
  config,
  mapConfig,
  calendarConfig,
  kanbanConfig,
  galleryConfig,

  // Layout & appearance defaults
  title,
  actions,
  subHeader,
  subHeaderAlign = Alignment.RIGHT,
  subHeaderWrap = true,
  noHeader = false,
  noTableHead = false,
  persistTableHead = false,
  dense = false,
  responsive = true,
  fixedHeader = false,
  fixedHeaderScrollHeight = '100vh',
  onScroll,
  direction = Direction.LTR,
  className = '',
  style = {},
  ariaLabel,
  disabled = false,

  // Theming & styling defaults
  theme = 'default',
  customStyles,
  conditionalRowStyles,
  striped = false,
  highlightOnHover = false,
  pointerOnHover = false,
  columnSeparator,
  headerSeparator = true,
  animateRows = false,

  // Sorting props
  defaultSortFieldId,
  defaultSortAsc = true,
  sortServer = false,
  sortMulti = false,
  sortFunction = null,
  sortIcon,
  onSort,

  // Pagination props
  pagination,
  paginationPerPage = 10,
  paginationPosition = 'bottom',
  paginationRowsPerPageOptions,
  paginationDefaultPage = 1,
  paginationPage,
  paginationResetDefaultPage,
  paginationTotalRows,
  paginationServer = false,
  paginationServerOptions,
  paginationComponentOptions,
  paginationComponent,
  paginationIcons,
  onChangePage,
  onChangeRowsPerPage,
  footerComponent,
  showFooter,

  // Selection Props
  selectableRows,
  selectableRowsSingle = false,
  selectableRowsNoSelectAll = false,
  selectableRowsVisibleOnly = false,
  selectableRowsHighlight = false,
  selectableRowsRange = true,
  selectableRowDisabled,
  selectableRowSelected,
  selectedRows: controlledSelectedRows,
  selectableRowsComponent,
  selectableRowsComponentProps,
  onSelectedRowsChange,

  // Expandable Rows Props
  expandableRows = false,
  expandableRowsComponent,
  expandableRowsComponentProps = {},
  expandableRowExpanded,
  expandableRowDisabled,
  expandableRowsHideExpander = false,
  expandOnRowClicked = false,
  expandOnRowDoubleClicked = false,
  expandableInheritConditionalStyles = false,
  expandableIcon,
  onRowExpandToggled,

  // Row Events Props
  onRowClicked,
  onRowDoubleClicked,
  onRowMiddleClicked,
  onRowMouseEnter,
  onRowMouseLeave,

  // Column Features Props
  resizable = false,
  columnGroups,
  filterValues,
  onFilterChange,
  onColumnOrderChange,
  onColumnGroupOrderChange,
  onCellEdit,
  localization,
  columnFilterOptions,
  expandableRowsOptions,
}: DataTableProps<T>, ref: React.Ref<DataTableHandle>) {
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const actualOnline = isOnline && !simulatedOffline;

  const [offlineChanges, setOfflineChanges] = useState<any[]>(() => {
    if (typeof window !== 'undefined' && id) {
      const saved = localStorage.getItem(`dt_offline_changes_${id}`);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [showOfflineMenu, setShowOfflineMenu] = useState(false);
  const offlineMenuRef = useRef<HTMLDivElement>(null);

  // Sync network state from browser online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && id) {
      localStorage.setItem(`dt_offline_changes_${id}`, JSON.stringify(offlineChanges));
    }
  }, [offlineChanges, id]);

  // Click outside to close offline menu
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (offlineMenuRef.current && !offlineMenuRef.current.contains(e.target as Node)) {
        setShowOfflineMenu(false);
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
  }, []);

  const clearOfflineChanges = () => {
    setOfflineChanges([]);
  };

  const syncOfflineChanges = async () => {
    const pending = offlineChanges.filter(c => c.status === 'pending');
    if (pending.length === 0) return;
    setIsSyncing(true);
    
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: pending })
      });
      
      if (response.ok) {
        // Mark all as synced and trigger onCellEdit callback if provided
        for (const change of pending) {
          const row = (data || []).find((r, idx) => {
            const key = r[keyField] !== undefined ? r[keyField] : (r.id !== undefined ? r.id : idx);
            return String(key) === String(change.rowId);
          });
          const col = columns?.find(c => String(c.id) === String(change.columnId));
          if (row && col && onCellEdit) {
            onCellEdit(row, change.newValue, col);
          }
        }
        setOfflineChanges(prev => prev.map(c => c.status === 'pending' ? { ...c, status: 'synced' } : c));
      } else {
        throw new Error('Server sync failed');
      }
    } catch (err) {
      console.error("Offline sync connection failed, falling back to local simulation:", err);
      // Fallback local simulation
      for (const change of pending) {
        const row = (data || []).find((r, idx) => {
          const key = r[keyField] !== undefined ? r[keyField] : (r.id !== undefined ? r.id : idx);
          return String(key) === String(change.rowId);
        });
        const col = columns?.find(c => String(c.id) === String(change.columnId));
        if (row && col && onCellEdit) {
          onCellEdit(row, change.newValue, col);
        }
      }
      setOfflineChanges(prev => prev.map(c => c.status === 'pending' ? { ...c, status: 'synced' } : c));
    } finally {
      setIsSyncing(false);
      setShowOfflineMenu(false);
    }
  };

  const transformedData = useMemo(() => {
    let result = data || [];
    if (plugins) {
      plugins.forEach(p => {
        if (p.transformData) {
          result = p.transformData(result);
        }
      });
    }

    // Merge pending offline changes if offline editing is enabled
    if (config?.offlineEditing && offlineChanges.length > 0) {
      result = result.map((row: any, idx: number) => {
        const rowKey = row[keyField] !== undefined ? row[keyField] : (row.id !== undefined ? row.id : idx);
        const pendingChanges = offlineChanges.filter(c => String(c.rowId) === String(rowKey) && c.status === 'pending');
        if (pendingChanges.length === 0) return row;

        const updatedRow = { ...row };
        pendingChanges.forEach(change => {
          // Find the column by ID
          const col = columns?.find(c => String(c.id) === String(change.columnId));
          if (col) {
            // Apply value to matching properties
            updatedRow[change.columnId] = change.newValue;
            if (col.sortField) {
              updatedRow[col.sortField] = change.newValue;
            }
          } else {
            // Fallback: apply directly to columnId property
            updatedRow[change.columnId] = change.newValue;
          }
        });
        return updatedRow;
      });
    }

    return result;
  }, [data, plugins, config?.offlineEditing, offlineChanges, keyField, columns]);

  const finalData = transformedData;
  
  const rawColumns = useMemo(() => {
    let result = columns || [];
    if (plugins) {
      plugins.forEach(p => {
        if (p.transformColumns) {
          result = p.transformColumns(result);
        }
      });
    }
    return result;
  }, [columns, plugins]);

  // Column Features State & Logic
  const [columnsOrder, setColumnsOrder] = useState<string[]>([]);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [internalFilters, setInternalFilters] = useState<Record<string, FilterState>>({});
  const [activeFilterPopover, setActiveFilterPopover] = useState<string | null>(null);
  
  // Inline editing state
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colId: string;
    value: string;
    error: string | null;
  } | null>(null);

  // Side Preview Panel states
  const [previewRow, setPreviewRow] = useState<T | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Row Comments & Mentions states
  const [rowCommentsData, setRowCommentsData] = useState<Record<string, {
    id: string;
    user: string;
    text: string;
    timestamp: Date;
  }[]>>({
    "1": [
      { id: "c1", user: "Alice", text: "Hey @Bob, please check the inventory count for this line.", timestamp: new Date(Date.now() - 3600000 * 2) },
      { id: "c2", user: "Bob", text: "On it, @Alice! Looks like we have more coming next week.", timestamp: new Date(Date.now() - 3600000 * 1.5) }
    ],
    "2": [
      { id: "c3", user: "Charlie", text: "The status of this item has been updated to Low Stock. @Emma, please review.", timestamp: new Date(Date.now() - 3600000 * 5) }
    ],
    "3": [
      { id: "c4", user: "Emma", text: "High priority! Let's get this finalized ASAP. @David", timestamp: new Date(Date.now() - 3600000 * 8) }
    ]
  });
  const [selectedCommentRowKey, setSelectedCommentRowKey] = useState<any>(null);
  const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [showMentionsList, setShowMentionsList] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [mentionIndex, setMentionIndex] = useState(-1);

  useEffect(() => {
    if (selectedCommentRowKey) {
      const loadComments = async () => {
        try {
          const res = await fetch(`/api/comments/${selectedCommentRowKey}`);
          if (res.ok) {
            const serverComments = await res.json();
            const parsedComments = serverComments.map((c: any) => ({
              id: c.id,
              user: c.author,
              text: c.text,
              timestamp: new Date(c.timestamp)
            }));
            setRowCommentsData(prev => ({
              ...prev,
              [String(selectedCommentRowKey)]: parsedComments
            }));
          }
        } catch (err) {
          console.error("Failed to load server comments, falling back to local:", err);
        }
      };
      loadComments();
    }
  }, [selectedCommentRowKey]);

  const teamMembers = useMemo(() => ["Alice", "Bob", "Charlie", "David", "Emma"], []);

  const renderCommentText = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        const name = part.slice(1);
        if (teamMembers.includes(name)) {
          return (
            <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 mx-0.5 border border-indigo-100">
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  const activeFilters = useMemo(() => {
    return filterValues !== undefined ? filterValues : internalFilters;
  }, [filterValues, internalFilters]);

  const heatmapRanges = useMemo(() => {
    const ranges: Record<string, { min: number; max: number }> = {};
    rawColumns.forEach(col => {
      if (col.heatmap) {
        const colId = String(col.id || col.name).toLowerCase();
        const configMin = col.heatmapConfig?.min;
        const configMax = col.heatmapConfig?.max;

        if (configMin !== undefined && configMax !== undefined) {
          ranges[colId] = { min: configMin, max: configMax };
        } else {
          let minVal = Infinity;
          let maxVal = -Infinity;
          finalData.forEach((row, rowIndex) => {
            if (col.selector) {
              const rawVal = col.selector(row, rowIndex);
              const num = getNumericValue(rawVal);
              if (num < minVal) minVal = num;
              if (num > maxVal) maxVal = num;
            }
          });
          if (minVal === Infinity) minVal = 0;
          if (maxVal === -Infinity) maxVal = 100;
          if (minVal === maxVal) {
            minVal -= 1;
            maxVal += 1;
          }
          ranges[colId] = {
            min: configMin !== undefined ? configMin : minVal,
            max: configMax !== undefined ? configMax : maxVal
          };
        }
      }
    });
    return ranges;
  }, [finalData, rawColumns]);

  const finalColumns = useMemo(() => {
    let activeCols = rawColumns.filter(col => !col.omit);
    if (columnsOrder.length > 0) {
      const colMap = new Map(activeCols.map(col => [String(col.id || col.name).toLowerCase(), col]));
      const ordered: TableColumn<T>[] = [];
      columnsOrder.forEach(id => {
        const col = colMap.get(id);
        if (col) {
          ordered.push(col);
          colMap.delete(id);
        }
      });
      colMap.forEach(col => {
        ordered.push(col);
      });
      activeCols = ordered;
    }

    const hasRowActions = plugins?.some(p => p.renderRowAction);
    if (hasRowActions) {
      const actionCol: TableColumn<T> = {
        id: 'plugin-actions',
        name: 'Actions',
        right: true,
        selector: () => '',
        cell: (row, index) => (
          <div className="flex items-center justify-end gap-1.5">
            {plugins?.map((p, pIdx) => p.renderRowAction && (
              <React.Fragment key={`p-action-${pIdx}`}>
                {p.renderRowAction(row, index)}
              </React.Fragment>
            ))}
          </div>
        )
      };
      activeCols = [...activeCols, actionCol];
    }

    return activeCols;
  }, [rawColumns, columnsOrder, plugins]);

  useEffect(() => {
    const ids = rawColumns.filter(col => !col.omit).map(col => String(col.id || col.name).toLowerCase());
    const currentSet = new Set(columnsOrder);
    const hasDifference = ids.some(id => !currentSet.has(id)) || ids.length !== columnsOrder.length;
    if (hasDifference) {
      setColumnsOrder(ids);
    }
  }, [rawColumns]);

  // Screen width state for responsive column hiding
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isColHiddenByBreakpoint = (col: TableColumn<T>) => {
    if (col.hide === undefined) return false;
    
    // Check if col.hide is a number (e.g. 768)
    if (typeof col.hide === 'number') {
      return windowWidth < col.hide;
    }
    
    // Check if col.hide is standard media breakpoint
    const breakpointMap: Record<string, number> = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    };
    
    const limit = breakpointMap[String(col.hide).toLowerCase()];
    if (limit !== undefined) {
      return windowWidth < limit;
    }
    
    return false;
  };

  // Style helper for column width / resizing
  const getColStyle = (colId: string): React.CSSProperties => {
    const col = finalColumns.find(c => String(c.id || c.name).toLowerCase() === String(colId).toLowerCase());
    const style: React.CSSProperties = {};

    const resizedWidth = columnWidths[colId];
    if (resizedWidth !== undefined) {
      style.width = resizedWidth;
      style.minWidth = resizedWidth;
      style.maxWidth = resizedWidth;
    } else if (col) {
      if (col.width !== undefined) {
        style.width = col.width;
      }
      if (col.minWidth !== undefined) {
        style.minWidth = col.minWidth;
      }
      if (col.maxWidth !== undefined) {
        style.maxWidth = col.maxWidth;
      }
      if (col.grow !== undefined) {
        style.flexGrow = col.grow;
      }
    }
    return style;
  };

  // Resize handler on mouse down
  const handleResizeStart = (colId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const currentTh = event.currentTarget.parentElement;
    const startWidth = columnWidths[colId] || (currentTh ? currentTh.getBoundingClientRect().width : 150);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX);
      setColumnWidths(prev => ({
        ...prev,
        [colId]: newWidth
      }));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Drag & drop column reordering
  const [draggedColId, setDraggedColId] = useState<string | null>(null);

  const handleDragStart = (colId: string, e: React.DragEvent) => {
    setDraggedColId(colId);
    e.dataTransfer.setData('text/plain', colId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColId: string, e: React.DragEvent) => {
    e.preventDefault();
    const sourceColId = e.dataTransfer.getData('text/plain') || draggedColId;
    if (!sourceColId || sourceColId === targetColId) return;

    const sourceIdx = columnsOrder.indexOf(sourceColId);
    const targetIdx = columnsOrder.indexOf(targetColId);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const nextOrder = [...columnsOrder];
    nextOrder.splice(sourceIdx, 1);
    nextOrder.splice(targetIdx, 0, sourceColId);

    setColumnsOrder(nextOrder);
    setDraggedColId(null);

    const colMap = new Map(rawColumns.map(col => [String(col.id || col.name).toLowerCase(), col]));
    const updatedColumns = nextOrder.map(id => colMap.get(id)).filter(Boolean) as TableColumn<T>[];
    if (onColumnOrderChange) {
      onColumnOrderChange(updatedColumns);
    }
    if (columnGroups && onColumnGroupOrderChange) {
      onColumnGroupOrderChange(columnGroups, updatedColumns);
    }
  };

  // Drag & drop group reordering
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);

  const handleGroupDragStart = (groupId: string, e: React.DragEvent) => {
    setDraggedGroupId(groupId);
    e.dataTransfer.setData('text/group-id', groupId);
  };

  const handleGroupDrop = (targetGroupId: string, e: React.DragEvent) => {
    e.preventDefault();
    const sourceGroupId = e.dataTransfer.getData('text/group-id') || draggedGroupId;
    if (!sourceGroupId || sourceGroupId === targetGroupId || !columnGroups) return;

    const findGroupById = (id: string) => {
      return columnGroups.find((g, idx) => {
        const gId = g.id || (typeof g.name === 'string' ? g.name : `group-index-${idx}`);
        return gId === id;
      });
    };

    const sourceGroup = findGroupById(sourceGroupId);
    const targetGroup = findGroupById(targetGroupId);
    if (!sourceGroup || !targetGroup) return;

    const sourceIdx = columnGroups.indexOf(sourceGroup);
    const targetIdx = columnGroups.indexOf(targetGroup);
    if (sourceIdx === -1 || targetIdx === -1) return;

    const updatedGroups = [...columnGroups];
    updatedGroups.splice(sourceIdx, 1);
    updatedGroups.splice(targetIdx, 0, sourceGroup);

    const groupColIds = sourceGroup.columnIds.map(String);
    const targetColIds = targetGroup.columnIds.map(String);
    
    let firstTargetIdx = columnsOrder.findIndex(id => targetColIds.includes(String(id)));
    if (firstTargetIdx === -1) firstTargetIdx = 0;

    const otherCols = columnsOrder.filter(id => !groupColIds.includes(String(id)));
    const nextOrder = [
      ...otherCols.slice(0, firstTargetIdx),
      ...groupColIds,
      ...otherCols.slice(firstTargetIdx)
    ];

    setColumnsOrder(nextOrder);
    setDraggedGroupId(null);

    const colMap = new Map(rawColumns.map(col => [String(col.id || col.name).toLowerCase(), col]));
    const updatedColumns = nextOrder.map(id => colMap.get(id)).filter(Boolean) as TableColumn<T>[];
    
    if (onColumnGroupOrderChange) {
      onColumnGroupOrderChange(updatedGroups, updatedColumns);
    }
    if (onColumnOrderChange) {
      onColumnOrderChange(updatedColumns);
    }
  };

  // Derived settings merging individual props and config object values (with props taking priority)
  const isSearchable = config?.searchable ?? true;
  const isSortable = config?.sortable ?? true;
  const isPagination = pagination !== undefined ? pagination : (config?.pagination ?? false);
  const isSelectableRows = selectableRows !== undefined ? selectableRows : (config?.selectableRows ?? false);
  const isExportable = config?.exportable ?? true;
  const isColumnVisibility = config?.columnVisibility ?? true;
  const isDensityToggle = config?.densityToggle ?? true;
  const isAnimations = config?.animations ?? true;

  const [sortColumns, setSortColumns] = useState<ActiveSort<T>[]>(() => {
    if (defaultSortFieldId !== undefined) {
      const col = finalColumns.find(c => (String(c.id || c.name).toLowerCase() === String(defaultSortFieldId).toLowerCase()));
      if (col) {
        return [{
          column: col,
          id: defaultSortFieldId,
          direction: defaultSortAsc ? 'asc' : 'desc'
        }];
      }
    }
    return [];
  });

  const sortCol = sortColumns[0]?.id;
  const sortDir = sortColumns[0]?.direction || 'asc';
  const [selected, setSelected] = useState<any[]>([]);
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  const getRowKey = (row: any, index: number) => {
    return row[keyField] !== undefined ? row[keyField] : (row.id !== undefined ? row.id : index);
  };

  const updateSelection = (newSelectedKeys: any[]) => {
    if (controlledSelectedRows === undefined) {
      setSelected(newSelectedKeys);
    }
    
    const selectedRowsList = finalData.filter((row: any, idx: number) => 
      newSelectedKeys.includes(getRowKey(row, idx))
    );

    const selectableRowsInDataset = filteredData.filter((row: any) => {
      return !selectableRowDisabled || !selectableRowDisabled(row);
    });
    const selectableKeys = selectableRowsInDataset.map((row: any, idx: number) => getRowKey(row, idx));
    const allSelected = selectableKeys.length > 0 && selectableKeys.every(k => newSelectedKeys.includes(k));

    const selectableRowsOnPage = paginatedData.filter((row: any) => {
      return !selectableRowDisabled || !selectableRowDisabled(row);
    });
    const pageSelectableKeys = selectableRowsOnPage.map((row: any, idx: number) => getRowKey(row, idx));
    const allSelectedPage = pageSelectableKeys.length > 0 && pageSelectableKeys.every(k => newSelectedKeys.includes(k));

    if (onSelectedRowsChange) {
      onSelectedRowsChange({
        allSelected: selectableRowsVisibleOnly ? allSelectedPage : allSelected,
        selectedCount: selectedRowsList.length,
        selectedRows: selectedRowsList,
      });
    }
  };

  // Sync controlledSelectedRows prop to internal selected state
  useEffect(() => {
    if (controlledSelectedRows !== undefined) {
      const keys = controlledSelectedRows.map((row: any, idx: number) => getRowKey(row, idx));
      setSelected(keys);
    }
  }, [controlledSelectedRows, keyField]);

  // Handle selectableRowSelected pre-selection
  const initialSelectionLoaded = useRef(false);
  useEffect(() => {
    if (selectableRowSelected && controlledSelectedRows === undefined && !initialSelectionLoaded.current) {
      const preSelectedKeys = finalData
        .filter((row: any) => selectableRowSelected(row))
        .map((row: any, idx: number) => getRowKey(row, idx));
      setSelected(preSelectedKeys);
      initialSelectionLoaded.current = true;
    }
  }, [finalData, selectableRowSelected, controlledSelectedRows]);

  // Expandable Rows State
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  const toggleExpandRow = (rowKey: any, row: any) => {
    if (expandableRowDisabled && expandableRowDisabled(row)) return;

    const isExpanded = expandedKeys.includes(rowKey);
    const newExpandedKeys = isExpanded 
      ? expandedKeys.filter(k => k !== rowKey) 
      : [...expandedKeys, rowKey];

    setExpandedKeys(newExpandedKeys);

    if (onRowExpandToggled) {
      onRowExpandToggled(!isExpanded, row);
    }
  };

  // Sync expanded keys based on expandableRowExpanded
  const initialExpansionLoaded = useRef(false);
  useEffect(() => {
    if (expandableRowExpanded && !initialExpansionLoaded.current) {
      const preExpandedKeys = finalData
        .filter((row: any) => expandableRowExpanded(row))
        .map((row: any, idx: number) => getRowKey(row, idx));
      setExpandedKeys(preExpandedKeys);
      initialExpansionLoaded.current = true;
    }
  }, [finalData, expandableRowExpanded]);

  const [search, setSearch] = useState('');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);
  const [bookmarkedKeys, setBookmarkedKeys] = useState<Set<string | number>>(new Set());

  useEffect(() => {
    if (config?.bookmarks) {
      const loadBookmarks = async () => {
        try {
          const res = await fetch('/api/bookmarks');
          if (res.ok) {
            const keys = await res.json();
            setBookmarkedKeys(new Set(keys));
          }
        } catch (err) {
          console.error("Failed to load server bookmarks:", err);
        }
      };
      loadBookmarks();
    }
  }, [config?.bookmarks]);

  const toggleBookmark = async (key: string | number) => {
    // Optimistic UI update
    setBookmarkedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });

    try {
      await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
    } catch (err) {
      console.error("Failed to sync bookmark with server:", err);
    }
  };
  const [viewMode, setViewMode] = useState<'table' | 'map' | 'calendar' | 'kanban' | 'gallery'>('table');

  // Swipe state & touch gesture handlers for Mobile Swipe Actions
  const [swipedRowKey, setSwipedRowKey] = useState<string | number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const swipeStartOffset = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent, rowKey: string | number) => {
    if (!config?.swipeActions || !mobileSwipeActions) return;

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;
    setIsSwiping(true);

    swipeStartOffset.current = swipedRowKey === rowKey ? swipeOffset : 0;

    if (swipedRowKey !== null && swipedRowKey !== rowKey) {
      setSwipedRowKey(null);
      setSwipeOffset(0);
      swipeStartOffset.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent, rowKey: string | number) => {
    if (!isSwiping) return;

    const touch = e.touches[0];
    touchCurrentX.current = touch.clientX;
    touchCurrentY.current = touch.clientY;

    const diffX = touchCurrentX.current - touchStartX.current;
    const diffY = touchCurrentY.current - touchStartY.current;

    // If vertical scrolling is more prominent, ignore swipe gesture
    if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 12) {
      setIsSwiping(false);
      return;
    }

    if (Math.abs(diffX) > 8) {
      if (e.cancelable) {
        e.preventDefault();
      }
      
      const leftActionsWidth = mobileSwipeActions?.left ? mobileSwipeActions.left.length * 70 : 0;
      const rightActionsWidth = mobileSwipeActions?.right ? mobileSwipeActions.right.length * 70 : 0;

      let targetOffset = swipeStartOffset.current + diffX;

      if (targetOffset > 0 && !mobileSwipeActions?.left) {
        targetOffset = 0;
      } else if (targetOffset < 0 && !mobileSwipeActions?.right) {
        targetOffset = 0;
      } else {
        const maxLeft = leftActionsWidth;
        const maxRight = -rightActionsWidth;
        if (targetOffset > maxLeft) {
          targetOffset = maxLeft + (targetOffset - maxLeft) * 0.25;
        } else if (targetOffset < maxRight) {
          targetOffset = maxRight + (targetOffset - maxRight) * 0.25;
        }
      }

      setSwipeOffset(targetOffset);
      setSwipedRowKey(rowKey);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, rowKey: string | number) => {
    if (!isSwiping) return;
    setIsSwiping(false);

    const leftActionsWidth = mobileSwipeActions?.left ? mobileSwipeActions.left.length * 70 : 0;
    const rightActionsWidth = mobileSwipeActions?.right ? mobileSwipeActions.right.length * 70 : 0;

    const threshold = 35;

    if (swipeOffset > threshold && mobileSwipeActions?.left) {
      setSwipeOffset(leftActionsWidth);
      setSwipedRowKey(rowKey);
    } else if (swipeOffset < -threshold && mobileSwipeActions?.right) {
      setSwipeOffset(-rightActionsWidth);
      setSwipedRowKey(rowKey);
    } else {
      setSwipeOffset(0);
      setSwipedRowKey(null);
    }
  };
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandSearch, setCommandSearch] = useState('');
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);

  
  const [internalPage, setInternalPage] = useState(paginationDefaultPage ?? 1);
  const currentPage = paginationPage !== undefined ? paginationPage : internalPage;

  const [internalRowsPerPage, setInternalRowsPerPage] = useState(paginationPerPage ?? 10);
  const rowsPerPage = internalRowsPerPage;

  // Track reset default page toggle
  const lastResetToggleRef = useRef(paginationResetDefaultPage);
  useEffect(() => {
    if (paginationResetDefaultPage !== undefined && paginationResetDefaultPage !== lastResetToggleRef.current) {
      lastResetToggleRef.current = paginationResetDefaultPage;
      if (paginationPage === undefined) {
        setInternalPage(1);
      }
    }
  }, [paginationResetDefaultPage, paginationPage]);

  // Sync rows per page if prop changes
  useEffect(() => {
    if (paginationPerPage !== undefined) {
      setInternalRowsPerPage(paginationPerPage);
    }
  }, [paginationPerPage]);

  const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showSavedViewsMenu, setShowSavedViewsMenu] = useState(false);
  const [savedViewsList, setSavedViewsList] = useState<SavedView[]>([]);
  const [activeSavedViewId, setActiveSavedViewId] = useState<string | null>(null);
  const [newViewName, setNewViewName] = useState('');

  useEffect(() => {
    if (plugins) {
      plugins.forEach(p => {
        if (p.onInit) {
          p.onInit({
            data: finalData,
            columns: rawColumns,
            setViewMode,
            setDensity
          });
        }
      });
    }
  }, [plugins, finalData, rawColumns]);
  
  useEffect(() => {
    if (config?.savedViews) {
      const loadViews = async () => {
        try {
          const res = await fetch('/api/saved-views');
          if (res.ok) {
            setSavedViewsList(await res.json());
          }
        } catch (err) {
          console.error("Failed to load server saved views:", err);
        }
      };
      loadViews();
    }
  }, [config?.savedViews]);

  const saveCurrentView = async () => {
    if (!newViewName.trim()) return;
    
    const viewState = {
      search,
      viewMode,
      density,
      columnsOrder,
      visibleColumns,
      sortColumns,
      internalFilters,
      columnWidths,
    };

    try {
      const res = await fetch('/api/saved-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newViewName.trim(), state: viewState })
      });
      
      if (res.ok) {
        const savedView = await res.json();
        setSavedViewsList(prev => [...prev, savedView]);
        setActiveSavedViewId(savedView.id);
        setNewViewName('');
        setShowSavedViewsMenu(false);
      }
    } catch (err) {
      console.error("Failed to save view to server:", err);
      // Fallback local only
      const newView: SavedView = {
        id: Math.random().toString(36).substr(2, 9),
        name: newViewName.trim(),
        state: viewState
      };
      setSavedViewsList(prev => [...prev, newView]);
      setActiveSavedViewId(newView.id);
      setNewViewName('');
      setShowSavedViewsMenu(false);
    }
  };

  const loadSavedView = (viewId: string) => {
    const view = savedViewsList.find(v => v.id === viewId);
    if (!view) return;
    
    setSearch(view.state.search);
    setViewMode(view.state.viewMode);
    setDensity(view.state.density);
    setColumnsOrder(view.state.columnsOrder);
    setVisibleColumns(view.state.visibleColumns);
    setSortColumns(view.state.sortColumns);
    setInternalFilters(view.state.internalFilters);
    setColumnWidths(view.state.columnWidths);
    
    setActiveSavedViewId(view.id);
    setShowSavedViewsMenu(false);
  };
  
  const [showShareToast, setShowShareToast] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [showAuditModal, setShowAuditModal] = useState(false);

  useEffect(() => {
    if (showAuditModal && config?.auditTrail) {
      const fetchAuditLogs = async () => {
        try {
          const res = await fetch('/api/audit-trail');
          if (res.ok) {
            const serverLogs = await res.json();
            const parsedLogs = serverLogs.map((l: any) => ({
              id: l.id,
              timestamp: new Date(l.timestamp),
              rowId: l.details.match(/ID: (\d+)/)?.[1] || "Server",
              columnId: "system",
              columnName: l.action,
              oldValue: "",
              newValue: l.details
            }));
            setAuditLogs(parsedLogs);
          }
        } catch (err) {
          console.error("Failed to load server audit trail, falling back to local:", err);
        }
      };
      fetchAuditLogs();
    }
  }, [showAuditModal, config?.auditTrail]);

  useEffect(() => {
    if (config?.shareableViews) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const shareParam = id ? `viewState_${id}` : 'viewState';
        const sharedStateBase64 = urlParams.get(shareParam);
        
        if (sharedStateBase64) {
          const jsonStr = atob(sharedStateBase64);
          const state = JSON.parse(jsonStr);
          
          if (state.search !== undefined) setSearch(state.search);
          if (state.viewMode !== undefined) setViewMode(state.viewMode);
          if (state.density !== undefined) setDensity(state.density);
          if (state.columnsOrder !== undefined) setColumnsOrder(state.columnsOrder);
          if (state.visibleColumns !== undefined) setVisibleColumns(state.visibleColumns);
          if (state.sortColumns !== undefined) setSortColumns(state.sortColumns);
          if (state.internalFilters !== undefined) setInternalFilters(state.internalFilters);
          if (state.columnWidths !== undefined) setColumnWidths(state.columnWidths);
        }
      } catch (e) {
        console.error('Failed to parse shared view state', e);
      }
    }
  }, [config?.shareableViews, id]);

  const copyShareLink = () => {
    try {
      const state = {
        search,
        viewMode,
        density,
        columnsOrder,
        visibleColumns,
        sortColumns,
        internalFilters,
        columnWidths,
      };
      
      const jsonStr = JSON.stringify(state);
      const base64Str = btoa(jsonStr);
      
      const url = new URL(window.location.href);
      const shareParam = id ? `viewState_${id}` : 'viewState';
      url.searchParams.set(shareParam, base64Str);
      
      navigator.clipboard.writeText(url.toString());
      
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (e) {
      console.error('Failed to generate share link', e);
    }
  };
  
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => {
    const initialVisibility: Record<string, boolean> = {};
    finalColumns.forEach(col => {
      const colId = String(col.id || col.name).toLowerCase();
      initialVisibility[colId] = true;
    });
    return initialVisibility;
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const savedViewsMenuRef = useRef<HTMLDivElement>(null);
  const timeTravelMenuRef = useRef<HTMLDivElement>(null);

  const [historyStack, setHistoryStack] = useState<{
    timestamp: Date;
    label: string;
    state: {
      search: string;
      viewMode: 'table' | 'map' | 'calendar' | 'kanban' | 'gallery';
      density: 'compact' | 'normal' | 'spacious';
      columnsOrder: string[];
      visibleColumns: Record<string, boolean>;
      sortColumns: any[];
      internalFilters: Record<string, FilterState>;
      columnWidths: Record<string, number>;
    };
  }[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [showTimeTravel, setShowTimeTravel] = useState(false);
  const isApplyingHistory = useRef(false);

  const getActionLabel = (prev: any, next: any) => {
    if (!prev) return 'Initial State';
    if (prev.search !== next.search) return `Searched: "${next.search || '(cleared)'}"`;
    if (prev.viewMode !== next.viewMode) return `Switched View: ${next.viewMode}`;
    if (prev.density !== next.density) return `Changed Density: ${next.density}`;
    
    const prevVis = JSON.stringify(prev.visibleColumns || {});
    const nextVis = JSON.stringify(next.visibleColumns || {});
    if (prevVis !== nextVis) return 'Toggled Columns';
    
    const prevSort = JSON.stringify(prev.sortColumns || []);
    const nextSort = JSON.stringify(next.sortColumns || []);
    if (prevSort !== nextSort) return 'Updated Sorting';
    
    const prevFilters = JSON.stringify(prev.internalFilters || {});
    const nextFilters = JSON.stringify(next.internalFilters || {});
    if (prevFilters !== nextFilters) return 'Filtered Grid';
    
    const prevOrder = JSON.stringify(prev.columnsOrder || []);
    const nextOrder = JSON.stringify(next.columnsOrder || []);
    if (prevOrder !== nextOrder) return 'Reordered Columns';
    
    const prevWidths = JSON.stringify(prev.columnWidths || {});
    const nextWidths = JSON.stringify(next.columnWidths || {});
    if (prevWidths !== nextWidths) return 'Resized Columns';
    
    return 'Grid Updated';
  };

  const jumpToHistoryIndex = (idx: number) => {
    if (idx < 0 || idx >= historyStack.length) return;
    isApplyingHistory.current = true;
    const entry = historyStack[idx];
    
    setSearch(entry.state.search);
    setViewMode(entry.state.viewMode);
    setDensity(entry.state.density);
    setColumnsOrder(entry.state.columnsOrder);
    setVisibleColumns(entry.state.visibleColumns);
    setSortColumns(entry.state.sortColumns);
    setInternalFilters(entry.state.internalFilters);
    setColumnWidths(entry.state.columnWidths);
    
    setHistoryIndex(idx);
    
    setTimeout(() => {
      isApplyingHistory.current = false;
    }, 50);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      jumpToHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      jumpToHistoryIndex(historyIndex + 1);
    }
  };

  useEffect(() => {
    if (!config?.timeTravel) return;
    if (isApplyingHistory.current) return;

    const currentSnapshot = {
      search,
      viewMode,
      density,
      columnsOrder,
      visibleColumns,
      sortColumns,
      internalFilters,
      columnWidths,
    };

    const prevSnapshot = historyIndex >= 0 ? historyStack[historyIndex]?.state : null;
    
    if (prevSnapshot && JSON.stringify(prevSnapshot) === JSON.stringify(currentSnapshot)) {
      return;
    }

    const label = getActionLabel(prevSnapshot, currentSnapshot);
    const newEntry = {
      timestamp: new Date(),
      label,
      state: currentSnapshot,
    };

    const activeStack = historyIndex >= 0 ? historyStack.slice(0, historyIndex + 1) : [];
    const updatedStack = [...activeStack, newEntry];
    setHistoryStack(updatedStack);
    setHistoryIndex(updatedStack.length - 1);
  }, [search, viewMode, density, columnsOrder, visibleColumns, sortColumns, internalFilters, columnWidths, config?.timeTravel]);

  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const themeObj = themeRegistry[theme] || themeRegistry.default;

  const shouldAnimate = (animateRows || isAnimations) && !prefersReducedMotion;

  // Helper to evaluate conditionalRowStyles
  const getConditionalStyles = (row: T) => {
    let combinedStyle: React.CSSProperties = {};
    let combinedClasses: string[] = [];
    
    if (conditionalRowStyles && Array.isArray(conditionalRowStyles)) {
      conditionalRowStyles.forEach(rule => {
        if (rule.when(row)) {
          if (rule.style) {
            const ruleStyle = typeof rule.style === 'function' ? rule.style(row) : rule.style;
            combinedStyle = { ...combinedStyle, ...ruleStyle };
          }
          if (rule.classNames) {
            combinedClasses = [...combinedClasses, ...rule.classNames];
          }
        }
      });
    }
    
    return { style: combinedStyle, className: combinedClasses.join(' ') };
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowColumnsMenu(false);
      }
      if (savedViewsMenuRef.current && !savedViewsMenuRef.current.contains(event.target as Node)) {
        setShowSavedViewsMenu(false);
      }
      if (timeTravelMenuRef.current && !timeTravelMenuRef.current.contains(event.target as Node)) {
        setShowTimeTravel(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update visible columns if finalColumns list changes
  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    finalColumns.forEach(col => {
      const colId = String(col.id || col.name).toLowerCase();
      initialVisibility[colId] = true;
    });
    setVisibleColumns(initialVisibility);
  }, [finalColumns]);

  const sortDataWithColumns = (rowsToSort: T[], configCols: ActiveSort<T>[]) => {
    if (configCols.length === 0) return rowsToSort;
    
    return [...rowsToSort].sort((a, b) => {
      for (const s of configCols) {
        const activeCol = s.column;
        const isAsc = s.direction === 'asc';
        
        if (activeCol.sortFunction) {
          const res = activeCol.sortFunction(a, b);
          if (res !== 0) return isAsc ? res : -res;
          continue;
        }

        const valA = activeCol.selector ? activeCol.selector(a) : (a as any)[s.id];
        const valB = activeCol.selector ? activeCol.selector(b) : (b as any)[s.id];
        
        if (valA === valB) continue;
        
        if (valA === undefined || valA === null) return isAsc ? 1 : -1;
        if (valB === undefined || valB === null) return isAsc ? -1 : 1;
        
        if (typeof valA === 'string' && typeof valB === 'string') {
          const comp = valA.localeCompare(valB);
          if (comp !== 0) {
            return isAsc ? comp : -comp;
          }
          continue;
        }

        if (valA < valB) return isAsc ? -1 : 1;
        if (valA > valB) return isAsc ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (col: TableColumn<T>, event?: React.MouseEvent) => {
    if (disabled) return;
    
    const colId = String(col.id || col.name).toLowerCase();
    const isCtrlClick = event && (event.ctrlKey || event.metaKey);
    const multiSortEnabled = sortMulti && isCtrlClick;

    let newSortColumns: ActiveSort<T>[] = [];

    if (multiSortEnabled) {
      const existingIndex = sortColumns.findIndex(c => c.id === colId);
      if (existingIndex > -1) {
        const existing = sortColumns[existingIndex];
        if (existing.direction === 'asc') {
          newSortColumns = sortColumns.map((c, idx) => 
            idx === existingIndex ? { ...c, direction: 'desc' as const } : c
          );
        } else {
          newSortColumns = sortColumns.filter((_, idx) => idx !== existingIndex);
        }
      } else {
        newSortColumns = [
          ...sortColumns,
          { column: col, id: colId, direction: 'asc' }
        ];
      }
    } else {
      const existing = sortColumns.find(c => c.id === colId);
      if (existing) {
        if (existing.direction === 'asc') {
          newSortColumns = [{ column: col, id: colId, direction: 'desc' }];
        } else {
          newSortColumns = [];
        }
      } else {
        newSortColumns = [{ column: col, id: colId, direction: 'asc' }];
      }
    }

    setSortColumns(newSortColumns);

    if (onSort) {
      const updatedEntry = newSortColumns.find(c => c.id === colId);
      const directionStr = updatedEntry ? updatedEntry.direction : 'clear';
      
      const calculatedSortedRows = sortServer 
        ? filteredData 
        : sortDataWithColumns(filteredData, newSortColumns);

      onSort(col, directionStr, calculatedSortedRows, newSortColumns);
    }
  };

  useImperativeHandle(ref, () => ({
    clearSort: () => {
      if (defaultSortFieldId !== undefined) {
        const col = finalColumns.find(c => (String(c.id || c.name).toLowerCase() === String(defaultSortFieldId).toLowerCase()));
        if (col) {
          const defaultSort: ActiveSort<T>[] = [{
            column: col,
            id: defaultSortFieldId,
            direction: defaultSortAsc ? 'asc' : 'desc'
          }];
          setSortColumns(defaultSort);
          if (onSort) {
            const calculatedSortedRows = sortServer 
              ? filteredData 
              : sortDataWithColumns(filteredData, defaultSort);
            onSort(col, defaultSortAsc ? 'asc' : 'desc', calculatedSortedRows, defaultSort);
          }
          return;
        }
      }
      setSortColumns([]);
      if (onSort && finalColumns[0]) {
        onSort(finalColumns[0], 'clear', filteredData, []);
      }
    },
    clearSelectedRows: () => {
      updateSelection([]);
    }
  }));

  const filteredData = useMemo(() => {
    let result = finalData;

    // 1. Global Search Filter
    if (search && isSearchable) {
      const searchLower = search.toLowerCase();
      result = result.filter((item: T) => {
        return finalColumns.some(col => {
          const val = col.selector(item);
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(searchLower);
        });
      });
    }

    // 2. Column-Level Filters
    const filterKeys = Object.keys(activeFilters);
    if (filterKeys.length > 0) {
      const resolvedFilters = filterKeys.map(colId => {
        const filterState = activeFilters[colId];
        const col = finalColumns.find(c => String(c.id || c.name).toLowerCase() === String(colId).toLowerCase());
        const filterValStr = filterState?.value !== undefined ? String(filterState.value).toLowerCase() : '';
        const filterValNum = filterState?.value !== undefined ? Number(filterState.value) : NaN;
        return {
          colId,
          filterState,
          col,
          filterValStr,
          filterValNum
        };
      }).filter(f => f.filterState && f.col);

      result = result.filter((item: T) => {
        return resolvedFilters.every(({ filterState, col, filterValStr, filterValNum }) => {
          if (!filterState || !col) return true;
          
          if (col.filterFunction) {
            return col.filterFunction(item, filterState);
          }

          const hasVal = filterState.value !== undefined && filterState.value !== null && String(filterState.value).trim() !== '';
          if (!hasVal && filterState.operator !== 'isEmpty' && filterState.operator !== 'isNotEmpty') {
            return true;
          }

          const rawVal = col.selector(item);
          if (filterState.operator === 'isEmpty') {
            return rawVal === null || rawVal === undefined || String(rawVal).trim() === '';
          }
          if (filterState.operator === 'isNotEmpty') {
            return rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '';
          }

          if (rawVal === null || rawVal === undefined) return false;

          const valStr = String(rawVal).toLowerCase();

          switch (filterState.operator) {
            case 'contains':
              return valStr.includes(filterValStr);
            case 'equals':
              return valStr === filterValStr;
            case 'startsWith':
              return valStr.startsWith(filterValStr);
            case 'endsWith':
              return valStr.endsWith(filterValStr);
            case 'greaterThan':
              return Number(rawVal) > filterValNum;
            case 'lessThan':
              return Number(rawVal) < filterValNum;
            default:
              return true;
          }
        });
      });
    }

    // 3. Bookmarks Filter
    if (showOnlyBookmarked && config?.bookmarks) {
      result = result.filter((item: T, idx: number) => {
        const key = getRowKey(item, idx);
        return bookmarkedKeys.has(key);
      });
    }

    return result;
  }, [finalData, search, isSearchable, finalColumns, activeFilters, showOnlyBookmarked, bookmarkedKeys, config?.bookmarks]);

  const sortedData = useMemo(() => {
    if (!isSortable) return filteredData;
    if (sortServer) return filteredData;
    if (sortFunction) {
      const primarySort = sortColumns[0];
      if (!primarySort) return filteredData;
      return sortFunction(filteredData, primarySort.column, primarySort.direction);
    }
    return sortDataWithColumns(filteredData, sortColumns);
  }, [filteredData, sortColumns, isSortable, sortServer, sortFunction]);

  const paginatedData = useMemo(() => {
    if (!isPagination || paginationServer) return sortedData;
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage, isPagination, paginationServer]);

  const totalRows = paginationServer && paginationTotalRows !== undefined ? paginationTotalRows : sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onChangePage) {
      onChangePage(newPage, totalRows);
    }
    if (paginationPage === undefined) {
      setInternalPage(newPage);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage: number) => {
    setInternalRowsPerPage(newRowsPerPage);
    if (onChangeRowsPerPage) {
      onChangeRowsPerPage(newRowsPerPage, currentPage);
    }
    if (paginationPage === undefined) {
      setInternalPage(1);
    }
  };

  const renderPaginationControls = () => {
    if (!isPagination) return null;

    if (paginationComponent) {
      const PaginationComp = paginationComponent;
      return (
        <PaginationComp
          rowsPerPage={rowsPerPage}
          rowCount={totalRows}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          currentPage={currentPage}
        />
      );
    }

    const defaultRowsPerPageOptions = [10, 15, 20, 25, 30];
    const options = paginationRowsPerPageOptions ?? defaultRowsPerPageOptions;

    const rowsPerPageText = localization?.pagination?.rowsPerPage ?? paginationComponentOptions?.rowsPerPageText ?? "Rows per page:";
    const rangeSeparatorText = paginationComponentOptions?.rangeSeparatorText ?? "of";
    const noRowsPerPage = paginationComponentOptions?.noRowsPerPage ?? false;

    const firstPageTitle = localization?.pagination?.firstPage ?? "First Page";
    const prevPageTitle = localization?.pagination?.previousPage ?? "Previous Page";
    const nextPageTitle = localization?.pagination?.nextPage ?? "Next Page";
    const lastPageTitle = localization?.pagination?.lastPage ?? "Last Page";

    const prevAriaLabel = localization?.pagination?.previousPageAriaLabel ?? prevPageTitle;
    const nextAriaLabel = localization?.pagination?.nextPageAriaLabel ?? nextPageTitle;

    const prevIcon = paginationIcons?.previous ?? <ChevronLeft className="w-4 h-4" />;
    const nextIcon = paginationIcons?.next ?? <ChevronRight className="w-4 h-4" />;
    const firstIcon = paginationIcons?.first ?? <ChevronsLeft className="w-4 h-4" />;
    const lastIcon = paginationIcons?.last ?? <ChevronsRight className="w-4 h-4" />;

    const startIdx = totalRows > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0;
    const endIdx = Math.min(currentPage * rowsPerPage, totalRows);

    return (
      <div 
        className="p-3 flex flex-wrap justify-between items-center gap-4 text-xs rounded-b-xl border-t"
        style={{
          backgroundColor: themeObj.background.default === '#ffffff' ? '#f8fafc' : themeObj.background.default,
          color: themeObj.text.secondary,
          borderColor: themeObj.divider.default,
          ...customStyles?.pagination?.style
        }}
      >
        {!noRowsPerPage ? (
          <div className="flex items-center">
            <span style={{ color: themeObj.text.secondary }}>{rowsPerPageText}</span>
            <select 
              className="ml-2 bg-transparent outline-none cursor-pointer border rounded px-1.5 py-0.5 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-xs"
              style={{ borderColor: themeObj.divider.default, color: themeObj.text.primary }}
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              disabled={disabled || (progressPending && paginatedData.length === 0)}
            >
              {options.map((opt) => (
                <option key={opt} value={opt} style={{ backgroundColor: themeObj.background.default, color: themeObj.text.primary }}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div />
        )}
        
        <div className="flex items-center gap-4" style={{ color: themeObj.text.secondary }}>
          <span>
            {totalRows > 0 ? `${startIdx}-${endIdx} ${rangeSeparatorText} ${totalRows}` : `0-0 ${rangeSeparatorText} 0`}
          </span>
          <div className="flex gap-1">
            <button 
              className="p-1 hover:bg-slate-200/50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed" 
              style={{ color: themeObj.text.primary, ...customStyles?.pagination?.pageButtonsStyle }}
              disabled={disabled || currentPage === 1 || (progressPending && paginatedData.length === 0)}
              onClick={() => handlePageChange(1)}
              title={firstPageTitle}
              aria-label={firstPageTitle}
            >
              {firstIcon}
            </button>
            <button 
              className="p-1 hover:bg-slate-200/50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed" 
              style={{ color: themeObj.text.primary, ...customStyles?.pagination?.pageButtonsStyle }}
              disabled={disabled || currentPage === 1 || (progressPending && paginatedData.length === 0)}
              onClick={() => handlePageChange(currentPage - 1)}
              title={prevPageTitle}
              aria-label={prevAriaLabel}
            >
              {prevIcon}
            </button>
            <button 
              className="p-1 hover:bg-slate-200/50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed" 
              style={{ color: themeObj.text.primary, ...customStyles?.pagination?.pageButtonsStyle }}
              disabled={disabled || currentPage >= totalPages || (progressPending && paginatedData.length === 0)}
              onClick={() => handlePageChange(currentPage + 1)}
              title={nextPageTitle}
              aria-label={nextAriaLabel}
            >
              {nextIcon}
            </button>
            <button 
              className="p-1 hover:bg-slate-200/50 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors disabled:cursor-not-allowed" 
              style={{ color: themeObj.text.primary, ...customStyles?.pagination?.pageButtonsStyle }}
              disabled={disabled || currentPage >= totalPages || (progressPending && paginatedData.length === 0)}
              onClick={() => handlePageChange(totalPages)}
              title={lastPageTitle}
              aria-label={lastPageTitle}
            >
              {lastIcon}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const toggleSelectAll = () => {
    if (disabled || selectableRowsSingle) return;
    
    const rowsToTarget = selectableRowsVisibleOnly ? paginatedData : filteredData;
    const selectables = rowsToTarget.filter(row => {
      return !selectableRowDisabled || !selectableRowDisabled(row);
    });
    
    const rowKeys = selectables.map((d, idx) => getRowKey(d, idx));
    const isAllSelected = rowKeys.length > 0 && rowKeys.every(k => selected.includes(k));
    
    if (isAllSelected) {
      updateSelection(selected.filter(k => !rowKeys.includes(k)));
    } else {
      const newSelected = [...selected];
      rowKeys.forEach(k => {
        if (!newSelected.includes(k)) newSelected.push(k);
      });
      updateSelection(newSelected);
    }
  };

  const toggleSelect = (k: any, row: any, index: number, event?: React.MouseEvent) => {
    if (disabled) return;
    if (selectableRowDisabled && selectableRowDisabled(row)) return;

    if (selectableRowsSingle) {
      if (selected.includes(k)) {
        updateSelection([]);
      } else {
        updateSelection([k]);
      }
      setLastClickedIndex(index);
      return;
    }

    if (selectableRowsRange && event && event.shiftKey && lastClickedIndex !== null) {
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      
      const rangeRows = paginatedData.slice(start, end + 1);
      const selectableRangeKeys = rangeRows
        .filter(r => !selectableRowDisabled || !selectableRowDisabled(r))
        .map((r, idx) => getRowKey(r, start + idx));
      
      const newSelected = [...selected];
      selectableRangeKeys.forEach(key => {
        if (!newSelected.includes(key)) {
          newSelected.push(key);
        }
      });
      updateSelection(newSelected);
      setLastClickedIndex(index);
      return;
    }

    if (selected.includes(k)) {
      updateSelection(selected.filter(s => s !== k));
    } else {
      updateSelection([...selected, k]);
    }
    setLastClickedIndex(index);
  };

  const renderCheckbox = ({ checked, onChange, disabled: cbDisabled, isHeader = false }: { checked: boolean; onChange: (e?: any) => void; disabled?: boolean; isHeader?: boolean }) => {
    const defaultClass = "rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer w-4 h-4 disabled:opacity-50 disabled:cursor-not-allowed";
    
    if (selectableRowsComponent && selectableRowsComponent !== 'input') {
      const Component = selectableRowsComponent;
      return (
        <Component
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={cbDisabled}
          ref={isHeader ? headerCheckboxRef : undefined}
          {...(selectableRowsComponentProps || {})}
        />
      );
    }
    
    return (
      <input
        ref={isHeader ? headerCheckboxRef : undefined}
        type="checkbox"
        className={defaultClass}
        checked={checked}
        onChange={onChange}
        disabled={cbDisabled}
        {...(selectableRowsComponentProps || {})}
      />
    );
  };

  const exportCSV = () => {
    if (disabled) return;
    const headers = finalColumns.map(col => col.name);
    const rows = filteredData.map(row => 
      finalColumns.map(col => {
        const val = col.selector(row);
        return typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      })
    );
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pageRowKeys = useMemo(() => {
    const pageRows = paginatedData.filter(row => !selectableRowDisabled || !selectableRowDisabled(row));
    return pageRows.map((d, idx) => getRowKey(d, idx));
  }, [paginatedData, selectableRowDisabled, keyField]);

  const isAllSelectedOnPage = useMemo(() => {
    return pageRowKeys.length > 0 && pageRowKeys.every(k => selected.includes(k));
  }, [pageRowKeys, selected]);

  const isSomeSelectedOnPage = useMemo(() => {
    return pageRowKeys.length > 0 && pageRowKeys.some(k => selected.includes(k)) && !isAllSelectedOnPage;
  }, [pageRowKeys, selected, isAllSelectedOnPage]);

  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isSomeSelectedOnPage;
    }
  }, [isSomeSelectedOnPage]);

  // Reset pagination if search changes
  React.useEffect(() => {
    if (paginationPage === undefined) {
      setInternalPage(1);
    }
  }, [search, paginationPage]);

  // If the prop dense is set to true, it overrides the density selector to compact.
  const actualDensity = dense ? 'compact' : density;
  const cellPadding = actualDensity === 'compact' ? 'p-2' : actualDensity === 'spacious' ? 'p-6' : 'p-4';

  const visibleColumnsCount = finalColumns.filter(col => {
    const colId = String(col.id || col.name).toLowerCase();
    return visibleColumns[colId] !== false && !isColHiddenByBreakpoint(col);
  }).length + (isSelectableRows ? 1 : 0);

  // Check if header bar should be displayed
  const hasHeader = !noHeader && (
    title !== undefined || 
    actions !== undefined || 
    isSearchable || 
    isColumnVisibility || 
    isDensityToggle || 
    isExportable
  );

  // Condition for displaying the table head row
  const showHeaderRow = !noTableHead && (sortedData.length > 0 || persistTableHead || progressPending);

  const rootStyle: React.CSSProperties = {
    backgroundColor: themeObj.background.default,
    color: themeObj.text.primary,
    borderColor: themeObj.divider.default,
    colorScheme: themeObj.colorScheme,
    ...style,
    ...customStyles?.tableWrapper?.style
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: themeObj.background.default === '#ffffff' ? '#f8fafc' : themeObj.background.default,
    color: themeObj.text.primary,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: themeObj.divider.default,
    ...(customStyles?.header?.fontColor ? { color: customStyles.header.fontColor } : {}),
    ...(customStyles?.header?.fontSize ? { fontSize: customStyles.header.fontSize } : {}),
    ...customStyles?.header?.style
  };

  const subHeaderStyle: React.CSSProperties = {
    backgroundColor: themeObj.background.default === '#ffffff' ? 'rgba(248, 250, 252, 0.5)' : themeObj.background.default,
    color: themeObj.text.secondary,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: themeObj.divider.default,
    ...customStyles?.subHeader?.style
  };

  const paginationStyle: React.CSSProperties = {
    backgroundColor: themeObj.background.default === '#ffffff' ? '#f8fafc' : themeObj.background.default,
    color: themeObj.text.secondary,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: themeObj.divider.default,
    ...customStyles?.pagination?.style
  };

  const visibleCols = finalColumns.filter(col => {
    const colId = String(col.id || col.name).toLowerCase();
    return visibleColumns[colId] !== false && !isColHiddenByBreakpoint(col);
  });

  const isExpanderVisible = expandableRows && !expandableRowsHideExpander;
  const isCommentsVisible = !!config?.rowComments;
  const isBookmarksVisible = !!config?.bookmarks;
  const totalColsCount = visibleCols.length + (isSelectableRows ? 1 : 0) + (isExpanderVisible ? 1 : 0) + (isCommentsVisible ? 1 : 0) + (isBookmarksVisible ? 1 : 0);
  const showHeaderSep = headerSeparator !== false && headerSeparator !== undefined;
  const showColSep = columnSeparator !== false && columnSeparator !== undefined;

  const shouldShowFooter = showFooter !== false && (
    showFooter === true ||
    footerComponent !== undefined ||
    visibleCols.some(col => col.footer !== undefined)
  );

  const isCommandPaletteEnabled = config?.commandPalette !== false;

  const commands = useMemo(() => {
    if (!isCommandPaletteEnabled) return [];

    const list: Array<{
      id: string;
      label: string;
      category: string;
      icon: React.ReactNode;
      action: () => void;
      shortcut?: string;
    }> = [];

    // Category: Navigation & Views
    list.push({
      id: 'view-table',
      label: 'Switch to Table View',
      category: 'Views',
      icon: <LayoutGrid className="w-4 h-4 text-slate-500" />,
      action: () => setViewMode('table'),
    });

    if (config?.mapView) {
      list.push({
        id: 'view-map',
        label: 'Switch to Map View',
        category: 'Views',
        icon: <MapIcon className="w-4 h-4 text-slate-500" />,
        action: () => setViewMode('map'),
      });
    }

    if (config?.calendarView) {
      list.push({
        id: 'view-calendar',
        label: 'Switch to Calendar View',
        category: 'Views',
        icon: <CalendarIcon className="w-4 h-4 text-slate-500" />,
        action: () => setViewMode('calendar'),
      });
    }

    // Category: Layout & Style
    list.push(
      {
        id: 'density-compact',
        label: 'Set Density to Compact',
        category: 'Layout & Style',
        icon: <Settings2 className="w-4 h-4 text-slate-500" />,
        action: () => setDensity('compact'),
      },
      {
        id: 'density-normal',
        label: 'Set Density to Standard',
        category: 'Layout & Style',
        icon: <Settings2 className="w-4 h-4 text-slate-500" />,
        action: () => setDensity('normal'),
      },
      {
        id: 'density-spacious',
        label: 'Set Density to Relaxed (Spacious)',
        category: 'Layout & Style',
        icon: <Settings2 className="w-4 h-4 text-slate-500" />,
        action: () => setDensity('spacious'),
      }
    );

    // Category: Favorites & Bookmarks
    if (config?.bookmarks) {
      list.push(
        {
          id: 'bookmarks-only',
          label: 'Show Bookmarked Rows Only',
          category: 'Filters',
          icon: <Star className="w-4 h-4 text-amber-500 fill-amber-400" />,
          action: () => setShowOnlyBookmarked(true),
        },
        {
          id: 'bookmarks-all',
          label: 'Show All Rows (Turn Off Bookmarks Filter)',
          category: 'Filters',
          icon: <Star className="w-4 h-4 text-slate-400" />,
          action: () => setShowOnlyBookmarked(false),
        }
      );
    }

    // Category: Export & Actions
    if (isExportable) {
      list.push({
        id: 'export-csv',
        label: 'Export current view to CSV',
        category: 'Actions',
        icon: <Download className="w-4 h-4 text-emerald-500" />,
        action: () => exportCSV(),
      });
    }

    // Reset Table
    list.push({
      id: 'reset-grid',
      label: 'Reset All Grid Settings & Filters',
      category: 'Actions',
      icon: <X className="w-4 h-4 text-red-500" />,
      action: () => {
        setSearch('');
        setDensity('normal');
        setViewMode('table');
        setInternalFilters({});
        setSortColumns([]);
        if (config?.bookmarks) {
          setShowOnlyBookmarked(false);
        }
        // Restore default column visibility
        const defaultVis: Record<string, boolean> = {};
        finalColumns.forEach(col => {
          const colId = String(col.id || col.name).toLowerCase();
          defaultVis[colId] = col.omit !== true;
        });
        setVisibleColumns(defaultVis);
      },
    });

    // Time Travel
    if (config?.timeTravel) {
      list.push(
        {
          id: 'time-undo',
          label: 'Time Travel: Undo Last Action',
          category: 'History',
          icon: <Undo2 className="w-4 h-4 text-indigo-500" />,
          action: () => handleUndo(),
          shortcut: 'Ctrl+Z'
        },
        {
          id: 'time-redo',
          label: 'Time Travel: Redo Action',
          category: 'History',
          icon: <Redo2 className="w-4 h-4 text-indigo-500" />,
          action: () => handleRedo(),
          shortcut: 'Ctrl+Y'
        }
      );
    }

    // Category: Toggle Column Visibility
    finalColumns.forEach(col => {
      const colId = String(col.id || col.name).toLowerCase();
      const isVisible = visibleColumns[colId] !== false;
      list.push({
        id: `toggle-col-${colId}`,
        label: `${isVisible ? 'Hide' : 'Show'} Column: ${col.name}`,
        category: 'Toggle Columns',
        icon: isVisible ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-indigo-500" />,
        action: () => {
          setVisibleColumns(prev => ({
            ...prev,
            [colId]: !isVisible
          }));
        },
      });
    });

    return list;
  }, [
    isCommandPaletteEnabled,
    config,
    visibleColumns,
    finalColumns,
    showOnlyBookmarked,
    isExportable,
    exportCSV,
    handleUndo,
    handleRedo
  ]);

  const filteredCommands = useMemo(() => {
    if (!commandSearch) return commands;
    const s = commandSearch.toLowerCase();
    return commands.filter(c => 
      c.label.toLowerCase().includes(s) || 
      c.category.toLowerCase().includes(s)
    );
  }, [commands, commandSearch]);

  // Adjust selected index on filtered results change
  useEffect(() => {
    setSelectedCommandIndex(0);
  }, [commandSearch]);

  // Command Palette global keyboard shortcut
  useEffect(() => {
    if (!isCommandPaletteEnabled) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isCommandPaletteEnabled]);

  // Handle keyboard events when Command Palette is open
  const handlePaletteKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedCommandIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedCommandIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedCommandIndex]) {
        filteredCommands[selectedCommandIndex].action();
        setIsCommandPaletteOpen(false);
        setCommandSearch('');
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsCommandPaletteOpen(false);
      setCommandSearch('');
    }
  };

  return (
    <div 
      dir={direction}
      className={`w-full flex flex-col font-sans relative rounded-xl border ${disabled ? 'opacity-60 select-none' : ''} ${className}`}
      style={rootStyle}
      aria-label={ariaLabel}
    >
      {/* Header bar */}
      {hasHeader && (
        <div 
          className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50"
          style={headerStyle}
        >
          <div className="flex items-center gap-3">
            {plugins?.map((p, idx) => p.renderToolbarLeft && (
              <React.Fragment key={`p-tb-left-${idx}`}>
                {p.renderToolbarLeft()}
              </React.Fragment>
            ))}
            {selected.length > 0 && isSelectableRows ? (
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full text-sm font-semibold border border-indigo-100">
                {selected.length} selected
                <button 
                  onClick={() => !disabled && setSelected([])}
                  disabled={disabled}
                  className="ml-1 text-indigo-400 hover:text-indigo-600 font-normal disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
              </div>
            ) : (
              title !== undefined ? (
                typeof title === 'string' ? (
                  <h3 className="font-bold text-lg" style={{ color: themeObj.text.primary }}>{title}</h3>
                ) : (
                  title
                )
              ) : (
                <h3 className="font-semibold" style={{ color: themeObj.text.primary }}>Movies</h3>
              )
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {plugins?.map((p, idx) => p.renderToolbarRight && (
              <React.Fragment key={`p-tb-right-${idx}`}>
                {p.renderToolbarRight()}
              </React.Fragment>
            ))}
            {/* Custom actions rendered on the right side of the header */}
            {actions !== undefined && (
              <div className="flex items-center gap-2 mr-1">
                {React.Children.map(actions, (action, idx) => (
                  <div key={idx}>{action}</div>
                ))}
              </div>
            )}

            {isSearchable && (
              <div className="relative flex-1 sm:flex-none">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search movies..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={disabled}
                  style={{ 
                    backgroundColor: themeObj.background.default === '#ffffff' ? '#ffffff' : 'rgba(255, 255, 255, 0.05)',
                    color: themeObj.text.primary,
                    borderColor: themeObj.divider.default
                  }}
                  className={`pl-9 ${isCommandPaletteEnabled ? 'pr-12' : 'pr-4'} py-1.5 text-sm border rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-48 transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                {isCommandPaletteEnabled && (
                  <kbd 
                    onClick={() => !disabled && setIsCommandPaletteOpen(true)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 hover:bg-slate-200 cursor-pointer border border-slate-200 rounded select-none transition-all active:scale-95"
                    title="Open Command Palette (Ctrl + K)"
                  >
                    <span>⌘</span><span>K</span>
                  </kbd>
                )}
              </div>
            )}

            {(isColumnVisibility || isDensityToggle || isExportable || config?.mapView || config?.calendarView || config?.savedViews || config?.shareableViews || config?.auditTrail || config?.timeTravel || config?.bookmarks || config?.offlineEditing) && (
              <div className="flex items-center gap-2 border-l pl-3" style={{ borderColor: themeObj.divider.default }}>
                {config?.timeTravel && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => !disabled && handleUndo()}
                      disabled={disabled || historyIndex <= 0}
                      style={{ color: themeObj.text.secondary }}
                      className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Undo State Change (Time Travel Back)"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => !disabled && handleRedo()}
                      disabled={disabled || historyIndex >= historyStack.length - 1}
                      style={{ color: themeObj.text.secondary }}
                      className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Redo State Change (Time Travel Forward)"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <div className="relative" ref={timeTravelMenuRef}>
                      <button
                        onClick={() => !disabled && setShowTimeTravel(!showTimeTravel)}
                        disabled={disabled}
                        style={{ color: showTimeTravel ? themeObj.context.text : themeObj.text.secondary }}
                        className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${showTimeTravel ? 'bg-indigo-50/80' : ''}`}
                        title="Timeline Replay (Time Travel Panel)"
                      >
                        <Clock className="w-4 h-4" />
                      </button>
                      
                      {showTimeTravel && !disabled && (
                        <div
                          style={{ backgroundColor: themeObj.background.default, borderColor: themeObj.divider.default }}
                          className="absolute right-0 top-full mt-2 w-64 border shadow-lg rounded-lg py-2 z-10 text-sm flex flex-col"
                        >
                          <div className="px-3 pb-2 mb-2 border-b" style={{ borderColor: themeObj.divider.default }}>
                            <div className="font-semibold text-xs uppercase tracking-wider mb-1" style={{ color: themeObj.text.secondary }}>
                              Time Travel Replay
                            </div>
                            <div className="text-[11px] text-slate-500">
                              Replay or restore previous layout, filter, and search states.
                            </div>
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto px-1 space-y-1">
                            {historyStack.length === 0 ? (
                              <div className="px-3 py-2 text-xs italic text-center" style={{ color: themeObj.text.disabled }}>
                                No history recorded yet.
                              </div>
                            ) : (
                              historyStack.map((item, idx) => {
                                const isActive = idx === historyIndex;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => jumpToHistoryIndex(idx)}
                                    className={`w-full text-left px-3 py-2 rounded-md transition-all flex items-start gap-2 ${isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                  >
                                    <div className="flex-grow min-w-0">
                                      <div className={`text-xs font-medium truncate ${isActive ? 'text-indigo-600' : 'text-slate-800'}`}>
                                        {item.label}
                                      </div>
                                      <div className="text-[9px] text-slate-400 mt-0.5">
                                        {item.timestamp.toLocaleTimeString()}
                                      </div>
                                    </div>
                                    {isActive && (
                                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 flex-shrink-0 animate-pulse" />
                                    )}
                                  </button>
                                );
                              })
                            )}
                          </div>
                          
                          {historyStack.length > 0 && (
                            <div className="px-3 pt-2 mt-2 border-t text-center" style={{ borderColor: themeObj.divider.default }}>
                              <button
                                onClick={() => {
                                  setHistoryStack([]);
                                  setHistoryIndex(-1);
                                  setShowTimeTravel(false);
                                }}
                                className="text-[10px] text-red-500 hover:text-red-700 font-medium transition-colors"
                              >
                                Clear History
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {config?.auditTrail && (
                  <button 
                    onClick={() => !disabled && setShowAuditModal(true)}
                    disabled={disabled}
                    style={{ color: themeObj.text.secondary }}
                    className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50"
                    title="Audit Trail"
                  >
                    <History className="w-4 h-4" />
                  </button>
                )}
                {config?.shareableViews && (
                  <div className="relative">
                    <button 
                      onClick={() => !disabled && copyShareLink()}
                      disabled={disabled}
                      style={{ color: showShareToast ? themeObj.context.text : themeObj.text.secondary }}
                      className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${showShareToast ? 'bg-green-50 text-green-600' : ''}`}
                      title={showShareToast ? "Link Copied!" : "Share View"}
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    {showShareToast && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-800 text-white text-xs font-medium rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                        Link copied!
                      </div>
                    )}
                  </div>
                )}
                {config?.bookmarks && (
                  <button 
                    onClick={() => !disabled && setShowOnlyBookmarked(!showOnlyBookmarked)}
                    disabled={disabled}
                    style={{ color: showOnlyBookmarked ? '#f59e0b' : themeObj.text.secondary }}
                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${showOnlyBookmarked ? 'bg-amber-50/80 text-amber-600' : ''}`}
                    title={showOnlyBookmarked ? "Show All Rows" : "Show Bookmarks Only"}
                  >
                    <Star className={`w-4 h-4 ${showOnlyBookmarked ? 'fill-amber-400 text-amber-500' : ''}`} />
                  </button>
                )}
                {config?.offlineEditing && (
                  <div className="relative" ref={offlineMenuRef}>
                    <button 
                      onClick={() => !disabled && setShowOfflineMenu(!showOfflineMenu)}
                      disabled={disabled}
                      style={{ 
                        color: !actualOnline 
                          ? '#f97316' 
                          : offlineChanges.filter(c => c.status === 'pending').length > 0 
                          ? '#3b82f6' 
                          : themeObj.text.secondary 
                      }}
                      className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 flex items-center gap-1 ${
                        !actualOnline ? 'bg-orange-50/80 text-orange-600' :
                        offlineChanges.filter(c => c.status === 'pending').length > 0 ? 'bg-blue-50/80 text-blue-600' : ''
                      }`}
                      title="Offline Sync Center"
                    >
                      {!actualOnline ? (
                        <CloudOff className="w-4 h-4" />
                      ) : (
                        <Cloud className="w-4 h-4" />
                      )}
                      {offlineChanges.filter(c => c.status === 'pending').length > 0 && (
                        <span className="text-[10px] font-bold bg-indigo-600 text-white rounded-full px-1.5 min-w-[16px] h-4 flex items-center justify-center">
                          {offlineChanges.filter(c => c.status === 'pending').length}
                        </span>
                      )}
                    </button>
                    
                    {showOfflineMenu && !disabled && (
                      <div 
                        style={{ backgroundColor: themeObj.background.default, borderColor: themeObj.divider.default }}
                        className="absolute right-0 top-full mt-2 w-80 border shadow-lg rounded-lg py-3 px-3 z-50 text-sm overflow-hidden flex flex-col max-h-[400px]"
                      >
                        <div className="flex items-center justify-between border-b pb-2 mb-2" style={{ borderColor: themeObj.divider.default }}>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            Offline Sync Center
                          </span>
                          <button 
                            type="button"
                            onClick={() => setShowOfflineMenu(false)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Online/Offline Toggle */}
                        <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg mb-3 border border-slate-100">
                          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                            Network: {actualOnline ? (
                              <span className="text-emerald-600 font-bold">Online</span>
                            ) : (
                              <span className="text-orange-500 font-bold">Offline (Simulated)</span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSimulatedOffline(!simulatedOffline)}
                            className={`px-2 py-0.5 text-[10px] font-bold rounded border transition-colors ${
                              simulatedOffline 
                                ? 'bg-orange-500 text-white border-orange-500' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {simulatedOffline ? 'Go Online' : 'Go Offline'}
                          </button>
                        </div>

                        {/* Sync Controls */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Pending edits in queue:</span>
                            <span className="font-bold text-slate-700">{offlineChanges.filter(c => c.status === 'pending').length}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={offlineChanges.filter(c => c.status === 'pending').length === 0 || !actualOnline || isSyncing}
                              onClick={syncOfflineChanges}
                              className="flex-1 px-3 py-1.5 bg-indigo-600 text-white rounded font-semibold text-xs hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
                            >
                              {isSyncing ? (
                                <>
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                  <span>Syncing...</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3 h-3" />
                                  <span>Sync to Server</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={offlineChanges.filter(c => c.status === 'pending').length === 0 || isSyncing}
                              onClick={clearOfflineChanges}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded font-semibold text-xs hover:bg-slate-200 disabled:opacity-40 transition-colors"
                            >
                              Discard
                            </button>
                          </div>
                        </div>

                        {/* Changes List */}
                        <div className="border-t pt-2 max-h-48 overflow-y-auto" style={{ borderColor: themeObj.divider.default }}>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Pending Changes</span>
                          {offlineChanges.filter(c => c.status === 'pending').length === 0 ? (
                            <div className="text-xs text-slate-400 italic text-center py-4">No pending offline changes. Try editing a cell while offline!</div>
                          ) : (
                            <div className="space-y-2 pr-1">
                              {offlineChanges.filter(c => c.status === 'pending').map(change => (
                                <div key={change.id} className="text-xs border border-slate-100 p-2 rounded-lg bg-slate-50/50 flex flex-col">
                                  <div className="flex justify-between font-semibold text-slate-700 mb-0.5">
                                    <span>Row ID: {String(change.rowId)}</span>
                                    <span className="text-[10px] text-slate-400 font-normal">{new Date(change.timestamp).toLocaleTimeString()}</span>
                                  </div>
                                  <div className="text-slate-500 text-[11px] truncate">
                                    Field: <strong className="text-indigo-600">{change.columnName}</strong>
                                  </div>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-600 mt-1">
                                    <span className="line-through text-slate-400">{String(change.oldValue || 'empty')}</span>
                                    <span>→</span>
                                    <span className="text-emerald-600 font-semibold">{String(change.newValue)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {isCommandPaletteEnabled && (
                  <button 
                    onClick={() => !disabled && setIsCommandPaletteOpen(true)}
                    disabled={disabled}
                    style={{ color: themeObj.text.secondary }}
                    className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50"
                    title="Command Palette (Ctrl + K)"
                  >
                    <Command className="w-4 h-4" />
                  </button>
                )}
                {config?.savedViews && (
                  <div className="relative" ref={savedViewsMenuRef}>
                    <button 
                      onClick={() => !disabled && setShowSavedViewsMenu(!showSavedViewsMenu)}
                      disabled={disabled}
                      style={{ color: showSavedViewsMenu ? themeObj.context.text : themeObj.text.secondary }}
                      className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${showSavedViewsMenu ? 'bg-indigo-50/80' : ''}`}
                      title="Saved Views"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    {showSavedViewsMenu && !disabled && (
                      <div 
                        style={{ backgroundColor: themeObj.background.default, borderColor: themeObj.divider.default }}
                        className="absolute right-0 top-full mt-2 w-64 border shadow-lg rounded-lg py-2 z-10 text-sm overflow-hidden flex flex-col"
                      >
                        <div className="px-3 pb-2 mb-2 border-b" style={{ borderColor: themeObj.divider.default }}>
                          <div className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: themeObj.text.secondary }}>
                            Save Current View
                          </div>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={newViewName}
                              onChange={(e) => setNewViewName(e.target.value)}
                              placeholder="View name..."
                              className="flex-1 text-xs px-2 py-1.5 border rounded outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveCurrentView();
                              }}
                            />
                            <button
                              onClick={saveCurrentView}
                              disabled={!newViewName.trim()}
                              className="px-2 py-1.5 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 disabled:opacity-50 transition-colors flex items-center justify-center"
                              title="Save View"
                            >
                              <Save className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="font-semibold text-xs uppercase tracking-wider px-3 pb-1 pt-1" style={{ color: themeObj.text.secondary }}>
                          Saved Views
                        </div>
                        <div className="max-h-48 overflow-y-auto">
                          {savedViewsList.length === 0 ? (
                            <div className="px-4 py-3 text-xs italic text-center" style={{ color: themeObj.text.disabled }}>
                              No saved views yet.
                            </div>
                          ) : (
                            savedViewsList.map(view => (
                              <button
                                key={view.id}
                                onClick={() => loadSavedView(view.id)}
                                className={`w-full text-left px-4 py-2 hover:bg-slate-100/50 transition-colors flex items-center justify-between group ${activeSavedViewId === view.id ? 'bg-indigo-50/50' : ''}`}
                              >
                                <span className={`text-sm truncate pr-2 ${activeSavedViewId === view.id ? 'font-medium text-indigo-600' : 'text-slate-700'}`}>
                                  {view.name}
                                </span>
                                {activeSavedViewId === view.id && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {config?.mapView && (
                  <button 
                    onClick={() => !disabled && setViewMode(viewMode === 'map' ? 'table' : 'map')}
                    disabled={disabled}
                    style={{ color: viewMode === 'map' ? themeObj.context.text : themeObj.text.secondary }}
                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${viewMode === 'map' ? 'bg-indigo-50/80' : ''}`}
                    title="Map View"
                  >
                    <MapIcon className="w-4 h-4" />
                  </button>
                )}
                {config?.calendarView && (
                  <button 
                    onClick={() => !disabled && setViewMode(viewMode === 'calendar' ? 'table' : 'calendar')}
                    disabled={disabled}
                    style={{ color: viewMode === 'calendar' ? themeObj.context.text : themeObj.text.secondary }}
                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${viewMode === 'calendar' ? 'bg-indigo-50/80' : ''}`}
                    title="Calendar View"
                  >
                    <CalendarIcon className="w-4 h-4" />
                  </button>
                )}
                {config?.kanbanView && (
                  <button 
                    onClick={() => !disabled && setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
                    disabled={disabled}
                    style={{ color: viewMode === 'kanban' ? themeObj.context.text : themeObj.text.secondary }}
                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${viewMode === 'kanban' ? 'bg-indigo-50/80' : ''}`}
                    title="Kanban View"
                  >
                    <Trello className="w-4 h-4" />
                  </button>
                )}
                {config?.galleryView && (
                  <button 
                    onClick={() => !disabled && setViewMode(viewMode === 'gallery' ? 'table' : 'gallery')}
                    disabled={disabled}
                    style={{ color: viewMode === 'gallery' ? themeObj.context.text : themeObj.text.secondary }}
                    className={`p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50 ${viewMode === 'gallery' ? 'bg-indigo-50/80' : ''}`}
                    title="Gallery View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                )}
                <div className="w-px h-4 bg-slate-200/60 mx-1"></div>
                {(isColumnVisibility || isDensityToggle) && (
                  <div className="relative" ref={menuRef}>
                    <button 
                      onClick={() => !disabled && setShowColumnsMenu(!showColumnsMenu)}
                      disabled={disabled}
                      style={{ color: themeObj.text.secondary }}
                      className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors disabled:opacity-50"
                      title="View Options"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    
                    {showColumnsMenu && !disabled && (
                      <div 
                        style={{ backgroundColor: themeObj.background.default, borderColor: themeObj.divider.default }}
                        className="absolute right-0 top-full mt-2 w-48 border shadow-lg rounded-lg py-2 z-10 text-sm"
                      >
                        {isColumnVisibility && (
                          <>
                            <div 
                              style={{ color: themeObj.text.secondary, borderColor: themeObj.divider.default }}
                              className="px-3 pb-2 mb-2 border-b font-semibold text-xs uppercase tracking-wider"
                            >
                              Columns
                            </div>
                            {finalColumns.map(col => {
                              const colId = String(col.id || col.name).toLowerCase();
                              return (
                                <label key={colId} className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-100/10 cursor-pointer">
                                  <span className="capitalize" style={{ color: themeObj.text.primary }}>{col.name}</span>
                                  <button 
                                    onClick={() => setVisibleColumns(prev => ({...prev, [colId]: !prev[colId]}))}
                                    className={`p-0.5 rounded transition-colors ${visibleColumns[colId] !== false ? 'text-indigo-600' : 'text-slate-300'}`}
                                  >
                                    {visibleColumns[colId] !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                  </button>
                                </label>
                              );
                            })}
                          </>
                        )}
                        
                        {isDensityToggle && (
                          <>
                            {isColumnVisibility && <div className="px-3 pt-2 mt-2 border-t" style={{ borderColor: themeObj.divider.default }}></div>}
                            <div 
                              style={{ color: themeObj.text.secondary, borderColor: themeObj.divider.default }}
                              className={`px-3 pb-2 mb-2 ${!isColumnVisibility ? 'border-b' : ''} font-semibold text-xs uppercase tracking-wider`}
                            >
                              Density
                            </div>
                            <div className="px-3 py-2 flex gap-1">
                              {(['compact', 'normal', 'spacious'] as const).map(d => (
                                <button
                                  key={d}
                                  onClick={() => setDensity(d)}
                                  className={`flex-1 py-1 text-xs rounded transition-colors capitalize ${density === d ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-500 hover:bg-slate-100/50'}`}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {isExportable && (
                  <button 
                    onClick={exportCSV}
                    disabled={disabled}
                    style={{ color: themeObj.text.secondary }}
                    className="p-1.5 hover:bg-slate-200/50 rounded-md transition-colors flex items-center gap-1 disabled:opacity-50"
                    title="Export CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub Header bar */}
      {subHeader !== undefined && (
        <div 
          className={`p-3 border-b flex gap-3 items-center ${
            subHeaderAlign === 'left' ? 'justify-start' : 
            subHeaderAlign === 'center' ? 'justify-center' : 'justify-end'
          } ${subHeaderWrap ? 'flex-wrap' : 'flex-nowrap overflow-x-auto'}`}
          style={subHeaderStyle}
        >
          {subHeader}
        </div>
      )}
      
      {(paginationPosition === 'top' || paginationPosition === 'both') && renderPaginationControls()}

      {/* Table container supporting responsive wrapping, scroll event handling, and fixedHeader height config */}
      {viewMode === 'calendar' ? (
        <div className="w-full relative bg-white z-0 p-4" style={{ height: fixedHeader ? fixedHeaderScrollHeight : '600px', minHeight: '400px' }}>
          {progressPending && paginatedData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10" style={customStyles?.progress?.style}>
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          ) : (
            <Calendar
              localizer={localizer}
              events={paginatedData.map((row, idx) => {
                const dateFieldVal = calendarConfig?.dateField ? row[calendarConfig.dateField] : (row['date'] || row['createdAt']);
                const endDateFieldVal = calendarConfig?.endDateField ? row[calendarConfig.endDateField] : undefined;
                const title = calendarConfig?.titleField ? row[calendarConfig.titleField] : (row['title'] || row['name'] || `Event ${idx}`);
                
                let start = new Date();
                if (dateFieldVal) {
                  start = new Date(dateFieldVal);
                }
                
                let end = start;
                if (endDateFieldVal) {
                  end = new Date(endDateFieldVal);
                }
                
                return {
                  title,
                  start,
                  end,
                  resource: row
                };
              })}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
            />
          )}
          {progressPending && paginatedData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[0.5px] z-[1000] transition-all" style={customStyles?.progress?.style}>
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          )}
        </div>
      ) : viewMode === 'map' ? (
        <div className="w-full relative bg-slate-100 z-0" style={{ height: fixedHeader ? fixedHeaderScrollHeight : '400px', minHeight: '290px' }}>
          {progressPending && paginatedData.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 z-10" style={customStyles?.progress?.style}>
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          ) : (
            <MapContainer center={[30, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {paginatedData.map((row, idx) => {
                const latStr = mapConfig?.latField ? row[mapConfig.latField] : row['lat'];
                const lngStr = mapConfig?.lngField ? row[mapConfig.lngField] : row['lng'];
                const title = mapConfig?.titleField ? row[mapConfig.titleField] : (row['title'] || row['name'] || `Item ${idx}`);
                
                if (latStr !== undefined && lngStr !== undefined) {
                  const lat = Number(latStr);
                  const lng = Number(lngStr);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    return (
                      <Marker key={row[keyField] || idx} position={[lat, lng]}>
                        <Popup>{title}</Popup>
                      </Marker>
                    );
                  }
                }
                return null;
              })}
            </MapContainer>
          )}
          {progressPending && paginatedData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[0.5px] z-[1000] transition-all" style={customStyles?.progress?.style}>
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          )}
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="w-full bg-slate-50/50 p-4 border-t border-slate-100 min-h-[400px] overflow-x-auto" style={{ ...(fixedHeader ? { maxHeight: fixedHeaderScrollHeight, overflowY: 'auto' } : {}) }}>
          {progressPending && paginatedData.length === 0 ? (
            <div className="flex items-center justify-center p-6 min-h-[300px]">
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          ) : (() => {
            const groupField = kanbanConfig?.columnField || 'status';
            
            // Get unique column values from config, or from data status values
            let columnValues = kanbanConfig?.columns;
            if (!columnValues) {
              const valuesSet = new Set<string>();
              paginatedData.forEach(row => {
                const val = row[groupField];
                if (val !== undefined && val !== null) {
                  valuesSet.add(String(val));
                }
              });
              columnValues = Array.from(valuesSet);
              if (columnValues.length === 0) {
                columnValues = ['To Do', 'In Progress', 'Completed'];
              }
            }

            // Group data by column value
            const groupedData: Record<string, T[]> = {};
            columnValues.forEach(colVal => {
              groupedData[colVal] = paginatedData.filter(row => String(row[groupField] || '') === colVal);
            });

            return (
              <div className="flex gap-4 items-start min-w-[800px] h-full pb-2">
                {columnValues.map(colVal => (
                  <div 
                    key={colVal} 
                    className="flex-1 min-w-[250px] bg-slate-100/70 border border-slate-200/50 rounded-xl p-3 flex flex-col max-h-[600px]"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="font-bold text-slate-700 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                        {colVal}
                        <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                          {groupedData[colVal]?.length || 0}
                        </span>
                      </span>
                    </div>

                    <div className="space-y-3 overflow-y-auto pr-0.5 flex-1 min-h-[200px]">
                      {groupedData[colVal]?.length === 0 ? (
                        <div className="text-center py-8 text-xs italic text-slate-400 border border-dashed border-slate-200 rounded-lg bg-white/50">
                          No items in this column
                        </div>
                      ) : (
                        groupedData[colVal]?.map((row, rIdx) => {
                          const rowKey = row[keyField] !== undefined ? row[keyField] : rIdx;
                          const title = kanbanConfig?.titleField ? row[kanbanConfig.titleField] : (row['title'] || row['name'] || `Item ${rowKey}`);
                          const description = kanbanConfig?.descriptionField ? row[kanbanConfig.descriptionField] : (row['description'] || row['category'] || '');

                          return (
                            <div 
                              key={rowKey}
                              onClick={(e) => {
                                if (onRowClicked) onRowClicked(row, e as any);
                                if (config?.sidePreview && renderSidePreview) {
                                  setPreviewRow(row);
                                }
                              }}
                              className="bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-indigo-200 flex flex-col gap-2.5 relative"
                            >
                              <div className="flex justify-between items-start gap-1.5">
                                <h5 className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                                  {title}
                                </h5>
                                {config?.bookmarks && (() => {
                                  const rowKeyField = row[keyField] !== undefined ? row[keyField] : (row.id !== undefined ? row.id : rIdx);
                                  const isBookmarked = bookmarkedKeys.has(rowKeyField);
                                  return (
                                    <button 
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleBookmark(rowKeyField);
                                      }}
                                      className={`p-0.5 rounded hover:bg-slate-100 transition-colors ${isBookmarked ? 'text-amber-500' : 'text-slate-300'}`}
                                    >
                                      <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                                    </button>
                                  );
                                })()}
                              </div>

                              {description && (
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                  {description}
                                </p>
                              )}

                              {/* Card Metadata / Values */}
                              <div className="flex flex-wrap gap-1.5 mt-1 border-t pt-2 border-slate-100">
                                {columns?.slice(0, 4).map(col => {
                                  if (col.id === kanbanConfig?.titleField || col.id === kanbanConfig?.descriptionField || col.id === groupField) return null;
                                  const cellVal = col.selector ? col.selector(row, rIdx) : row[col.id];
                                  if (cellVal === undefined || cellVal === null || cellVal === '') return null;
                                  return (
                                    <div key={String(col.id)} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded font-medium truncate max-w-[120px]" title={`${col.name}: ${cellVal}`}>
                                      <span className="font-semibold text-slate-400">{col.name}:</span> {String(cellVal)}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Move Status Dropdown Option */}
                              <div className="flex justify-end border-t pt-2 border-slate-100/60 mt-1">
                                <select
                                  value={String(row[groupField] || '')}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    const col = columns?.find(c => String(c.id) === groupField);
                                    if (col && onCellEdit) {
                                      onCellEdit(row, e.target.value, col);
                                    } else {
                                      if (onCellEdit) {
                                        onCellEdit(row, e.target.value, { id: groupField, name: groupField } as any);
                                      }
                                    }
                                  }}
                                  className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-semibold text-slate-600 hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  {columnValues?.map(opt => (
                                    <option key={opt} value={opt}>Move to {opt}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      ) : viewMode === 'gallery' ? (
        <div className="w-full bg-slate-50/50 p-4 border-t border-slate-100 min-h-[400px]" style={{ ...(fixedHeader ? { maxHeight: fixedHeaderScrollHeight, overflowY: 'auto' } : {}) }}>
          {progressPending && paginatedData.length === 0 ? (
            <div className="flex items-center justify-center p-6 min-h-[300px]">
              {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4">
              {paginatedData.length === 0 ? (
                <div className="w-full text-center py-16 text-sm text-slate-400">
                  {noDataComponent !== undefined ? noDataComponent : 'No items found'}
                </div>
              ) : (
                paginatedData.map((row, rIdx) => {
                  const rowKey = row[keyField] !== undefined ? row[keyField] : rIdx;
                  const title = galleryConfig?.titleField ? row[galleryConfig.titleField] : (row['title'] || row['name'] || `Item ${rowKey}`);
                  const description = galleryConfig?.descriptionField ? row[galleryConfig.descriptionField] : (row['description'] || row['category'] || '');
                  const imageUrl = galleryConfig?.imageField ? row[galleryConfig.imageField] : (row['image'] || row['imageUrl'] || row['avatar'] || row['photo'] || '');

                  const gradientIdx = (Number(rowKey) || rIdx) % 5;
                  const gradients = [
                    'from-indigo-400 to-purple-500',
                    'from-sky-400 to-blue-500',
                    'from-emerald-400 to-teal-500',
                    'from-amber-400 to-orange-500',
                    'from-rose-400 to-pink-500'
                  ];

                  return (
                    <div 
                      key={rowKey}
                      onClick={(e) => {
                        if (onRowClicked) onRowClicked(row, e as any);
                        if (config?.sidePreview && renderSidePreview) {
                          setPreviewRow(row);
                        }
                      }}
                      className="bg-white border border-slate-200/70 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex flex-col group h-full w-full sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)] flex-shrink-0"
                    >
                      <div className="relative w-full h-32 flex-shrink-0 bg-slate-100 overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${gradients[gradientIdx]} opacity-80 flex items-center justify-center relative`}>
                            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                            <span className="font-bold text-white text-3xl font-sans tracking-wide drop-shadow-sm select-none uppercase">
                              {String(title).substring(0, 2)}
                            </span>
                          </div>
                        )}
                        {config?.bookmarks && (() => {
                          const rowKeyField = row[keyField] !== undefined ? row[keyField] : (row.id !== undefined ? row.id : rIdx);
                          const isBookmarked = bookmarkedKeys.has(rowKeyField);
                          return (
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(rowKeyField);
                              }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow backdrop-blur-sm hover:bg-white text-amber-500 hover:scale-110 transition-all"
                            >
                              <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : 'text-slate-300'}`} />
                            </button>
                          );
                        })()}
                      </div>

                      <div className="p-4 flex-grow flex flex-col gap-2">
                        <h5 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {title}
                        </h5>
                        {description && (
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-grow">
                            {description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-slate-100">
                          {columns?.slice(0, 4).map(col => {
                            if (col.id === galleryConfig?.titleField || col.id === galleryConfig?.descriptionField) return null;
                            const cellVal = col.selector ? col.selector(row, rIdx) : row[col.id];
                            if (cellVal === undefined || cellVal === null || cellVal === '') return null;
                            return (
                              <div key={String(col.id)} className="text-[10px] bg-slate-50 text-slate-600 border border-slate-100 px-2 py-0.5 rounded font-medium max-w-full truncate" title={`${col.name}: ${cellVal}`}>
                                <span className="font-semibold text-slate-400">{col.name}:</span> {String(cellVal)}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-row relative w-full items-stretch min-h-[290px] overflow-hidden border-t border-slate-100">
          <div 
            className={`flex-1 ${responsive ? 'overflow-x-auto' : 'overflow-hidden'} relative`}
            onScroll={onScroll}
            style={{ ...(fixedHeader ? { maxHeight: fixedHeaderScrollHeight, overflowY: 'auto' } : {}), ...(responsive ? customStyles?.responsiveWrapper?.style : {}) }}
          >
        <table className="w-full text-left border-collapse" style={customStyles?.table?.style}>
          {showHeaderRow && (() => {
            const getColGroup = (colId: string) => {
              if (!columnGroups) return null;
              return columnGroups.find(g => g.columnIds.map(String).includes(String(colId))) || null;
            };

            const firstRowItems: FirstRowItem[] = [];
            if (columnGroups) {
              let i = 0;
              while (i < visibleCols.length) {
                const col = visibleCols[i];
                const colId = String(col.id || col.name).toLowerCase();
                const group = getColGroup(colId);
                if (group) {
                  const groupColIds = [colId];
                  let j = i + 1;
                  while (j < visibleCols.length) {
                    const nextCol = visibleCols[j];
                    const nextColId = String(nextCol.id || nextCol.name).toLowerCase();
                    const nextGroup = getColGroup(nextColId);
                    if (nextGroup && (nextGroup === group || (nextGroup.id && nextGroup.id === group.id))) {
                      groupColIds.push(nextColId);
                      j++;
                    } else {
                      break;
                    }
                  }
                  firstRowItems.push({
                    type: 'group',
                    group,
                    colSpan: groupColIds.length,
                    colIds: groupColIds
                  });
                  i = j;
                } else {
                  firstRowItems.push({
                    type: 'column',
                    column: col,
                    rowSpan: 2
                  });
                  i++;
                }
              }
            }

            const renderHeaderCell = (col: TableColumn<T>, hasRowSpan = false) => {
              const colId = String(col.id || col.name).toLowerCase();
              const colIndex = visibleCols.findIndex(c => (String(c.id || c.name).toLowerCase()) === colId);
              const actualThIndex = colIndex + (isSelectableRows ? 1 : 0) + (isExpanderVisible ? 1 : 0);
              const widthStyle = getColStyle(colId);

              return (
                <th 
                  key={colId} 
                  rowSpan={hasRowSpan ? 2 : undefined}
                  style={{
                    backgroundColor: themeObj.background.default,
                    color: themeObj.text.secondary,
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: themeObj.divider.default,
                    position: fixedHeader ? 'sticky' : 'relative',
                    top: fixedHeader ? 0 : undefined,
                    zIndex: fixedHeader ? (activeFilterPopover === colId ? 30 : 10) : (activeFilterPopover === colId ? 30 : undefined),
                    boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                    ...customStyles?.headCells?.style,
                    ...(colId === draggedColId ? customStyles?.headCells?.draggingStyle : {}),
                    ...widthStyle
                  }}
                  className={`${cellPadding} ${!disabled && isSortable && col.sortable !== false ? 'cursor-pointer hover:bg-slate-100/5 select-none' : 'cursor-default'} ${col.right ? 'text-right' : col.center ? 'text-center' : 'text-left'} transition-all duration-200 relative`} 
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    if (!disabled && isSortable && col.sortable !== false) {
                      handleSort(col, e);
                    }
                  }}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(colId, e)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(colId, e)}
                >
                  <div className={`flex items-center gap-1.5 ${col.right ? 'justify-end' : col.center ? 'justify-center' : 'justify-start'}`}>
                    <span className="font-semibold">{col.name}</span>
                    
                    {isSortable && col.sortable !== false && (() => {
                      const sortIndex = sortColumns.findIndex(c => c.id === colId);
                      const isSorted = sortIndex > -1;
                      if (!isSorted) return null;
                      
                      const activeDir = sortColumns[sortIndex].direction;
                      const iconToRender = sortIcon !== undefined ? sortIcon : (
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDir === 'asc' ? 'rotate-180' : ''}`} />
                      );
                      
                      return (
                        <div className="flex items-center gap-0.5">
                          {iconToRender}
                          {sortMulti && sortColumns.length > 1 && (
                            <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center scale-90">
                              {sortIndex + 1}
                            </span>
                          )}
                        </div>
                      );
                    })()}

                    {col.filterable && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveFilterPopover(activeFilterPopover === colId ? null : colId);
                        }}
                        className={`p-1 rounded hover:bg-slate-100 transition-colors ml-auto ${activeFilters[colId] ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}
                      >
                        <Search className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {activeFilterPopover === colId && col.filterable && (
                    <div 
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="absolute top-full mt-1.5 right-1 w-56 p-3 bg-white border border-slate-200 rounded-lg shadow-xl text-slate-800 font-normal cursor-default z-[100]"
                      style={{ 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        lineHeight: '1.2'
                      }}
                    >
                      <div className="flex flex-col gap-2 text-left">
                        <span className="text-xs font-semibold text-slate-500">Filter {col.name}</span>
                        
                        <select
                          value={activeFilters[colId]?.operator || 'contains'}
                          onChange={(e) => {
                            const op = e.target.value as any;
                            const currentVal = activeFilters[colId]?.value ?? '';
                            const newFilter = { value: currentVal, operator: op };
                            
                            if (onFilterChange) {
                              onFilterChange(colId, newFilter);
                            } else {
                              setInternalFilters(prev => ({ ...prev, [colId]: newFilter }));
                            }
                          }}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {col.filterType !== 'number' && col.filterType !== 'date' && (
                            <>
                              <option value="contains">Contains</option>
                              <option value="equals">Equals</option>
                              <option value="startsWith">Starts With</option>
                              <option value="endsWith">Ends With</option>
                            </>
                          )}
                          {(col.filterType === 'number' || col.filterType === 'date') && (
                            <>
                              <option value="equals">Equals</option>
                              <option value="greaterThan">Greater Than</option>
                              <option value="lessThan">Less Than</option>
                            </>
                          )}
                          <option value="isEmpty">Is Empty</option>
                          <option value="isNotEmpty">Is Not Empty</option>
                        </select>

                        {activeFilters[colId]?.operator !== 'isEmpty' && activeFilters[colId]?.operator !== 'isNotEmpty' && (
                          <input
                            type={col.filterType === 'number' ? 'number' : col.filterType === 'date' ? 'date' : 'text'}
                            placeholder="Filter value..."
                            value={activeFilters[colId]?.value ?? ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              const op = activeFilters[colId]?.operator || (col.filterType === 'number' || col.filterType === 'date' ? 'equals' : 'contains');
                              const newFilter = { value: val, operator: op };
                              
                              if (onFilterChange) {
                                onFilterChange(colId, newFilter);
                              } else {
                                setInternalFilters(prev => ({ ...prev, [colId]: newFilter }));
                              }
                            }}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        )}

                        <div className="flex justify-end gap-1.5 mt-1 border-t pt-2 border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              if (onFilterChange) {
                                onFilterChange(colId, { value: '', operator: 'contains' });
                              } else {
                                setInternalFilters(prev => {
                                  const next = { ...prev };
                                  delete next[colId];
                                  return next;
                                });
                              }
                              setActiveFilterPopover(null);
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-800 px-2 py-1 rounded transition-colors font-medium"
                          >
                            {localization?.filter?.clear ?? columnFilterOptions?.clearText ?? "Clear"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveFilterPopover(null)}
                            className="text-[10px] bg-indigo-600 text-white hover:bg-indigo-700 px-2.5 py-1 rounded shadow transition-colors font-medium"
                          >
                            {localization?.filter?.apply ?? columnFilterOptions?.applyText ?? "Done"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {resizable && (
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500/50 active:bg-indigo-600 transition-colors z-20"
                      onMouseDown={(e) => handleResizeStart(colId, e)}
                    />
                  )}

                  {showHeaderSep && actualThIndex < totalColsCount - 1 && (
                    <div 
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                      style={{ 
                        height: headerSeparator === 'full' ? '100%' : '60%', 
                        backgroundColor: themeObj.divider.default 
                      }} 
                    />
                  )}
                </th>
              );
            };

            interface FirstRowItem {
              type: 'group' | 'column';
              group?: any;
              column?: any;
              colSpan?: number;
              rowSpan?: number;
              colIds?: string[];
            }

            return (
              <thead style={customStyles?.head?.style}>
                {columnGroups ? (
                  <>
                    <tr 
                      className="border-b text-sm font-semibold text-slate-600 bg-white"
                      style={{ borderBottomColor: themeObj.divider.default, ...customStyles?.headRow?.style, ...(actualDensity === 'compact' ? customStyles?.headRow?.denseStyle : {}) }}
                    >
                      {isExpanderVisible && (
                        <th 
                          rowSpan={2}
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-12 text-center transition-all duration-200`}
                        />
                      )}
                      {isSelectableRows && (
                        <th 
                          rowSpan={2}
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-12 text-center transition-all duration-200`}
                        >
                          {!selectableRowsNoSelectAll && !selectableRowsSingle && renderCheckbox({
                            checked: isAllSelectedOnPage,
                            onChange: toggleSelectAll,
                            disabled: disabled || (progressPending && paginatedData.length === 0),
                            isHeader: true
                          })}
                        </th>
                      )}
                      {config?.bookmarks && (
                        <th 
                          rowSpan={2}
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-12 text-center transition-all duration-200`}
                        >
                          <button
                            type="button"
                            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                            className={`p-1.5 rounded-full transition-colors ${
                              showOnlyBookmarked ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                            }`}
                            title={showOnlyBookmarked ? "Show All Rows" : "Show Bookmarks Only"}
                          >
                            <Star className={`w-4 h-4 ${showOnlyBookmarked ? 'fill-amber-400' : ''}`} />
                          </button>
                        </th>
                      )}
                      {firstRowItems.map((item, idx) => {
                        if (item.type === 'column') {
                          return renderHeaderCell(item.column, true);
                        } else {
                          const groupId = item.group.id || (typeof item.group.name === 'string' ? item.group.name : `group-index-${idx}`);
                          const groupAlign = item.group.align || 'center';
                          const isReorder = !!item.group.reorder;

                          return (
                            <th
                              key={`group-header-${groupId}-${idx}`}
                              colSpan={item.colSpan}
                              draggable={isReorder}
                              onDragStart={(e) => isReorder ? handleGroupDragStart(groupId, e) : undefined}
                              onDragOver={isReorder ? handleDragOver : undefined}
                              onDrop={(e) => isReorder ? handleGroupDrop(groupId, e) : undefined}
                              style={{
                                backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                                color: themeObj.text.primary,
                                borderBottomWidth: '1px',
                                borderBottomStyle: 'solid',
                                borderBottomColor: themeObj.divider.default,
                                textAlign: groupAlign,
                                position: fixedHeader ? 'sticky' : 'relative',
                                top: fixedHeader ? 0 : undefined,
                                zIndex: fixedHeader ? 10 : undefined,
                                boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                              }}
                              className={`${cellPadding} font-bold text-xs uppercase tracking-wider select-none border-r border-slate-100/50 ${
                                groupAlign === 'left' ? 'text-left' : groupAlign === 'right' ? 'text-right' : 'text-center'
                              } ${isReorder ? 'cursor-move' : 'cursor-default'}`}
                            >
                              <div className={`flex items-center gap-1.5 ${
                                groupAlign === 'left' ? 'justify-start' : groupAlign === 'right' ? 'justify-end' : 'justify-center'
                              }`}>
                                {isReorder && <GripVertical className="w-3.5 h-3.5 text-slate-400 cursor-move flex-shrink-0" />}
                                <span className="truncate">{item.group.name}</span>
                              </div>
                            </th>
                          );
                        }
                      })}
                      {config?.rowComments && (
                        <th
                          rowSpan={2}
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            textAlign: 'center',
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-24 font-bold text-xs uppercase tracking-wider select-none text-center transition-all duration-200`}
                        >
                          Comments
                        </th>
                      )}
                    </tr>
                    <tr 
                      className="border-b text-sm font-semibold text-slate-600 bg-white"
                      style={{ borderBottomColor: themeObj.divider.default, ...customStyles?.headRow?.style, ...(actualDensity === 'compact' ? customStyles?.headRow?.denseStyle : {}) }}
                    >
                      {visibleCols.filter(col => {
                        const colId = String(col.id || col.name).toLowerCase();
                        return getColGroup(colId) !== null;
                      }).map(col => renderHeaderCell(col, false))}
                    </tr>
                  </>
                ) : (
                  <tr 
                    className="border-b text-sm font-semibold text-slate-600 bg-white"
                    style={{ borderBottomColor: themeObj.divider.default, ...customStyles?.headRow?.style, ...(actualDensity === 'compact' ? customStyles?.headRow?.denseStyle : {}) }}
                  >
                    {isExpanderVisible && (
                      <th 
                        style={{
                          backgroundColor: themeObj.background.default,
                          color: themeObj.text.secondary,
                          borderBottomWidth: '1px',
                          borderBottomStyle: 'solid',
                          borderBottomColor: themeObj.divider.default,
                          position: fixedHeader ? 'sticky' : 'relative',
                          top: fixedHeader ? 0 : undefined,
                          zIndex: fixedHeader ? 10 : undefined,
                          boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                          ...customStyles?.headCells?.style
                        }}
                        className={`${cellPadding} w-12 text-center transition-all duration-200`}
                      >
                        {showHeaderSep && 0 < totalColsCount - 1 && (
                          <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                            style={{ 
                              height: headerSeparator === 'full' ? '100%' : '60%', 
                              backgroundColor: themeObj.divider.default 
                            }} 
                          />
                        )}
                      </th>
                    )}
                    {isSelectableRows && (() => {
                      const checkboxThIndex = isExpanderVisible ? 1 : 0;
                      return (
                        <th 
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-12 text-center transition-all duration-200`}
                        >
                          {!selectableRowsNoSelectAll && !selectableRowsSingle && renderCheckbox({
                            checked: isAllSelectedOnPage,
                            onChange: toggleSelectAll,
                            disabled: disabled || (progressPending && paginatedData.length === 0),
                            isHeader: true
                          })}
                          {showHeaderSep && checkboxThIndex < totalColsCount - 1 && (
                            <div 
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                              style={{ 
                                height: headerSeparator === 'full' ? '100%' : '60%', 
                                backgroundColor: themeObj.divider.default 
                              }} 
                            />
                          )}
                        </th>
                      );
                    })()}
                    {config?.bookmarks && (() => {
                      const bookmarkThIndex = (isExpanderVisible ? 1 : 0) + (isSelectableRows ? 1 : 0);
                      return (
                        <th 
                          style={{
                            backgroundColor: themeObj.background.default,
                            color: themeObj.text.secondary,
                            borderBottomWidth: '1px',
                            borderBottomStyle: 'solid',
                            borderBottomColor: themeObj.divider.default,
                            position: fixedHeader ? 'sticky' : 'relative',
                            top: fixedHeader ? 0 : undefined,
                            zIndex: fixedHeader ? 10 : undefined,
                            boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                            ...customStyles?.headCells?.style
                          }}
                          className={`${cellPadding} w-12 text-center transition-all duration-200`}
                        >
                          <button
                            type="button"
                            onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                            className={`p-1.5 rounded-full transition-colors ${
                              showOnlyBookmarked ? 'bg-amber-50 text-amber-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                            }`}
                            title={showOnlyBookmarked ? "Show All Rows" : "Show Bookmarks Only"}
                          >
                            <Star className={`w-4 h-4 ${showOnlyBookmarked ? 'fill-amber-400' : ''}`} />
                          </button>
                          {showHeaderSep && bookmarkThIndex < totalColsCount - 1 && (
                            <div 
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                              style={{ 
                                height: headerSeparator === 'full' ? '100%' : '60%', 
                                backgroundColor: themeObj.divider.default 
                              }} 
                            />
                          )}
                        </th>
                      );
                    })()}
                    {visibleCols.map((col) => renderHeaderCell(col, false))}
                    {config?.rowComments && (
                      <th
                        style={{
                          backgroundColor: themeObj.background.default,
                          color: themeObj.text.secondary,
                          borderBottomWidth: '1px',
                          borderBottomStyle: 'solid',
                          borderBottomColor: themeObj.divider.default,
                          position: fixedHeader ? 'sticky' : 'relative',
                          top: fixedHeader ? 0 : undefined,
                          zIndex: fixedHeader ? 10 : undefined,
                          boxShadow: fixedHeader ? `0 1px 0 0 ${themeObj.divider.default}` : undefined,
                          textAlign: 'center',
                          ...customStyles?.headCells?.style
                        }}
                        className={`${cellPadding} w-24 font-bold text-xs uppercase tracking-wider select-none text-center transition-all duration-200`}
                      >
                        Comments
                      </th>
                    )}
                  </tr>
                )}
              </thead>
            );
          })()}
          <tbody className={`text-sm relative ${progressPending && paginatedData.length > 0 ? 'opacity-40 pointer-events-none transition-opacity duration-200' : ''}`}>
            <AnimatePresenceWrapper enabled={!expandableRows}>
              {progressPending && paginatedData.length === 0 ? (
                progressComponent !== undefined ? (
                  <tr>
                    <td colSpan={totalColsCount} className="p-0" style={customStyles?.progress?.style}>
                      {progressComponent}
                    </td>
                  </tr>
                ) : (
                  // Shimmer skeleton loader for initial load
                  Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={`skeleton-${rowIndex}`} className="border-b animate-pulse" style={{ backgroundColor: themeObj.background.default, borderColor: themeObj.divider.default }}>
                      {isSelectableRows && (
                        <td className={`${cellPadding} text-center`}>
                          <div className="w-4 h-4 bg-slate-200 rounded mx-auto"></div>
                        </td>
                      )}
                      {finalColumns.map((col) => {
                        const colId = String(col.id || col.name).toLowerCase();
                        if (visibleColumns[colId] === false || isColHiddenByBreakpoint(col)) return null;
                        const widthStyle = getColStyle(colId);
                        return (
                          <td key={`skeleton-cell-${colId}`} className={cellPadding} style={widthStyle}>
                            <div className="h-4 bg-slate-200/50 rounded w-5/6"></div>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => {
                  const RowWrapper = shouldAnimate ? motion.tr : 'tr';
                  const animProps = shouldAnimate ? {
                    layout: true,
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    exit: { opacity: 0, scale: 0.95 },
                    transition: { 
                      duration: 0.2,
                      delay: animateRows ? Math.min(rowIndex * 0.03, 0.3) : 0
                    }
                  } : {};
                  
                  const rowKey = row[keyField] !== undefined ? row[keyField] : row.id;
                  const isRowSelected = selected.includes(rowKey);
                  const isStripedRow = striped && rowIndex % 2 === 1;
                  const isHovered = hoveredRowIndex === rowIndex;
                  const isRowDisabled = selectableRowDisabled ? selectableRowDisabled(row) : false;
                  const highlightSelected = selectableRowsHighlight === true;

                  // Evaluate conditional styles for this row
                  const cond = getConditionalStyles(row);

                  let computedRowStyle: React.CSSProperties = {
                    color: themeObj.text.primary,
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                    borderBottomColor: themeObj.divider.default,
                    cursor: pointerOnHover ? 'pointer' : (isSelectableRows && !disabled && !isRowDisabled ? 'pointer' : (isRowDisabled ? 'not-allowed' : 'default')),
                    transition: 'background-color 150ms ease, color 150ms ease',
                    opacity: isRowDisabled ? 0.6 : 1,
                    ...customStyles?.rows?.style
                  };

                  if (isRowSelected && isSelectableRows && highlightSelected) {
                    computedRowStyle = {
                      ...computedRowStyle,
                      backgroundColor: themeObj.selected.default,
                      color: themeObj.selected.text,
                      ...customStyles?.rows?.selectedHighlightStyle
                    };
                  } else if (isHovered && highlightOnHover && !isRowDisabled) {
                    computedRowStyle = {
                      ...computedRowStyle,
                      backgroundColor: themeObj.highlightOnHover.default, color: themeObj.highlightOnHover.text,
                      ...customStyles?.rows?.highlightOnHoverStyle
                    };
                  } else if (isStripedRow) {
                    computedRowStyle = {
                      ...computedRowStyle,
                      backgroundColor: themeObj.striped.default,
                      color: themeObj.striped.text,
                      ...customStyles?.rows?.stripedStyle
                    };
                  } else {
                    computedRowStyle.backgroundColor = themeObj.background.default;
                  }

                  // Merge in any conditional row styles
                  computedRowStyle = {
                    ...computedRowStyle,
                    ...cond.style
                  };                  const isExpanded = expandedKeys.includes(rowKey);
                  const expandedRowStyle: React.CSSProperties = expandableInheritConditionalStyles 
                    ? { ...computedRowStyle, cursor: 'default' } 
                    : { backgroundColor: themeObj.background.default, color: themeObj.text.primary };

                  const rowSwipeStyle: React.CSSProperties = swipedRowKey === rowKey ? {
                    transform: `translateX(${swipeOffset}px)`,
                    transition: isSwiping ? 'none' : 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    zIndex: 10,
                  } : {
                    transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                  };

                  computedRowStyle = {
                    ...computedRowStyle,
                    ...rowSwipeStyle
                  };

                  const rowElement = (
                    <RowWrapper 
                      key={`row-${rowKey}`} 
                      {...(animProps as any)}
                      className={`border-b transition-colors ${cond.className}`}
                      style={computedRowStyle}
                      onTouchStart={(e) => handleTouchStart(e, rowKey)}
                      onTouchMove={(e) => handleTouchMove(e, rowKey)}
                      onTouchEnd={(e) => handleTouchEnd(e, rowKey)}
                      onClick={(e) => {
                        if (disabled) return;
                        if (swipedRowKey === rowKey && Math.abs(swipeOffset) > 10) {
                          setSwipedRowKey(null);
                          setSwipeOffset(0);
                          return;
                        }
                        if (onRowClicked) {
                          onRowClicked(row, e);
                        }
                        if (plugins) {
                          plugins.forEach(p => {
                            if (p.onRowClick) {
                              p.onRowClick(row, rowIndex);
                            }
                          });
                        }
                        if (config?.sidePreview) {
                          setPreviewRow(row);
                        }
                        if (expandOnRowClicked) {
                          const isExpDisabled = expandableRowDisabled ? expandableRowDisabled(row) : false;
                          if (!isExpDisabled) {
                            toggleExpandRow(rowKey, row);
                          }
                        }
                        if (!isRowDisabled && isSelectableRows) {
                          toggleSelect(rowKey, row, rowIndex, e);
                        }
                      }}
                      onDoubleClick={(e) => {
                        if (disabled) return;
                        if (onRowDoubleClicked) {
                          onRowDoubleClicked(row, e);
                        }
                        if (expandOnRowDoubleClicked) {
                          const isExpDisabled = expandableRowDisabled ? expandableRowDisabled(row) : false;
                          if (!isExpDisabled) {
                            toggleExpandRow(rowKey, row);
                          }
                        }
                      }}
                      onAuxClick={(e) => {
                        if (disabled) return;
                        if (e.button === 1 && onRowMiddleClicked) {
                          onRowMiddleClicked(row, e);
                        }
                      }}
                      onMouseEnter={(e) => {
                        setHoveredRowIndex(rowIndex);
                        if (onRowMouseEnter) {
                          onRowMouseEnter(row, e);
                        }
                      }}
                      onMouseLeave={(e) => {
                        setHoveredRowIndex(null);
                        if (onRowMouseLeave) {
                          onRowMouseLeave(row, e);
                        }
                      }}
                    >
                      {config?.swipeActions && swipedRowKey === rowKey && (
                        <td 
                          className="absolute inset-y-0 left-0 right-0 p-0 border-0 pointer-events-none"
                          style={{
                            height: '100%',
                            width: '100%',
                            zIndex: 0,
                          }}
                        >
                          {/* Left Swipe Actions */}
                          {mobileSwipeActions?.left && swipeOffset > 0 && (
                            <div 
                              className="absolute left-0 top-0 bottom-0 h-full flex items-stretch z-0 pointer-events-auto"
                              style={{
                                transform: `translateX(${-swipeOffset}px)`,
                                width: `${mobileSwipeActions.left.length * 70}px`,
                              }}
                            >
                              {mobileSwipeActions.left.map((action) => (
                                <button
                                  key={action.key}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row, rowIndex);
                                    setSwipedRowKey(null);
                                    setSwipeOffset(0);
                                  }}
                                  className={`h-full flex flex-col items-center justify-center text-center px-3 gap-1 text-white text-xs font-semibold ${action.className || 'bg-indigo-600'} transition-all active:brightness-90`}
                                  style={{ width: '70px' }}
                                >
                                  {action.icon}
                                  <span className="text-[10px] truncate max-w-full">{action.label}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Right Swipe Actions */}
                          {mobileSwipeActions?.right && swipeOffset < 0 && (
                            <div 
                              className="absolute right-0 top-0 bottom-0 h-full flex items-stretch z-0 pointer-events-auto"
                              style={{
                                transform: `translateX(${-swipeOffset}px)`,
                                width: `${mobileSwipeActions.right.length * 70}px`,
                              }}
                            >
                              {mobileSwipeActions.right.map((action) => (
                                <button
                                  key={action.key}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row, rowIndex);
                                    setSwipedRowKey(null);
                                    setSwipeOffset(0);
                                  }}
                                  className={`h-full flex flex-col items-center justify-center text-center px-3 gap-1 text-white text-xs font-semibold ${action.className || 'bg-red-600'} transition-all active:brightness-90`}
                                  style={{ width: '70px' }}
                                >
                                  {action.icon}
                                  <span className="text-[10px] truncate max-w-full">{action.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      )}
                      {isExpanderVisible && (() => {
                        const isRowExpanded = expandedKeys.includes(rowKey);
                        const isExpDisabled = expandableRowDisabled ? expandableRowDisabled(row) : false;
                        
                        let iconEl: React.ReactNode;
                        if (expandableIcon) {
                          iconEl = isRowExpanded ? expandableIcon.expanded : expandableIcon.collapsed;
                        } else {
                          iconEl = (
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isRowExpanded ? 'rotate-180 text-indigo-600' : 'text-slate-400'
                              } ${isExpDisabled ? 'opacity-30' : ''}`} 
                            />
                          );
                        }

                        const expandText = localization?.expandable?.expand ?? expandableRowsOptions?.expandText ?? "Expand";
                        const collapseText = localization?.expandable?.collapse ?? expandableRowsOptions?.collapseText ?? "Collapse";
                        const titleText = isRowExpanded ? collapseText : expandText;

                        return (
                          <td className={`${cellPadding} text-center transition-all duration-200 relative w-12`}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!disabled && !isExpDisabled) {
                                  toggleExpandRow(rowKey, row);
                                }
                              }}
                              disabled={disabled || isExpDisabled}
                              style={customStyles?.expanderButton?.style}
                              className={`p-1 rounded-md hover:bg-slate-100 transition-colors flex items-center justify-center mx-auto ${
                                isExpDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                              }`}
                              title={titleText}
                              aria-label={titleText}
                            >
                              {iconEl}
                            </button>
                            {showColSep && 0 < totalColsCount - 1 && (
                              <div 
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                                style={{ 
                                  height: columnSeparator === 'full' ? '100%' : '60%', 
                                  backgroundColor: themeObj.divider.default 
                                }} 
                              />
                            )}
                          </td>
                        );
                      })()}
                      {isSelectableRows && (
                        <td className={`${cellPadding} text-center transition-all duration-200 relative`}>
                          <div onClick={(e) => e.stopPropagation()}>
                            {renderCheckbox({
                              checked: isRowSelected,
                              onChange: (e: any) => {
                                if (!disabled && !isRowDisabled) {
                                  toggleSelect(rowKey, row, rowIndex, e);
                                }
                              },
                              disabled: disabled || isRowDisabled
                            })}
                          </div>
                          {showColSep && (isExpanderVisible ? 1 : 0) < totalColsCount - 1 && (
                            <div 
                              className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                              style={{ 
                                height: columnSeparator === 'full' ? '100%' : '60%', 
                                backgroundColor: themeObj.divider.default 
                              }} 
                            />
                          )}
                        </td>
                      )}
                      {config?.bookmarks && (() => {
                        const bookmarkCellIndex = (isExpanderVisible ? 1 : 0) + (isSelectableRows ? 1 : 0);
                        return (
                          <td className={`${cellPadding} text-center transition-all duration-200 relative w-12`}>
                            <div onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(rowKey)}
                                className={`p-1 rounded-full transition-colors ${
                                  bookmarkedKeys.has(rowKey) 
                                    ? 'text-amber-500 hover:text-amber-600' 
                                    : 'text-slate-300 hover:text-slate-500'
                                }`}
                                title={bookmarkedKeys.has(rowKey) ? "Remove from bookmarks" : "Add to bookmarks"}
                              >
                                <Star className={`w-4 h-4 ${bookmarkedKeys.has(rowKey) ? 'fill-amber-400' : ''}`} />
                              </button>
                            </div>
                            {showColSep && bookmarkCellIndex < totalColsCount - 1 && (
                              <div 
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                                style={{ 
                                  height: columnSeparator === 'full' ? '100%' : '60%', 
                                  backgroundColor: themeObj.divider.default 
                                }} 
                              />
                            )}
                          </td>
                        );
                      })()}
                      {finalColumns.map((col) => {
                        const colId = String(col.id || col.name).toLowerCase();
                        if (visibleColumns[colId] === false || isColHiddenByBreakpoint(col)) return null;
                        
                        let cellVal;
                        if (col.sparkline) {
                          const rawData = col.selector(row, rowIndex);
                          cellVal = <Sparkline data={Array.isArray(rawData) ? rawData : []} config={col.sparklineConfig} label={`${colId}-${rowIndex}`} />;
                        } else if (col.cell) {
                          cellVal = col.cell(row, rowIndex, col, colId);
                        } else if (col.format) {
                          cellVal = col.format(row, rowIndex);
                        } else {
                          cellVal = col.selector(row, rowIndex);
                        }
                        
                        const isTitle = colId === 'title';
                        const alignmentClass = col.right ? 'text-right' : (col.center || col.button) ? 'text-center' : 'text-left';
                        const actualPadding = col.compact ? 'p-1' : cellPadding;
                        const wrapClass = col.wrap ? 'whitespace-normal break-words' : 'truncate whitespace-nowrap';
                        
                        const colIndex = visibleCols.findIndex(c => String(c.id || c.name).toLowerCase() === String(colId).toLowerCase());
                        const actualThIndex = colIndex + (isSelectableRows ? 1 : 0) + (isExpanderVisible ? 1 : 0);
                        const widthStyle = getColStyle(colId);

                        const { condStyles, condClasses } = (() => {
                          let combinedStyle: React.CSSProperties = {};
                          let combinedClasses: string[] = [];
                          if (!col.conditionalCellStyles) return { condStyles: combinedStyle, condClasses: combinedClasses };
                          
                          for (const cond of col.conditionalCellStyles) {
                            if (cond.when(row)) {
                              if (cond.style) {
                                const ruleStyle = typeof cond.style === 'function' ? cond.style(row) : cond.style;
                                combinedStyle = { ...combinedStyle, ...ruleStyle };
                              }
                              if (cond.classNames) {
                                combinedClasses = [...combinedClasses, ...cond.classNames];
                              }
                            }
                          }
                          return { condStyles: combinedStyle, condClasses: combinedClasses };
                        })();

                        const heatmapStyle = (() => {
                          if (col.heatmap) {
                            const val = col.selector(row, rowIndex);
                            const numericVal = getNumericValue(val);
                            const range = heatmapRanges[colId] || { min: 0, max: 100 };
                            return getHeatmapStyles(numericVal, range.min, range.max, col.heatmapConfig);
                          }
                          return {};
                        })();

                        const cellStyle: React.CSSProperties = {
                          color: (isRowSelected && highlightSelected) ? themeObj.context.text : (isTitle ? themeObj.text.primary : themeObj.text.secondary),
                          borderBottomWidth: '1px',
                          borderBottomStyle: 'solid',
                          borderBottomColor: themeObj.divider.default,
                          overflow: col.allowOverflow ? 'visible' : undefined,
                          ...customStyles?.cells?.style,
                          ...(colId === draggedColId ? customStyles?.cells?.draggingStyle : {}),
                          ...widthStyle,
                          ...col.style,
                          ...condStyles,
                          ...heatmapStyle,
                        };

                        const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.colId === colId;
                        const isEditable = col.editable || col.editor !== undefined;

                        const handleEditCommit = (overrideValue?: string) => {
                          if (!editingCell) return;
                          const finalValue = overrideValue !== undefined ? overrideValue : editingCell.value;
                          
                          let isValid: boolean | string = true;
                          if (col.validate) {
                            isValid = col.validate(finalValue, row, col);
                          }

                          if (isValid === true) {
                            const oldValue = col.selector ? col.selector(row, rowIndex) : undefined;
                            const rowKey = row[keyField] !== undefined ? row[keyField] : (row.id !== undefined ? row.id : rowIndex);

                            if (oldValue !== finalValue) {
                              if (config?.auditTrail) {
                                const newLog = {
                                  id: Math.random().toString(36).substr(2, 9),
                                  timestamp: new Date(),
                                  rowId: rowKey,
                                  columnId: colId,
                                  columnName: String(col.name),
                                  oldValue,
                                  newValue: finalValue
                                };
                                setAuditLogs(prev => [newLog, ...prev]);

                                if (actualOnline) {
                                  fetch('/api/audit-trail', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      action: "Cell Updated",
                                      details: `Cell on Row ID ${rowKey}, Column "${col.name}" changed from "${oldValue || 'empty'}" to "${finalValue}".`
                                    })
                                  }).catch(e => console.error("Failed to post audit log to server", e));
                                }
                              }

                              if (config?.offlineEditing && !actualOnline) {
                                // Save to offline queue
                                setOfflineChanges(prev => {
                                  const existingIndex = prev.findIndex(c => String(c.rowId) === String(rowKey) && String(c.columnId) === String(colId) && c.status === 'pending');
                                  if (existingIndex > -1) {
                                    const updated = [...prev];
                                    updated[existingIndex] = {
                                      ...updated[existingIndex],
                                      newValue: finalValue,
                                      timestamp: new Date().toISOString()
                                    };
                                    return updated;
                                  } else {
                                    return [...prev, {
                                      id: Math.random().toString(36).substr(2, 9),
                                      rowId: rowKey,
                                      columnId: colId,
                                      columnName: String(col.name),
                                      oldValue,
                                      newValue: finalValue,
                                      timestamp: new Date().toISOString(),
                                      status: 'pending'
                                    }];
                                  }
                                });
                              } else {
                                // Default flow (online)
                                if (onCellEdit) {
                                  onCellEdit(row, finalValue, col);
                                }
                              }
                            }
                            setEditingCell(null);
                          } else if (typeof isValid === 'string') {
                            setEditingCell({ ...editingCell, value: finalValue, error: isValid });
                          } else {
                            setEditingCell(null);
                          }
                        };

                        return (
                          <td 
                            key={`cell-${colId}`} 
                            className={`${actualPadding} ${isTitle ? 'font-medium' : ''} ${alignmentClass} transition-all duration-200 relative ${isEditable && !isEditing ? 'ig_cell-editable' : ''} ${isEditing ? 'ig_cellEditing' : ''} ${condClasses.join(' ')}`}
                            style={cellStyle}
                            onClick={(e) => {
                              if (col.button || col.ignoreRowClick) {
                                e.stopPropagation();
                              } else if (isEditable && !isEditing) {
                                e.stopPropagation();
                                setEditingCell({
                                  rowIndex,
                                  colId,
                                  value: String(col.selector ? col.selector(row, rowIndex) : ''),
                                  error: null
                                });
                              }
                            }}
                            onDoubleClick={(e) => {
                              if (col.button || col.ignoreRowClick) {
                                e.stopPropagation();
                              }
                            }}
                          >
                            <div className={wrapClass}>
                              {isEditing ? (
                                <div className="relative flex flex-col gap-1 w-full" onClick={e => e.stopPropagation()}>
                                  {col.editor?.type === 'custom' ? (
                                    col.editor.render({
                                      row,
                                      value: editingCell.value,
                                      setValue: (next: string) => setEditingCell({ ...editingCell, value: next, error: null }),
                                      commit: (val?: string) => handleEditCommit(val),
                                      cancel: () => setEditingCell(null),
                                      column: col
                                    })
                                  ) : col.editor?.type === 'select' ? (
                                    <select
                                      autoFocus
                                      className={`ig_editSelect w-full px-2 py-1 text-sm border rounded outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 ${editingCell.error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                      value={editingCell.value}
                                      onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value, error: null })}
                                      onBlur={() => handleEditCommit()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleEditCommit();
                                        else if (e.key === 'Escape') setEditingCell(null);
                                      }}
                                    >
                                      {col.editor.placeholder && <option value="" disabled>{col.editor.placeholder}</option>}
                                      {col.editor.options.map((opt: any) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                      ))}
                                    </select>
                                  ) : col.editor?.type === 'checkbox' ? (
                                    <input
                                      autoFocus
                                      type="checkbox"
                                      className={`w-4 h-4 mx-auto ${editingCell.error ? 'border-red-500' : ''}`}
                                      checked={editingCell.value === 'true'}
                                      onChange={(e) => setEditingCell({ ...editingCell, value: e.target.checked ? 'true' : 'false', error: null })}
                                      onBlur={() => handleEditCommit()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleEditCommit();
                                        else if (e.key === 'Escape') setEditingCell(null);
                                      }}
                                    />
                                  ) : (
                                    <input
                                      autoFocus
                                      type={col.editor?.type || 'text'}
                                      placeholder={(col.editor as any)?.placeholder}
                                      min={(col.editor as any)?.min}
                                      max={(col.editor as any)?.max}
                                      step={(col.editor as any)?.step}
                                      className={`ig_editInput w-full px-2 py-1 text-sm border rounded outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-900 ${editingCell.error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}`}
                                      value={editingCell.value}
                                      onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value, error: null })}
                                      onBlur={() => handleEditCommit()}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          handleEditCommit();
                                        } else if (e.key === 'Escape') {
                                          setEditingCell(null);
                                        }
                                      }}
                                    />
                                  )}
                                  {editingCell.error && (
                                    <span className="text-[10px] text-red-600 bg-red-50 px-1 py-0.5 rounded leading-tight absolute -bottom-5 left-0 z-10 shadow-sm border border-red-100 whitespace-nowrap">
                                      {editingCell.error}
                                    </span>
                                  )}
                                </div>
                              ) : (() => {
                                const isPendingOffline = config?.offlineEditing && offlineChanges.some(c => String(c.rowId) === String(rowKey) && String(c.columnId) === String(colId) && c.status === 'pending');
                                if (isPendingOffline) {
                                  return (
                                    <div className="flex items-center gap-1.5 justify-between w-full">
                                      <span className="truncate">{cellVal}</span>
                                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse flex-shrink-0" title="Offline update pending sync" />
                                    </div>
                                  );
                                }
                                return cellVal;
                              })()}
                            </div>
                            {showColSep && actualThIndex < totalColsCount - 1 && (
                              <div 
                                className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                                style={{ 
                                  height: columnSeparator === 'full' ? '100%' : '60%', 
                                  backgroundColor: themeObj.divider.default 
                                }} 
                              />
                            )}
                          </td>
                        );
                      })}
                      {config?.rowComments && (() => {
                        const commentsList = rowCommentsData[String(rowKey)] || [];
                        const commentsCount = commentsList.length;
                        return (
                          <td 
                            className={`${cellPadding} text-center transition-all duration-200 relative w-24`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCommentRowKey(rowKey);
                              setNewCommentText("");
                              setShowCommentsDrawer(true);
                            }}
                          >
                            <button
                              type="button"
                              className={`p-1.5 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center mx-auto relative group ${
                                commentsCount > 0 ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                              }`}
                              title={`${commentsCount} comment${commentsCount === 1 ? '' : 's'}`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              {commentsCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                                  {commentsCount}
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })()}
                    </RowWrapper>
                  );

                  if (expandableRows) {
                    return (
                      <React.Fragment key={`row-group-${rowKey}`}>
                        {rowElement}
                        {isExpanded && expandableRowsComponent && (
                          <tr 
                            style={{ 
                              ...expandedRowStyle, 
                              borderBottomWidth: '1px', 
                              borderBottomStyle: 'solid', 
                              borderBottomColor: themeObj.divider.default,
                              ...customStyles?.expanderRow?.style
                            }}
                          >
                            <td colSpan={totalColsCount} className="p-4 bg-slate-50/50" style={customStyles?.expanderCell?.style}>
                              <div className="transition-all duration-300">
                                {React.createElement(expandableRowsComponent, {
                                  data: row,
                                  ...expandableRowsComponentProps
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  }

                  return rowElement;
                })
              ) : (
                <tr>
                  <td colSpan={totalColsCount} className="p-0" style={customStyles?.noData?.style}>
                    {noDataComponent !== undefined ? noDataComponent : <DefaultNoDataComponent />}
                  </td>
                </tr>
              )}
            </AnimatePresenceWrapper>
          </tbody>
          {shouldShowFooter && (
            <tfoot style={customStyles?.footer?.style}>
              {footerComponent ? (
                <tr style={customStyles?.footer?.style}>
                  <td colSpan={totalColsCount} className="p-0">
                    {React.createElement(footerComponent, { rows: paginatedData, columns: visibleCols })}
                  </td>
                </tr>
              ) : (
                <tr className="border-t-2" style={{ borderColor: themeObj.divider.default, ...customStyles?.footer?.style }}>
                  {isExpanderVisible && (
                    <td 
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                        borderTopWidth: '2px',
                        borderTopStyle: 'solid',
                        borderTopColor: themeObj.divider.default,
                      }}
                      className={`${cellPadding} text-center transition-all duration-200 relative`}
                    >
                      {showColSep && 0 < totalColsCount - 1 && (
                        <div 
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                          style={{ 
                            height: columnSeparator === 'full' ? '100%' : '60%', 
                            backgroundColor: themeObj.divider.default 
                          }} 
                        />
                      )}
                    </td>
                  )}
                  {isSelectableRows && (
                    <td 
                      style={{
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                        borderTopWidth: '2px',
                        borderTopStyle: 'solid',
                        borderTopColor: themeObj.divider.default,
                      }}
                      className={`${cellPadding} text-center transition-all duration-200 relative`}
                    >
                      {showColSep && (isExpanderVisible ? 1 : 0) < totalColsCount - 1 && (
                        <div 
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                          style={{ 
                            height: columnSeparator === 'full' ? '100%' : '60%', 
                            backgroundColor: themeObj.divider.default 
                          }} 
                        />
                      )}
                    </td>
                  )}
                  {visibleCols.map((col) => {
                    const colId = String(col.id || col.name).toLowerCase();
                    const colIndex = visibleCols.findIndex(c => (String(c.id || c.name).toLowerCase()) === colId);
                    const actualThIndex = colIndex + (isSelectableRows ? 1 : 0) + (isExpanderVisible ? 1 : 0);

                    return (
                      <td
                        key={`footer-cell-${colId}`}
                        className={`${cellPadding} font-semibold transition-all duration-200 relative ${col.right ? 'text-right' : col.center ? 'text-center' : 'text-left'}`}
                        style={{
                          color: themeObj.text.primary,
                          borderTopWidth: '2px',
                          borderTopStyle: 'solid',
                          borderTopColor: themeObj.divider.default,
                          backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
                          ...customStyles?.footerCells?.style,
                          ...getColStyle(colId)
                        }}
                      >
                        {col.footer !== undefined ? (typeof col.footer === 'function' ? col.footer(sortedData) : col.footer) : ''}
                        {showColSep && actualThIndex < totalColsCount - 1 && (
                          <div 
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] pointer-events-none" 
                            style={{ 
                              height: columnSeparator === 'full' ? '100%' : '60%', 
                              backgroundColor: themeObj.divider.default 
                            }} 
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              )}
            </tfoot>
          )}
        </table>

        {/* Overlay Spinner for re-fetching when data is already present */}
        {progressPending && paginatedData.length > 0 && (
          <div className="absolute inset-0 top-[45px] flex items-center justify-center bg-white/40 backdrop-blur-[0.5px] z-10 transition-all" style={customStyles?.progress?.style}>
            {progressComponent !== undefined ? progressComponent : <DefaultSpinner />}
          </div>
        )}
      </div>

      {/* Side Preview Panel */}
      {config?.sidePreview && (
        <AnimatePresence>
          {previewRow && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="border-l border-slate-200 bg-slate-50 flex-shrink-0 flex flex-col h-full overflow-hidden"
              style={{ maxHeight: fixedHeader ? fixedHeaderScrollHeight : '100%' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Preview Details</h4>
                    <p className="text-[10px] text-slate-400 truncate font-mono">
                      {(() => {
                        const titleCol = finalColumns.find(c => ['title', 'name'].includes(String(c.id || c.name).toLowerCase())) || finalColumns[0];
                        if (titleCol) {
                          try {
                            return String(titleCol.selector ? titleCol.selector(previewRow, 0) : (previewRow as any)[titleCol.id || '']);
                          } catch (e) {
                            return 'Selected Row';
                          }
                        }
                        return 'Selected Row';
                      })()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewRow(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
                  aria-label="Close Preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderSidePreview ? (
                  renderSidePreview(previewRow, () => setPreviewRow(null))
                ) : (
                  <>
                    <div className="space-y-3">
                      {finalColumns.map((col) => {
                        const colId = String(col.id || col.name).toLowerCase();
                        
                        let rawVal;
                        try {
                          rawVal = col.selector ? col.selector(previewRow, 0) : (previewRow as any)[colId];
                        } catch (e) {
                          rawVal = (previewRow as any)[colId];
                        }

                        let displayVal = rawVal;
                        if (col.format) {
                          try {
                            displayVal = col.format(previewRow, 0);
                          } catch (e) {}
                        }

                        if (col.button || React.isValidElement(displayVal)) {
                          if (typeof rawVal === 'string' || typeof rawVal === 'number' || typeof rawVal === 'boolean') {
                            displayVal = String(rawVal);
                          } else {
                            return null;
                          }
                        }

                        const valString = String(displayVal ?? '');

                        return (
                          <div key={colId} className="bg-white rounded-lg border border-slate-100 p-3 shadow-sm hover:border-slate-200 transition-all flex flex-col group relative">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                              {col.name}
                            </span>
                            <div className="text-xs text-slate-800 pr-8 break-words font-medium">
                              {valString || <span className="text-slate-300 italic">Empty</span>}
                            </div>
                            {valString && (
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(valString);
                                  setCopiedField(colId);
                                  setTimeout(() => setCopiedField(null), 1500);
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded bg-slate-50 border border-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
                                title="Copy Value"
                              >
                                {copiedField === colId ? (
                                  <Check className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Extra Meta Data */}
                    {(() => {
                      const colKeys = new Set(finalColumns.map(col => String(col.id || col.name).toLowerCase()));
                      const allKeys = Object.keys(previewRow || {});
                      const extraFields = allKeys.filter(key => {
                        const kLower = key.toLowerCase();
                        return !colKeys.has(kLower) && key !== 'id' && !key.startsWith('_') && typeof (previewRow as any)[key] !== 'function';
                      });

                      if (extraFields.length === 0) return null;

                      return (
                        <div className="pt-3 border-t border-slate-200">
                          <h5 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Other Metadata</h5>
                          <div className="space-y-1.5">
                            {extraFields.map(key => {
                              const val = (previewRow as any)[key];
                              const valString = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '');

                              return (
                                <div key={key} className="flex justify-between items-center gap-2 py-1.5 px-2 bg-slate-100/60 rounded border border-slate-100 text-[10px] relative group/meta">
                                  <span className="font-mono text-slate-500 truncate max-w-[120px]" title={key}>{key}</span>
                                  <span className="font-medium text-slate-700 truncate pr-6 max-w-[160px]" title={valString}>
                                    {valString || <span className="text-slate-300 italic">empty</span>}
                                  </span>
                                  {valString && (
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(valString);
                                        setCopiedField(key);
                                        setTimeout(() => setCopiedField(null), 1500);
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 opacity-0 group-hover/meta:opacity-100 hover:text-slate-600 transition-all bg-white border border-slate-100 rounded shadow-xs"
                                      title="Copy Value"
                                    >
                                      {copiedField === key ? (
                                        <Check className="w-3 h-3 text-green-500" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
    )}
      
      {(paginationPosition === 'bottom' || paginationPosition === 'both') && renderPaginationControls()}

      {/* Audit Trail Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Audit Trail
              </h3>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
              {auditLogs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 italic">
                  No cell edits have been made in this session.
                </div>
              ) : (
                <div className="space-y-4">
                  {auditLogs.map(log => (
                    <div key={log.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Row ID: {log.rowId} &bull; Column: {log.columnName}
                        </div>
                        <div className="text-xs text-slate-400">
                          {log.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex-1 bg-red-50 text-red-700 p-2 rounded line-through border border-red-100">
                          {String(log.oldValue)}
                        </div>
                        <div className="text-slate-400">&rarr;</div>
                        <div className="flex-1 bg-green-50 text-green-700 p-2 rounded border border-green-100">
                          {String(log.newValue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Row Comments Drawer */}
      <AnimatePresence>
        {showCommentsDrawer && selectedCommentRowKey !== null && (() => {
          const comments = rowCommentsData[String(selectedCommentRowKey)] || [];
          const matchedRow = finalData.find(row => {
            const rowKey = row[keyField] !== undefined ? row[keyField] : row.id;
            return String(rowKey) === String(selectedCommentRowKey);
          });
          const rowTitle = matchedRow ? (matchedRow.title || matchedRow.name || matchedRow.id || `Row ${selectedCommentRowKey}`) : `Row ${selectedCommentRowKey}`;
          
          // Autocomplete suggestions
          const filteredMentions = teamMembers.filter(m => 
            m.toLowerCase().startsWith(mentionSearch.toLowerCase())
          );

          const selectMention = (name: string) => {
            // Replace the typed @mention search with the selected name
            const beforeMention = newCommentText.slice(0, newCommentText.lastIndexOf('@'));
            setNewCommentText(beforeMention + '@' + name + ' ');
            setShowMentionsList(false);
            setMentionSearch("");
            setMentionIndex(-1);
          };

          const handleAddComment = async () => {
            if (!newCommentText.trim() || !selectedCommentRowKey) return;
            
            const commentPayload = {
              author: "You",
              text: newCommentText
            };

            let serverComment: any = null;
            try {
              const res = await fetch(`/api/comments/${selectedCommentRowKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentPayload)
              });
              if (res.ok) {
                serverComment = await res.json();
              }
            } catch (err) {
              console.error("Failed to post comment to server", err);
            }

            const newComment = serverComment ? {
              id: serverComment.id,
              user: serverComment.author,
              text: serverComment.text,
              timestamp: new Date(serverComment.timestamp)
            } : {
              id: Math.random().toString(36).substr(2, 9),
              user: "You",
              text: newCommentText,
              timestamp: new Date()
            };
            
            setRowCommentsData(prev => ({
              ...prev,
              [String(selectedCommentRowKey)]: [...(prev[String(selectedCommentRowKey)] || []), newComment]
            }));
            setNewCommentText("");
            setShowMentionsList(false);
          };

          const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            if (showMentionsList && filteredMentions.length > 0) {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setMentionIndex(prev => (prev + 1) % filteredMentions.length);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setMentionIndex(prev => (prev - 1 + filteredMentions.length) % filteredMentions.length);
              } else if (e.key === 'Enter') {
                e.preventDefault();
                const activeIndex = mentionIndex >= 0 ? mentionIndex : 0;
                selectMention(filteredMentions[activeIndex]);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowMentionsList(false);
              }
            } else {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAddComment();
              }
            }
          };

          const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const val = e.target.value;
            setNewCommentText(val);

            // Check if user is typing a mention
            const lastAtIdx = val.lastIndexOf('@');
            if (lastAtIdx !== -1 && lastAtIdx >= val.length - 15) { // within last 15 chars
              const textAfterAt = val.slice(lastAtIdx + 1);
              // Mentions shouldn't have spaces
              if (!textAfterAt.includes(' ')) {
                setShowMentionsList(true);
                setMentionSearch(textAfterAt);
                return;
              }
            }
            setShowMentionsList(false);
          };

          return (
            <>
              {/* Overlay backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCommentsDrawer(false)}
                className="fixed inset-0 bg-slate-900 z-40 cursor-pointer"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                      Row Comments
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-[280px]">
                      {rowTitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCommentsDrawer(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Comment Thread */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-slate-50/50">
                  {comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-60">
                      <div className="p-3 bg-indigo-50 text-indigo-500 rounded-full mb-3">
                        <MessageSquare className="w-8 h-8" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">No comments yet</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                        Start the conversation by typing your comment below. Mention colleagues with @name.
                      </p>
                    </div>
                  ) : (
                    comments.map((comment) => {
                      const isYou = comment.user === "You";
                      const colorMap: Record<string, string> = {
                        "Alice": "bg-pink-100 text-pink-700 border-pink-200",
                        "Bob": "bg-blue-100 text-blue-700 border-blue-200",
                        "Charlie": "bg-green-100 text-green-700 border-green-200",
                        "David": "bg-amber-100 text-amber-700 border-amber-200",
                        "Emma": "bg-purple-100 text-purple-700 border-purple-200",
                        "You": "bg-indigo-100 text-indigo-700 border-indigo-200"
                      };
                      const userColor = colorMap[comment.user] || "bg-slate-100 text-slate-700 border-slate-200";
                      
                      return (
                        <div key={comment.id} className="flex gap-3 items-start">
                          <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs shrink-0 ${userColor}`}>
                            {comment.user.charAt(0)}
                          </div>
                          <div className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative">
                            <div className="flex justify-between items-baseline mb-1">
                              <span className="font-semibold text-slate-800 text-sm">
                                {comment.user}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed break-words">
                              {renderCommentText(comment.text)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Panel */}
                <div className="p-4 border-t border-slate-200 bg-white relative">
                  {/* Mentions autocomplete list */}
                  {showMentionsList && filteredMentions.length > 0 && (
                    <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg border border-slate-200 shadow-xl max-h-40 overflow-y-auto z-50 divide-y divide-slate-100">
                      <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <AtSign className="w-3 h-3 text-indigo-500" /> Team Members
                      </div>
                      {filteredMentions.map((name, idx) => {
                        const isHovered = idx === (mentionIndex >= 0 ? mentionIndex : 0);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => selectMention(name)}
                            className={`w-full text-left px-4 py-2 text-xs flex items-center gap-2 transition-colors ${
                              isHovered ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-600">
                              {name.charAt(0)}
                            </span>
                            <span className="font-medium">{name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Textarea container */}
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 relative">
                      <textarea
                        rows={2}
                        value={newCommentText}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Write a comment... Use @ to mention"
                        className="w-full text-xs text-slate-800 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50 resize-none leading-relaxed"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!newCommentText.trim()}
                      onClick={handleAddComment}
                      className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-45 disabled:cursor-not-allowed shrink-0 flex items-center justify-center shadow-md shadow-indigo-200"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex justify-between text-[10px] text-slate-400 px-1">
                    <span>Press Enter to send</span>
                    <span className="flex items-center gap-0.5">
                      <AtSign className="w-2.5 h-2.5" /> Alice, Bob, Charlie, Emma...
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          );
        })()}
      </AnimatePresence>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCommandPaletteOpen(false);
                setCommandSearch('');
              }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9998] cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-white border border-slate-200 rounded-2xl shadow-2xl z-[9999] overflow-hidden flex flex-col focus:outline-none"
              tabIndex={-1}
              onKeyDown={handlePaletteKeyDown}
            >
              {/* Header with Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-slate-50">
                <Terminal className="w-5 h-5 text-indigo-600 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type a command or search settings..."
                  value={commandSearch}
                  onChange={(e) => setCommandSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none border-none py-1 focus:ring-0 focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setCommandSearch('');
                  }}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Commands List */}
              <div className="max-h-[350px] overflow-y-auto p-2 space-y-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    No commands found matching "{commandSearch}"
                  </div>
                ) : (() => {
                  // Group commands by category
                  const categories: Record<string, typeof commands> = {};
                  filteredCommands.forEach(c => {
                    if (!categories[c.category]) {
                      categories[c.category] = [];
                    }
                    categories[c.category].push(c);
                  });

                  let absoluteIdx = 0;

                  return Object.entries(categories).map(([category, items]) => (
                    <div key={category} className="space-y-1">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 rounded-md">
                        {category}
                      </div>
                      {items.map((cmd) => {
                        const currentAbsIdx = absoluteIdx++;
                        const isSelected = currentAbsIdx === selectedCommandIndex;
                        return (
                          <div
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              setIsCommandPaletteOpen(false);
                              setCommandSearch('');
                            }}
                            onMouseEnter={() => setSelectedCommandIndex(currentAbsIdx)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                              isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className={`shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`}>
                                {cmd.icon}
                              </span>
                              <span className="text-xs truncate">{cmd.label}</span>
                            </div>
                            {cmd.shortcut && (
                              <span className="text-[10px] text-slate-400 font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shadow-sm shrink-0">
                                {cmd.shortcut}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ));
                })()}
              </div>

              {/* Footer Panel */}
              <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 select-none">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-slate-500">Ctrl + K</span> to open / close
                </div>
                <div className="flex items-center gap-3 font-medium">
                  <span className="flex items-center gap-0.5"><kbd className="px-1 border rounded bg-white">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-0.5"><kbd className="px-1 border rounded bg-white">enter</kbd> select</span>
                  <span className="flex items-center gap-0.5"><kbd className="px-1 border rounded bg-white">esc</kbd> close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

const DataTable = forwardRef(DataTableInner) as <T extends Record<string, any>>(
  props: DataTableProps<T> & { ref?: React.Ref<DataTableHandle> }
) => React.ReactElement | null;

export default DataTable;


export interface ColumnVisibilityEntry {
  id: string | number;
  name: React.ReactNode;
  visible: boolean;
}

export interface UseColumnVisibilityResult<T> {
  columns: TableColumn<T>[];
  visibility: ColumnVisibilityEntry[];
  toggle: (id: string | number) => void;
  setAll: (visible: boolean) => void;
}

export function useColumnVisibility<T>(rawColumns: TableColumn<T>[]): UseColumnVisibilityResult<T> {
  const [hiddenIds, setHiddenIds] = React.useState<Set<string | number>>(() => {
    const hidden = new Set<string | number>();
    rawColumns.forEach(c => {
      if (c.omit) {
        hidden.add(c.id || c.name as string);
      }
    });
    return hidden;
  });

  const toggle = (id: string | number) => {
    setHiddenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const setAll = (visible: boolean) => {
    if (visible) {
      setHiddenIds(new Set());
    } else {
      setHiddenIds(new Set(rawColumns.map(c => c.id || c.name as string)));
    }
  };

  const columns = React.useMemo(() => {
    return rawColumns.map(c => ({
      ...c,
      omit: hiddenIds.has(c.id || c.name as string)
    }));
  }, [rawColumns, hiddenIds]);

  const visibility = React.useMemo(() => {
    return rawColumns.map(c => ({
      id: c.id || c.name as string,
      name: c.name,
      visible: !hiddenIds.has(c.id || c.name as string)
    }));
  }, [rawColumns, hiddenIds]);

  return { columns, visibility, toggle, setAll };
}

export interface UseTableExportOptions<T> {
  columns: TableColumn<T>[];
  rows: T[];
  valueSource?: "selector" | "format";
  headerOverrides?: Record<string | number, string>;
  columnOrder?: (string | number)[];
}

export interface UseTableExportResult {
  toCSV: () => string;
  toJSON: () => string;
  download: (filename: string, format?: "csv" | "json") => void;
  copy: (format?: "csv" | "json") => Promise<void>;
}

export function useTableExport<T>({ columns, rows, valueSource = "selector", headerOverrides, columnOrder }: UseTableExportOptions<T>): UseTableExportResult {
  const getExportableColumns = React.useCallback(() => {
    let exportCols = columns.filter(c => !c.omit);
    if (columnOrder) {
      exportCols = columnOrder.map(id => exportCols.find(c => (c.id || c.name) === id)).filter(Boolean) as TableColumn<T>[];
    }
    return exportCols;
  }, [columns, columnOrder]);

  const toCSV = React.useCallback(() => {
    const exportCols = getExportableColumns();
    const headers = exportCols.map(c => {
      const id = c.id || c.name as string;
      return headerOverrides?.[id] || c.name;
    });
    
    const csvRows = rows.map(row => {
      return exportCols.map((c, i) => {
        let val;
        if (valueSource === "format" && c.format) {
          val = c.format(row, i);
        } else if (c.selector) {
          val = c.selector(row, i);
        } else {
          val = "";
        }
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      }).join(',');
    });

    return [headers.join(','), ...csvRows].join('\n');
  }, [getExportableColumns, rows, valueSource, headerOverrides]);

  const toJSON = React.useCallback(() => {
    const exportCols = getExportableColumns();
    
    const jsonRows = rows.map(row => {
      const obj: any = {};
      exportCols.forEach((c, i) => {
        const id = c.id || c.name as string;
        const key = headerOverrides?.[id] || c.name as string;
        
        let val;
        if (valueSource === "format" && c.format) {
          val = c.format(row, i);
        } else if (c.selector) {
          val = c.selector(row, i);
        } else {
          val = "";
        }
        obj[key] = val;
      });
      return obj;
    });
    
    return JSON.stringify(jsonRows, null, 2);
  }, [getExportableColumns, rows, valueSource, headerOverrides]);

  const download = React.useCallback((filename: string, format: "csv" | "json" = "csv") => {
    const content = format === "csv" ? toCSV() : toJSON();
    const blob = new Blob([content], { type: format === "csv" ? 'text/csv;charset=utf-8;' : 'application/json;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [toCSV, toJSON]);

  const copy = React.useCallback(async (format: "csv" | "json" = "csv") => {
    const content = format === "csv" ? toCSV() : toJSON();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(content);
    }
  }, [toCSV, toJSON]);

  return { toCSV, toJSON, download, copy };
}

