import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, LayoutGrid, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsSidebarOpen, setDocsSidebarOpen] = useState(false);
  const location = useLocation();

  const isDocsPage = location.pathname === '/docs';

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      setDocsSidebarOpen(customEvent.detail);
    };
    window.addEventListener('docs-sidebar-state', handleStateChange);
    return () => {
      window.removeEventListener('docs-sidebar-state', handleStateChange);
    };
  }, []);

  const handleToggleSidebar = () => {
    const event = new CustomEvent('toggle-docs-sidebar');
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-slate-200">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800 hidden sm:block">
            EnterpriseGrid<span className="text-indigo-600">.io</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 ml-8">
          <Link to="/docs" className="hover:text-slate-800 transition-colors">Docs</Link>
          <Link to="/themes" className="hover:text-slate-800 transition-colors">Themes</Link>
          <Link to="/api" className="hover:text-slate-800 transition-colors">API</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {isDocsPage && (
          <button 
            className="md:hidden p-2 text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 rounded-lg mr-1"
            onClick={handleToggleSidebar}
            aria-label="Toggle Sidebar"
            id="mobile-sidebar-toggle-btn"
          >
            {docsSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </button>
        )}
        
        <div className="hidden sm:flex items-center gap-4">
          <Link to="/docs" className="px-4 py-2 bg-slate-900 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
            Get started
          </Link>
        </div>
        
        <button 
          className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-800 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-lg md:hidden flex flex-col items-center py-4 gap-4"
          >
            <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Docs</Link>
            <Link to="/themes" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">Themes</Link>
            <Link to="/api" onClick={() => setMobileMenuOpen(false)} className="text-slate-600 hover:text-indigo-600 font-medium">API</Link>
            <div className="w-full h-px bg-slate-100 my-2"></div>
            <Link to="/docs" onClick={() => setMobileMenuOpen(false)} className="mt-2 w-11/12 text-center px-4 py-3 bg-slate-900 text-white rounded font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
              Get started
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
