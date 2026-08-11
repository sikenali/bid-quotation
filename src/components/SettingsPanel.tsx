import React, { useState, useEffect } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThemeSelector from './ThemeSelector';

interface Props {
  onClose: () => void;
}

type Tab = 'theme' | 'export' | 'api';

export default function SettingsPanel({ onClose }: Props) {
  const { theme, apiKey, apiEndpoint, setApiKey, setApiEndpoint, exportConfig, importConfig } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('theme');
  const [importText, setImportText] = useState('');

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'theme', label: '主题管理', icon: 'ri-palette-line' },
    { id: 'export', label: '导出管理', icon: 'ri-archive-line' },
    { id: 'api', label: 'API 管理', icon: 'ri-key-line' },
  ];

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

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative ml-auto w-full max-w-4xl bg-bg flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 py-5 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <i className="ri-settings-3-line text-xl text-white"></i>
            </div>
            <span className="font-semibold text-text text-lg">设置</span>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-text transition-colors">
              <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 bg-card border-r border-border p-4 flex flex-col">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:bg-white hover:text-text'
                  }`}
                >
                  <i className={`text-lg ${tab.icon}`}></i>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#EAE5D9] dark:bg-gray-900 p-8 overflow-y-auto">
            <div className="max-w-2xl">
              {activeTab === 'theme' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white"><i className="ri-palette-line text-xl"></i></div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">主题管理</h2>
                      <p className="text-textSecondary text-sm">选择界面显示主题</p>
                    </div>
                  </div>
                  <ThemeSelector />
                </>
              )}

              {activeTab === 'export' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white"><i className="ri-download-2-line text-xl"></i></div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">导出管理</h2>
                      <p className="text-textSecondary text-sm">导入导出配置文件</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button onClick={handleExport} className="btn-primary w-full justify-center">
                      <span><i className="ri-download-2-line"></i></span>
                      <span>导出配置（JSON）</span>
                    </button>
                    <div className="bg-white rounded-xl p-4 border border-border">
                      <label className="block text-textSecondary text-sm mb-2">导入配置</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="block w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primaryHover cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                          localStorage.removeItem('bid-quotation-config');
                          window.location.reload();
                        }
                      }}
                      className="w-full py-3 rounded-xl border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      清空所有数据
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'api' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white"><i className="ri-key-line text-xl"></i></div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">API 管理</h2>
                      <p className="text-textSecondary text-sm">配置 AI 解析所需的 API Key</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-textSecondary text-sm mb-2">API 端点</label>
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
                      <label className="block text-textSecondary text-sm mb-2">API Key</label>
                      <input
                        type="password"
                        value={apiKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="input-field w-full"
                        placeholder="sk-..."
                      />
                      <p className="text-textSecondary text-xs mt-2">
                        API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
