import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { StepIndicator } from './StepIndicator';
// TODO: Create SettingsPanel component
// import SettingsPanel from './SettingsPanel';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, theme, setTheme, config } = useConfigStore();
  const [showSettings, setShowSettings] = useState(false);

  const isResultPage = currentStep === 5;

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-bg dark:bg-dark-bg">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-40 bg-bg dark:bg-dark-bg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            {/* 左侧品牌 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-lg font-bold">投</span>
              </div>
              <div>
                <h1 className="text-text font-semibold text-lg leading-tight">投标报价测算</h1>
                <p className="text-text-secondary text-xs">评分辅助工具</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {!isResultPage && <StepIndicator currentStep={currentStep} />}

              {isResultPage && (
                <button
                  onClick={() => navigate('/step-4')}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-text hover:bg-border-light transition-colors"
                >
                  <span>返回编辑</span>
                </button>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  showSettings
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-text-secondary hover:bg-border-light'
                }`}
                aria-label="设置"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 2l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 2l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </main>

        {/* 设置面板 */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-lg font-semibold text-text mb-4">设置</h2>
              <p className="text-text-secondary text-sm mb-6">设置面板即将实现</p>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                关闭
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
