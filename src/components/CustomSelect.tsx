import React, { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  isDark?: boolean;
}

export default function CustomSelect({ options, value, onChange, className = '', isDark = false }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`styled-select select-default w-full flex items-center justify-between pr-8 ${isDark ? 'dark' : ''}`}
        style={{ backgroundColor: isDark ? 'transparent' : 'transparent' }}
      >
        <span className={isDark ? 'text-[#E8E0D0]' : ''}>{selected?.label || ''}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="7"
          viewBox="0 0 10 7"
          className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`}
          fill={isDark ? '#A89880' : '#8B7355'}
        >
          <path d="M0 0l5 7 5-7z" />
        </svg>
      </button>

      {open && (
        <div
          className={`absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border overflow-hidden shadow-lg ${
            isDark
              ? 'bg-[#2A2A2A] border-[#3A3A3A]'
              : 'bg-white border-[#E8DCC8]'
          }`}
          style={{ maxHeight: '240px', overflowY: 'auto' }}
        >
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                opt.value === value
                  ? isDark
                    ? 'bg-[#C43A31]/20 text-[#C43A31]'
                    : 'bg-[#FFF0ED] text-[#C43A31]'
                  : isDark
                    ? 'text-[#E8E0D0] hover:bg-[#3A3A3A]'
                    : 'text-text hover:bg-[#F5EFE0]'
              }`}
            >
              {opt.value === value && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
              <span className={opt.value === value ? '' : 'ml-6'}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
