import React from 'react';
import { useConfigStore } from '../stores/configStore';

export default function ThemeSelector() {
  const { theme, setTheme } = useConfigStore();

  return (
    <div className="space-y-4">
      <div
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'light' ? 'border-primary bg-white' : 'border-border bg-card'
        }`}
        onClick={() => setTheme('light')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center"><i className="ri-sun-line text-xl text-yellow-500"></i></div>
          <div>
            <div className="font-semibold text-text">浅色主题</div>
            <div className="text-textSecondary text-sm">暖米色背景，护眼舒适</div>
          </div>
          {theme === 'light' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <i className="ri-check-line text-white text-sm"></i>
            </div>
          )}
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'dark' ? 'border-primary bg-gray-900' : 'border-border bg-card'
        }`}
        onClick={() => setTheme('dark')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center"><i className="ri-moon-clear-line text-xl text-indigo-300"></i></div>
          <div>
            <div className="font-semibold text-text dark:text-white">深色主题</div>
            <div className="text-textSecondary text-sm">暗色配色，夜间使用</div>
          </div>
          {theme === 'dark' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <i className="ri-check-line text-white text-sm"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
