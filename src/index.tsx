import './index.css';
import { createRoot } from "react-dom/client";
import { App } from "./App";

// Environment validation and debugging
console.log('🚀 App Starting - Environment Debug:');
console.log('- NODE_ENV:', import.meta.env.NODE_ENV);
console.log('- VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('- All env vars:', import.meta.env);
console.log('- Current URL:', window.location.href);
console.log('- Current Pathname:', window.location.pathname);

// Validate critical environment variables
if (!import.meta.env.VITE_API_URL && import.meta.env.NODE_ENV === 'production') {
  console.warn('⚠️ VITE_API_URL not set in production!');
}

const container = document.getElementById("root");
if (!container) {
  console.error('❌ Root element not found!');
  throw new Error('Root element not found');
}

console.log('🎯 Creating React app...');
const root = createRoot(container);
root.render(<App />);
console.log('✅ React app rendered successfully!');