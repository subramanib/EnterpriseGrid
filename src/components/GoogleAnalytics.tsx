import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleAnalytics() {
  const location = useLocation();
  const measurementId = (import.meta as any).env.VITE_GA_MEASUREMENT_ID;

  // 1. Initialize Google Analytics script
  useEffect(() => {
    if (!measurementId || measurementId.trim() === '' || measurementId.includes('YOUR_')) {
      console.log('Google Analytics: No valid VITE_GA_MEASUREMENT_ID found. Analytics script is not loaded.');
      return;
    }

    // Check if script already exists to prevent duplication
    const scriptId = 'google-analytics-gtag';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
      
      window.gtag('js', new Date());
      window.gtag('config', measurementId, {
        send_page_view: false // We will trigger page_view manually on route changes
      });
      
      console.log(`Google Analytics initialized with ID: ${measurementId}`);
    }
  }, [measurementId]);

  // 2. Track route changes
  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    const path = location.pathname + location.search;
    window.gtag('config', measurementId, {
      page_path: path,
      page_title: document.title || 'EnterpriseGrid'
    });
    
    console.log(`Google Analytics tracked page view: ${path}`);
  }, [location, measurementId]);

  return null;
}
