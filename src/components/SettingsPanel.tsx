import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThemeSelector from './ThemeSelector';

interface Props {
  onClose: () => void;
}

type Tab = 'theme' | 'export' | 'api';

const TAB_ICONS: Record<Tab, string> = {
  theme: 'ri-palette-line',
  export: 'ri-download-2-line',
  api: 'ri-key-line',
};

const tabs: Array<{ id: Tab; label: string; subLabel: string }> = [
  { id: 'theme', label: '主题管理', subLabel: 'Theme' },
  { id: 'export', label: '导出管理', subLabel: 'Export' },
  { id: 'api', label: 'API 管理', subLabel: 'API Keys' },
];

const HEADER_ICONS: Record<Tab, { icon: string; title: string; subtitle: string }> = {
  theme: { icon: 'ri-palette-line', title: '主题管理', subtitle: '选择界面配色方案' },
  export: { icon: 'ri-download-2-line', title: '导出管理', subtitle: '导入导出配置文件' },
  api: { icon: 'ri-key-line', title: 'API 管理', subtitle: '配置 AI 解析所需的 API Key' },
};

export default function SettingsPanel({ onClose }: Props) {
  const { apiKey, apiEndpoint, setApiKey, setApiEndpoint, theme, exportFormat, setExportFormat } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('theme');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className={`relative ml-auto w-full max-w-4xl flex flex-col ${isDark ? 'bg-[#2D2D2D]' : 'bg-[#FBF7EF]'}`} onClick={(e) => e.stopPropagation()}>
        {/* 顶部导航栏 */}
        <div className={`flex items-center justify-between px-8 py-5 border-b ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </div>
            <span className={`font-semibold text-lg ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>设置</span>
          </div>
          <button onClick={onClose} className={`hover:text-[#C43A31] transition-colors ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧标签面板 */}
          <div className={`w-[280px] border-r flex flex-col ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
            <div className={`px-6 py-5 border-b ${isDark ? 'border-[#3D3D3D]' : 'border-[#E8DCC8]'}`}>
              <div className={`font-semibold text-[16px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>系统设置</div>
              <div className={`text-[12px] mt-1 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>配置主题、导出与API</div>
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
                        ? 'bg-[#3D3D3D] text-[#C0B098] hover:bg-[#2D2D2D] hover:text-[#F2EDE4]'
                        : 'bg-[#F5EFE0] text-text-secondary hover:bg-white hover:text-text'
                  }`}
                >
                  <div className={`flex-shrink-0 ${activeTab === tab.id ? 'text-white' : isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                    <i className={`text-lg ${TAB_ICONS[tab.id]}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${activeTab === tab.id ? 'text-white' : isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>
                      {tab.label}
                    </div>
                    <div className={`text-[11px] ${activeTab === tab.id ? 'text-white/75' : isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
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
          <div className={`flex-1 p-8 overflow-y-auto ${isDark ? 'bg-[#252525]' : 'bg-[#EAE5D9]'}`}>
            <div className="max-w-2xl">
              {/* 内容标题栏 */}
              <div className={`rounded-xl px-8 py-5 mb-6 ${isDark ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-[#FDF5E6]'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center text-white">
                    <i className={`text-xl ${HEADER_ICONS[activeTab].icon}`}></i>
                  </div>
                  <div>
                    <h2 className={`font-semibold text-[18px] ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>{HEADER_ICONS[activeTab].title}</h2>
                    <p className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{HEADER_ICONS[activeTab].subtitle}</p>
                  </div>
                </div>
              </div>

              {/* 设置内容区 */}
              <div className="space-y-6">
                {activeTab === 'theme' && (
                  <div className={`rounded-2xl p-8 ${isDark ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-[#F5EFE0] border border-[#E8DCC8]'}`}>
                    <ThemeSelector />
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className={`rounded-2xl p-8 ${isDark ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-[#F5EFE0] border border-[#E8DCC8]'}`}>
                    <div className="space-y-4">
                      {[
                        {
                          id: 'csv' as const,
                          label: 'CSV 格式',
                          desc: 'Excel 表格直接打开，支持中文',
                          icon: 'ri-file-text-line',
                          iconColor: 'text-[#D97706]',
                        },
                        {
                          id: 'md' as const,
                          label: 'Markdown 格式',
                          desc: '表格渲染友好，适合文档嵌入',
                          icon: 'ri-markdown-line',
                          iconColor: 'text-[#C43A31]',
                        },
                      ].map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                            exportFormat === opt.id
                              ? isDark
                                ? 'border-[#C43A31] bg-[#2D2D2D]'
                                : 'border-[#C43A31] bg-white'
                              : isDark
                                ? 'border-[#E8DCC8] bg-[#FBF7EF]'
                                : 'border-[#E8DCC8] bg-[#FBF7EF]'
                          }`}
                          onClick={() => setExportFormat(opt.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-white border border-[#E8DCC8] flex items-center justify-center">
                              <i className={`${opt.icon} text-xl ${opt.iconColor}`}></i>
                            </div>
                            <div>
                              <div className={`font-semibold ${isDark ? 'text-[#F2EDE4]' : 'text-text'}`}>{opt.label}</div>
                              <div className={`text-sm ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>{opt.desc}</div>
                            </div>
                            {exportFormat === opt.id && (
                              <div className="ml-auto w-5 h-5 rounded-full bg-[#C43A31] flex items-center justify-center">
                                <i className="ri-check-line text-white text-sm"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'api' && (
                  <div className={`rounded-2xl p-6 border ${isDark ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-[#F5EFE0] border border-[#E8DCC8]'}`}>
                    <div className="space-y-4">
                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>API 端点</label>
                        <div className="flex gap-2">
                          {[
                            { value: 'https://api.deepseek.com/v1', label: 'DeepSeek' },
                            { value: 'https://api.ccswitch.com/v1', label: 'CCswitch' },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setApiEndpoint(opt.value)}
                              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${
                                apiEndpoint === opt.value
                                  ? 'border-[#C43A31] bg-[#FFF0ED] text-[#C43A31]'
                                  : isDark
                                    ? 'border-[#3D3D3D] bg-[#2D2D2D] text-[#C0B098] hover:border-[#C43A31]/50'
                                    : 'border-[#E8DCC8] bg-white text-text-secondary hover:border-[#C43A31]/40'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={`block text-sm mb-2 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>API Key</label>
                        <input
                          type="password"
                          value={apiKey || ''}
                          onChange={(e) => setApiKey(e.target.value)}
                          className={`input-field w-full ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D] text-[#F2EDE4]' : ''}`}
                          placeholder="sk-..."
                        />
                        <p className={`text-xs mt-2 ${isDark ? 'text-[#C0B098]' : 'text-text-secondary'}`}>
                          API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮栏 */}
              <div className={`rounded-xl px-8 py-5 mt-6 flex items-center justify-end gap-3 ${isDark ? 'bg-[#2D2D2D] border border-[#3D3D3D]' : 'bg-[#FDF5E6]'}`}>
                <button onClick={onClose} className={`px-6 py-2.5 rounded-xl text-sm transition-colors ${isDark ? 'bg-[#3D3D3D] text-[#C0B098] hover:text-[#F2EDE4]' : 'bg-[#F5EFE0] border border-[#E0D5C0] text-text-secondary hover:text-text'}`}>
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
