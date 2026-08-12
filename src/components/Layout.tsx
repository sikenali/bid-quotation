import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { StepIndicator } from './StepIndicator';
import SettingsPanel from './SettingsPanel';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, theme } = useConfigStore();
  const [showSettings, setShowSettings] = useState(false);
  const isDark = theme === 'dark';

  const isResultPage = currentStep === 5;

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-bg dark:bg-dark-bg">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-40 bg-bg dark:bg-dark-bg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            {/* 左侧品牌 */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => { setCurrentStep(1); navigate('/algorithm'); }}
            >
              <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center">
                <i className="ri-auction-line text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-text font-semibold text-[20px] leading-tight dark:text-dark-text">文价猩</h1>
                <p className="text-text-secondary text-[11px] dark:text-dark-text-secondary">标书智能报价平台</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {!isResultPage && <StepIndicator currentStep={currentStep} />}

              <button
                onClick={() => setShowSettings(true)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  showSettings
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-text-secondary hover:bg-border-light dark:bg-dark-card dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-border'
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
