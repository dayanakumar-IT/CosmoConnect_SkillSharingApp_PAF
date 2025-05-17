// src/hooks/useCursor.js
import { useEffect } from 'react';
import rocketCursor from '../assets/images/cursor-rocket.png';
import rocketPointerCursor from '../assets/images/cursor-rocket-pointer.png';

export function useCursor() {
  useEffect(() => {
    // Apply cursor styles programmatically with hotspot coordinates
    // The exact format is critical: url(...) x y, fallback
    document.body.style.cursor = `url(${rocketCursor}) 8 8, auto`;
    
    // Create a style element for interactive elements
    const style = document.createElement('style');
    style.textContent = `
      button, a, input[type=submit], input[type=button], input[type=checkbox], select {
        cursor: url(${rocketPointerCursor}) 8 8, pointer !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      // Clean up
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
}