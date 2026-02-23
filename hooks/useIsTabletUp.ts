'use client';

import { useState, useEffect } from 'react';

const TABLET_BREAKPOINT = 768; // Tailwind md

export function useIsTabletUp(): boolean {
  const [isTabletUp, setIsTabletUp] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);
    setIsTabletUp(media.matches);
    const listener = () => setIsTabletUp(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return isTabletUp;
}
