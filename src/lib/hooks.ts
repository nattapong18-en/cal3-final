import { useCallback, useEffect, useState } from 'react';

const PKEY = 'cal3-web-progress-v1';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function useProgress() {
  const [done, setDone] = useState<Record<string, boolean>>(() => readJSON(PKEY, {}));
  useEffect(() => {
    try { localStorage.setItem(PKEY, JSON.stringify(done)); } catch { /* storage blocked */ }
  }, [done]);
  const toggle = useCallback((id: string) => setDone((d) => {
    const n = { ...d };
    if (n[id]) delete n[id]; else n[id] = true;
    return n;
  }), []);
  return { done, toggle };
}

export type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const a = document.documentElement.getAttribute('data-theme');
    return a === 'light' || a === 'dark' ? a : systemTheme();
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const on = () => { if (!document.documentElement.getAttribute('data-theme')) setTheme(systemTheme()); };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const toggle = useCallback(() => {
    setTheme((t) => {
      const n: Theme = t === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', n);
      try { localStorage.setItem('cal3-theme', n); } catch { /* storage blocked */ }
      return n;
    });
  }, []);
  return { theme, toggle };
}

/** อ่านค่าสีจาก CSS variables ให้รูปวาด (SVG / three.js) ใช้สีตรงกับธีม */
export function usePalette(theme: Theme) {
  const read = () => {
    const cs = getComputedStyle(document.documentElement);
    const g = (n: string) => cs.getPropertyValue(n).trim();
    return {
      ink: g('--ink'), muted: g('--muted'), line: g('--line'), paper: g('--paper'), paper2: g('--paper-2'),
      blue: g('--blue'), red: g('--red'), green: g('--green'), violet: g('--violet'), hl: g('--hl'), amber: g('--amber'),
    };
  };
  const [p, setP] = useState(read);
  useEffect(() => { setP(read()); }, [theme]);
  return p;
}
export type Palette = ReturnType<typeof usePalette>;
