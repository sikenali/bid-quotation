import React from 'react';
import { useConfigStore } from '../stores/configStore';

export default function ThemeSelector() {
  const { theme, setTheme } = useConfigStore();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      <div
        className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'light' ? 'border-[#C43A31] bg-white' : 'border-[#E8DCC8] bg-[#FBF7EF]'
        }`}
        onClick={() => setTheme('light')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-[#E8DCC8] flex items-center justify-center"><i className="ri-sun-line text-xl text-[#D97706]"></i></div>
          <div>
            <div className="font-semibold text-text">浅色主题</div>
            <div className="text-text-secondary text-sm">暖米色背景，护眼舒适</div>
          </div>
          {theme === 'light' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-[#C43A31] flex items-center justify-center">
              <i className="ri-check-line text-white text-sm"></i>
            </div>
          )}
        </div>
      </div>

      <div
        className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'dark' ? 'border-[#C43A31] bg-[#2D2D2D]' : 'border-[#E8DCC8] bg-[#FBF7EF]'
        }`}
        onClick={() => setTheme('dark')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center"><i className="ri-moon-clear-line text-xl text-indigo-300"></i></div>
          <div>
            <div className={`font-semibold ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>深色主题</div>
            <div className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>暗色配色，夜间使用</div>
          </div>
          {theme === 'dark' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-[#C43A31] flex items-center justify-center">
              <i className="ri-check-line text-white text-sm"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
