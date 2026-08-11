import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThemeSelector from './ThemeSelector';

interface Props {
  onClose: () => void;
}

type Tab = 'theme' | 'export' | 'api';

const tabs: Array<{ id: Tab; label: string; subLabel: string; icon: string }> = [
  { id: 'theme', label: '主题管理', subLabel: 'Theme', icon: 'ri-palette-line' },
  { id: 'export', label: '导出管理', subLabel: 'Export', icon: 'ri-archive-line' },
  { id: 'api', label: 'API 管理', subLabel: 'API Keys', icon: 'ri-key-line' },
];

export default function SettingsPanel({ onClose }: Props) {
  const { apiKey, apiEndpoint, setApiKey, setApiEndpoint, exportConfig, importConfig } = useConfigStore();
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

  const getContentHeader = (tab: Tab) => {
    const configs: Record<Tab, { icon: string; title: string; subtitle: string }> = {
      theme: { icon: 'ri-palette-line', title: '主题管理', subtitle: '选择界面配色方案' },
      export: { icon: 'ri-download-2-line', title: '导出管理', subtitle: '导入导出配置文件' },
      api: { icon: 'ri-key-line', title: 'API 管理', subtitle: '配置 AI 解析所需的 API Key' },
    };
    return configs[tab];
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative ml-auto w-full max-w-4xl bg-bg flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* 顶部导航栏 */}
        <div className="flex items-center justify-between px-8 py-5 bg-[#FBF7EF] border-b border-[#E8DCC8]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center text-white">
              <i className="ri-settings-3-line text-xl text-white"></i>
            </div>
            <span className="font-semibold text-text text-lg">设置</span>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-text transition-colors">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧标签面板 */}
          <div className="w-[280px] bg-[#FBF7EF] border-r border-[#E8DCC8] flex flex-col">
            <div className="px-6 py-5 border-b border-[#E8DCC8]">
              <div className="font-semibold text-text text-[16px]">系统设置</div>
              <div className="text-text-secondary text-[12px] mt-1">配置主题、导出与API</div>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#C43A31] text-white'
                      : 'bg-[#F5EFE0] text-textSecondary hover:bg-white hover:text-text'
                  }`}
                >
                  <i className={`text-lg ${activeTab === tab.id ? 'text-white' : 'text-text-secondary'}`}>
                    {tab.icon}
                  </i>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${activeTab === tab.id ? 'text-white' : 'text-text'}`}>
                      {tab.label}
                    </div>
                    <div className={`text-[11px] ${activeTab === tab.id ? 'text-white/75' : 'text-text-secondary'}`}>
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
          <div className="flex-1 bg-[#EAE5D9] p-8 overflow-y-auto">
            <div className="max-w-2xl">
              {/* 内容标题栏 */}
              <div className="bg-[#FDF5E6] rounded-xl px-8 py-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C43A31] flex items-center justify-center text-white">
                    <i className={`text-xl ${getContentHeader(activeTab).icon}`}></i>
                  </div>
                  <div>
                    <h2 className="font-semibold text-text text-[18px]">{getContentHeader(activeTab).title}</h2>
                    <p className="text-text-secondary text-sm">{getContentHeader(activeTab).subtitle}</p>
                  </div>
                </div>
              </div>

              {/* 设置内容区 */}
              <div className="space-y-6">
                {activeTab === 'theme' && (
                  <div className="bg-[#F5EFE0] border border-[#E8DCC8] rounded-2xl p-8">
                    <ThemeSelector />
                  </div>
                )}

                {activeTab === 'export' && (
                  <div className="space-y-4">
                    <button onClick={handleExport} className="btn-primary w-full justify-center">
                      <span><i className="ri-download-2-line"></i></span>
                      <span>导出配置（JSON）</span>
                    </button>
                    <div className="bg-white rounded-xl p-4 border border-[#E8DCC8]">
                      <label className="block text-text-secondary text-sm mb-2">导入配置</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#C43A31] file:text-white hover:file:bg-[#A83028] cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                          localStorage.removeItem('bid-quotation-config');
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
                      <label className="block text-text-secondary text-sm mb-2">API 端点</label>
                      <select
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="input-field w-full"
                      >
                        <option value="https://api.deepseek.com/v1">DeepSeek (api.deepseek.com)</option>
                        <option value="https://api.ccswitch.com/v1">CCswitch (api.ccswitch.com)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-text-secondary text-sm mb-2">API Key</label>
                      <input
                        type="password"
                        value={apiKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="input-field w-full"
                        placeholder="sk-..."
                      />
                      <p className="text-text-secondary text-xs mt-2">
                        API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* 底部按钮栏 */}
              <div className="bg-[#FDF5E6] rounded-xl px-8 py-5 mt-6 flex items-center justify-end gap-3">
                <button onClick={onClose} className="px-6 py-2.5 bg-[#F5EFE0] border border-[#E0D5C0] rounded-xl text-text-secondary hover:text-text transition-colors text-sm">
                  取消
                </button>
                <button onClick={onClose} className="btn-primary">
                  <i className="ri-check-line"></i>
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
