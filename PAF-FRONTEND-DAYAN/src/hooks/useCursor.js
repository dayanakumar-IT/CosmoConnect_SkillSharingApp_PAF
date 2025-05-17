// src/hooks/useCursor.js
import { useEffect } from 'react';
import rocketCursor from '../assets/images/cursor-rocket.png';

export function useCursor() {
  useEffect(() => {
    // Apply cursor styles programmatically with hotspot coordinates
    // The exact format is critical: url(...) x y, fallback
    document.body.style.cursor = `url(${rocketCursor}) 8 8, auto`;
  }, []);
}