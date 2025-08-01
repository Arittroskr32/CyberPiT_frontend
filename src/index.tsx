import './index.css';
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Environment validation and debugging
console.log('🚀 App Starting - Environment Debug:');
console.log('- NODE_ENV:', import.meta.env.NODE_ENV);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- All env vars:', import.meta.env);
console.log('- Current URL:', window.location.href);

// Validate critical environment variables
if (!import.meta.env.VITE_API_URL && import.meta.env.NODE_ENV === 'production') {
  console.warn('⚠️ VITE_API_URL not set in production!');
}

const container = document.getElementById("root");
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(<App />);