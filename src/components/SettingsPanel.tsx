import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThemeSelector from './ThemeSelector';

interface Props {
  onClose: () => void;
}

type Tab = 'theme' | 'export' | 'api';

const SVG_ICONS: Record<string, React.ReactNode> = {
  palette: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.17-.6-1.63-.37-.46-.6-.1-.6-.67 0-.44.36-.8.8-.8.44 0 .8.36.8.8 0 1.38-1.12 2.5-2.5 2.5-4.48 0-8.5-3.52-8.5-8s4.02-8 8.5-8 8.5 3.52 8.5 8c0 1.38-.36 2.67-.97 3.77-.18.33-.51.53-.88.53-.37 0-.7-.2-.88-.53-.61-1.1-.97-2.39-.97-3.77 0-3.86-3.14-7-7-7s-7 3.14-7 7 3.14 7 7 7 7-3.14 7-7z"/>
    </svg>
  ),
  archive: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M5 20c-1.1 0-2-.9-2-2V8h2v10h14V8h2v10c0 1.1-.9 2-2 2H5zm14-12l-4-4H13v4h6V8z"/>
    </svg>
  ),
  key: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
    </svg>
  ),
};

const tabs: Array<{ id: Tab; label: string; subLabel: string; iconKey: string }> = [
  { id: 'theme', label: '主题管理', subLabel: 'Theme', iconKey: 'palette' },
  { id: 'export', label: '导出管理', subLabel: 'Export', iconKey: 'archive' },
  { id: 'api', label: 'API 管理', subLabel: 'API Keys', iconKey: 'key' },
];

const HEADER_ICONS: Record<Tab, { icon: string; title: string; subtitle: string }> = {
  theme: { icon: 'ri-palette-line', title: '主题管理', subtitle: '选择界面配色方案' },
  export: { icon: 'ri-download-2-line', title: '导出管理', subtitle: '导入导出配置文件' },
  api: { icon: 'ri-key-line', title: 'API 管理', subtitle: '配置 AI 解析所需的 API Key' },
};

export default function SettingsPanel({ onClose }: Props) {
  const { apiKey, apiEndpoint, setApiKey, setApiEndpoint, exportConfig, importConfig, theme } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('theme');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleExport = () => {
    const blob = new Blob([exportConfig()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `投标报价配置_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) importConfig(text);
    };
    reader.readAsText(file);
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className={`relative ml-auto w-full max-w-4xl flex flex-col ${isDark ? 'bg-[#2A2A2A]' : 'bg-[#FBF7EF]'}`} onClick={(e) => e.stopPropagation()}>
        {/* 顶部导航栏 */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </div>
            <span className={`font-semibold text-lg ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>设置</span>
          </div>
          <button onClick={onClose} className={`hover:text-[#C43A31] transition-colors ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧标签面板 */}
          <div className={`w-[280px] border-r flex flex-col ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
            <div className={`px-6 py-5 border-b ${isDark ? 'border-[#3A3A3A]' : 'border-[#E8DCC8]'}`}>
              <div className={`font-semibold text-[16px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>系统设置</div>
              <div className={`text-[12px] mt-1 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>配置主题、导出与API</div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#C43A31] text-white'
                      : isDark
                        ? 'bg-[#3A3A3A] text-[#A89880] hover:bg-[#2A2A2A] hover:text-[#E8E0D0]'
                        : 'bg-[#F5EFE0] text-text-secondary hover:bg-white hover:text-text'
                  }`}
                >
                  <div className={`flex-shrink-0 ${activeTab === tab.id ? 'text-white' : isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
                    {SVG_ICONS[tab.iconKey]}
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${activeTab === tab.id ? 'text-white' : isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
                      {tab.label}
                    </div>
                    <div className={`text-[11px] ${activeTab === tab.id ? 'text-white/75' : isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
                      {tab.subLabel}
                    </div>
                  </div>
                  {activeTab === tab.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-white ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className={`flex-1 p-8 overflow-y-auto ${isDark ? 'bg-[#1A1A1A]' : 'bg-[#EAE5D9]'}`}>
            <div className="max-w-2xl">
              {/* 内容标题栏 */}
              <div className={`rounded-xl px-8 py-5 mb-6 ${isDark ? 'bg-[#2A2A2A] border border-[#3A3A3A]' : 'bg-[#FDF5E6]'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      {activeTab === 'theme' && <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>}
                      {activeTab === 'export' && <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>}
                      {activeTab === 'api' && <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>}
                    </svg>
                  </div>
                  <div>
                    <h2 className={`font-semibold text-[18px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>{HEADER_ICONS[activeTab].title}</h2>
                    <p className={`text-sm ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>{HEADER_ICONS[activeTab].subtitle}</p>
                  </div>
                </div>
              </div>

              {/* 设置内容区 */}
              <div className="space-y-6">
                {activeTab === 'theme' && (
                  <div className={`rounded-2xl p-8 ${isDark ? 'bg-[#2A2A2A] border border-[#3A3A3A]' : 'bg-[#F5EFE0] border border-[#E8DCC8]'}`}>
                    <ThemeSelector />
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className="space-y-4">
                    <button onClick={handleExport} className="btn-primary w-full justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                      </svg>
                      <span>导出配置（JSON）</span>
                    </button>
                    <div className={`rounded-xl p-4 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-white border-[#E8DCC8]'}`}>
                      <label className={`block text-sm mb-2 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>导入配置</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="block w-full text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C43A31] file:text-white hover:file:bg-[#A83028]"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                          localStorage.removeItem('bidQuotationConfig');
                          window.location.reload();
                        }
                      }}
                      className="w-full py-3 rounded-xl border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium text-sm"
                    >
                      清空所有数据
                    </button>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm mb-2 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>API 端点</label>
                      <select
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="styled-select select-default w-full"
                      >
                        <option value="https://api.deepseek.com/v1">DeepSeek (api.deepseek.com)</option>
                        <option value="https://api.ccswitch.com/v1">CCswitch (api.ccswitch.com)</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm mb-2 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>API Key</label>
                      <input
                        type="password"
                        value={apiKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        className={`input-field w-full ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
                        placeholder="sk-..."
                      />
                      <p className={`text-xs mt-2 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
                        API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮栏 */}
              <div className={`rounded-xl px-8 py-5 mt-6 flex items-center justify-end gap-3 ${isDark ? 'bg-[#2A2A2A] border border-[#3A3A3A]' : 'bg-[#FDF5E6]'}`}>
                <button onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm transition-colors ${isDark ? 'bg-[#3A3A3A] text-[#A89880] hover:text-[#E8E0D0]' : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-text'}`}>
                  取消
                </button>
                <button onClick={onClose} className="btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                  <span>应用设置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
