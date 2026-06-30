import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Docs from './pages/Docs';
import Themes from './pages/Themes';
import ApiPage from './pages/ApiPage';
import GoogleAnalytics from './components/GoogleAnalytics';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <GoogleAnalytics />
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500/30">
          <Navbar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/api" element={<ApiPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
