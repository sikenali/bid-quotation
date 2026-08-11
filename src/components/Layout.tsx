import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { StepIndicator } from './StepIndicator';
import SettingsPanel from './SettingsPanel';
import { exportCSV } from '../utils/export';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { currentStep, theme } = useConfigStore();
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
                <i className="ri-file-text-line text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-text font-semibold text-[20px] leading-tight">文价猩</h1>
                <p className="text-text-secondary text-[11px]">BidPrice AI</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {!isResultPage && <StepIndicator currentStep={currentStep} />}

              {isResultPage && (
                <>
                  <button
                    onClick={() => navigate('/step-4')}
                    className="flex items-center gap-2 px-4 py-2 bg-[#F5EFE0] border border-[#E0D5C0] rounded-lg text-[#5C4033] hover:bg-[#E8DCC8] transition-colors text-sm"
                  >
                    <i className="ri-arrow-left-line text-[16px]"></i>
                    <span>返回编辑</span>
                  </button>
                  <button
                    onClick={() => {
                      const { calculationResult } = useConfigStore.getState();
                      if (calculationResult) exportCSV(calculationResult);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#5B8C5A] rounded-lg text-white hover:bg-[#4A7A49] transition-colors text-sm"
                  >
                    <i className="ri-download-line text-[16px]"></i>
                    <span>导出CSV</span>
                  </button>
                </>
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
                <i className="ri-settings-3-line text-xl"></i>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </main>

        {/* 设置面板 */}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      </div>
    </div>
  );
}
